/** @format */
const githubFileUrl =
    "https://raw.githubusercontent.com/XXXXXXXXXXXXXXXX/emstatus/deploy/log.json"; // GitHub Raw URL
const githubRepoUrl =
    "https://api.github.com/repos/XXXXXXXXXXXXXXXX/emstatus/contents/log.json?ref=main"; // GitHub API URL
const githubToken = "XXXXXXXXXXXXXXXX"; // 請替換為你的 GitHub Token
const githubBranch = "main"; // GitHub Branch

/** @format */

function checkWebsiteStatus() {
    const response = UrlFetchApp.fetch(githubFileUrl);
    const jsonData = JSON.parse(response.getContentText());

    jsonData.websites.forEach(site => {
        const status = getWebsiteStatus(site.url);
        const lastLog = site.log[site.log.length - 1];

        if (lastLog.status == status.code) {
            lastLog.time = Date.now();
        } else {
            const newLog = {
                time: Date.now(),
                status: parseInt(status.code),
            };
            if (status.code != 200) {
                newLog.message = status.message;
            }
            site.log.push(newLog);
        }
    });
    jsonData.lastUpdate = Date.now();
    const updatedJsonData = JSON.stringify(jsonData, null, 2);

    // Fetch the latest SHA of the file before updating
    const latestSha = getShaOfFile(githubRepoUrl, githubToken);

    const options = {
        method: "put",
        contentType: "application/json",
        headers: {
            Authorization: "token " + githubToken,
        },
        payload: JSON.stringify({
            message:
                "更新紀錄 " +
                new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
            content: Utilities.base64Encode(
                Utilities.newBlob(updatedJsonData).getBytes()
            ),
            sha: latestSha,
            branch: githubBranch,
        }),
    };

    UrlFetchApp.fetch(githubRepoUrl, options);
}

function getWebsiteStatus(url) {
    try {
        const response = UrlFetchApp.fetch(url);
        const responseCode = response.getResponseCode();
        const responseBody = response.getContentText();

        if (!responseBody.includes("<body")) {
            return {
                code: 418, // I'm a teapot
                message: "No <body> tag found in the response.",
            };
        }

        return {
            code: responseCode,
            message: "",
        };
    } catch (e) {
        if (e.response) {
            return {
                code: e.response.getResponseCode(),
                message: e.message,
            };
        } else {
            return {
                code: 0,
                message: e.message,
            };
        }
    }
}

function getShaOfFile(githubRepoUrl, githubToken) {
    const options = {
        method: "get",
        contentType: "application/json",
        headers: {
            Authorization: "token " + githubToken,
        },
    };
    const response = UrlFetchApp.fetch(githubRepoUrl, options);
    const json = JSON.parse(response.getContentText());
    return json.sha;
}

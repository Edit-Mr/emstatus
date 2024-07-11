/** @format */

function checkWebsiteStatus() {
    const githubFileUrl = "https://github.com/Edit-Mr/emstatus/raw/main/log.json";
    const githubRepoUrl = "https://api.github.com/repos/Edit-Mr/emstatus/contents/log.json";
    const githubToken = ""; // 請替換為你的 GitHub Token

    // 讀取現有的 JSON 文件
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
    // 將更新後的 JSON 文件轉為字符串
    const updatedJsonData = JSON.stringify(jsonData, null, 2);

    // 使用 GitHub API 更新文件
    const options = {
        method: "put",
        contentType: "application/json",
        headers: {
            Authorization: "token " + githubToken,
        },
        payload: JSON.stringify({
            message: "更新紀錄 " + new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
            content: Utilities.base64Encode(Utilities.newBlob(updatedJsonData).getBytes()),
            sha: getShaOfFile(githubRepoUrl, githubToken),
        }),
    };

    UrlFetchApp.fetch(githubRepoUrl, options);
}

function getWebsiteStatus(url) {
    try {
        const response = UrlFetchApp.fetch(url);
        return {
            code: response.getResponseCode(),
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

function testStatus() {
    const url = "https://pi.elvismao.com/";
    const e = getWebsiteStatus(url);
    Logger.log(e);
}
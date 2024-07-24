# emstatus - 毛哥EM的網頁狀態監控

<https://status.emtech.cc>

emstatus 是一個簡單而高效的網站狀態監控工具,專為毛哥EM的網站設計。它使用Google Apps Script定期檢查網站狀態,並在GitHub上更新結果。

UI 設計靈感來自 [UptimeRobot](https://uptimerobot.com)

## 功能特點

- 每5分鐘自動檢查網站狀態
- 顯示近7天的網站運行狀況圖表
- 提供24小時、7天、30天和90天的整體運行時間統計
- 支持中文和英文界面
- 響應式設計,適配各種設備

## 技術棧

- 前端: HTML, CSS, JavaScript
- 後端: Google Apps Script
- 數據存儲: GitHub (JSON文件)

### 上線時間計算

做的時候數學有點亂，畫一下圖來幫助理解。

![時間計算](count.svg)

## 如何使用

1. 克隆此倉庫
2. 在 Google Apps Script 中設置`Code.js`文件，並設定自動觸發

![設定自動觸發](image.png)

3. 設置 GitHub Token 和需要監控的網站列表
4. 部署前端文件到您的網站服務器

## 配置

在`Code.js`中,您需要:

1. 設置您的 GitHub Token
2. 在 JSON 文件中添加您想監控的網站

## 貢獻

歡迎提交問題和拉取請求。對於重大變更,請先開issue討論您想要改變的內容。

## 聯繫方式

- 作者: [毛哥EM](https://elvismao.com)
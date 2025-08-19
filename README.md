# DBF Viewer

DBF Viewer 是一個用於瀏覽和查詢 DBF 檔案的網頁應用程序。它提供了友好的用戶界面，可以輕鬆瀏覽 DBF 檔案的記錄，並支持 KCSTMR 和 KDRUG 等特殊查詢功能。

## 功能特點

- 📋 DBF 檔案列表瀏覽
- 🔍 記錄搜索和過濾
- 📊 使用 DataGrid 顯示記錄數據
- 📝 記錄詳情查看
- 🔎 KCSTMR 查詢功能
- 💊 KDRUG 查詢功能
- 🚀 服務器端渲染
- 🔄 數據加載和變更
- 🔒 TypeScript 支持

## 系統要求

- Node.js 18.0 或更高版本
- MongoDB 4.4 或更高版本

## 安裝

安裝依賴項：

```bash
npm install
```

## 環境配置

在 `.env` 文件中配置以下環境變數：

```
# MongoDB 連接設定
MONGO_URI=mongodb://your-mongodb-server:27017/your-database
MONGO_DB=your-database
MONGO_COLLECTION_PREFIX=dbf_

# API 服務端口
API_PORT=7001
```

## 開發

### 同時啟動前端和後端服務

使用以下命令同時啟動前端和後端服務：

```bash
npm run dev:all
```

### 分別啟動服務

啟動前端開發服務器：

```bash
npm run dev
```

啟動後端 API 服務：

```bash
npm run api
```

前端應用程序將在 `http://localhost:5173` 可用，後端 API 服務將在 `http://localhost:7001` 可用。

## 構建生產版本

創建生產版本：

```bash
npm run build
```

## API 端點

- `GET /api/dbf-files` - 獲取所有 DBF 檔案列表
- `GET /api/dbf/:fileName` - 獲取特定 DBF 檔案的記錄
- `GET /api/dbf/:fileName/:recordNo` - 獲取特定記錄的詳情
- `GET /api/KCSTMR/:value` - KCSTMR 查詢
- `GET /api/KDRUG/:value` - KDRUG 查詢

## 部署

### Docker 部署

使用 Docker 構建和運行：

```bash
docker build -t dbf-viewer .

# 運行容器
docker run -p 7001:7001 -p 5173:5173 dbf-viewer
```

## 故障排除

如果遇到問題，請嘗試以下步驟：

1. 確保 MongoDB 服務正在運行
2. 檢查 `.env` 文件中的配置是否正確
3. 清除 `.react-router` 目錄並重新啟動應用程序
4. 檢查控制台錯誤信息

---

使用 ❤️ 和 React Router 構建。
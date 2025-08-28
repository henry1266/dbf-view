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

## 技術棧

### 前端技術
- **React 19** - 最新版本的 React 框架
- **React Router 7** - 最新版本的路由管理，支持服務器端渲染
- **TypeScript** - 提供靜態類型檢查
- **Material UI 7** - 現代化的 UI 組件庫
  - @mui/material - 核心組件
  - @mui/icons-material - 圖標庫
  - @mui/x-data-grid - 數據表格組件
  - @mui/x-date-pickers - 日期選擇器組件
- **Tailwind CSS 4** - 實用優先的 CSS 框架
- **Redux Toolkit** - 狀態管理解決方案
- **React Hook Form** - 表單處理
- **Zod** - 表單驗證
- **Emotion** - CSS-in-JS 解決方案
- **Dayjs** - 輕量級日期處理庫

### 後端技術
- **Express.js** - Node.js Web 應用框架
- **MongoDB** - NoSQL 數據庫
- **Node.js** - JavaScript 運行時環境

### 開發工具
- **Vite 6** - 現代前端構建工具
- **ESLint** - 代碼質量檢查
- **Prettier** - 代碼格式化
- **Concurrently** - 同時運行多個命令
- **TypeScript** - 類型檢查

### 部署
- **Docker** - 容器化部署

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

## 故障排除

如果遇到問題，請嘗試以下步驟：

1. 確保 MongoDB 服務正在運行
2. 檢查 `.env` 文件中的配置是否正確
3. 清除 `.react-router` 目錄並重新啟動應用程序
4. 檢查控制台錯誤信息

---

使用 ❤️ 和 React Router 構建。

## 最佳實踐建議

### 代碼質量與架構
- **單元測試** - 添加 Vitest 進行單元測試，提高代碼可靠性
- **端到端測試** - 考慮使用 Cypress 或 Playwright 進行 E2E 測試
- **API 文檔** - 使用 Swagger/OpenAPI 為後端 API 生成文檔
- **狀態管理優化** - 考慮使用 React Query 或 SWR 進行數據獲取和緩存
- **錯誤監控** - 集成 Sentry 等工具進行前端錯誤監控
- **性能監控** - 添加 Web Vitals 監控關鍵性能指標

### 開發流程
- **CI/CD 流程** - 設置 GitHub Actions 或 GitLab CI 自動化部署流程
- **版本控制策略** - 採用 Git Flow 或 GitHub Flow 工作流
- **語義化版本** - 遵循語義化版本規範 (SemVer)
- **變更日誌** - 維護 CHANGELOG.md 記錄版本變更

### 安全性
- **API 安全** - 實現 JWT 或 OAuth2 認證
- **輸入驗證** - 在前後端都進行數據驗證
- **CSRF/XSS 防護** - 實施跨站請求偽造和跨站腳本攻擊防護
- **依賴掃描** - 使用 Dependabot 或 Snyk 定期掃描依賴漏洞

## 與 LLM 協力開發的最佳化建議

### 代碼文檔與註釋
- **JSDoc 註釋** - 為函數和組件添加標準化的 JSDoc 註釋，幫助 LLM 理解代碼意圖
- **README 文件** - 為每個主要目錄添加 README.md，說明該目錄的用途和內容
- **架構圖** - 提供系統架構圖和數據流程圖，幫助 LLM 理解系統全貌
- **代碼示例** - 提供典型用例的代碼示例，幫助 LLM 理解使用模式

### 代碼組織
- **一致的命名約定** - 使用一致的命名風格 (如 camelCase, PascalCase)
- **模塊化設計** - 將代碼分解為小型、功能單一的模塊
- **類型定義集中化** - 將 TypeScript 類型定義集中在專門的文件中
- **API 客戶端抽象** - 將 API 調用抽象為專門的服務層

### 開發工具配置
- **編輯器配置** - 提供 .vscode/settings.json 和推薦擴展
- **代碼片段** - 創建常用代碼片段，提高開發效率
- **自動化腳本** - 提供用於常見任務的腳本 (如數據遷移、環境設置)

### LLM 特定優化
- **提示工程** - 創建專門的提示模板，用於生成特定類型的代碼
- **代碼生成指南** - 提供指南說明如何使用 LLM 生成符合項目風格的代碼
- **代碼審查清單** - 創建清單用於審查 LLM 生成的代碼
- **上下文窗口優化** - 組織代碼使其關鍵部分能夠在 LLM 上下文窗口中完整呈現
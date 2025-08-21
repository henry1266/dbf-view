# 路由目錄 (routes/)

這個目錄包含了 DBF Viewer 應用程序的所有路由頁面組件，使用 React Router 7 進行路由管理。

## 路由列表

- `home.tsx` - 首頁路由 (`/`)
- `dashboard.tsx` - 儀表板頁面路由 (`/dashboard`)
- `dbf-files.tsx` - DBF 檔案列表頁面路由 (`/dbf-files`)
- `dbf.$fileName.tsx` - 特定 DBF 檔案記錄頁面路由 (`/dbf/:fileName`)
- `dbf.$fileName.$recordNo.tsx` - 特定記錄詳情頁面路由 (`/dbf/:fileName/:recordNo`)
- `kcstmr.$value.tsx` - KCSTMR 查詢結果頁面路由 (`/kcstmr/:value`)
- `kdrug.$value.tsx` - KDRUG 查詢結果頁面路由 (`/kdrug/:value`)
- `dbf-stats.$fileName.tsx` - DBF 檔案統計頁面路由 (`/dbf-stats/:fileName`)

## 路由配置

路由配置在 `app/routes.ts` 文件中定義，使用 React Router 7 的路由配置格式。

## 路由參數

- `:fileName` - DBF 檔案名稱參數
- `:recordNo` - 記錄編號參數
- `:value` - 查詢值參數

## 頁面結構

每個路由頁面通常包含以下結構：

1. 使用 Layout 組件作為頁面佈局
2. 使用 React hooks 獲取和管理數據
3. 使用 Material UI 組件構建用戶界面
4. 實現頁面特定的邏輯和交互

## 數據加載

路由頁面通常使用以下方式加載數據：

1. 使用 `useEffect` hook 在組件掛載時加載數據
2. 使用 `app/services/api.ts` 中的函數發送 API 請求
3. 使用 React 狀態管理數據和加載狀態

## 開發指南

開發新的路由頁面時，請遵循以下原則：

1. 使用一致的文件命名約定（使用 React Router 7 的文件命名約定）
2. 實現適當的錯誤處理和加載狀態
3. 確保頁面在所有屏幕尺寸上都能正常工作
4. 使用 TypeScript 類型定義確保類型安全
5. 添加適當的註釋和文檔
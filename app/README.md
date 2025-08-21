# 應用程序目錄 (app/)

這個目錄包含了 DBF Viewer 應用程序的主要源代碼。

## 目錄結構

- `root.tsx` - 應用程序的根組件，定義了整體佈局和主題
- `routes.ts` - 應用程序的路由配置
- `app.css` - 全局樣式定義

## 子目錄

- `components/` - 包含所有可重用的 UI 組件
- `routes/` - 包含所有路由頁面組件
- `services/` - 包含 API 服務和數據處理邏輯
- `welcome/` - 包含歡迎頁面相關資源

## 技術棧

- React 19
- React Router 7
- TypeScript
- Material UI 7
- Tailwind CSS 4

## 開發指南

開發新功能時，請遵循以下原則：

1. 使用 TypeScript 類型定義確保類型安全
2. 遵循組件化設計原則，將 UI 拆分為可重用的組件
3. 使用 JSDoc 註釋記錄組件和函數的用途和參數
4. 保持一致的代碼風格和命名約定
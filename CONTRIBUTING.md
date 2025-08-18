# DBF 檔案瀏覽器開發守則

## 程式碼規範

### TypeScript 使用規範

1. **強制使用 TypeScript**
   - 所有新程式碼必須使用 TypeScript（`.ts` 或 `.tsx`）編寫
   - 嚴格禁止使用 JavaScript（`.js` 或 `.jsx`）檔案
   - 唯一例外：配置檔案如 `.eslintrc.js`、`postcss.config.js` 等可使用 `.js` 或 `.cjs`

2. **類型定義要求**
   - 所有函數參數和返回值必須有明確的類型註解
   - 禁止使用 `any` 類型，除非有特殊情況並附上註解說明
   - 使用介面（interface）定義複雜資料結構
   - 所有 React 元件必須使用 TypeScript 的 React 類型（如 `React.FC<Props>`）

3. **檔案命名規範**
   - React 元件檔案使用 `.tsx` 副檔名
   - 非 React 程式碼使用 `.ts` 副檔名
   - 類型定義檔案使用 `.d.ts` 副檔名

## 開發流程

1. **程式碼提交前檢查**
   - 確保所有程式碼通過 TypeScript 編譯檢查：`npm run typecheck`
   - 確保所有程式碼通過 ESLint 檢查：`npm run lint`
   - 確保沒有引入新的 `.js` 檔案

2. **程式碼審查要求**
   - 審查者必須確認提交的程式碼遵循 TypeScript 規範
   - 拒絕合併包含 `.js` 檔案的提交（配置檔案除外）

## 現有 JavaScript 程式碼處理

1. **遷移計劃**
   - 所有現有的 `.js` 檔案應逐步遷移到 `.ts` 或 `.tsx`
   - 遷移時應添加適當的類型定義，而不僅僅是更改副檔名

2. **遷移優先順序**
   - 核心業務邏輯
   - 共用元件
   - 工具函數
   - 配置檔案（如可能）

## 工具與資源

- [TypeScript 官方文件](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 為什麼強制使用 TypeScript？

- 提高程式碼品質和可維護性
- 在編譯時捕獲錯誤，減少運行時錯誤
- 提供更好的開發體驗和自動完成功能
- 使程式碼更易於理解和重構
- 確保專案的一致性和可擴展性
# 組件目錄 (components/)

這個目錄包含了 DBF Viewer 應用程序的所有可重用 UI 組件。

## 組件列表

- `Layout.tsx` - 應用程序的主要佈局組件，提供響應式側邊欄和內容區域
- `A2StatsDisplay.tsx` - 顯示 A2 藥費總和的統計組件
- `A97StatsDisplay.tsx` - 顯示 A97 相關統計數據的組件
- `A99GroupStatsDisplay.tsx` - 顯示 A99 分組統計數據的組件
- `A99StatsDisplay.tsx` - 顯示 A99 統計數據的組件
- `LDRUStatsDisplay.tsx` - 顯示 LDRU 統計數據的組件
- `MoneyStatsDisplay.tsx` - 顯示金額相關統計數據的組件
- `TechBackground.tsx` - 提供科技風格背景效果的組件
- `TOTStatsDisplay.tsx` - 顯示 TOT 統計數據的組件

## 子目錄

- `dashboard/` - 包含儀表板相關的組件

## 設計原則

1. **組件化設計** - 每個組件應該專注於單一職責
2. **可重用性** - 組件應該設計為可在多個地方重用
3. **類型安全** - 使用 TypeScript 接口定義組件屬性
4. **一致的風格** - 遵循項目的設計系統和風格指南
5. **響應式設計** - 組件應該在不同屏幕尺寸上正常工作

## 開發指南

創建新組件時，請遵循以下模式：

1. 使用 TypeScript 函數組件
2. 使用 JSDoc 註釋記錄組件的用途和屬性
3. 定義明確的 Props 接口
4. 使用 Material UI 和 Tailwind CSS 進行樣式設計
5. 考慮組件的可訪問性和性能
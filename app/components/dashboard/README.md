# 儀表板組件目錄 (dashboard/)

這個目錄包含了與儀表板頁面相關的所有 UI 組件。

## 組件列表

- `Calendar.tsx` - 日曆顯示組件，用於儀表板上的日期選擇和事件顯示
- `DashboardCard.tsx` - 儀表板卡片組件，用於顯示統計數據和信息
- `DashboardHeader.tsx` - 儀表板頁面的頂部組件，顯示標題和日期
- `StatisticsCards.tsx` - 統計卡片集合組件，用於顯示多個統計數據
- `SystemStatus.tsx` - 系統狀態顯示組件，用於顯示系統運行狀態

## 設計特點

1. **科技風格** - 使用現代科技風格的 UI 設計，包括漸變、發光效果和動畫
2. **數據可視化** - 專注於清晰、直觀地展示數據和統計信息
3. **響應式設計** - 適應不同屏幕尺寸，從移動設備到大屏顯示器
4. **一致的視覺語言** - 所有組件遵循相同的設計語言和色彩方案
5. **交互反饋** - 提供豐富的交互反饋，如懸停效果和動畫

## 使用示例

```tsx
import { DashboardCard } from './DashboardCard';
import { DashboardHeader } from './DashboardHeader';
import { StatisticsCards } from './StatisticsCards';
import { SystemStatus } from './SystemStatus';

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader />
      <StatisticsCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard 
          title="總處方數" 
          value="1,234" 
          icon={<DocumentIcon />} 
          color="primary" 
        />
        <DashboardCard 
          title="今日處方" 
          value="42" 
          icon={<TodayIcon />} 
          color="success" 
        />
      </div>
      <SystemStatus />
    </div>
  );
};
```

## 開發指南

開發新的儀表板組件時，請確保：

1. 遵循現有的設計風格和視覺語言
2. 使用 TypeScript 類型定義確保類型安全
3. 優化組件性能，特別是對於數據密集型組件
4. 添加適當的動畫和交互效果，但不要過度使用
5. 確保組件在所有屏幕尺寸上都能正常工作
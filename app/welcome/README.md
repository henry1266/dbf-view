# 歡迎頁面目錄 (welcome/)

這個目錄包含了 DBF Viewer 應用程序的歡迎頁面相關資源和組件。

## 文件列表

- `welcome.tsx` - 歡迎頁面組件
- `logo-dark.svg` - 深色主題下使用的應用程序 logo
- `logo-light.svg` - 淺色主題下使用的應用程序 logo

## 歡迎頁面

歡迎頁面是用戶首次訪問應用程序時看到的頁面，提供了以下功能：

1. 應用程序介紹和概述
2. 主要功能的快速導航
3. 最近訪問的 DBF 檔案列表
4. 系統狀態和版本信息

## 設計特點

1. **現代科技風格** - 使用現代科技風格的 UI 設計，包括漸變、發光效果和動畫
2. **響應式設計** - 適應不同屏幕尺寸，從移動設備到大屏顯示器
3. **主題支持** - 支持淺色和深色主題，自動適應用戶系統設置
4. **動畫效果** - 使用精心設計的動畫效果提升用戶體驗

## Logo 使用指南

- `logo-dark.svg` - 在淺色背景上使用
- `logo-light.svg` - 在深色背景上使用

根據當前主題自動選擇適當的 logo：

```tsx
import { useTheme } from '@mui/material';
import logoDark from '../welcome/logo-dark.svg';
import logoLight from '../welcome/logo-light.svg';

const Header = () => {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? logoLight : logoDark;
  
  return (
    <header>
      <img src={logo} alt="DBF Viewer Logo" />
    </header>
  );
};
```

## 開發指南

修改歡迎頁面時，請確保：

1. 保持設計的一致性和專業性
2. 優化圖像和動畫性能
3. 確保頁面在所有屏幕尺寸上都能正常工作
4. 考慮不同用戶的可訪問性需求
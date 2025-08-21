# 測試工具目錄 (test-utils/)

這個目錄包含了 DBF Viewer 應用程序的測試工具和輔助函數，用於簡化和標準化測試流程。

## 主要文件

- `index.tsx` - 提供全功能的自定義渲染函數和測試工具

## 全功能渲染函數

這個目錄提供了一個「全功能」的自定義渲染函數，它預設提供了所有必要的 Providers（如 Router, Theme Provider 等）。

### 優勢

1. **一致性**：所有測試都使用同一個 render 函數，只需從 test-utils 中導入，而不是直接從 @testing-library/react 導入
2. **靈活性**：對於不需要路由的元件，多一層 Router 包裹通常無害；對於需要路由的元件，它又能直接運作，無需任何額外設定
3. **可維護性**：當需要新增一個全域 Provider（例如，國際化 i18n），只需要修改 test-utils 這一個檔案，所有測試就都能獲得新的上下文

### 使用方式

```tsx
// 1. 基本用法
import { render, screen } from '../../test-utils';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeDefined();
});

// 2. 配置路由
import { render, screen } from '../../test-utils';

test('renders with specific route', () => {
  render(<MyComponent />, {
    providerProps: {
      routerProps: {
        initialEntries: ['/dashboard']
      }
    }
  });
  expect(screen.getByText('Dashboard')).toBeDefined();
});
```

## 擴展指南

如果需要添加新的 Provider 或測試工具，請按照以下步驟：

1. 在 `AllTheProviders` 組件中添加新的 Provider
2. 更新 `AllTheProvidersProps` 接口，添加新的配置屬性
3. 更新 `CustomRenderOptions` 接口，添加新的配置選項
4. 在 README.md 中更新使用示例

## 最佳實踐

1. 始終使用 test-utils 中的 render 函數，而不是直接使用 @testing-library/react 的 render 函數
2. 對於需要特定路由的測試，使用 providerProps.routerProps 配置選項
3. 保持測試的簡潔和專注，每個測試只測試一個功能點
4. 使用 data-testid 屬性來選擇元素，而不是依賴於文本內容或 DOM 結構
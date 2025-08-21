import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../test-utils';
import DashboardCard from '../DashboardCard';

// 創建一個簡單的圖標組件用於測試
const TestIcon = () => <div data-testid="test-icon">Test Icon</div>;

// 模擬 MUI 組件
vi.mock('@mui/material', () => {
  return {
    Card: ({ children, sx }: any) => <div data-testid="mui-card">{children}</div>,
    CardContent: ({ children, sx }: any) => <div data-testid="mui-card-content">{children}</div>,
    Box: ({ children, sx }: any) => <div data-testid="mui-box">{children}</div>,
    Typography: ({ children, variant, component, sx }: any) => (
      <div data-testid="mui-typography">{children}</div>
    ),
    useTheme: () => ({
      breakpoints: {
        down: () => false
      }
    })
  };
});

describe('DashboardCard 基本功能測試', () => {
  it('應該渲染標題和數值', () => {
    const { getByText } = render(
      <DashboardCard 
        title="測試標題" 
        value="123" 
        icon={<TestIcon />} 
        color="primary" 
      />
    );
    
    // 檢查標題和數值是否存在
    expect(getByText('測試標題')).toBeDefined();
    expect(getByText('123')).toBeDefined();
    // 檢查是否成功渲染
    expect(getByText('測試標題').textContent).toBe('測試標題');
    expect(getByText('123').textContent).toBe('123');
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
import DashboardCard from '../DashboardCard';

// 模擬 MUI 圖標
vi.mock('@mui/icons-material/Folder', () => ({
  default: () => <div data-testid="folder-icon">Folder Icon</div>
}));

// 導入模擬的圖標
import FolderIcon from '@mui/icons-material/Folder';

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
    }),
    createTheme: () => ({})
  };
});

describe('DashboardCard 組件', () => {
  it('應該正確渲染標題和數值', () => {
    render(
      <DashboardCard 
        title="測試標題" 
        value="123" 
        icon={<FolderIcon data-testid="folder-icon" />} 
        color="primary" 
      />
    );
    
    // 檢查標題和數值是否正確渲染
    expect(screen.getByText('測試標題')).toBeDefined();
    expect(screen.getByText('123')).toBeDefined();
    expect(screen.getByTestId('folder-icon')).toBeDefined();
  });

  it('應該使用不同的顏色主題', () => {
    const { rerender } = render(
      <DashboardCard 
        title="主要主題" 
        value="123" 
        icon={<FolderIcon />} 
        color="primary" 
      />
    );

    // 重新渲染組件，使用不同的顏色主題
    rerender(
      <DashboardCard 
        title="成功主題" 
        value="456" 
        icon={<FolderIcon />} 
        color="success" 
      />
    );
    
    expect(screen.getByText('成功主題')).toBeDefined();
    expect(screen.getByText('456')).toBeDefined();
  });

  it('應該處理長標題和數值', () => {
    render(
      <DashboardCard 
        title="這是一個非常長的標題，用於測試組件如何處理長文本" 
        value="1,234,567,890" 
        icon={<FolderIcon />} 
        color="warning" 
      />
    );
    
    expect(screen.getByText('這是一個非常長的標題，用於測試組件如何處理長文本')).toBeDefined();
    expect(screen.getByText('1,234,567,890')).toBeDefined();
  });

  it('應該正確處理不同的圖標', () => {
    const CustomIcon = () => <div data-testid="custom-icon">自定義圖標</div>;
    
    render(
      <DashboardCard 
        title="自定義圖標" 
        value="789" 
        icon={<CustomIcon />} 
        color="info" 
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeDefined();
  });
});
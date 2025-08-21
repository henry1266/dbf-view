import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';

/**
 * @description 全功能的測試包裝器組件，包含所有必要的 Providers
 * @param {object} props - 組件屬性
 * @param {React.ReactNode} props.children - 子組件
 * @param {object} props.routerProps - React Router 的配置屬性
 * @returns {JSX.Element} 包含所有 Providers 的包裝器組件
 */
interface AllTheProvidersProps {
  children: React.ReactNode;
  routerProps?: {
    initialEntries?: string[];
    initialIndex?: number;
  };
}

/**
 * 全功能的測試包裝器組件
 * 包含：
 * 1. Material UI Theme Provider
 * 2. React Router
 * 可以根據專案需求添加更多 Provider
 */
const AllTheProviders: React.FC<AllTheProvidersProps> = ({ 
  children, 
  routerProps = { initialEntries: ['/'] }
}) => {
  // 創建測試用的主題
  const theme = createTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter {...routerProps}>
        {children}
      </MemoryRouter>
    </ThemeProvider>
  );
};

/**
 * @description 自定義的渲染函數，包含所有必要的 Providers
 * @param {React.ReactElement} ui - 要渲染的 UI 組件
 * @param {object} options - 渲染選項
 * @param {object} options.providerProps - Provider 的配置屬性
 * @param {object} options.providerProps.routerProps - React Router 的配置屬性
 * @returns {object} 渲染結果，包含 testing-library 的所有工具函數
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  providerProps?: {
    routerProps?: AllTheProvidersProps['routerProps'];
  };
}

/**
 * 自定義的渲染函數
 * 使用方式：
 * 1. 基本用法：render(<Component />)
 * 2. 配置路由：render(<Component />, { providerProps: { routerProps: { initialEntries: ['/dashboard'] } } })
 */
const customRender = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  const { providerProps, ...renderOptions } = options || {};
  
  return render(ui, { 
    wrapper: (props) => (
      <AllTheProviders {...props} {...providerProps}>
        {props.children}
      </AllTheProviders>
    ), 
    ...renderOptions 
  });
};

// 重新導出 testing-library 的所有函數
export * from '@testing-library/react';

// 導出自定義的渲染函數
export { customRender as render };
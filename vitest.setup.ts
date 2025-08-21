/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 擴展 Vitest 的 expect 方法，添加 jest-dom 的匹配器
expect.extend(matchers as any);

// 擴展 Vitest 的類型
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveTextContent(text: string): void;
      toBeVisible(): void;
      toHaveClass(className: string): void;
      toHaveStyle(style: Record<string, any>): void;
    }
  }
}

// 每個測試後自動清理
afterEach(() => {
  cleanup();
});

// 全局模擬
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // 可以在這裡添加特定組件的模擬
  };
});

// 模擬 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 模擬 ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 全局設置
beforeAll(() => {
  // 全局測試前設置
  console.log('測試開始執行');
});

afterAll(() => {
  // 全局測試後清理
  console.log('測試執行完成');
});
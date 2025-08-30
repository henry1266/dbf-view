import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加載環境變量
  const env = loadEnv(mode, process.cwd(), '');
  
  // 設置 API 主機和端口
  const API_HOST = env.VITE_API_HOST || '192.168.68.90';
  const API_PORT = env.VITE_API_PORT || '7001';
  
  console.log('Vite 配置:', {
    mode,
    API_HOST,
    API_PORT
  });
  
  return {
  // --- 外掛 (Plugins) ---
  plugins: [
    // Tailwind CSS 支援
    tailwindcss(),
    // React Router 支援 (在測試環境中禁用)
    process.env.VITEST ? [] : reactRouter(),
    // 支援 tsconfig.json 中的路徑別名
    tsconfigPaths()
  ].filter(Boolean),

  // --- CSS 相關設定 ---
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },

  // --- 路徑解析 (Resolve) ---
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'],
    alias: {
      // 設定 '~' 路徑別名，指向 'app' 目錄
      // 這必須與 tsconfig.json 中的 'paths' 選項保持同步
      '~': path.resolve(__dirname, './app'),
    }
  },

  // --- 依賴優化 ---
  optimizeDeps: {
    include: ['@mui/x-data-grid']
  },

  // --- 開發伺服器選項 (Server Options) ---
  server: {
    // 伺服器監聽的埠號
    port: 6002,
    // 伺服器主機名稱
    host: API_HOST,
    // 啟動時自動在瀏覽器中開啟應用程式
    open: true,
    // 關閉 HMR 錯誤覆蓋層
    hmr: {
      overlay: false
    },
    // 為開發伺服器設定代理規則，解決跨域問題
    proxy: {
      '/api': {
        target: `http://${API_HOST}:${API_PORT}`, // 後端 API 的地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // 添加代理事件監聽器，用於調試
          proxy.on('error', (err, req, res) => {
            console.error('代理錯誤:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理請求:', req.url, '到', options.target);
          });
        }
      }
    }
  },

  // --- 建置選項 (Build Options) ---
  build: {
    // 指定建置輸出的目錄
    outDir: 'dist',
    // 建置時生成 source map 檔案，方便在生產環境中偵錯
    sourcemap: true,
    // 禁用 CSS 代碼分割
    cssCodeSplit: false,
    // Rollup 選項，用於更細粒度的打包控制
    rollupOptions: {
      output: {
        // 設定靜態資源的輸出路徑和命名規則
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      }
    },
    // 設定 chunk 大小警告的限制（單位為 kB）
    chunkSizeWarningLimit: 1500
  },

  // --- 預覽伺服器選項 (Preview Options) ---
  preview: {
    // 預覽伺服器監聽的埠號
    port: 4173
  },

  // --- SSR 選項 ---
  // 處理 SSR 中的 CSS 文件
  ssr: {
    noExternal: ['@mui/x-data-grid', '@mui/material', '@emotion/react', '@emotion/styled']
  },

  // --- Vitest 測試配置 ---
  test: {
    // 啟用全局變量，如 describe, it, expect
    globals: true,
    // 使用 jsdom 模擬瀏覽器環境
    environment: 'jsdom',
    // 測試前運行的設置文件
    setupFiles: ['./vitest.setup.ts'],
    // 包含 CSS 處理
    css: true,
    // 排除測試的文件和目錄
    exclude: [...configDefaults.exclude, 'e2e/*'],
    // 代碼覆蓋率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'app/welcome/',
        'public/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/types.ts',
        'test/'
      ],
    },
    // 測試超時時間
    testTimeout: 10000
  }
};
});
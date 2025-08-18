import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css']
  },
  optimizeDeps: {
    include: ['@mui/x-data-grid']
  },
  build: {
    cssCodeSplit: false
  },
  server: {
    hmr: {
      overlay: false
    }
  },
    // 處理SSR中的CSS文件
  ssr: {
    noExternal: ['@mui/x-data-grid', '@mui/material', '@emotion/react', '@emotion/styled']
  }
});

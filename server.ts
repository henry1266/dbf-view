/**
 * @file server.ts
 * @description API 伺服器主入口點
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 引入中間件
import { corsMiddleware } from './src/middleware/cors';

// 引入路由
import dbfFilesRouter from './src/routes/dbf-files';
import dbfRecordsRouter from './src/routes/dbf-records';
import dbfMatchRouter from './src/routes/dbf-match';
import kcstmrRouter from './src/routes/kcstmr';
import kdrugRouter from './src/routes/kdrug';

// 引入數據庫連接
import { connect } from './src/db/mongo';

// 引入 Swagger UI 設置
import { setupSwagger } from './src/config/swagger-ui';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 載入環境變數
dotenv.config();

// 創建 Express 應用
const app = express();
const port = process.env.API_PORT || 7001; // 確保使用.env中設置的API_PORT，預設為7001

// 設定中間件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 允許跨域請求
app.use(corsMiddleware);

// 設定路由
app.use('/api/dbf-files', dbfFilesRouter);
app.use('/api/dbf', dbfRecordsRouter);
app.use('/api/dbf-match', dbfMatchRouter);
app.use('/api/KCSTMR', kcstmrRouter);
app.use('/api/KDRUG', kdrugRouter);

// 設置 Swagger UI
setupSwagger(app);

// 啟動伺服器
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
  
  // 連接 MongoDB
  connect().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
});
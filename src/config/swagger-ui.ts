/**
 * @file swagger-ui.ts
 * @description 設置 Swagger UI 路由
 */

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.config';

/**
 * @function setupSwagger
 * @description 設置 Swagger UI 路由
 * @param {express.Application} app - Express 應用程序實例
 */
export function setupSwagger(app: express.Application): void {
  // 設置 Swagger UI 路由
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'DBF Viewer API 文檔',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    }
  }));

  // 提供 OpenAPI 規範的 JSON 端點
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('Swagger UI 已設置在 /api-docs 路徑');
}
/**
 * @file swagger.config.ts
 * @description Swagger 配置
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DBF Viewer API',
      version: '1.0.0',
      description: '用於瀏覽和查詢 DBF 檔案的 API 服務',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
    },
    servers: [
      {
        url: `http://${process.env.VITE_API_HOST}:${process.env.VITE_API_PORT || '7001'}`,
        description: '開發環境 API 伺服器'
      }
    ],
    components: {
      schemas: {
        DbfRecord: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB 文檔 ID'
            },
            _recordNo: {
              type: 'integer',
              description: '記錄編號'
            },
            _file: {
              type: 'string',
              description: '來源檔案名稱'
            },
            hash: {
              type: 'string',
              description: '記錄的雜湊值，用於識別唯一性'
            },
            data: {
              type: 'object',
              description: '記錄的實際資料，鍵值對形式',
              additionalProperties: true
            },
            _created: {
              type: 'string',
              format: 'date-time',
              description: '記錄創建時間'
            },
            _updated: {
              type: 'string',
              format: 'date-time',
              description: '記錄最後更新時間'
            },
            _truncated: {
              type: 'boolean',
              description: '記錄是否被截斷'
            }
          }
        },
        DbfFile: {
          type: 'object',
          properties: {
            fileName: {
              type: 'string',
              description: 'DBF 檔案名稱，包含副檔名'
            },
            baseName: {
              type: 'string',
              description: 'DBF 檔案基本名稱，不含副檔名'
            },
            collectionName: {
              type: 'string',
              description: 'MongoDB 集合名稱'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: '錯誤訊息'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              description: '當前頁碼'
            },
            totalPages: {
              type: 'integer',
              description: '總頁數'
            },
            total: {
              type: 'integer',
              description: '總記錄數'
            },
            pageSize: {
              type: 'integer',
              description: '每頁記錄數'
            }
          }
        }
      }
    }
  },
  // 更新 APIs 配置，包含所有拆分後的路由檔案
  apis: [
    './src/routes/*.ts',
    './server.ts'
  ],
};

const specs = swaggerJsdoc(options);

export default specs;
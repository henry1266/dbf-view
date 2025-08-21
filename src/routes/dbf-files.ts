/**
 * @file dbf-files.ts
 * @description DBF 檔案列表路由處理
 */

import express, { Request, Response, Router } from 'express';
import { connect, getDb } from '../db/mongo';
import { DbfFile } from '../types';

// 創建路由
const router: Router = express.Router();

/**
 * @openapi
 * /api/dbf-files:
 *   get:
 *     summary: 獲取所有可用的DBF檔案列表
 *     description: 返回系統中所有可用的DBF檔案列表，包含檔案名稱、基本名稱和集合名稱
 *     tags:
 *       - DBF 檔案
 *     responses:
 *       200:
 *         description: 成功獲取檔案列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DbfFile'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await connect();
    const db = getDb();
    
    if (!db) {
      return res.status(500).json({ error: '無法連接到數據庫' });
    }
    
    const collections = await db.listCollections().toArray();
    const dbfFiles: DbfFile[] = collections
      .filter(collection => collection.name.startsWith(process.env.MONGO_COLLECTION_PREFIX || ''))
      .map(collection => {
        const fileName = collection.name.replace(process.env.MONGO_COLLECTION_PREFIX || '', '');
        return {
          fileName: `${fileName.toUpperCase()}.DBF`,
          baseName: fileName,
          collectionName: collection.name
        };
      });
    
    res.json(dbfFiles);
  } catch (err) {
    console.error('Error fetching DBF files:', err);
    res.status(500).json({ error: 'Failed to fetch DBF files' });
  }
});

export default router;
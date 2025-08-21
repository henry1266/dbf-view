/**
 * @file kcstmr.ts
 * @description KCSTMR 查詢路由處理
 */

import express, { Request, Response, Router } from 'express';
import { connect, getAllCollections } from '../db/mongo';
import { DbfRecord, KcstmrResponse } from '../types';

// 創建路由
const router: Router = express.Router();

/**
 * @openapi
 * /api/KCSTMR/{value}:
 *   get:
 *     summary: KCSTMR 查詢
 *     description: 根據 KCSTMR 值查詢相關記錄
 *     tags:
 *       - 特殊查詢
 *     parameters:
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: KCSTMR 值
 *     responses:
 *       200:
 *         description: 成功獲取查詢結果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kcstmrValue:
 *                   type: string
 *                   description: 查詢的 KCSTMR 值
 *                 recordsByFile:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       records:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/DbfRecord'
 *                       count:
 *                         type: integer
 *                   description: 按檔案分組的記錄
 *                 totalRecords:
 *                   type: integer
 *                   description: 總記錄數
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:value', async (req: Request, res: Response) => {
  const { value } = req.params;
  
  try {
    await connect();
    
    const recordsByFile: Record<string, { records: DbfRecord[]; count: number }> = {};
    let totalRecords = 0;
    
    // 獲取所有集合
    const dbfRecordsCollections = getAllCollections();
    
    // 對每個 DBF 檔案進行查詢
    for (const [baseName, collection] of Object.entries(dbfRecordsCollections)) {
      // 構建查詢條件 - 精確匹配 KCSTMR 欄位
      const query = { 'data.KCSTMR': value };
      
      // 執行查詢
      const records = await collection.find(query).sort({ _recordNo: 1 }).toArray();
      
      // 如果有結果，添加到對應檔案的結果集中
      if (records.length > 0) {
        recordsByFile[`${baseName.toUpperCase()}.DBF`] = {
          records,
          count: records.length
        };
        
        totalRecords += records.length;
      }
    }
    
    const response: KcstmrResponse = {
      kcstmrValue: value,
      recordsByFile,
      totalRecords
    };
    
    res.json(response);
  } catch (err) {
    console.error(`Error fetching KCSTMR=${value} records:`, err);
    res.status(500).json({ error: `查詢 KCSTMR=${value} 時發生錯誤` });
  }
});

export default router;
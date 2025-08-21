/**
 * @file kdrug.ts
 * @description KDRUG 查詢路由處理
 */

import express, { Request, Response, Router } from 'express';
import { connect, getCollection } from '../db/mongo';
import { KdrugResponse } from '../types';

// 創建路由
const router: Router = express.Router();

/**
 * @openapi
 * /api/KDRUG/{value}:
 *   get:
 *     summary: KDRUG 查詢
 *     description: 根據 KDRUG 值查詢相關記錄，支持日期範圍篩選
 *     tags:
 *       - 特殊查詢
 *     parameters:
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: KDRUG 值
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: 開始日期 (格式：YYMMDD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: 結束日期 (格式：YYMMDD)
 *     responses:
 *       200:
 *         description: 成功獲取查詢結果
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kdrugValue:
 *                   type: string
 *                   description: 查詢的 KDRUG 值
 *                 records:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DbfRecord'
 *                   description: 查詢結果記錄
 *                 totalRecords:
 *                   type: integer
 *                   description: 總記錄數
 *                 totalPTQTY:
 *                   type: number
 *                   description: PTQTY 總和
 *                 totalPTQTY_I:
 *                   type: number
 *                   description: LDRU 為 I 的 PTQTY 總和
 *                 totalPTQTY_O:
 *                   type: number
 *                   description: LDRU 為 O 的 PTQTY 總和
 *                 startDate:
 *                   type: string
 *                   description: 查詢的開始日期
 *                 endDate:
 *                   type: string
 *                   description: 查詢的結束日期
 *                 allDates:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 所有不重複的日期
 *       404:
 *         description: 找不到相關集合
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:value', async (req: Request, res: Response) => {
  const { value } = req.params;
  const { startDate = '', endDate = '' } = req.query as { startDate?: string; endDate?: string };
  
  try {
    await connect();
    
    // 找到 co02p 集合
    const co02pCollection = getCollection('co02p');
    
    if (!co02pCollection) {
      return res.status(404).json({ error: '找不到 co02p.DBF 對應的集合' });
    }
    
    // 找到 CO03L 集合
    const co03lCollection = getCollection('co03l');
    
    if (!co03lCollection) {
      return res.status(404).json({ error: '找不到 CO03L.DBF 對應的集合' });
    }
    
    // 找到 CO09D 集合
    const co09dCollection = getCollection('co09d');
    
    if (!co09dCollection) {
      return res.status(404).json({ error: '找不到 CO09D.DBF 對應的集合' });
    }
    
    // 構建查詢條件 - 精確匹配 KDRUG 欄位
    let query: any = { 'data.KDRUG': value };
    
    // 如果有日期區間，添加到查詢條件
    if (startDate && endDate) {
      query['data.PDATE'] = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query['data.PDATE'] = { $gte: startDate };
    } else if (endDate) {
      query['data.PDATE'] = { $lte: endDate };
    }
    
    // 執行查詢
    const records = await co02pCollection.find(query).sort({ _recordNo: 1 }).toArray();
    
    // 為每個 co02p 記錄查找匹配的 CO03L 記錄，並獲取 LDRU 值
    for (const record of records) {
      // 從 co02p 記錄中提取 KCSTMR、PDATE 和 PTIME 值
      const kcstmr = record.data.KCSTMR || '';
      const pdate = record.data.PDATE || '';
      const ptime = record.data.PTIME || '';
      const kdrug = record.data.KDRUG || '';
      
      // 構建查詢條件 - 匹配 KCSTMR、DATE 和 TIME
      const co03lQuery = {
        'data.KCSTMR': kcstmr,
        'data.DATE': pdate,
        'data.TIME': ptime
      };
      
      // 查找匹配的 CO03L 記錄
      const matchingCo03lRecord = await co03lCollection.findOne(co03lQuery);
      
      // 如果找到匹配的記錄，獲取 LDRU 值
      if (matchingCo03lRecord && matchingCo03lRecord.data.LDRU) {
        // 將 LDRU 值添加到 co02p 記錄中
        record.data.LDRU = matchingCo03lRecord.data.LDRU;
      } else {
        record.data.LDRU = '';
      }
      
      // 構建查詢條件 - 匹配 KDRUG
      const co09dQuery = {
        'data.KDRUG': kdrug
      };
      
      // 查找匹配的 CO09D 記錄
      const matchingCo09dRecord = await co09dCollection.findOne(co09dQuery);
      
      // 如果找到匹配的記錄，獲取 DNO 和 DDESC 值
      if (matchingCo09dRecord) {
        // 將 DNO 和 DDESC 值添加到 co02p 記錄中
        record.data.DNO = matchingCo09dRecord.data.DNO || '';
        record.data.DDESC = matchingCo09dRecord.data.DDESC || '';
      } else {
        record.data.DNO = '';
        record.data.DDESC = '';
      }
    }
    
    // 計算 PTQTY 加總，並根據 LDRU 值分類
    let totalPTQTY = 0;
    let totalPTQTY_I = 0; // LDRU: I 的 PTQTY 加總
    let totalPTQTY_O = 0; // LDRU: O 的 PTQTY 加總
    
    records.forEach(record => {
      if (record.data.PTQTY) {
        // 嘗試將 PTQTY 轉換為數字
        const ptqty = parseFloat(record.data.PTQTY);
        if (!isNaN(ptqty)) {
          // 總加總
          totalPTQTY += ptqty;
          
          // 根據 LDRU 值分類加總
          if (record.data.LDRU === 'I') {
            totalPTQTY_I += ptqty;
          } else if (record.data.LDRU === 'O') {
            totalPTQTY_O += ptqty;
          }
        }
      }
    });
    
    // 獲取所有不重複的 PDATE 值，用於日期選擇器
    const allDates = [...new Set(records.map(record => record.data.PDATE).filter(Boolean))].sort();
    
    const response: KdrugResponse = {
      kdrugValue: value,
      records,
      totalRecords: records.length,
      totalPTQTY,
      totalPTQTY_I,
      totalPTQTY_O,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      allDates
    };
    
    res.json(response);
  } catch (err) {
    console.error(`Error fetching KDRUG=${value} records:`, err);
    res.status(500).json({ error: `查詢 KDRUG=${value} 時發生錯誤` });
  }
});

export default router;
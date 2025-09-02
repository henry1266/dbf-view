/**
 * @file dbf-match.ts
 * @description DBF 記錄配對路由處理
 */

import express, { Request, Response, Router } from 'express';
import { connect, getCollection } from '../db/mongo';
import { DbfRecord } from '../types';

// 創建路由
const router: Router = express.Router();

/**
 * @openapi
 * /api/dbf-match/CO02P:
 *   get:
 *     summary: 獲取配對的 CO02P 記錄
 *     description: 根據 KCSTMR、DATE 和 TIME 參數獲取配對的 CO02P 記錄
 *     tags:
 *       - DBF 記錄配對
 *     parameters:
 *       - in: query
 *         name: kcstmr
 *         required: true
 *         schema:
 *           type: string
 *         description: 客戶編號
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: 日期
 *       - in: query
 *         name: time
 *         required: true
 *         schema:
 *           type: string
 *         description: 時間
 *     responses:
 *       200:
 *         description: 成功獲取配對記錄
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DbfRecord'
 *       404:
 *         description: 找不到配對記錄
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
router.get('/CO02P', async (req: Request, res: Response) => {
  const { kcstmr, date, time } = req.query as {
    kcstmr?: string;
    date?: string;
    time?: string;
  };

  // 驗證必要參數
  if (!kcstmr || !date || !time) {
    return res.status(400).json({ error: '缺少必要參數：kcstmr、date 和 time 都是必須的' });
  }

  try {
    await connect();

    // 獲取 CO02P 集合
    const co02pCollection = getCollection('co02p');

    if (!co02pCollection) {
      return res.status(404).json({ error: '找不到 CO02P 對應的集合' });
    }

    // 構建查詢條件
    const query = {
      'data.KCSTMR': kcstmr.trim(),
      'data.PDATE': date.trim(),
      'data.PTIME': time.trim()
    };

    // 執行查詢
    const matchingRecords = await co02pCollection.find(query).toArray();

    // 返回結果
    res.json(matchingRecords);
  } catch (err) {
    console.error(`Error fetching matching CO02P records:`, err);
    res.status(500).json({ error: '獲取配對的 CO02P 記錄時發生錯誤' });
  }
});

/**
 * @openapi
 * /api/dbf-match/CO09D:
 *   get:
 *     summary: 獲取配對的 CO02P 記錄 (根據 KDRUG)
 *     description: 根據 KDRUG 參數獲取配對的 CO02P 記錄，並從 CO09D 獲取 DNO 和 DDESC
 *     tags:
 *       - DBF 記錄配對
 *     parameters:
 *       - in: query
 *         name: kdrug
 *         required: true
 *         schema:
 *           type: string
 *         description: 藥品代碼
 *     responses:
 *       200:
 *         description: 成功獲取配對記錄
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 co02pRecords:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DbfRecord'
 *                 co09dRecord:
 *                   $ref: '#/components/schemas/DbfRecord'
 *       404:
 *         description: 找不到配對記錄
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
router.get('/CO09D', async (req: Request, res: Response) => {
  const { kdrug } = req.query as {
    kdrug?: string;
  };

  // 驗證必要參數
  if (!kdrug) {
    return res.status(400).json({ error: '缺少必要參數：kdrug 是必須的' });
  }

  try {
    await connect();

    // 獲取 CO02P 集合
    const co02pCollection = getCollection('co02p');
    if (!co02pCollection) {
      return res.status(404).json({ error: '找不到 CO02P 對應的集合' });
    }

    // 獲取 CO09D 集合
    const co09dCollection = getCollection('co09d');
    if (!co09dCollection) {
      return res.status(404).json({ error: '找不到 CO09D 對應的集合' });
    }

    // 構建 CO02P 查詢條件
    const co02pQuery = {
      'data.KDRUG': kdrug.trim()
    };

    // 執行 CO02P 查詢
    const co02pRecords = await co02pCollection.find(co02pQuery).toArray();

    // 構建 CO09D 查詢條件
    const co09dQuery = {
      'data.KDRUG': kdrug.trim()
    };

    // 執行 CO09D 查詢
    const co09dRecord = await co09dCollection.findOne(co09dQuery);

    // 返回結果
    res.json({
      co02pRecords,
      co09dRecord
    });
  } catch (err) {
    console.error(`Error fetching matching records for KDRUG=${kdrug}:`, err);
    res.status(500).json({ error: '獲取配對記錄時發生錯誤' });
  }
});

export default router;
/**
 * @file mpersonid.ts
 * @description MPERSONID 查詢路由模組
 */

import express, { Request, Response, Router } from 'express';
import { connect, getCollection } from '../db/mongo';
import { DbfRecord, MpersonidResponse } from '../types';

const router: Router = express.Router();
const CO01M_COLLECTION_KEY = 'co01m';

/**
 * @openapi
 * /api/MPERSONID/{value}:
 *   get:
 *     summary: MPERSONID 查詢
 *     description: 依據 MPERSONID 查詢 CO01M.DBF 中相關的病患基本資料。
 *     tags:
 *       - 進階查詢
 *     parameters:
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: MPERSONID 值
 *     responses:
 *       200:
 *         description: 查詢成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MpersonidResponse'
 *       404:
 *         description: 找不到 MPERSONID 對應的資料或資料來源
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

  try {
    await connect();

    const collection = getCollection(CO01M_COLLECTION_KEY);
    if (!collection) {
      return res.status(404).json({ error: 'CO01M.DBF 資料來源不存在' });
    }

    const query = { 'data.MPERSONID': value };
    const records = await collection.find(query).sort({ _recordNo: 1 }).toArray();

    if (records.length === 0) {
      return res.status(404).json({ error: `查無 MPERSONID=${value} 的資料` });
    }

    const uniqueKcstmrValues = Array.from(
      new Set(
        records
          .map((record: DbfRecord) => record?.data?.KCSTMR)
          .filter((kcstmr): kcstmr is string => Boolean(kcstmr))
      )
    );

    const response: MpersonidResponse = {
      mpersonidValue: value,
      records,
      totalRecords: records.length,
      uniqueKcstmrValues,
    };

    res.json(response);
  } catch (err) {
    console.error(`Error fetching MPERSONID=${value} records:`, err);
    res.status(500).json({ error: `查詢 MPERSONID=${value} 時發生錯誤` });
  }
});

export default router;

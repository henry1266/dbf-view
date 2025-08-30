/**
 * @file dbf-records.ts
 * @description DBF 記錄路由處理
 */

import express, { Request, Response, Router } from 'express';
import path from 'path';
import { connect, getCollection } from '../db/mongo';
import { DbfRecord, DbfRecordsResponse } from '../types';
import { addCustomerDataToRecords, addCustomerDataToRecord } from '../db/customer-data';

// 創建路由
const router: Router = express.Router();

/**
 * @openapi
 * /api/dbf/{fileName}:
 *   get:
 *     summary: 獲取特定DBF檔案的記錄
 *     description: 獲取特定DBF檔案的記錄，支持分頁、搜索、排序和日期範圍篩選
 *     tags:
 *       - DBF 記錄
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: DBF檔案名稱
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 頁碼
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 每頁記錄數
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索關鍵字
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         description: 搜索的欄位名稱
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *         description: 排序欄位
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 排序方向
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
 *       - in: query
 *         name: statsPage
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: 'false'
 *         description: 是否為統計頁面請求
 *     responses:
 *       200:
 *         description: 成功獲取記錄
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileName:
 *                   type: string
 *                   description: DBF檔案名稱
 *                 records:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DbfRecord'
 *                   description: 記錄數據
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 sortApplied:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     direction:
 *                       type: string
 *                 filters:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: string
 *                     field:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                     endDate:
 *                       type: string
 *       404:
 *         description: 找不到檔案
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
router.get('/:fileName', async (req: Request, res: Response) => {
  const { fileName } = req.params;
  // 獲取查詢參數
  let {
    page = '1',
    pageSize = '20',
    search = '',
    field = '',
    sortField,
    sortDirection = 'desc',  // 默認降序排序（最新優先）
    startDate = '',          // 添加開始日期參數
    endDate = '',            // 添加結束日期參數
    statsPage = 'false'      // 添加統計頁面標記參數
  } = req.query as {
    page?: string;
    pageSize?: string;
    search?: string;
    field?: string;
    sortField?: string;
    sortDirection?: string;
    startDate?: string;      // 添加開始日期參數類型
    endDate?: string;        // 添加結束日期參數類型
    statsPage?: string;      // 添加統計頁面標記參數類型
  };
  
  // 根據檔案名稱設置默認排序欄位
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
  if (!sortField) {
    if (baseName === 'co03l') {
      sortField = '_recordNo';  // CO03L.DBF 默認按紀錄編號排序
      //console.log(`使用 ${fileName} 特殊排序: 按紀錄編號排序`);
    } else {
      sortField = 'PDATE';  // 其他檔案默認按 PDATE 排序
    }
  }
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  
  try {
    await connect();
    
    const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
    const collection = getCollection(baseName);
    
    if (!collection) {
      return res.status(404).json({ error: `找不到 ${fileName} 對應的集合` });
    }
    
    // 構建查詢條件
    let query: any = {};
    
    // 處理搜尋條件
    if (search && field) {
      // 如果指定了欄位，則在該欄位中搜尋
      query[`data.${field}`] = { $regex: search, $options: 'i' };
    } else if (search) {
      // 如果沒有指定欄位，則在所有欄位中搜尋
      const firstRecord = await collection.findOne({}, { projection: { data: 1 } });
      if (firstRecord && firstRecord.data) {
        query.$or = Object.keys(firstRecord.data)
          .map(field => ({
            [`data.${field}`]: { $regex: search, $options: 'i' }
          }));
      }
    }
    
    // 處理日期範圍篩選
    if (startDate || endDate) {
      // 根據檔案類型選擇適當的日期欄位
      let dateField = 'data.PDATE';  // 默認使用 PDATE 欄位
      
      // 如果是 CO03L.DBF，則使用 DATE 欄位
      if (baseName.toUpperCase() === 'CO03L') {
        dateField = 'data.DATE';
        //console.log(`使用 ${fileName} 特殊日期欄位: DATE`);
      }
      
      // 構建日期範圍條件
      if (!query[dateField]) {
        query[dateField] = {};
      }
      
      if (startDate && endDate) {
        query[dateField] = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query[dateField] = { $gte: startDate };
      } else if (endDate) {
        query[dateField] = { $lte: endDate };
      }
    }
    
    // 為 CO03L.DBF 添加 LPID 和 LISRS 不為空值的篩選條件
    if (baseName.toUpperCase() === 'CO03L' && statsPage === 'true') {
      // 使用 $and 運算符組合多個條件
      query['$and'] = [
        // LPID 不為空值的條件
        {
          'data.LPID': {
            $exists: true,  // 欄位必須存在
            $nin: [null, '', ' ']  // 不能為 null、空字符串或只有空格
          }
        },
        // LISRS 不為空值的條件
        {
          'data.LISRS': {
            $exists: true,  // 欄位必須存在
            $nin: [null, '', ' ']  // 不能為 null、空字符串或只有空格
          }
        }
      ];
    }
    
    // 獲取總記錄數
    const total = await collection.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(pageSize));
    
    // 準備聚合管道
    let aggregationPipeline: any[] = [];
    
    // 添加查詢條件
    if (Object.keys(query).length > 0) {
      aggregationPipeline.push({ $match: query });
    }
    
    // 處理排序
    const sortOrder = sortDirection.toLowerCase() === 'asc' ? 1 : -1;
    
    // 特別處理 PDATE 欄位的排序（民國年日期格式）
    if (sortField?.toUpperCase() === 'PDATE') {
      // 添加轉換欄位，將 PDATE 字串轉換為可排序的日期物件
      aggregationPipeline.push({
        $addFields: {
          // 建立一個臨時的日期物件欄位，供後續排序使用
          convertedGregorianDate: {
            $cond: {
              // 檢查 PDATE 是否存在且格式正確（長度為 7 的字符串）
              if: {
                $and: [
                  { $ne: ["$data.PDATE", null] },
                  { $ne: ["$data.PDATE", ""] },
                  // 確保 PDATE 是字串類型
                  { $eq: [{ $type: "$data.PDATE" }, "string"] },
                  // 確保字串長度為 7
                  { $eq: [{ $strLenCP: "$data.PDATE" }, 7] },
                  // 確保前三位是數字
                  { $regexMatch: { input: { $substrCP: ["$data.PDATE", 0, 3] }, regex: /^\\d+$/ } },
                  // 確保中間兩位是數字
                  { $regexMatch: { input: { $substrCP: ["$data.PDATE", 3, 2] }, regex: /^\\d+$/ } },
                  // 確保後兩位是數字
                  { $regexMatch: { input: { $substrCP: ["$data.PDATE", 5, 2] }, regex: /^\\d+$/ } }
                ]
              },
              // 如果 PDATE 格式正確，則進行轉換
              then: {
                $let: {
                  vars: {
                    // 拆解 PDATE 字串 '1130814'
                    minguoYearStr: { $substrCP: ["$data.PDATE", 0, 3] }, // 取前3碼 "113"
                    monthStr: { $substrCP: ["$data.PDATE", 3, 2] },      // 取中間2碼 "08"
                    dayStr: { $substrCP: ["$data.PDATE", 5, 2] }         // 取後方2碼 "14"
                  },
                  in: {
                    // 將拆分後的字串組合回 MongoDB 認識的 ISO 格式 "YYYY-MM-DD"
                    $dateFromString: {
                      dateString: {
                        $concat: [
                          // 將民國年轉為數字，加上 1911，再轉回字串
                          {
                            $toString: {
                              $add: [
                                {
                                  $toInt: {
                                    $cond: {
                                      if: { $regexMatch: { input: "$$minguoYearStr", regex: /^\\d+$/ } },
                                      then: "$$minguoYearStr",
                                      else: "0" // 如果不是數字，則使用 0
                                    }
                                  }
                                },
                                1911
                              ]
                            }
                          },
                          "-",
                          "$$monthStr",
                          "-",
                          "$$dayStr"
                        ]
                      },
                      onError: new Date(0) // 處理無效日期
                    }
                  }
                }
              },
              // 如果 PDATE 格式不正確，則使用一個默認日期（1970-01-01）
              else: new Date(0)
            }
          }
        }
      });
      
      // 根據轉換後的日期欄位排序
      aggregationPipeline.push({
        $sort: { convertedGregorianDate: sortOrder }
      });
    } else {
      // 其他欄位使用標準排序
      // 如果是排序資料欄位，需要加上 data. 前綴
      const sortKey = sortField?.startsWith('_') ? sortField : `data.${sortField}`;
      
      aggregationPipeline.push({
        $sort: { [sortKey]: sortOrder }
      });
    }
    
    // 添加分頁
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: parseInt(pageSize) });
    
    // 如果是統計頁面請求，添加一個步驟來確保A2、A97和TOT欄位存在
    if (statsPage === 'true') {
      // 添加一個步驟來確保A2、A97和TOT欄位存在，如果不存在則設置為0
      aggregationPipeline.push({
        $addFields: {
          "data.A2": {
            $cond: {
              if: { $or: [
                { $eq: ["$data.A2", null] },
                { $eq: ["$data.A2", ""] },
                { $eq: ["$data.A2", " "] },
                { $not: [{ $ifNull: ["$data.A2", false] }] }
              ]},
              then: 0,  // 如果A2欄位不存在或為空，則設置為0
              else: { $toDouble: { $ifNull: ["$data.A2", 0] } }  // 否則將其轉換為數字
            }
          },
          "data.A97": {
            $cond: {
              if: { $or: [
                { $eq: ["$data.A97", null] },
                { $eq: ["$data.A97", ""] },
                { $eq: ["$data.A97", " "] },
                { $not: [{ $ifNull: ["$data.A97", false] }] }
              ]},
              then: 0,  // 如果A97欄位不存在或為空，則設置為0
              else: { $toDouble: { $ifNull: ["$data.A97", 0] } }  // 否則將其轉換為數字
            }
          },
          "data.TOT": {
            $cond: {
              if: { $or: [
                { $eq: ["$data.TOT", null] },
                { $eq: ["$data.TOT", ""] },
                { $eq: ["$data.TOT", " "] },
                { $not: [{ $ifNull: ["$data.TOT", false] }] }
              ]},
              then: 0,  // 如果TOT欄位不存在或為空，則設置為0
              else: { $toDouble: { $ifNull: ["$data.TOT", 0] } }  // 否則將其轉換為數字
            }
          }
        }
      });
    }
    
    // 執行聚合查詢
    const records = await collection.aggregate(aggregationPipeline).toArray();
    
    // 如果是 CO03L.DBF 或 CO02P.DBF，在應用層面添加客戶資料欄位
    if (baseName.toUpperCase() === 'CO03L' || baseName.toUpperCase() === 'CO02P') {
      // 使用可重用組件添加客戶資料
      await addCustomerDataToRecords(records);
    }
    
    const response: DbfRecordsResponse = {
      fileName,
      records,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        pageSize: parseInt(pageSize)
      },
      sortApplied: {
        field: sortField || '',
        direction: sortDirection
      },
      filters: {
        search,
        field,
        startDate,
        endDate
      }
    };
    
    res.json(response);
  } catch (err) {
    console.error(`Error fetching ${fileName} records:`, err);
    res.status(500).json({ error: `獲取 ${fileName} 記錄時發生錯誤` });
  }
});

/**
 * @openapi
 * /api/dbf/{fileName}/{recordNo}:
 *   get:
 *     summary: 獲取特定記錄
 *     description: 根據檔案名稱和記錄編號獲取特定記錄的詳細信息
 *     tags:
 *       - DBF 記錄
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: DBF檔案名稱
 *       - in: path
 *         name: recordNo
 *         required: true
 *         schema:
 *           type: integer
 *         description: 記錄編號
 *     responses:
 *       200:
 *         description: 成功獲取記錄
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DbfRecord'
 *       404:
 *         description: 找不到檔案或記錄
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
router.get('/:fileName/:recordNo', async (req: Request, res: Response) => {
  const { fileName, recordNo } = req.params;
  
  try {
    await connect();
    
    const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
    const collection = getCollection(baseName);
    
    if (!collection) {
      return res.status(404).json({ error: `找不到 ${fileName} 對應的集合` });
    }
    
    const record = await collection.findOne({ _recordNo: parseInt(recordNo) });
    
    if (!record) {
      return res.status(404).json({ error: `找不到記錄編號為 ${recordNo} 的 ${fileName} 記錄` });
    }
    
    // 如果是 CO03L.DBF 或 CO02P.DBF，在應用層面添加客戶資料欄位
    if ((baseName.toUpperCase() === 'CO03L' || baseName.toUpperCase() === 'CO02P') && record.data && record.data.KCSTMR) {
      // 使用可重用組件添加客戶資料
      await addCustomerDataToRecord(record);
    }
    
    res.json(record);
  } catch (err) {
    console.error(`Error fetching ${fileName} record #${recordNo}:`, err);
    res.status(500).json({ error: `獲取 ${fileName} 記錄 #${recordNo} 時發生錯誤` });
  }
});

export default router;
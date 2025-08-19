import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { MongoClient, Collection, Db } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 定義記錄類型
interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
  _truncated?: boolean;
}

// MongoDB 連接
let db: Db | null = null;
let dbfRecordsCollections: Record<string, Collection<DbfRecord>> = {};

async function connectMongo(): Promise<Db> {
  if (db) return db;
  
  try {
    const mongoClient = new MongoClient(process.env.MONGO_URI || '');
    await mongoClient.connect();
    
    db = mongoClient.db(process.env.MONGO_DB);
    
    // 獲取所有集合
    const collections = await db.listCollections().toArray();
    
    // 為每個 DBF 檔案創建集合引用
    for (const collection of collections) {
      if (collection.name.startsWith(process.env.MONGO_COLLECTION_PREFIX || '')) {
        const fileName = collection.name.replace(process.env.MONGO_COLLECTION_PREFIX || '', '');
        dbfRecordsCollections[fileName] = db.collection<DbfRecord>(collection.name);
      }
    }
    
    console.log('API server connected to MongoDB');
    return db;
  } catch (err) {
    console.error('API server failed to connect to MongoDB:', err);
    throw err;
  }
}

// API 路由

// 獲取所有 DBF 檔案列表
app.get('/api/dbf-files', async (req: Request, res: Response) => {
  try {
    await connectMongo();
    
    const collections = await db!.listCollections().toArray();
    const dbfFiles = collections
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

// 獲取特定 DBF 檔案的記錄
app.get('/api/dbf/:fileName', async (req: Request, res: Response) => {
  const { fileName } = req.params;
  // 獲取查詢參數
  let {
    page = '1',
    pageSize = '20',
    search = '',
    field = '',
    sortField,
    sortDirection = 'desc'  // 默認降序排序（最新優先）
  } = req.query as {
    page?: string;
    pageSize?: string;
    search?: string;
    field?: string;
    sortField?: string;
    sortDirection?: string;
  };
  
  // 根據檔案名稱設置默認排序欄位
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
  if (!sortField) {
    if (baseName === 'co03l') {
      sortField = '_recordNo';  // CO03L.DBF 默認按紀錄編號排序
      console.log(`使用 ${fileName} 特殊排序: 按紀錄編號排序`);
    } else {
      sortField = 'PDATE';  // 其他檔案默認按 PDATE 排序
    }
  }
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  
  try {
    await connectMongo();
    
    const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
    const collection = dbfRecordsCollections[baseName];
    
    if (!collection) {
      return res.status(404).json({ error: `找不到 ${fileName} 對應的集合` });
    }
    
    // 構建查詢條件
    let query: any = {};
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
    if (sortField.toUpperCase() === 'PDATE') {
      //console.log('使用 PDATE 特殊排序邏輯（民國年轉西元年）');
      
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
                  { $regexMatch: { input: { $substrCP: ["$data.PDATE", 0, 3] }, regex: /^\d+$/ } },
                  // 確保中間兩位是數字
                  { $regexMatch: { input: { $substrCP: ["$data.PDATE", 3, 2] }, regex: /^\d+$/ } },
                  // 確保後兩位是數字
                  { $regexMatch: { input: { $substrCP: ["$data.PDATE", 5, 2] }, regex: /^\d+$/ } }
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
                                      if: { $regexMatch: { input: "$$minguoYearStr", regex: /^\d+$/ } },
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
      //console.log(`使用標準排序: ${sortField} ${sortDirection}`);
      
      // 如果是排序資料欄位，需要加上 data. 前綴
      const sortKey = sortField.startsWith('_') ? sortField : `data.${sortField}`;
      
      aggregationPipeline.push({
        $sort: { [sortKey]: sortOrder }
      });
    }
    
    // 添加分頁
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: parseInt(pageSize) });
    
    // 執行聚合查詢
    console.log('執行聚合查詢:', JSON.stringify(aggregationPipeline, null, 2));
    const records = await collection.aggregate(aggregationPipeline).toArray();
    
    res.json({
      fileName,
      records,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        total,
        pageSize: parseInt(pageSize)
      },
      sortApplied: {
        field: sortField,
        direction: sortDirection
      }
    });
  } catch (err) {
    console.error(`Error fetching ${fileName} records:`, err);
    res.status(500).json({ error: `獲取 ${fileName} 記錄時發生錯誤` });
  }
});

// 獲取特定記錄
app.get('/api/dbf/:fileName/:recordNo', async (req: Request, res: Response) => {
  const { fileName, recordNo } = req.params;
  
  try {
    await connectMongo();
    
    const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
    const collection = dbfRecordsCollections[baseName];
    
    if (!collection) {
      return res.status(404).json({ error: `找不到 ${fileName} 對應的集合` });
    }
    
    const record = await collection.findOne({ _recordNo: parseInt(recordNo) });
    
    if (!record) {
      return res.status(404).json({ error: `找不到記錄編號為 ${recordNo} 的 ${fileName} 記錄` });
    }
    
    res.json(record);
  } catch (err) {
    console.error(`Error fetching ${fileName} record #${recordNo}:`, err);
    res.status(500).json({ error: `獲取 ${fileName} 記錄 #${recordNo} 時發生錯誤` });
  }
});

// KCSTMR 查詢
app.get('/api/KCSTMR/:value', async (req: Request, res: Response) => {
  const { value } = req.params;
  
  try {
    await connectMongo();
    
    const recordsByFile: Record<string, { records: DbfRecord[]; count: number }> = {};
    let totalRecords = 0;
    
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
    
    res.json({
      kcstmrValue: value,
      recordsByFile,
      totalRecords
    });
  } catch (err) {
    console.error(`Error fetching KCSTMR=${value} records:`, err);
    res.status(500).json({ error: `查詢 KCSTMR=${value} 時發生錯誤` });
  }
});

// KDRUG 查詢
app.get('/api/KDRUG/:value', async (req: Request, res: Response) => {
  const { value } = req.params;
  const { startDate = '', endDate = '' } = req.query as { startDate?: string; endDate?: string };
  
  try {
    await connectMongo();
    
    // 找到 co02p 集合
    const co02pCollection = dbfRecordsCollections['co02p'];
    
    if (!co02pCollection) {
      return res.status(404).json({ error: '找不到 co02p.DBF 對應的集合' });
    }
    
    // 找到 CO03L 集合
    const co03lCollection = dbfRecordsCollections['co03l'];
    
    if (!co03lCollection) {
      return res.status(404).json({ error: '找不到 CO03L.DBF 對應的集合' });
    }
    
    // 找到 CO09D 集合
    const co09dCollection = dbfRecordsCollections['co09d'];
    
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
    
    res.json({
      kdrugValue: value,
      records,
      totalRecords: records.length,
      totalPTQTY,
      totalPTQTY_I,
      totalPTQTY_O,
      startDate,
      endDate,
      allDates
    });
  } catch (err) {
    console.error(`Error fetching KDRUG=${value} records:`, err);
    res.status(500).json({ error: `查詢 KDRUG=${value} 時發生錯誤` });
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
  
  // 連接 MongoDB
  connectMongo().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
});
import axios from 'axios';

// 使用環境變量設置 API 地址
const API_HOST = import.meta.env.VITE_API_HOST || '192.168.68.90';
const API_PORT = import.meta.env.VITE_API_PORT || '7001';

// 始終使用絕對 URL
export const API_BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

// 輸出調試信息
console.log('API 設置:', {
  API_HOST,
  API_PORT,
  API_BASE_URL,
  VITE_API_HOST: import.meta.env.VITE_API_HOST,
  VITE_API_PORT: import.meta.env.VITE_API_PORT
});

/**
 * @description 創建 axios 實例，配置基本 URL 和請求頭
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @function fetchDbfFiles
 * @description 獲取所有 DBF 檔案列表
 * @returns {Promise<Array<string>>} 包含所有 DBF 檔案名稱的數組
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const dbfFiles = await fetchDbfFiles();
 * console.log(dbfFiles); // ['file1.dbf', 'file2.dbf', ...]
 */
export const fetchDbfFiles = async () => {
  try {
    const response = await api.get('/dbf-files');
    return response.data;
  } catch (error) {
    console.error('Error fetching DBF files:', error);
    throw error;
  }
};

/**
 * @function fetchDbfRecords
 * @description 獲取特定 DBF 檔案的記錄，支持分頁、搜索、排序和日期過濾
 * @param {string} fileName - DBF 檔案名稱
 * @param {number} [page=1] - 頁碼，默認為 1
 * @param {number} [pageSize=20] - 每頁記錄數，默認為 20
 * @param {string} [search=''] - 搜索關鍵字
 * @param {string} [field=''] - 搜索的欄位名稱
 * @param {string} [sortField=''] - 排序的欄位名稱
 * @param {string} [sortDirection=''] - 排序方向 ('asc' 或 'desc')
 * @param {string} [startDate=''] - 開始日期過濾 (YYYY-MM-DD 格式)
 * @param {string} [endDate=''] - 結束日期過濾 (YYYY-MM-DD 格式)
 * @param {string} [statsPage='false'] - 是否為統計頁面 ('true' 或 'false')
 * @returns {Promise<{records: Array<any>, totalCount: number}>} 包含記錄數組和總記錄數的對象
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const result = await fetchDbfRecords('patients.dbf', 1, 10, 'John', 'name');
 * console.log(result.records); // 記錄數組
 * console.log(result.totalCount); // 總記錄數
 */
export const fetchDbfRecords = async (
  fileName: string,
  page = 1,
  pageSize = 20,
  search = '',
  field = '',
  sortField = '',
  sortDirection = '',
  startDate = '',
  endDate = '',
  statsPage = 'false'
) => {
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await api.get(`/dbf/${encodedFileName}`, {
      params: {
        page,
        pageSize,
        search,
        field,
        sortField,
        sortDirection,
        startDate,
        endDate,
        statsPage
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${fileName} records:`, error);
    throw error;
  }
};

/**
 * @function fetchDbfRecord
 * @description 獲取特定 DBF 檔案中的特定記錄
 * @param {string} fileName - DBF 檔案名稱
 * @param {number} recordNo - 記錄編號
 * @returns {Promise<any>} 包含記錄詳情的對象
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const record = await fetchDbfRecord('patients.dbf', 123);
 * console.log(record); // 記錄詳情
 */
export const fetchDbfRecord = async (fileName: string, recordNo: number) => {
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await api.get(`/dbf/${encodedFileName}/${recordNo}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${fileName} record #${recordNo}:`, error);
    throw error;
  }
};

/**
 * @function fetchKcstmrRecords
 * @description 執行 KCSTMR 查詢，根據指定值獲取相關記錄
 * @param {string} value - 查詢值
 * @returns {Promise<Array<any>>} 包含查詢結果的數組
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const records = await fetchKcstmrRecords('12345');
 * console.log(records); // 查詢結果數組
 */
export const fetchKcstmrRecords = async (value: string) => {
  try {
    const encodedValue = encodeURIComponent(value);
    const response = await api.get(`/KCSTMR/${encodedValue}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching KCSTMR=${value} records:`, error);
    throw error;
  }
};

/**
 * @function fetchMpersonidRecords
 * @description 依據 MPERSONID 查詢 CO01M.DBF 病患資料
 * @param {string} value - 查詢值
 * @returns {Promise<any>} 查詢結果
 * @throws {Error} 若 API 請求失敗時拋出錯誤
 */
export const fetchMpersonidRecords = async (value: string) => {
  try {
    const encodedValue = encodeURIComponent(value);
    const response = await api.get(`/MPERSONID/${encodedValue}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching MPERSONID=${value} records:`, error);
    throw error;
  }
};

/**
 * @function fetchKdrugRecords
 * @description 執行 KDRUG 查詢，根據指定值和日期範圍獲取相關記錄
 * @param {string} value - 查詢值
 * @param {string} [startDate=''] - 開始日期過濾 (YYYY-MM-DD 格式)
 * @param {string} [endDate=''] - 結束日期過濾 (YYYY-MM-DD 格式)
 * @returns {Promise<Array<any>>} 包含查詢結果的數組
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const records = await fetchKdrugRecords('A12345', '2023-01-01', '2023-12-31');
 * console.log(records); // 查詢結果數組
 */
export const fetchKdrugRecords = async (value: string, startDate = '', endDate = '') => {
  try {
    const encodedValue = encodeURIComponent(value);
    const response = await api.get(`/KDRUG/${encodedValue}`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching KDRUG=${value} records:`, error);
    throw error;
  }
};

/**
 * @function fetchMatchingCO02PRecords
 * @description 根據 CO03L 記錄的 KCSTMR、DATE 和 TIME 值，獲取配對的 CO02P 記錄
 * @param {string} kcstmr - 客戶編號
 * @param {string} date - 日期
 * @param {string} time - 時間
 * @returns {Promise<Array<any>>} 包含配對的 CO02P 記錄的數組
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const matchingRecords = await fetchMatchingCO02PRecords('12345', '1130814', '1430');
 * console.log(matchingRecords); // 配對的 CO02P 記錄數組
 */
export const fetchMatchingCO02PRecords = async (kcstmr: string, date: string, time: string) => {
  try {
    // 使用 fetchDbfRecords 函數獲取 CO02P 記錄
    // 設置查詢參數，使用 KCSTMR 作為搜索值，不限制頁碼和每頁記錄數
    const result = await api.get('/dbf-match/CO02P', {
      params: {
        kcstmr,
        date,
        time
      },
    });
    return result.data;
  } catch (error) {
    console.error(`Error fetching matching CO02P records for KCSTMR=${kcstmr}, DATE=${date}, TIME=${time}:`, error);
    throw error;
  }
};

/**
 * @function fetchMatchingRecordsForKDRUG
 * @description 根據 KDRUG 值，獲取配對的 CO02P 記錄和 CO09D 記錄
 * @param {string} kdrug - 藥品代碼
 * @returns {Promise<{co02pRecords: Array<any>, co09dRecord: any}>} 包含配對的 CO02P 記錄數組和 CO09D 記錄
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const result = await fetchMatchingRecordsForKDRUG('A12345');
 * console.log(result.co02pRecords); // 配對的 CO02P 記錄數組
 * console.log(result.co09dRecord); // 配對的 CO09D 記錄
 */
export const fetchMatchingRecordsForKDRUG = async (kdrug: string) => {
  try {
    const result = await api.get('/dbf-match/CO09D', {
      params: {
        kdrug
      },
    });
    return result.data;
  } catch (error) {
    console.error(`Error fetching matching records for KDRUG=${kdrug}:`, error);
    throw error;
  }
};

// DbfRecord 接口定義
interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
}

/**
 * @function fetchLdruICountsByDate
 * @description 獲取 CO03L.DBF 中每日 LDRU=I (已調劑) 的數量
 * @param {string} [startDate=''] - 開始日期過濾 (民國年格式，例如：1130801)
 * @param {string} [endDate=''] - 結束日期過濾 (民國年格式，例如：1130831)
 * @returns {Promise<Record<string, number>>} 包含每個日期的 LDRU=I 數量的對象
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const ldruICounts = await fetchLdruICountsByDate('1130801', '1130831');
 * console.log(ldruICounts); // { '1130801': 5, '1130802': 8, ... }
 */
export const fetchLdruICountsByDate = async (startDate = '', endDate = '') => {
  try {
    // 獲取 CO03L.DBF 的所有記錄
    const result = await fetchDbfRecords(
      'CO03L.DBF',
      1,
      1000, // 使用較大的頁面大小以獲取更多記錄
      '',
      '',
      '',
      '',
      startDate,
      endDate,
      'true' // 標記為統計頁面請求
    );

    // 初始化每日 LDRU=I 數量的對象
    const ldruICounts: Record<string, number> = {};

    // 處理記錄，計算每日 LDRU=I 的數量
    result.records.forEach((record: DbfRecord) => {
      const ldruValue = record.data.LDRU || '';
      const dateValue = record.data.DATE || '';

      // 只處理 LDRU=I 的記錄
      if (ldruValue === 'I' && dateValue) {
        // 如果該日期尚未在對象中，初始化為 0
        if (!ldruICounts[dateValue]) {
          ldruICounts[dateValue] = 0;
        }
        
        // 增加該日期的 LDRU=I 數量
        ldruICounts[dateValue]++;
      }
    });

    return ldruICounts;
  } catch (error) {
    console.error('Error fetching LDRU=I counts by date:', error);
    throw error;
  }
};

/**
 * @function fetchA99Count75
 * @description 獲取 CO03L.DBF 中 A99 欄位為 75 的記錄數量
 * @param {string} [startDate=''] - 開始日期過濾 (民國年格式，例如：1130801)
 * @param {string} [endDate=''] - 結束日期過濾 (民國年格式，例如：1130831)
 * @returns {Promise<number>} A99 欄位為 75 的記錄數量
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const count = await fetchA99Count75('1130801', '1130831');
 * console.log(count); // 10
 */
export const fetchA99Count75 = async (startDate = '', endDate = '') => {
  try {
    // 獲取 CO03L.DBF 的所有記錄
    const result = await fetchDbfRecords(
      'CO03L.DBF',
      1,
      1000, // 使用較大的頁面大小以獲取更多記錄
      '',
      '',
      '',
      '',
      startDate,
      endDate,
      'true' // 標記為統計頁面請求
    );

    // 計算 A99 欄位為 75 的記錄數量
    let count = 0;
    result.records.forEach((record: DbfRecord) => {
      const a99Value = record.data.A99 !== undefined ? Number(record.data.A99) : 0;
      
      // 檢查 A99 欄位是否為 75
      if (a99Value === 75) {
        count++;
      }
    });

    return count;
  } catch (error) {
    console.error('Error fetching A99=75 count:', error);
    throw error;
  }
};

/**
 * @function fetchLldcnEq1Count
 * @description 獲取 CO03L.DBF 中 LDRU=I 且 LLDCN 欄位為 1 的記錄數量
 * @param {string} [startDate=''] - 開始日期過濾 (民國年格式，例如：1130801)
 * @param {string} [endDate=''] - 結束日期過濾 (民國年格式，例如：1130831)
 * @returns {Promise<number>} LLDCN 欄位為 04 的記錄數量
 */
export const fetchLldcnEq1Count = async (startDate = '', endDate = '') => {
  try {
    const result = await fetchDbfRecords(
      'CO03L.DBF',
      1,
      1000, // 使用較大的頁面大小以獲取更多記錄
      '',
      '',
      '',
      '',
      startDate,
      endDate,
      'true'
    );
    let count = 0;
    result.records.forEach((record: DbfRecord) => {
      const ldruValue = record.data.LDRU || '';
      const lldcnValue = record.data.LLDCN !== undefined ? Number(record.data.LLDCN) : 0;
      if (ldruValue === 'I' && lldcnValue === 1) {
        count++;
      }
    });
    return count;
  } catch (error) {
    console.error('Error fetching LLDCN=1 count:', error);
    throw error;
  }
};

/**
 * @function fetchLldcnEq2Or3Count
 * @description 獲取 CO03L.DBF 中 LDRU=I 且 LLDCN 欄位為 2 或 3 的記錄數量
 * @param {string} [startDate=''] - 開始日期過濾 (民國年格式，例如：1130801)
 * @param {string} [endDate=''] - 結束日期過濾 (民國年格式，例如：1130831)
 * @returns {Promise<number>} 選定條件的記錄數量
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 */
export const fetchLldcnEq2Or3Count = async (startDate = '', endDate = '') => {
  try {
    const result = await fetchDbfRecords(
      'CO03L.DBF',
      1,
      1000,
      '',
      '',
      '',
      '',
      startDate,
      endDate,
      'true'
    );
    let count = 0;
    result.records.forEach((record: DbfRecord) => {
      const ldruValue = record.data.LDRU || '';
      const lldcnValue = record.data.LLDCN !== undefined ? Number(record.data.LLDCN) : 0;
      if (ldruValue === 'I' && (lldcnValue === 2 || lldcnValue === 3)) {
        count++;
      }
    });
    return count;
  } catch (error) {
    console.error('Error fetching LLDCN=2 or 3 count:', error);
    throw error;
  }
};

/**
 * @function fetchA99Total
 * @description 獲取 CO03L.DBF 中 A99 欄位的總和
 * @param {string} [startDate=''] - 開始日期過濾 (民國年格式，例如：1130801)
 * @param {string} [endDate=''] - 結束日期過濾 (民國年格式，例如：1130831)
 * @returns {Promise<number>} A99 欄位的總和
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const total = await fetchA99Total('1130801', '1130831');
 * console.log(total); // 12345
 */
export const fetchA99Total = async (startDate = '', endDate = '') => {
   try {
    // 獲取 CO03L.DBF 的所有記錄
    const result = await fetchDbfRecords(
      'CO03L.DBF',
      1,
      1000, // 使用較大的頁面大小以獲取更多記錄
      '',
      '',
      '',
      '',
      startDate,
      endDate,
      'true' // 標記為統計頁面請求
    );

    // 計算 A99 欄位的總和
    let total = 0;
    result.records.forEach((record: DbfRecord) => {
      const a99Value = record.data.A99 !== undefined ? Number(record.data.A99) : 0;
      
      // 只有當 A99 是有效數字時才加入總和
      if (!isNaN(a99Value)) {
        total += a99Value;
      }
    });

    return total;
  } catch (error) {
    console.error('Error fetching A99 total:', error);
    throw error;
  }
};

/**
 * @function saveWhiteboard
 * @description 儲存觸控書寫小白板資料到資料庫
 * @param {string} recordId - 記錄 ID
 * @param {string} canvasData - 畫布資料 (base64 編碼)
 * @returns {Promise<any>} 儲存結果
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 */
export const saveWhiteboard = async (recordId: string, canvasData: string) => {
  try {
    const response = await api.post('/whiteboard', {
      recordId,
      canvasData
    });
    return response.data;
  } catch (error) {
    console.error(`Error saving whiteboard for record ${recordId}:`, error);
    throw error;
  }
};

/**
 * @function loadWhiteboard
 * @description 從資料庫載入觸控書寫小白板資料
 * @param {string} recordId - 記錄 ID
 * @returns {Promise<string | null>} 畫布資料或 null
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 */
export const loadWhiteboard = async (recordId: string) => {
  try {
    const response = await api.get(`/whiteboard/${recordId}`);
    return response.data.canvasData;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // 沒有找到資料時返回 null
      return null;
    }
    console.error(`Error loading whiteboard for record ${recordId}:`, error);
    throw error;
  }
};

/**
 * @function deleteWhiteboard
 * @description 刪除觸控書寫小白板資料
 * @param {string} recordId - 記錄 ID
 * @returns {Promise<any>} 刪除結果
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 */
export const deleteWhiteboard = async (recordId: string) => {
  try {
    const response = await api.delete(`/whiteboard/${recordId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting whiteboard for record ${recordId}:`, error);
    throw error;
  }
};

/**
 * @function deleteDbfRecord
 * @description 刪除特定 DBF 檔案中的特定記錄
 * @param {string} fileName - DBF 檔案名稱
 * @param {number} recordNo - 記錄編號
 * @returns {Promise<any>} 刪除結果
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const result = await deleteDbfRecord('CO03L.DBF', 123);
 * console.log(result); // 刪除結果
 */
export const deleteDbfRecord = async (fileName: string, recordNo: number) => {
  try {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await api.delete(`/dbf/${encodedFileName}/${recordNo}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${fileName} record #${recordNo}:`, error);
    throw error;
  }
};

/**
 * @function fetchA99GroupStats
 * @description 獲取 CO03L.DBF 中 A99 欄位的分組統計數據
 * @param {string} [startDate=''] - 開始日期過濾 (民國年格式，例如：1130801)
 * @param {string} [endDate=''] - 結束日期過濾 (民國年格式，例如：1130831)
 * @returns {Promise<{totalSum: number, valueGroups: Record<string, number>}>} A99 欄位的分組統計數據
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const stats = await fetchA99GroupStats('1130801', '1130831');
 * console.log(stats); // { totalSum: 12345, valueGroups: { '10': 75, '20': 45, '15': 30 } }
 */
export const fetchA99GroupStats = async (startDate = '', endDate = '') => {
  try {
    // 獲取 CO03L.DBF 的所有記錄
    const result = await fetchDbfRecords(
      'CO03L.DBF',
      1,
      1000, // 使用較大的頁面大小以獲取更多記錄
      '',
      '',
      '',
      '',
      startDate,
      endDate,
      'true' // 標記為統計頁面請求
    );

    // 初始化 A99 欄位的分組統計數據
    const valueGroups: Record<string, number> = {};
    let totalSum = 0;

    // 處理記錄，計算 A99 欄位的分組統計數據
    result.records.forEach((record: DbfRecord) => {
      const a99Value = record.data.A99 !== undefined ? Number(record.data.A99) : 0;
      
      // 只有當 A99 是有效數字時才處理
      if (!isNaN(a99Value) && a99Value > 0) {
        // 將 A99 值轉換為字符串作為鍵
        const key = a99Value.toString();
        
        // 如果該值尚未在對象中，初始化為 0
        if (!valueGroups[key]) {
          valueGroups[key] = 0;
        }
        
        // 增加該值的數量
        valueGroups[key]++;
        
        // 增加總和
        totalSum += a99Value;
      }
    });

    return { totalSum, valueGroups };
  } catch (error) {
    console.error('Error fetching A99 group stats:', error);
    throw error;
  }
};

/**
 * @function fetchDailyA99GroupStats
 * @description 獲取 CO03L.DBF 中當日 A99 欄位的分組統計數據
 * @returns {Promise<{totalSum: number, valueGroups: Record<string, number>}>} 當日 A99 欄位的分組統計數據
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const stats = await fetchDailyA99GroupStats();
 * console.log(stats); // { totalSum: 1234, valueGroups: { '10': 7, '20': 4, '15': 3 } }
 */
export const fetchDailyA99GroupStats = async () => {
  try {
    // 獲取當日日期（民國年格式）
    const now = new Date();
    const year = now.getFullYear() - 1911; // 西元年轉民國年
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const today = `${year}${month}${day}`;
    
    // 使用當日日期作為開始和結束日期
    return fetchA99GroupStats(today, today);
  } catch (error) {
    console.error('Error fetching daily A99 group stats:', error);
    throw error;
  }
};

/**
 * @function searchCO01MRecords
 * @description 根據姓名、生日和 MPERSONID 搜索 CO01M.DBF 中的記錄
 * @param {string} [name=''] - 患者姓名（支持部分匹配）
 * @param {string} [birthDate=''] - 生日（支持部分匹配）
 * @param {string} [mpersonid=''] - MPERSONID（支持部分匹配）
 * @returns {Promise<Array<any>>} 包含匹配記錄的數組
 * @throws {Error} 當 API 請求失敗時拋出錯誤
 * @example
 * const records = await searchCO01MRecords('陳', '1985', 'A123456789');
 * console.log(records); // 匹配的記錄數組
 */
export const searchCO01MRecords = async (name = '', birthDate = '', mpersonid = '') => {
  try {
    const response = await api.get('/dbf/CO01M.DBF', {
      params: {
        page: 1,
        pageSize: 100, // 獲取更多記錄以支持搜索
        search: name || birthDate, // 如果有姓名或生日，使用它們作為搜索關鍵字
        field: name ? 'MNAME' : 'MBIRTHDT', // 根據提供的參數決定搜索欄位
        sortField: 'KCSTMR',
        sortDirection: 'asc'
      },
    });

    // 如果提供了多個條件，需要在前端進行額外的過濾
    let records = response.data.records || [];

    if (name && birthDate && mpersonid) {
      records = records.filter((record: DbfRecord) => {
        const recordName = record.data.MNAME || '';
        const recordBirthDate = record.data.MBIRTHDT || '';
        const recordMpersonid = record.data.MPERSONID || '';
        const nameMatch = recordName.indexOf(name) !== -1;
        const birthMatch = recordBirthDate.indexOf(birthDate) !== -1;
        const mpersonidMatch = recordMpersonid.indexOf(mpersonid) !== -1;
        return nameMatch && birthMatch && mpersonidMatch;
      });
    } else if (name && birthDate) {
      records = records.filter((record: DbfRecord) => {
        const recordName = record.data.MNAME || '';
        const recordBirthDate = record.data.MBIRTHDT || '';
        const nameMatch = recordName.indexOf(name) !== -1;
        const birthMatch = recordBirthDate.indexOf(birthDate) !== -1;
        return nameMatch && birthMatch;
      });
    } else if (name && mpersonid) {
      records = records.filter((record: DbfRecord) => {
        const recordName = record.data.MNAME || '';
        const recordMpersonid = record.data.MPERSONID || '';
        const nameMatch = recordName.indexOf(name) !== -1;
        const mpersonidMatch = recordMpersonid.indexOf(mpersonid) !== -1;
        return nameMatch && mpersonidMatch;
      });
    } else if (birthDate && mpersonid) {
      records = records.filter((record: DbfRecord) => {
        const recordBirthDate = record.data.MBIRTHDT || '';
        const recordMpersonid = record.data.MPERSONID || '';
        const birthMatch = recordBirthDate.indexOf(birthDate) !== -1;
        const mpersonidMatch = recordMpersonid.indexOf(mpersonid) !== -1;
        return birthMatch && mpersonidMatch;
      });
    } else if (name) {
      records = records.filter((record: DbfRecord) => {
        const recordName = record.data.MNAME || '';
        return recordName.indexOf(name) !== -1;
      });
    } else if (birthDate) {
      records = records.filter((record: DbfRecord) => {
        const recordBirthDate = record.data.MBIRTHDT || '';
        return recordBirthDate.indexOf(birthDate) !== -1;
      });
    } else if (mpersonid) {
      records = records.filter((record: DbfRecord) => {
        const recordMpersonid = record.data.MPERSONID || '';
        return recordMpersonid.indexOf(mpersonid) !== -1;
      });
    }

    return records;
  } catch (error) {
    console.error('Error searching CO01M records:', error);
    throw error;
  }
};

export default api;
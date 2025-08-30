import axios from 'axios';

// 使用環境變量設置 API 地址
const API_HOST = import.meta.env.VITE_API_HOST || '192.168.68.90';
const API_PORT = import.meta.env.VITE_API_PORT || '7001';

// 始終使用絕對 URL
const API_BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

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

export default api;
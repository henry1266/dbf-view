import axios from 'axios';

const API_BASE_URL = 'http://localhost:7001/api';

// 創建 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 獲取所有 DBF 檔案列表
export const fetchDbfFiles = async () => {
  try {
    const response = await api.get('/dbf-files');
    return response.data;
  } catch (error) {
    console.error('Error fetching DBF files:', error);
    throw error;
  }
};

// 獲取特定 DBF 檔案的記錄
export const fetchDbfRecords = async (fileName: string, page = 1, pageSize = 20, search = '', field = '') => {
  try {
    const response = await api.get(`/dbf/${fileName}`, {
      params: { page, pageSize, search, field },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${fileName} records:`, error);
    throw error;
  }
};

// 獲取特定記錄
export const fetchDbfRecord = async (fileName: string, recordNo: number) => {
  try {
    const response = await api.get(`/dbf/${fileName}/${recordNo}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${fileName} record #${recordNo}:`, error);
    throw error;
  }
};

// KCSTMR 查詢
export const fetchKcstmrRecords = async (value: string) => {
  try {
    const response = await api.get(`/KCSTMR/${value}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching KCSTMR=${value} records:`, error);
    throw error;
  }
};

// KDRUG 查詢
export const fetchKdrugRecords = async (value: string, startDate = '', endDate = '') => {
  try {
    const response = await api.get(`/KDRUG/${value}`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching KDRUG=${value} records:`, error);
    throw error;
  }
};

export default api;
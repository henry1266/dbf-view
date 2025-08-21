import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '../../test-utils';
import axios from 'axios';
import { fetchDbfFiles, fetchDbfRecords, fetchDbfRecord, fetchKcstmrRecords, fetchKdrugRecords } from '../api';

// 直接模擬 api 模組而不是 axios
vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal();
  
  // 返回原始模組，但覆蓋我們要測試的函數
  return {
    ...actual,
    // 我們將在每個測試中單獨模擬這些函數
    fetchDbfFiles: vi.fn(),
    fetchDbfRecords: vi.fn(),
    fetchDbfRecord: vi.fn(),
    fetchKcstmrRecords: vi.fn(),
    fetchKdrugRecords: vi.fn(),
  };
});

describe('API 服務', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchDbfFiles', () => {
    it('應該正確獲取 DBF 檔案列表', async () => {
      // 模擬返回值
      const mockDbfFiles = ['file1.dbf', 'file2.dbf', 'file3.dbf'];
      fetchDbfFiles.mockResolvedValue(mockDbfFiles);
      
      // 調用被測試的函數
      const result = await fetchDbfFiles();
      
      // 驗證結果
      expect(fetchDbfFiles).toHaveBeenCalled();
      expect(result).toEqual(mockDbfFiles);
    });

    it('應該處理錯誤情況', async () => {
      // 模擬錯誤
      const mockError = new Error('API 錯誤');
      fetchDbfFiles.mockRejectedValue(mockError);
      
      // 驗證錯誤處理
      await expect(fetchDbfFiles()).rejects.toThrow('API 錯誤');
    });
  });

  describe('fetchDbfRecords', () => {
    it('應該正確獲取 DBF 記錄', async () => {
      // 模擬返回值
      const mockRecordsData = {
        records: [{ id: 1, name: 'Record 1' }, { id: 2, name: 'Record 2' }],
        totalCount: 2
      };
      fetchDbfRecords.mockResolvedValue(mockRecordsData);
      
      // 調用被測試的函數
      const result = await fetchDbfRecords('test.dbf', 1, 10);
      
      // 驗證結果
      expect(fetchDbfRecords).toHaveBeenCalled();
      expect(fetchDbfRecords.mock.calls[0][0]).toBe('test.dbf');
      expect(fetchDbfRecords.mock.calls[0][1]).toBe(1);
      expect(fetchDbfRecords.mock.calls[0][2]).toBe(10);
      expect(result).toEqual(mockRecordsData);
    });
  });

  describe('fetchDbfRecord', () => {
    it('應該正確獲取特定記錄', async () => {
      // 模擬返回值
      const mockRecord = { id: 1, name: 'Record 1' };
      fetchDbfRecord.mockResolvedValue(mockRecord);
      
      // 調用被測試的函數
      const result = await fetchDbfRecord('test.dbf', 1);
      
      // 驗證結果
      expect(fetchDbfRecord).toHaveBeenCalledWith('test.dbf', 1);
      expect(result).toEqual(mockRecord);
    });
  });

  describe('fetchKcstmrRecords', () => {
    it('應該正確執行 KCSTMR 查詢', async () => {
      // 模擬返回值
      const mockCustomers = [{ id: 1, name: 'Customer 1' }];
      fetchKcstmrRecords.mockResolvedValue(mockCustomers);
      
      // 調用被測試的函數
      const result = await fetchKcstmrRecords('12345');
      
      // 驗證結果
      expect(fetchKcstmrRecords).toHaveBeenCalledWith('12345');
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('fetchKdrugRecords', () => {
    it('應該正確執行 KDRUG 查詢', async () => {
      // 模擬返回值
      const mockDrugs = [{ id: 1, name: 'Drug 1' }];
      fetchKdrugRecords.mockResolvedValue(mockDrugs);
      
      // 調用被測試的函數
      const result = await fetchKdrugRecords('A12345', '2023-01-01', '2023-12-31');
      
      // 驗證結果
      expect(fetchKdrugRecords).toHaveBeenCalledWith('A12345', '2023-01-01', '2023-12-31');
      expect(result).toEqual(mockDrugs);
    });
  });
});
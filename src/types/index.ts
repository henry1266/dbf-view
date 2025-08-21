/**
 * @file index.ts
 * @description 定義系統中使用的所有類型
 */

import { Collection } from 'mongodb';

/**
 * @interface DbfRecord
 * @description DBF檔案記錄的資料結構
 * @property {string} _id - MongoDB文檔ID
 * @property {number} _recordNo - 記錄編號
 * @property {string} _file - 來源檔案名稱
 * @property {string} hash - 記錄的雜湊值，用於識別唯一性
 * @property {Record<string, any>} data - 記錄的實際資料，鍵值對形式
 * @property {string} _created - 記錄創建時間
 * @property {string} _updated - 記錄最後更新時間
 * @property {boolean} [_truncated] - 記錄是否被截斷
 */
export interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
  _truncated?: boolean;
}

/**
 * @interface DbfFile
 * @description DBF檔案的基本資訊
 */
export interface DbfFile {
  fileName: string;
  baseName: string;
  collectionName: string;
}

/**
 * @interface Pagination
 * @description 分頁資訊
 */
export interface Pagination {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

/**
 * @interface SortOptions
 * @description 排序選項
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * @interface FilterOptions
 * @description 篩選選項
 */
export interface FilterOptions {
  search?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * @interface DbfRecordsResponse
 * @description DBF記錄查詢回應
 */
export interface DbfRecordsResponse {
  fileName: string;
  records: DbfRecord[];
  pagination: Pagination;
  sortApplied: SortOptions;
  filters: FilterOptions;
}

/**
 * @interface KcstmrResponse
 * @description KCSTMR查詢回應
 */
export interface KcstmrResponse {
  kcstmrValue: string;
  recordsByFile: Record<string, { records: DbfRecord[]; count: number }>;
  totalRecords: number;
}

/**
 * @interface KdrugResponse
 * @description KDRUG查詢回應
 */
export interface KdrugResponse {
  kdrugValue: string;
  records: DbfRecord[];
  totalRecords: number;
  totalPTQTY: number;
  totalPTQTY_I: number;
  totalPTQTY_O: number;
  startDate?: string;
  endDate?: string;
  allDates: string[];
}

/**
 * @interface DbfCollections
 * @description DBF集合的映射
 */
export interface DbfCollections {
  [fileName: string]: Collection<DbfRecord>;
}

/**
 * @interface ApiError
 * @description API錯誤回應
 */
export interface ApiError {
  error: string;
}
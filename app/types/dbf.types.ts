/**
 * DBF 相關型別定義
 */
import React from 'react';

/**
 * DBF 記錄介面
 */
export interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
}

/**
 * DBF 記錄回應介面
 */
export interface DbfRecordsResponse {
  fileName: string;
  records: DbfRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    pageSize: number;
  };
}

/**
 * 表格列定義介面
 */
export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, record?: DbfRecord) => string | React.ReactNode;
}

/**
 * 配對記錄元件屬性介面
 */
export interface MatchingCO02PRecordsProps {
  co03lRecord: DbfRecord;
}
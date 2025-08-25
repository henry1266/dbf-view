/**
 * DBF 表格相關工具函數
 */

import type { Column, DbfRecord } from '../types/dbf.types';

/**
 * 獲取優先顯示欄位
 * @param fileName DBF 檔案名稱
 * @returns 優先顯示欄位陣列
 */
export function getPriorityFields(fileName: string): string[] {
  if (fileName.toUpperCase() === 'CO01M.DBF') {
    return ['KCSTMR', 'MNAME', 'MBIRTHDT', 'MPERSONID', 'MSEX'];
  } else if (fileName.toUpperCase() === 'CO02P.DBF') {
    return ['KCSTMR', 'MNAME', 'MBIRTHDT', 'MPERSONID', 'PDATE', 'PTIME', 'PLM', 'PRMK', 'KDRUG', 'PTQTY', 'PPR'];
  } else if (fileName.toUpperCase() === 'CO03L.DBF') {
    return ['KCSTMR', 'LNAME', 'MPERSONID', 'DATA_TIME', 'LPID_LDRU', 'LISRS', 'LCS', 'DAYQTY', 'LLDCN_LLDTT', 'A2', 'A99', 'A97', 'TOT'];
  }
  return [];
}

/**
 * 計算表格的列定義
 * @param priorityFields 優先顯示欄位
 * @param availableFields 可用欄位
 * @param fileName 檔案名稱
 * @returns 列定義陣列
 */
export function getColumns(priorityFields: string[], availableFields: string[], fileName: string): Column[] {
  // 基本列定義
  const baseColumns: Column[] = [
    {
      id: 'recordNo',
      label: '#',
      align: 'left'
    }
  ];
  
  // 優先顯示欄位
  const priorityColumns = priorityFields.map(field => {
    // 為 MPERSONID 欄位設置寬度
    if (field === 'MPERSONID') {
      return {
        id: field,
        label: field,
        align: 'left' as const
      };
    }
    
    // 為 LLDCN_LLDTT 合併欄位設置特殊處理
    if (field === 'LLDCN_LLDTT') {
      return {
        id: field,
        label: 'LLDCN/LLDTT', // 顯示名稱
        align: 'left' as const,
        format: (value: any, record?: DbfRecord) => {
          if (!record) return '';
          const lldcn = record.data.LLDCN || '';
          const lldtt = record.data.LLDTT || '';
          return `${lldcn}/${lldtt}`;
        }
      };
    }
    
    // 為 DATA_TIME 合併欄位設置特殊處理
    if (field === 'DATA_TIME') {
      return {
        id: field,
        label: 'DATA/TIME', // 顯示名稱
        align: 'left' as const,
        format: (value: any, record?: DbfRecord) => {
          if (!record) return '';
          const date = record.data.DATE || '';
          const time = record.data.TIME || '';
          return `${date}/${time}`;
        }
      };
    }
    
    // 為 LPID_LDRU 合併欄位設置特殊處理
    if (field === 'LPID_LDRU') {
      return {
        id: field,
        label: 'LPID/LDRU', // 顯示名稱
        align: 'left' as const,
        format: (value: any, record?: DbfRecord) => {
          if (!record) return '';
          const lpid = record.data.LPID || '';
          const ldru = record.data.LDRU || '';
          return `${lpid}/${ldru}`;
        }
      };
    }
    
    return {
      id: field,
      label: field,
      align: 'left' as const
    };
  });
  
  // 操作列
  const actionColumn = {
    id: 'actions',
    label: '操作',
    align: 'center' as const
  };
  
  // 只返回基本列、優先欄位和操作列，不包含其他欄位
  return [...baseColumns, ...priorityColumns, actionColumn];
}
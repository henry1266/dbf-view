/**
 * DBF 表格相關工具函數
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { Column, DbfRecord } from '../types/dbf.types';
import CO09DFieldsForCO02P from '../components/dbf/CO09DFieldsForCO02P';

/**
 * 獲取優先顯示欄位
 * @param fileName DBF 檔案名稱
 * @returns 優先顯示欄位陣列
 */
export function getPriorityFields(fileName: string): string[] {
  if (fileName.toUpperCase() === 'CO01M.DBF') {
    return ['KCSTMR', 'MNAME', 'MBIRTHDT', 'MPERSONID', 'MSEX'];
  } else if (fileName.toUpperCase() === 'CO02P.DBF') {
    return ['KCSTMR', 'MNAME', 'MBIRTHDT', 'MPERSONID', 'PDATE_PTIME', 'PLM_PRMK', 'KDRUG', 'DNO', 'DDESC', 'PTQTY', 'PPR'];
  } else if (fileName.toUpperCase() === 'CO03L.DBF') {
    return ['KCSTMR', 'LNAME', 'MPERSONID', 'DATA_TIME', 'LPID_LDRU', 'LISRS', 'LCS', 'DAYQTY', 'LLDCN_LLDTT', 'A2', 'A99', 'A97', 'TOT'];
  } else if (fileName.toUpperCase() === 'CO09D.DBF') {
    return ['KDRUG', 'DNO', 'DDESC'];
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
      align: 'left',
      minWidth: 1 // 設置最小寬度為50px
    }
  ];
  
  // 優先顯示欄位
  const priorityColumns = priorityFields.map(field => {
    // 為不同欄位設置不同的寬度
    let minWidth = 1; // 默認寬度
    
    // 根據欄位名稱設置不同的寬度
    if (['KCSTMR', 'MNAME', 'LNAME'].includes(field)) {
      minWidth = 1; // 較長的名稱欄位
    } else if (['MPERSONID', 'PDATE', 'PTIME', 'DATE', 'TIME'].includes(field)) {
      minWidth = 1; // 中等長度的欄位
    } else if (['A2', 'A99', 'A97', 'TOT', 'LCS', 'DAYQTY'].includes(field)) {
      minWidth = 1; // 較短的數值欄位
    } else if (['PQTY', 'PFQ', 'PTQTY', 'PPR'].includes(field)) {
      minWidth = 1; // 較短的數值欄位
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
    
    // 為 PDATE_PTIME 合併欄位設置特殊處理
    if (field === 'PDATE_PTIME') {
      return {
        id: field,
        label: 'PDATE/PTIME', // 顯示名稱
        align: 'left' as const,
        format: (value: any, record?: DbfRecord) => {
          if (!record) return '';
          const pdate = record.data.PDATE || '';
          const ptime = record.data.PTIME || '';
          return `${pdate}/${ptime}`;
        }
      };
    }
    
    // 為 PLM_PRMK 合併欄位設置特殊處理
    if (field === 'PLM_PRMK') {
      return {
        id: field,
        label: 'PLM/PRMK', // 顯示名稱
        align: 'left' as const,
        format: (value: any, record?: DbfRecord) => {
          if (!record) return '';
          const plm = record.data.PLM || '';
          const prmk = record.data.PRMK || '';
          return `${plm}/${prmk}`;
        }
      };
    }
    
    // 為 CO02P.DBF 的 DNO 和 DDESC 欄位設置特殊處理
    if (fileName.toUpperCase() === 'CO02P.DBF' && (field === 'DNO' || field === 'DDESC')) {
      return {
        id: field,
        label: field,
        align: 'left' as const,
        minWidth: minWidth,
        format: (value: any, record?: DbfRecord) => {
          if (!record) return '';
          
          // 獲取 KDRUG 值
          const kdrug = record.data.KDRUG || '';
          
          // 使用 CO09DFieldsForCO02P 組件獲取實際值
          return React.createElement(CO09DFieldsForCO02P, { kdrug, field });
        }
      };
    }
    
    if (field === 'KCSTMR') {
      return {
        id: field,
        label: field,
        align: 'left' as const,
        minWidth: minWidth,
        format: (value: any, record?: DbfRecord) => {
          const kcstmrValue = record?.data?.KCSTMR ?? value;
          if (!kcstmrValue) {
            return '';
          }
          const displayValue = String(kcstmrValue).trim();
          if (!displayValue) {
            return '';
          }
          return React.createElement(
            Link,
            {
              to: `/kcstmr/${encodeURIComponent(displayValue)}`,
              style: {
                color: '#64ffda',
                textDecoration: 'none',
              },
            },
            displayValue
          );
        },
      };
    }
    if (field === 'MPERSONID') {
      return {
        id: field,
        label: field,
        align: 'left' as const,
        minWidth: minWidth,
        format: (value: any, record?: DbfRecord) => {
          const mpersonidValue = record?.data?.MPERSONID ?? value;
          if (!mpersonidValue) {
            return '';
          }
          const displayValue = String(mpersonidValue).trim();
          if (!displayValue) {
            return '';
          }
          return React.createElement(
            Link,
            {
              to: `/mpersonid/${encodeURIComponent(displayValue)}`,
              style: {
                color: '#64ffda',
                textDecoration: 'none',
              },
            },
            displayValue
          );
        },
      };
    }
    return {
      id: field,
      label: field,
      align: 'left' as const,
      minWidth: minWidth
    };
  });
  
  // 操作列
  const actionColumn = {
    id: 'actions',
    label: '操作',
    align: 'center' as const,
    minWidth: 85 // 設置最小寬度為150px
  };
  
  // 只返回基本列、優先欄位和操作列，不包含其他欄位
  return [...baseColumns, ...priorityColumns, actionColumn];
}
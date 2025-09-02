import React, { useEffect, useState } from 'react';
import { fetchDbfRecords } from '../../services/api';
import type { DbfRecord } from '../../types/dbf.types';

interface CO09DFieldsForCO02PProps {
  kdrug: string;
  field: string; // 'DNO' 或 'DDESC'
}

/**
 * 顯示 CO02P 記錄對應的 CO09D 藥品欄位
 * 用於在 DbfTable 中顯示 DNO 和 DDESC 欄位的實際值
 */
function CO09DFieldsForCO02P({ kdrug, field }: CO09DFieldsForCO02PProps) {
  const [fieldValue, setFieldValue] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 獲取對應的 CO09D 記錄
  const fetchCO09DData = async () => {
    if (!kdrug) {
      setError('缺少必要的配對欄位：KDRUG');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // 使用 fetchDbfRecords 函數直接獲取 CO09D 記錄，使用 KDRUG 作為搜索條件
      const result = await fetchDbfRecords(
        'CO09D.DBF',  // 檔案名稱
        1,            // 頁碼
        1,            // 每頁記錄數 (只需要一條記錄)
        kdrug,        // 搜索關鍵字
        'KDRUG',      // 搜索欄位
        '',           // 排序欄位
        ''            // 排序方向
      );
      
      if (result && result.records && result.records.length > 0) {
        // 獲取指定欄位的值
        const value = result.records[0].data[field] || '';
        setFieldValue(value);
        setError(null);
      } else {
        setFieldValue('');
        setError('沒有找到對應的 CO09D 記錄');
      }
    } catch (err) {
      console.error('獲取 CO09D 記錄失敗:', err);
      setError('無法獲取對應的 CO09D 記錄');
      setFieldValue('');
    } finally {
      setLoading(false);
    }
  };

  // 組件加載時獲取 CO09D 記錄
  useEffect(() => {
    fetchCO09DData();
  }, [kdrug]);

  if (loading) {
    return <span>載入中...</span>;
  }

  if (error) {
    return <span title={error}>-</span>;
  }

  return <span>{fieldValue}</span>;
}

export default CO09DFieldsForCO02P;
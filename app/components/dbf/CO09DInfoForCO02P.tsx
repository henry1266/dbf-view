import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import type { DbfRecord } from '../../types/dbf.types';
import { fetchDbfRecords } from '../../services/api';

interface CO09DInfoForCO02PProps {
  co02pRecord: DbfRecord;
}

/**
 * 顯示 CO02P 記錄對應的 CO09D 藥品資訊
 */
function CO09DInfoForCO02P({ co02pRecord }: CO09DInfoForCO02PProps) {
  const [co09dData, setCO09DData] = useState<DbfRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 獲取對應的 CO09D 記錄 - 使用 fetchDbfRecords (類似 CO03L.DBF 的方法)
  const fetchCO09DData = async () => {
    if (!co02pRecord || !co02pRecord.data) return;

    const kdrug = co02pRecord.data.KDRUG;

    if (!kdrug) {
      setError('缺少必要的配對欄位：KDRUG');
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
        setCO09DData(result.records[0]);
        setError(null);
      } else {
        setError('沒有找到對應的 CO09D 記錄');
      }
    } catch (err) {
      console.error('獲取 CO09D 記錄失敗:', err);
      setError('無法獲取對應的 CO09D 記錄');
    } finally {
      setLoading(false);
    }
  };

  // 組件加載時獲取 CO09D 記錄
  useEffect(() => {
    fetchCO09DData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: 'rgba(255, 0, 0, 0.1)', p: 1, borderRadius: 1, color: '#ff6b6b' }}>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  if (!co09dData) {
    return null;
  }

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ bgcolor: 'rgba(100, 255, 218, 0.05)', p: 2, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#64ffda' }}>
          藥品資訊 (CO09D)
        </Typography>
        
        <Paper sx={{
          bgcolor: 'rgba(10, 25, 47, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 255, 218, 0.1)',
          p: 2,
          borderRadius: 1
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '30%' }}>
                <Typography variant="body2" sx={{ color: '#e6f1ff', fontWeight: 'bold' }}>
                  KDRUG:
                </Typography>
              </Box>
              <Box sx={{ width: '70%' }}>
                <Typography variant="body2" sx={{ color: '#e6f1ff', fontFamily: 'monospace' }}>
                  {co09dData.data.KDRUG || ''}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '30%' }}>
                <Typography variant="body2" sx={{ color: '#e6f1ff', fontWeight: 'bold' }}>
                  DNO:
                </Typography>
              </Box>
              <Box sx={{ width: '70%' }}>
                <Typography variant="body2" sx={{ color: '#e6f1ff', fontFamily: 'monospace' }}>
                  {co09dData.data.DNO || ''}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '30%' }}>
                <Typography variant="body2" sx={{ color: '#e6f1ff', fontWeight: 'bold' }}>
                  DDESC:
                </Typography>
              </Box>
              <Box sx={{ width: '70%' }}>
                <Typography variant="body2" sx={{ color: '#e6f1ff', fontFamily: 'monospace' }}>
                  {co09dData.data.DDESC || ''}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default CO09DInfoForCO02P;
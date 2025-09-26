import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import TechBackground from '../components/TechBackground';
import LLDCNChart from '../components/LLDCNChart';
import { fetchMonthlyLldcnStats } from '../services/api';

/**
 * @function meta
 * @description 定義 LLDCN 報告頁面的元數據，包括標題和描述
 * @returns {Array<Object>} 頁面元數據陣列
 */
export function meta() {
  return [
    { title: "LLDCN 報告 - 處方瀏覽器" },
    { name: "description", content: "LLDCN 統計數據報告頁面" },
  ];
}

/**
 * @component LLDCNReport
 * @description LLDCN 報告頁面組件，顯示每月 LLDCN 統計數據的折線圖
 * @returns {JSX.Element} 渲染的報告頁面
 */
export default function LLDCNReport() {
  // 存儲每月 LLDCN 統計數據
  const [monthlyStats, setMonthlyStats] = useState<Array<{
    month: string;
    lldcn1: number;
    lldcn2to3: number;
    total: number;
  }>>([]);
  // 加載狀態
  const [loading, setLoading] = useState<boolean>(true);
  // 錯誤狀態
  const [error, setError] = useState<string | null>(null);

  // 在組件加載時獲取數據
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await fetchMonthlyLldcnStats(12); // 獲取過去12個月的數據
        setMonthlyStats(stats);
        setError(null);
      } catch (err) {
        console.error('獲取每月 LLDCN 統計數據失敗:', err);
        setError('無法獲取 LLDCN 統計數據');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <Layout title="LLDCN 報告">
      <TechBackground>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              fontSize: '1.5rem',
              color: '#64ffda',
              textAlign: 'center',
              mb: 3
            }}
          >
            LLDCN 統計報告
          </Typography>

          <Paper
            sx={{
              p: 3,
              bgcolor: 'rgba(17, 34, 64, 0.6)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 30px rgba(100, 255, 218, 0.4)',
              borderRadius: 2,
              border: '1px solid rgba(100, 255, 218, 0.3)',
              minHeight: '400px'
            }}
          >
            {loading ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px'
              }}>
                <CircularProgress sx={{ color: '#64ffda' }} />
              </Box>
            ) : error ? (
              <Box sx={{
                p: 2,
                color: '#ff6b6b',
                bgcolor: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: 2,
                textAlign: 'center',
                fontFamily: 'monospace'
              }}>
                {error}
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontFamily: 'monospace',
                    color: '#e6f1ff',
                    textAlign: 'center',
                    mb: 2
                  }}
                >
                  每月 LLDCN 統計趨勢 (過去12個月)
                </Typography>
                <LLDCNChart data={monthlyStats} />
              </Box>
            )}
          </Paper>
        </Box>
      </TechBackground>
    </Layout>
  );
}
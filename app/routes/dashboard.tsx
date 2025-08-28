import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Grid, Box, CircularProgress } from '@mui/material';

// 引入拆分後的組件
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import SystemStatus from '../components/dashboard/SystemStatus';
import Calendar from '../components/dashboard/Calendar';
import TechBackground from '../components/TechBackground';

// 引入 API 服務函數
import { fetchLdruICountsByDate } from '../services/api';

/**
 * @function meta
 * @description 定義儀表板頁面的元數據，包括標題和描述
 * @returns {Array<Object>} 頁面元數據陣列
 */
export function meta() {
  return [
    { title: "儀表板 - 處方瀏覽器" },
    { name: "description", content: "DBF 檔案瀏覽器的儀表板頁面" },
  ];
}

/**
 * @component Dashboard
 * @description 儀表板頁面組件，顯示系統概覽、統計數據和日曆
 * @returns {JSX.Element} 渲染的儀表板頁面
 */
export default function Dashboard() {
  // 存儲 LDRU=I 的每日數量數據
  const [ldruICounts, setLdruICounts] = useState<Record<string, number>>({});
  // 存儲 LDRU=I 的總數
  const [totalLdruI, setTotalLdruI] = useState<number>(0);
  // 加載狀態
  const [loading, setLoading] = useState<boolean>(true);
  // 錯誤狀態
  const [error, setError] = useState<string | null>(null);

  // 獲取當月的第一天和最後一天（民國年格式）
  const getCurrentMonthRange = (): { start: string, end: string } => {
    const now = new Date();
    
    // 當月第一天
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayYear = firstDay.getFullYear() - 1911; // 西元年轉民國年
    const firstDayMonth = (firstDay.getMonth() + 1).toString().padStart(2, '0');
    const firstDayDate = firstDay.getDate().toString().padStart(2, '0');
    const firstDayStr = `${firstDayYear}${firstDayMonth}${firstDayDate}`;
    
    // 當月最後一天
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastDayYear = lastDay.getFullYear() - 1911; // 西元年轉民國年
    const lastDayMonth = (lastDay.getMonth() + 1).toString().padStart(2, '0');
    const lastDayDate = lastDay.getDate().toString().padStart(2, '0');
    const lastDayStr = `${lastDayYear}${lastDayMonth}${lastDayDate}`;
    
    return { start: firstDayStr, end: lastDayStr };
  };

  // 在組件加載時獲取數據
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 獲取當月日期範圍
        const { start, end } = getCurrentMonthRange();
        
        // 獲取 LDRU=I 的每日數量數據
        const data = await fetchLdruICountsByDate(start, end);
        
        // 計算 LDRU=I 的總數
        const total = Object.values(data).reduce((sum, count) => sum + count, 0);
        
        setLdruICounts(data);
        setTotalLdruI(total);
        setError(null);
      } catch (err) {
        console.error('獲取 LDRU=I 每日數量失敗:', err);
        setError('無法獲取 LDRU=I 每日數量數據');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout title="科技儀表板">
      <TechBackground>
        {/* 頂部標題 */}
        <DashboardHeader />
        
        {/* 頂部統計卡片 */}
        <StatisticsCards totalLdruI={totalLdruI} />

        {/* 中央日曆和統計區域 */}
        <Grid container spacing={3}>
          {/* 左側統計面板 */}
          <Grid sx={{ width: { xs: '100%', md: '25%' }, p: 1.5 }}>
            <SystemStatus />
          </Grid>

          {/* 中央日曆 */}
          <Grid sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
            {loading ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                minHeight: '200px',
                bgcolor: 'rgba(17, 34, 64, 0.6)',
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
                boxShadow: '0 4px 40px rgba(64, 175, 255, 0.5)',
                border: '1px solid rgba(64, 175, 255, 0.4)'
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
              <Calendar ldruICounts={ldruICounts} />
            )}
          </Grid>
        </Grid>
      </TechBackground>
    </Layout>
  );
}
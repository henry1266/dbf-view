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
import { fetchLdruICountsByDate, fetchA99Count75, fetchA99Total, fetchA99GroupStats } from '../services/api';

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
  // 存儲當週 LDRU=I 的總數
  const [weeklyLdruI, setWeeklyLdruI] = useState<number>(0);
  // 存儲 A99 欄位為 75 的數量
  const [a99Count75, setA99Count75] = useState<number>(0);
  // 存儲 A99 欄位的總和
  const [totalA99, setTotalA99] = useState<number>(0);
  // 存儲 A99 欄位的分組統計數據
  const [a99GroupStats, setA99GroupStats] = useState<{ totalSum: number, valueGroups: Record<string, number> }>({ totalSum: 0, valueGroups: {} });
  // 加載狀態
  const [loading, setLoading] = useState<boolean>(true);
  // 錯誤狀態
  const [error, setError] = useState<string | null>(null);
  // 當前選擇的年份和月份
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // 獲取指定月份的第一天和最後一天（民國年格式）
  const getMonthRange = (year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1): { start: string, end: string } => {
    // 指定月份的第一天
    const firstDay = new Date(year, month - 1, 1); // 月份從0開始，所以減1
    const firstDayYear = firstDay.getFullYear() - 1911; // 西元年轉民國年
    const firstDayMonth = (firstDay.getMonth() + 1).toString().padStart(2, '0');
    const firstDayDate = firstDay.getDate().toString().padStart(2, '0');
    const firstDayStr = `${firstDayYear}${firstDayMonth}${firstDayDate}`;
    
    // 指定月份的最後一天
    const lastDay = new Date(year, month, 0); // 下個月的第0天就是當月的最後一天
    const lastDayYear = lastDay.getFullYear() - 1911; // 西元年轉民國年
    const lastDayMonth = (lastDay.getMonth() + 1).toString().padStart(2, '0');
    const lastDayDate = lastDay.getDate().toString().padStart(2, '0');
    const lastDayStr = `${lastDayYear}${lastDayMonth}${lastDayDate}`;
    
    return { start: firstDayStr, end: lastDayStr };
  };

  // 處理月份切換的函數
  const handleMonthChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  // 在組件加載時或月份變化時獲取數據
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 獲取選擇的月份日期範圍
        const { start, end } = getMonthRange(selectedYear, selectedMonth);
        
        // 獲取 LDRU=I 的每日數量數據
        const data = await fetchLdruICountsByDate(start, end);
        
        // 獲取 A99 欄位為 75 的數量
        const a99Count = await fetchA99Count75(start, end);
        
        // 獲取 A99 欄位的總和
        const a99Total = await fetchA99Total(start, end);
        
        // 獲取 A99 欄位的分組統計數據
        const a99Stats = await fetchA99GroupStats(start, end);
        
        // 計算 LDRU=I 的總數
        const total = Object.values(data).reduce((sum, count) => sum + count, 0);
        
        // 計算當週 LDRU=I 的總數
        const now = new Date();
        const currentDay = now.getDay(); // 0 是星期日，1 是星期一，以此類推
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - currentDay); // 設置為本週的星期日
        
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // 設置為本週的星期六
        
        // 將日期轉換為民國年格式 (YYYMMDD)
        const formatToMinguoDate = (date: Date): string => {
          const year = date.getFullYear() - 1911; // 西元年轉民國年
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          return `${year}${month}${day}`;
        };
        
        const firstDayStr = formatToMinguoDate(firstDayOfWeek);
        const lastDayStr = formatToMinguoDate(lastDayOfWeek);
        
        // 計算當週的 LDRU=I 總數
        let weeklyTotal = 0;
        Object.entries(data).forEach(([date, count]) => {
          // 檢查日期是否在當週範圍內
          if (date >= firstDayStr && date <= lastDayStr) {
            weeklyTotal += count;
          }
        });
        
        setLdruICounts(data);
        setTotalLdruI(total);
        setWeeklyLdruI(weeklyTotal);
        setA99Count75(a99Count);
        setTotalA99(a99Total);
        setA99GroupStats(a99Stats);
        setError(null);
      } catch (err) {
        console.error('獲取 LDRU=I 每日數量失敗:', err);
        setError('無法獲取 LDRU=I 每日數量數據');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  return (
    <Layout title="科技儀表板">
      <TechBackground>
        {/* 頂部標題 */}
        <DashboardHeader />
        
        {/* 頂部統計卡片 */}
        <StatisticsCards
          totalLdruI={totalLdruI}
          weeklyLdruI={weeklyLdruI}
          a99Count75={a99Count75}
          totalA99={totalA99}
        />

        {/* 中央日曆和統計區域 */}
        <Grid container spacing={1}>
          {/* 左側統計面板 */}
          <Grid sx={{ width: { xs: '100%', lg: '24%' }, p: 1 }}>
            <SystemStatus a99GroupStats={a99GroupStats} />
          </Grid>

          {/* 中央日曆 */}
          <Grid sx={{ width: { xs: '100%', lg: '49%' }, p: 1 }}>
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
              <Calendar
                ldruICounts={ldruICounts}
                onMonthChange={handleMonthChange}
                initialYear={selectedYear}
                initialMonth={selectedMonth}
              />
            )}
          </Grid>
        </Grid>
      </TechBackground>
    </Layout>
  );
}
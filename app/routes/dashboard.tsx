import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Grid, Box, CircularProgress, Paper, Typography } from '@mui/material';

// 引入拆分後的組件
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import SystemStatus from '../components/dashboard/SystemStatus';
import Calendar from '../components/dashboard/Calendar';
import DailyA99AmountPanel from '../components/dashboard/DailyA99AmountPanel';
import TechBackground from '../components/TechBackground';

// 引入 API 服務函數
import { API_BASE_URL, fetchLdruICountsByDate, fetchA99Count75, fetchA99Total, fetchLldcnEq1Count, fetchLldcnEq2Or3Count, fetchA99GroupStats, fetchDailyA99GroupStats } from '../services/api';

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
  const [totalLldcnEq1, setTotalLldcnEq1] = useState<number>(0);
  const [totalLldcnEq2Or3, setTotalLldcnEq2Or3] = useState<number>(0);
  // 存儲 A99 欄位的分組統計數據
  const [a99GroupStats, setA99GroupStats] = useState<{ totalSum: number, valueGroups: Record<string, number> }>({ totalSum: 0, valueGroups: {} });
  // 存儲當日 A99 欄位的分組統計數據
  const [dailyA99GroupStats, setDailyA99GroupStats] = useState<{ totalSum: number, valueGroups: Record<string, number> }>({ totalSum: 0, valueGroups: {} });
  // 加載狀態
  const [loading, setLoading] = useState<boolean>(true);
  // 錯誤狀態
  const [error, setError] = useState<string | null>(null);
  // 當前選擇的年份和月份
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [refreshVersion, setRefreshVersion] = useState<number>(0);

  // 監聽 MongoDB Change Streams 推播，於資料異動時刷新儀表板
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const eventsUrl = `${API_BASE_URL}/stream/dashboard`;
    const eventSource = new EventSource(eventsUrl);

    const handleChange = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data ?? '{}') as { collection?: string };
        const changedCollection = payload.collection?.toLowerCase();

        if (changedCollection === 'co03l') {
          setRefreshVersion((prev) => prev + 1);
        }
      } catch (err) {
        console.error('處理儀表板 SSE 資料時發生錯誤:', err);
      }
    };

    const listener = (event: Event) => handleChange(event as MessageEvent);
    eventSource.addEventListener('change', listener);
    eventSource.onerror = (event) => {
      console.error('儀表板 SSE 連線發生錯誤:', event);
    };

    return () => {
      eventSource.removeEventListener('change', listener);
      eventSource.close();
    };
  }, []);

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
    let isActive = true;

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

        // 獲取當日 A99 欄位的分組統計數據
        const dailyA99Stats = await fetchDailyA99GroupStats();
        const lldcnCount = await fetchLldcnEq1Count(start, end);
        const lldcn2Or3Count = await fetchLldcnEq2Or3Count(start, end);

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

        if (!isActive) {
          return;
        }

        setLdruICounts(data);
        setTotalLdruI(total);
        setWeeklyLdruI(weeklyTotal);
        setA99Count75(a99Count);
        setTotalA99(a99Total);
        setA99GroupStats(a99Stats);
        setDailyA99GroupStats(dailyA99Stats);
        setTotalLldcnEq1(lldcnCount);
        setTotalLldcnEq2Or3(lldcn2Or3Count);
        setError(null);
      } catch (err) {
        console.error('獲取 LDRU=I 每日數量失敗:', err);
        if (isActive) {
          setError('無法獲取 LDRU=I 每日數量數據');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isActive = false;
    };
  }, [selectedYear, selectedMonth, refreshVersion]);

  return (
    <Layout title="科技儀表板">
      <TechBackground>
        {/* 頂部標題 */}
        <DashboardHeader />

        {/* 頂部統計卡片 */}
        <StatisticsCards
          totalLdruI={totalLdruI}
          totalLldcnEq1={totalLldcnEq1}
          totalLldcnEq2Or3={totalLldcnEq2Or3}
          a99Count75={a99Count75}
          totalA99={totalA99}
        />

        <Grid container spacing={1}>
          {/* 左側統計面板 */}
          <Grid sx={{ width: { xs: '100%', lg: '24%' }, p: 1 }}>
            <SystemStatus a99GroupStats={a99GroupStats} totalLdruI={totalLdruI} totalLldcnEq1={totalLldcnEq1} totalLldcnEq2Or3={totalLldcnEq2Or3} />
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

          <DailyA99AmountPanel dailyA99GroupStats={dailyA99GroupStats} />
        </Grid>
      </TechBackground>
    </Layout>
  );
}

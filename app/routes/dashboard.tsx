import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Grid, Box, CircularProgress, Paper, Typography } from '@mui/material';

// 引入拆分後的組件
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import SystemStatus from '../components/dashboard/SystemStatus';
import Calendar from '../components/dashboard/Calendar';
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

        {/* 中央日曆和統計區域 */}
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

          {/* 右側當日 A99 金額面板 */}
          <Grid sx={{ width: { xs: '100%', lg: '24%' }, p: 1 }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 250,
                bgcolor: 'rgba(17, 34, 64, 0.6)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 30px rgba(100, 255, 218, 0.4)',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.9), transparent)',
                  boxShadow: '0 0 20px rgba(100, 255, 218, 0.8)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  width: '80%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.6), transparent)',
                  boxShadow: '0 0 10px rgba(100, 255, 218, 0.4)'
                }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                fontSize: '0.9rem',
                color: '#64ffda',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span>當日 A99 金額</span>
                <Box component="span" sx={{
                  fontSize: '0.7rem',
                  color: '#64ffda',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  DAY
                </Box>
              </Typography>

              {/* 動態生成當日 A99 分組數據 */}
              {(() => {
                // 獲取 valueGroups 中的所有條目
                const entries = Object.entries(dailyA99GroupStats.valueGroups);

                // 計算總計金額
                const totalSum = dailyA99GroupStats.totalSum || 1; // 避免除以0

                // 按乘積降序排序
                const sortedEntries = entries
                  .map(([value, count]) => ({
                    value,
                    count,
                    product: Number(value) * count
                  }))
                  .sort((a, b) => b.product - a.product)
                  .slice(0, 3); // 只取前三個最大值

                // 顏色配置
                const colors = [
                  { bg: 'rgba(64, 175, 255, 0.2)', color: '#40afff', barColor: 'primary.main', shadow: 'rgba(64, 175, 255, 0.5)' },
                  { bg: 'rgba(100, 255, 218, 0.2)', color: '#64ffda', barColor: 'success.main', shadow: 'rgba(100, 255, 218, 0.5)' },
                  { bg: 'rgba(255, 171, 64, 0.2)', color: '#ffab40', barColor: 'warning.main', shadow: 'rgba(255, 171, 64, 0.5)' }
                ];

                return sortedEntries.map((entry, index) => {
                  const { value, count, product } = entry;
                  const percentage = (product / totalSum) * 100;
                  const color = colors[index % colors.length];

                  return (
                    <React.Fragment key={value}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: index === 0 ? 1 : 0 }}>
                        <Typography variant="body2" sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          color: '#e6f1ff',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <Box component="span" sx={{
                            fontSize: '0.9rem',
                            bgcolor: color.bg,
                            px: 0.6,
                            py: 0.2,
                            borderRadius: 0.8,
                            color: color.color,
                            mr: 0.5
                          }}>
                            {count}×
                          </Box>
                          {value}
                        </Typography>
                        <Typography variant="body2" sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          color: color.color,
                        }}>
                          {product}
                        </Typography>
                      </Box>
                      {/* 完全重新設計的長條圖 */}
                      <Box sx={{
                        width: '100%',
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}>
                        {/* 長條和標籤 */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          {/* 長條圖 */}
                          <Box sx={{
                            flex: 1,
                            height: 5,
                            bgcolor: '#1e293b',
                            borderRadius: 1,
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid #334155'
                          }}>
                            <Box sx={{
                              height: '100%',
                              width: `${percentage}%`,
                              bgcolor: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f97316',
                            }} />
                          </Box>
                        </Box>
                      </Box>
                    </React.Fragment>
                  );
                });
              })()}
              {/* A99 總計 */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2,
                borderTop: '1px solid rgba(64, 175, 255, 0.2)',
                pt: 1
              }}>
                <Typography variant="body2" sx={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #40afff, #64ffda)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>
                  總計: {dailyA99GroupStats.totalSum.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TechBackground>
    </Layout>
  );
}

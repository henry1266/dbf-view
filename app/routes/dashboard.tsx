import React from 'react';
import { Layout } from '../components/Layout';
import { Grid, Box } from '@mui/material';

// 引入拆分後的組件
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import SystemStatus from '../components/dashboard/SystemStatus';
import Calendar from '../components/dashboard/Calendar';
import TechBackground from '../components/TechBackground';

export function meta() {
  return [
    { title: "儀表板 - 處方瀏覽器" },
    { name: "description", content: "DBF 檔案瀏覽器的儀表板頁面" },
  ];
}
export default function Dashboard() {
  return (
    <Layout title="科技儀表板">
      <TechBackground>
        {/* 頂部標題 */}
        <DashboardHeader />
        
        {/* 頂部統計卡片 */}
        <StatisticsCards />

        {/* 中央日曆和統計區域 */}
        <Grid container spacing={3}>
          {/* 左側統計面板 */}
          <Grid sx={{ width: { xs: '100%', md: '25%' }, p: 1.5 }}>
            <SystemStatus />
          </Grid>

          {/* 中央日曆 */}
          <Grid sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
            <Calendar />
          </Grid>
        </Grid>
      </TechBackground>
    </Layout>
  );
}
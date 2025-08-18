import React from 'react';
import { Layout } from '../components/Layout';
import { Grid, Box } from '@mui/material';

// 引入拆分後的組件
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import SystemStatus from '../components/dashboard/SystemStatus';
import Calendar from '../components/dashboard/Calendar';

export function meta() {
  return [
    { title: "儀表板 - DBF 檔案瀏覽器" },
    { name: "description", content: "DBF 檔案瀏覽器的儀表板頁面" },
  ];
}

export default function Dashboard() {
  return (
    <Layout title="科技儀表板">
      <Box sx={{
         flexGrow: 1,
         background: 'linear-gradient(145deg, #0a192f 0%, #112240 100%)',
         backgroundImage: `
           radial-gradient(circle at 10% 20%, rgba(64, 175, 255, 0.07) 0%, transparent 20%),
           radial-gradient(circle at 90% 80%, rgba(64, 175, 255, 0.07) 0%, transparent 20%),
           radial-gradient(circle at 50% 50%, rgba(0, 30, 60, 0.1) 0%, rgba(0, 30, 60, 0.2) 100%),
           linear-gradient(145deg, #0a192f 0%, #112240 100%)
         `,
         p: 2,
         borderRadius: 2,
         boxShadow: 'inset 0 0 30px rgba(64, 175, 255, 0.1)',
         color: '#e6f1ff',
         position: 'relative',
         overflow: 'hidden',
         '&::before': {
           content: '""',
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '2px',
           background: 'linear-gradient(90deg, transparent, rgba(0, 120, 255, 0.3), transparent)'
         },
         '&::after': {
           content: '""',
           position: 'absolute',
           top: '20px',
           right: '20px',
           width: '200px',
           height: '200px',
           background: 'radial-gradient(circle, rgba(0,120,255,0.03) 0%, transparent 70%)',
           zIndex: 0
         }
       }}>
       {/* 背景網格線 */}
       <Box sx={{
         position: 'absolute',
         top: 0,
         left: 0,
         right: 0,
         bottom: 0,
         backgroundImage: `
           linear-gradient(rgba(100, 255, 218, 0.07) 1px, transparent 1px),
           linear-gradient(90deg, rgba(100, 255, 218, 0.07) 1px, transparent 1px)
         `,
         backgroundSize: '20px 20px',
         zIndex: 0,
         pointerEvents: 'none',
         '&::after': {
           content: '""',
           position: 'absolute',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           backgroundImage: `
             linear-gradient(rgba(100, 255, 218, 0.04) 4px, transparent 4px),
             linear-gradient(90deg, rgba(100, 255, 218, 0.04) 4px, transparent 4px)
           `,
           backgroundSize: '40px 40px',
           zIndex: 0
         }
       }} />
       
       {/* 發光效果 */}
       <Box sx={{
         position: 'absolute',
         top: '10%',
         left: '5%',
         width: '300px',
         height: '300px',
         borderRadius: '50%',
         background: 'radial-gradient(circle, rgba(100, 255, 218, 0.1) 0%, transparent 70%)',
         filter: 'blur(40px)',
         zIndex: 0,
         opacity: 0.6
       }} />
       
       <Box sx={{
         position: 'absolute',
         bottom: '15%',
         right: '10%',
         width: '250px',
         height: '250px',
         borderRadius: '50%',
         background: 'radial-gradient(circle, rgba(64, 175, 255, 0.1) 0%, transparent 70%)',
         filter: 'blur(40px)',
         zIndex: 0,
         opacity: 0.6
       }} />
       
       
       {/* 額外的浮動粒子 */}
       <Box sx={{
         position: 'absolute',
         top: '25%',
         left: '75%',
         width: '4px',
         height: '4px',
         borderRadius: '50%',
         background: 'rgba(100, 255, 218, 0.8)',
         boxShadow: '0 0 15px rgba(100, 255, 218, 0.9)',
         animation: 'float4 25s infinite ease-in-out',
         zIndex: 0,
         '@keyframes float4': {
           '0%': { transform: 'translate(0, 0)' },
           '20%': { transform: 'translate(-30px, 40px)' },
           '40%': { transform: 'translate(-60px, 10px)' },
           '60%': { transform: 'translate(-20px, -30px)' },
           '80%': { transform: 'translate(30px, -10px)' },
           '100%': { transform: 'translate(0, 0)' }
         }
       }} />
       
       <Box sx={{
         position: 'absolute',
         top: '60%',
         left: '30%',
         width: '3px',
         height: '3px',
         borderRadius: '50%',
         background: 'rgba(204, 114, 255, 0.8)',
         boxShadow: '0 0 15px rgba(204, 114, 255, 0.9)',
         animation: 'float5 22s infinite ease-in-out',
         zIndex: 0,
         '@keyframes float5': {
           '0%': { transform: 'translate(0, 0)' },
           '25%': { transform: 'translate(50px, -20px)' },
           '50%': { transform: 'translate(20px, -50px)' },
           '75%': { transform: 'translate(-30px, -30px)' },
           '100%': { transform: 'translate(0, 0)' }
         }
       }} />
       
       {/* 背景裝飾元素 - 同心圓 */}
       <Box sx={{
         position: 'absolute',
         bottom: '30px',
         right: '30px',
         width: '150px',
         height: '150px',
         border: '1px solid rgba(100, 255, 218, 0.3)',
         borderRadius: '50%',
         opacity: 0.8,
         zIndex: 0,
         pointerEvents: 'none',
         animation: 'rotate 20s linear infinite',
         boxShadow: '0 0 30px rgba(100, 255, 218, 0.1)',
         '@keyframes rotate': {
           '0%': { transform: 'rotate(0deg)' },
           '100%': { transform: 'rotate(360deg)' }
         },
         '&::before': {
           content: '""',
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           width: '70%',
           height: '70%',
           border: '1px solid rgba(64, 175, 255, 0.3)',
           borderRadius: '50%',
           animation: 'rotate 15s linear infinite reverse',
           boxShadow: '0 0 20px rgba(64, 175, 255, 0.1)'
         },
         '&::after': {
           content: '""',
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           width: '40%',
           height: '40%',
           border: '1px solid rgba(204, 114, 255, 0.3)',
           borderRadius: '50%',
           animation: 'rotate 10s linear infinite',
           boxShadow: '0 0 15px rgba(204, 114, 255, 0.1)'
         }
       }} />
       
       {/* 背景裝飾元素 - 六邊形 */}
       <Box sx={{
         position: 'absolute',
         top: '40px',
         left: '40px',
         width: '100px',
         height: '100px',
         opacity: 0.6,
         zIndex: 0,
         pointerEvents: 'none',
         '&::before': {
           content: '""',
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           background: 'transparent',
           border: '1px solid rgba(100, 255, 218, 0.3)',
           clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
           animation: 'rotate 25s linear infinite reverse',
           boxShadow: '0 0 20px rgba(100, 255, 218, 0.1)'
         }
       }} />
       
       {/* 科技感線條 */}
       <Box sx={{
         position: 'absolute',
         top: '20%',
         right: '10%',
         width: '150px',
         height: '1px',
         background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.5), transparent)',
         zIndex: 0,
         pointerEvents: 'none',
         boxShadow: '0 0 10px rgba(100, 255, 218, 0.3)',
         '&::before': {
           content: '""',
           position: 'absolute',
           top: '-15px',
           right: '30px',
           width: '30px',
           height: '1px',
           background: 'rgba(100, 255, 218, 0.5)',
           boxShadow: '0 0 10px rgba(100, 255, 218, 0.3)',
           transform: 'rotate(45deg)'
         },
         '&::after': {
           content: '""',
           position: 'absolute',
           top: '15px',
           right: '30px',
           width: '30px',
           height: '1px',
           background: 'rgba(100, 255, 218, 0.5)',
           boxShadow: '0 0 10px rgba(100, 255, 218, 0.3)',
           transform: 'rotate(-45deg)'
         }
       }} />
       
       {/* 內容容器 - 確保內容在背景元素之上 */}
       <Box sx={{ position: 'relative', zIndex: 1 }}>
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
      </Box>
      </Box>
    </Layout>
  );
}
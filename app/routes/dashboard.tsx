import React from 'react';
import { Layout } from '../components/Layout';
import { Grid, Paper, Box, Typography, Card, CardContent, Stack } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

export function meta() {
  return [
    { title: "儀表板 - DBF 檔案瀏覽器" },
    { name: "description", content: "DBF 檔案瀏覽器的儀表板頁面" },
  ];
}

// 儀表板卡片組件
const DashboardCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <Card sx={{
    height: '100%',
    bgcolor: 'background.paper',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '3px',
      background: `linear-gradient(90deg, ${color}.main, ${color}.light)`
    }
  }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{
          color: 'text.secondary',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          fontSize: '0.9rem',
          textTransform: 'uppercase'
        }}>
          {title}
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          borderRadius: '50%',
          p: 1,
          boxShadow: `0 0 10px ${color}.light`
        }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" component="div" sx={{
        fontFamily: 'monospace',
        fontWeight: 'bold',
        letterSpacing: '0.05em'
      }}>
        {value}
      </Typography>
      <Box sx={{
        mt: 2,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}.light, transparent)`
      }} />
    </CardContent>
  </Card>
);

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
       
       {/* 浮動粒子效果 */}
       <Box sx={{
         position: 'absolute',
         top: '10%',
         left: '5%',
         width: '8px',
         height: '8px',
         borderRadius: '50%',
         background: 'rgba(100, 255, 218, 0.8)',
         boxShadow: '0 0 15px rgba(100, 255, 218, 0.9)',
         animation: 'float1 15s infinite ease-in-out',
         zIndex: 0,
         '@keyframes float1': {
           '0%': { transform: 'translate(0, 0)' },
           '25%': { transform: 'translate(20px, 30px)' },
           '50%': { transform: 'translate(40px, 0)' },
           '75%': { transform: 'translate(20px, -30px)' },
           '100%': { transform: 'translate(0, 0)' }
         }
       }} />
       
       <Box sx={{
         position: 'absolute',
         top: '70%',
         left: '80%',
         width: '6px',
         height: '6px',
         borderRadius: '50%',
         background: 'rgba(64, 175, 255, 0.8)',
         boxShadow: '0 0 15px rgba(64, 175, 255, 0.9)',
         animation: 'float2 18s infinite ease-in-out',
         zIndex: 0,
         '@keyframes float2': {
           '0%': { transform: 'translate(0, 0)' },
           '33%': { transform: 'translate(-30px, -20px)' },
           '66%': { transform: 'translate(30px, -40px)' },
           '100%': { transform: 'translate(0, 0)' }
         }
       }} />
       
       <Box sx={{
         position: 'absolute',
         top: '40%',
         left: '20%',
         width: '5px',
         height: '5px',
         borderRadius: '50%',
         background: 'rgba(204, 114, 255, 0.8)',
         boxShadow: '0 0 15px rgba(204, 114, 255, 0.9)',
         animation: 'float3 20s infinite ease-in-out',
         zIndex: 0,
         '@keyframes float3': {
           '0%': { transform: 'translate(0, 0)' },
           '20%': { transform: 'translate(40px, 20px)' },
           '40%': { transform: 'translate(60px, -20px)' },
           '60%': { transform: 'translate(20px, -40px)' },
           '80%': { transform: 'translate(-20px, -20px)' },
           '100%': { transform: 'translate(0, 0)' }
         }
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
       
       {/* 掃描線效果 */}
       <Box sx={{
         position: 'absolute',
         top: 0,
         left: 0,
         right: 0,
         height: '100%',
         zIndex: 0,
         pointerEvents: 'none',
         overflow: 'hidden',
         '&::after': {
           content: '""',
           position: 'absolute',
           top: 0,
           left: 0,
           right: 0,
           height: '2px',
           background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.7), transparent)',
           boxShadow: '0 0 15px rgba(100, 255, 218, 0.5)',
           animation: 'scanline 8s linear infinite',
         },
         '@keyframes scanline': {
           '0%': { top: '0%' },
           '100%': { top: '100%' }
         }
       }} />
       
       {/* 水平掃描線 */}
       <Box sx={{
         position: 'absolute',
         top: 0,
         left: 0,
         bottom: 0,
         width: '100%',
         zIndex: 0,
         pointerEvents: 'none',
         overflow: 'hidden',
         '&::after': {
           content: '""',
           position: 'absolute',
           left: 0,
           top: 0,
           bottom: 0,
           width: '2px',
           background: 'linear-gradient(180deg, transparent, rgba(64, 175, 255, 0.7), transparent)',
           boxShadow: '0 0 15px rgba(64, 175, 255, 0.5)',
           animation: 'hscanline 12s linear infinite',
         },
         '@keyframes hscanline': {
           '0%': { left: '0%' },
           '100%': { left: '100%' }
         }
       }} />
       
       {/* 數字雨效果 - 左側 */}
       <Box sx={{
         position: 'absolute',
         top: '5%',
         left: '2%',
         fontSize: '10px',
         fontFamily: 'monospace',
         color: 'rgba(100, 255, 218, 0.6)',
         lineHeight: 1.2,
         zIndex: 0,
         pointerEvents: 'none',
         userSelect: 'none',
         animation: 'pulse 4s infinite ease-in-out',
         '@keyframes pulse': {
           '0%': { opacity: 0.4 },
           '50%': { opacity: 0.8 },
           '100%': { opacity: 0.4 }
         }
       }}>
         10110101<br />
         01001010<br />
         11010010<br />
         00101101<br />
         10101001<br />
         01010110<br />
         10010101<br />
         01101001
       </Box>
       
       {/* 數字雨效果 - 右側 */}
       <Box sx={{
         position: 'absolute',
         top: '15%',
         right: '3%',
         fontSize: '10px',
         fontFamily: 'monospace',
         color: 'rgba(64, 175, 255, 0.6)',
         lineHeight: 1.2,
         zIndex: 0,
         pointerEvents: 'none',
         userSelect: 'none',
         animation: 'pulse 5s infinite ease-in-out',
       }}>
         01101001<br />
         10010101<br />
         01010110<br />
         10101001<br />
         00101101<br />
         11010010<br />
         01001010<br />
         10110101
       </Box>
       
       {/* 額外的數字雨效果 */}
       <Box sx={{
         position: 'absolute',
         bottom: '10%',
         left: '8%',
         fontSize: '10px',
         fontFamily: 'monospace',
         color: 'rgba(204, 114, 255, 0.6)',
         lineHeight: 1.2,
         zIndex: 0,
         pointerEvents: 'none',
         userSelect: 'none',
         animation: 'pulse 6s infinite ease-in-out',
       }}>
         11100111<br />
         00110011<br />
         10011001<br />
         01100110<br />
         11001100<br />
         00111100<br />
       </Box>
       
       {/* 內容容器 - 確保內容在背景元素之上 */}
       <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* 頂部標題 */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          pb: 1,
          borderBottom: '1px solid rgba(0, 120, 255, 0.1)'
        }}>
          <Typography variant="h5" sx={{
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            color: 'primary.main',
            fontWeight: 'bold'
          }}>
            SYSTEM DASHBOARD
          </Typography>
          <Typography variant="body2" sx={{
            fontFamily: 'monospace',
            color: 'text.secondary'
          }}>
            <Box component="span" sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'inline-block',
              mr: 1,
              boxShadow: '0 0 5px rgba(0,200,0,0.5)'
            }}/>
            ONLINE • {dayjs().format('YYYY-MM-DD')}
          </Typography>
        </Box>
        
        {/* 頂部統計卡片 */}
        <Grid container spacing={2}>
          <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
            <DashboardCard 
              title="總檔案數" 
              value="128" 
              icon="📁" 
              color="primary"
            />
          </Grid>
          <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
            <DashboardCard 
              title="總記錄數" 
              value="24,512" 
              icon="📊" 
              color="success"
            />
          </Grid>
          <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
            <DashboardCard 
              title="今日查詢" 
              value="142" 
              icon="🔍" 
              color="warning"
            />
          </Grid>
          <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
            <DashboardCard 
              title="系統效能" 
              value="94%" 
              icon="⚡" 
              color="info"
            />
          </Grid>
        </Grid>

        {/* 中央日曆和統計區域 */}
        <Grid container spacing={3}>
          {/* 左側統計面板 */}
          <Grid sx={{ width: { xs: '100%', md: '25%' }, p: 1.5 }}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.5), transparent)'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom sx={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  '&::after': {
                    content: '""',
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    ml: 1,
                    animation: 'pulse 1.5s infinite'
                  },
                  '@keyframes pulse': {
                    '0%': { opacity: 0.5, transform: 'scale(0.8)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                    '100%': { opacity: 0.5, transform: 'scale(0.8)' }
                  }
                }}>
                  RECENT ACTIVITY
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <span style={{ marginRight: '0.25rem', color: 'var(--mui-palette-primary-main)' }}>📈</span>
                  <Typography variant="body2">CO02P.DBF 更新</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <span style={{ marginRight: '0.25rem', color: 'var(--mui-palette-success-main)' }}>☁️</span>
                  <Typography variant="body2">CO03L.DBF 上傳</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.25rem', color: 'var(--mui-palette-warning-main)' }}>📊</span>
                  <Typography variant="body2">查詢量增加 12%</Typography>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 200,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.5), transparent)'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom sx={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>SYSTEM STATUS</span>
                  <Box component="span" sx={{
                    fontSize: '0.7rem',
                    color: 'success.main',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box component="span" sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'inline-block',
                      mr: 0.5,
                      boxShadow: '0 0 5px rgba(0,200,0,0.5)'
                    }}/>
                    OPERATIONAL
                  </Box>
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>CPU</Typography>
                  <Typography variant="body2" color="primary.main" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>32%</Typography>
                </Box>
                <Box sx={{
                  width: '100%',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  height: 6,
                  borderRadius: 5,
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    animation: 'shimmer 2s infinite',
                  },
                  '@keyframes shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                  }
                }}>
                  <Box sx={{
                    width: '32%',
                    bgcolor: 'primary.main',
                    height: 6,
                    borderRadius: 5,
                    boxShadow: '0 0 5px rgba(25, 118, 210, 0.5)'
                  }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>MEMORY</Typography>
                  <Typography variant="body2" color="warning.main" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>68%</Typography>
                </Box>
                <Box sx={{
                  width: '100%',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  height: 6,
                  borderRadius: 5,
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    animation: 'shimmer 2s infinite',
                  }
                }}>
                  <Box sx={{
                    width: '68%',
                    bgcolor: 'warning.main',
                    height: 6,
                    borderRadius: 5,
                    boxShadow: '0 0 5px rgba(255, 152, 0, 0.5)'
                  }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>DISK</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>45%</Typography>
                </Box>
                <Box sx={{
                  width: '100%',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  height: 6,
                  borderRadius: 5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    animation: 'shimmer 2s infinite',
                  }
                }}>
                  <Box sx={{
                    width: '45%',
                    bgcolor: 'success.main',
                    height: 6,
                    borderRadius: 5,
                    boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)'
                  }} />
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* 中央日曆 */}
          <Grid sx={{ width: { xs: '100%', md: '50%' }, p: 1.5 }}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{
                mb: 2,
                color: 'primary.main',
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                textShadow: '0 0 5px rgba(0, 120, 255, 0.5)',
                textAlign: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  height: '2px',
                  width: '60px',
                  background: 'linear-gradient(90deg, transparent, #0088ff, transparent)',
                  bottom: '-5px',
                  left: 'calc(50% - 30px)'
                }
              }}>
                SYSTEM CALENDAR • {dayjs().format('YYYY')}
              </Typography>
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,120,255,0.05) 100%)',
                borderRadius: 2,
                p: 2,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 15px rgba(0, 120, 255, 0.1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(0, 120, 255, 0.5), transparent)'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(0, 120, 255, 0.5), transparent)'
                }
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  mb: 2,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.02) 0%, rgba(0,120,255,0.1) 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="h4" sx={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    color: 'primary.main'
                  }}>
                    {dayjs().locale('zh-tw').format('MM/DD')}
                  </Typography>
                  <Typography variant="h6" sx={{
                    fontFamily: 'monospace',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box component="span" sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'inline-block',
                      mr: 1,
                      boxShadow: '0 0 5px rgba(0,200,0,0.5)'
                    }}/>
                    {dayjs().locale('zh-tw').format('dddd')}
                  </Typography>
                </Box>
                
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 1,
                  width: '100%',
                  mt: 2,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0, 120, 255, 0.2), transparent)'
                  }
                }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <Box key={day} sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: 'primary.main',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      py: 0.5
                    }}>
                      {day}
                    </Box>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const d = dayjs().startOf('month').startOf('week').add(i, 'day');
                    const isCurrentMonth = d.month() === dayjs().month();
                    const isToday = d.isSame(dayjs(), 'day');
                    return (
                      <Box
                        key={i}
                        sx={{
                          textAlign: 'center',
                          p: 0.5,
                          borderRadius: 1,
                          bgcolor: isToday ? 'primary.main' : isCurrentMonth ? 'rgba(0,120,255,0.03)' : 'transparent',
                          color: isToday ? 'white' : isCurrentMonth ? 'text.primary' : 'text.disabled',
                          fontWeight: isToday ? 'bold' : 'normal',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          border: isToday ? 'none' : isCurrentMonth ? '1px solid rgba(0,120,255,0.1)' : 'none',
                          boxShadow: isToday ? '0 0 10px rgba(0,120,255,0.5)' : 'none',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: isToday ? 'primary.dark' : 'rgba(0,120,255,0.1)',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        {d.date()}
                      </Box>
                    );
                  })}
                </Box>
                
                <Box sx={{
                  mt: 3,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 1
                }}>
                  <Typography variant="caption" sx={{
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem'
                  }}>
                    SYS.TIME: {dayjs().format('HH:mm:ss')}
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: 'success.main',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem'
                  }}>
                    STATUS: ONLINE
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* 右側統計面板 */}
          <Grid sx={{ width: { xs: '100%', md: '25%' }, p: 1.5 }}>
            <Stack spacing={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 180,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.5), transparent)'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom sx={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem',
                  color: 'primary.main'
                }}>
                  POPULAR FILES
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box component="span" sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'inline-block',
                      mr: 1
                    }}/>
                    CO02P.DBF
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>42%</Typography>
                </Box>
                <Box sx={{
                  width: '100%',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  height: 6,
                  borderRadius: 5,
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    width: '42%',
                    bgcolor: 'primary.main',
                    height: 6,
                    borderRadius: 5,
                    boxShadow: '0 0 5px rgba(25, 118, 210, 0.5)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '5px',
                      height: '100%',
                      background: 'rgba(255,255,255,0.5)'
                    }
                  }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box component="span" sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'inline-block',
                      mr: 1
                    }}/>
                    CO03L.DBF
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>28%</Typography>
                </Box>
                <Box sx={{
                  width: '100%',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  height: 6,
                  borderRadius: 5,
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    width: '28%',
                    bgcolor: 'success.main',
                    height: 6,
                    borderRadius: 5,
                    boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '5px',
                      height: '100%',
                      background: 'rgba(255,255,255,0.5)'
                    }
                  }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box component="span" sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'warning.main',
                      display: 'inline-block',
                      mr: 1
                    }}/>
                    OTHER FILES
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>30%</Typography>
                </Box>
                <Box sx={{
                  width: '100%',
                  bgcolor: 'rgba(0,0,0,0.05)',
                  height: 6,
                  borderRadius: 5,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    width: '30%',
                    bgcolor: 'warning.main',
                    height: 6,
                    borderRadius: 5,
                    boxShadow: '0 0 5px rgba(255, 152, 0, 0.5)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '5px',
                      height: '100%',
                      background: 'rgba(255,255,255,0.5)'
                    }
                  }} />
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 160,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.5), transparent)'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom sx={{
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>NOTIFICATIONS</span>
                  <Box component="span" sx={{
                    fontSize: '0.7rem',
                    color: 'warning.main',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    2 PENDING
                  </Box>
                </Typography>
                
                <Box sx={{
                  p: 1.5,
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: 1,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgba(25, 118, 210, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    bgcolor: 'primary.main',
                    boxShadow: '0 0 8px rgba(25, 118, 210, 0.8)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mr: 1,
                    boxShadow: '0 0 5px rgba(25, 118, 210, 0.8)'
                  }} />
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    <span>SYSTEM MAINTENANCE</span>
                    <span style={{ opacity: 0.7 }}>14:00</span>
                  </Typography>
                </Box>
                
                <Box sx={{
                  p: 1.5,
                  bgcolor: 'rgba(255, 152, 0, 0.08)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgba(255, 152, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    bgcolor: 'warning.main',
                    boxShadow: '0 0 8px rgba(255, 152, 0, 0.8)'
                  }
                }}>
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    mr: 1,
                    boxShadow: '0 0 5px rgba(255, 152, 0, 0.8)'
                  }} />
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    <span>DATABASE BACKUP</span>
                    <span style={{ opacity: 0.7 }}>18:30</span>
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      </Box>
    </Layout>
  );
}
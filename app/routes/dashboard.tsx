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
  <Card sx={{ height: '100%', bgcolor: 'background.paper', boxShadow: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" color="text.secondary">
          {title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          bgcolor: `${color}.light`, 
          color: `${color}.main`,
          borderRadius: '50%',
          p: 1
        }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  return (
    <Layout title="科技儀表板">
      <Box sx={{ flexGrow: 1 }}>
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
                  boxShadow: 2,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  最近活動
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
                  boxShadow: 2,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  系統狀態
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CPU 使用率</Typography>
                  <Typography variant="body2" color="primary.main">32%</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 8, borderRadius: 5, mb: 2 }}>
                  <Box sx={{ width: '32%', bgcolor: 'primary.main', height: 8, borderRadius: 5 }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">記憶體使用率</Typography>
                  <Typography variant="body2" color="warning.main">68%</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 8, borderRadius: 5, mb: 2 }}>
                  <Box sx={{ width: '68%', bgcolor: 'warning.main', height: 8, borderRadius: 5 }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">磁碟使用率</Typography>
                  <Typography variant="body2" color="success.main">45%</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 8, borderRadius: 5 }}>
                  <Box sx={{ width: '45%', bgcolor: 'success.main', height: 8, borderRadius: 5 }} />
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
              <Typography variant="h5" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                系統日曆
              </Typography>
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 2
              }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {dayjs().locale('zh-tw').format('YYYY年MM月DD日')}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {dayjs().locale('zh-tw').format('dddd')}
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: 1, 
                  width: '100%', 
                  mt: 4 
                }}>
                  {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                    <Box key={day} sx={{ textAlign: 'center', fontWeight: 'bold', color: 'text.secondary' }}>
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
                          p: 1, 
                          borderRadius: 1,
                          bgcolor: isToday ? 'primary.main' : 'transparent',
                          color: isToday ? 'white' : isCurrentMonth ? 'text.primary' : 'text.disabled',
                          fontWeight: isToday ? 'bold' : 'normal'
                        }}
                      >
                        {d.date()}
                      </Box>
                    );
                  })}
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
                  boxShadow: 2,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  熱門檔案
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CO02P.DBF</Typography>
                  <Typography variant="body2" color="primary.main">42%</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 6, borderRadius: 5, mb: 2 }}>
                  <Box sx={{ width: '42%', bgcolor: 'primary.main', height: 6, borderRadius: 5 }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CO03L.DBF</Typography>
                  <Typography variant="body2" color="success.main">28%</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 6, borderRadius: 5, mb: 2 }}>
                  <Box sx={{ width: '28%', bgcolor: 'success.main', height: 6, borderRadius: 5 }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">其他檔案</Typography>
                  <Typography variant="body2" color="warning.main">30%</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 6, borderRadius: 5 }}>
                  <Box sx={{ width: '30%', bgcolor: 'warning.main', height: 6, borderRadius: 5 }} />
                </Box>
              </Paper>

              <Paper 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: 160,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  今日提醒
                </Typography>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'primary.light', 
                  borderRadius: 1, 
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    mr: 1
                  }} />
                  <Typography variant="body2">系統維護 (14:00)</Typography>
                </Box>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'warning.light', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: 'warning.main',
                    mr: 1
                  }} />
                  <Typography variant="body2">資料庫備份 (18:30)</Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
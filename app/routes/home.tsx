import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

export function meta() {
  return [
    { title: "處方瀏覽系統" },
    { name: "description", content: "瀏覽和查詢 DBF 檔案的記錄" },
  ];
}

/**
 * @component HomeHeader
 * @description 首頁頂部組件，顯示標題和當前日期，具有現代科技風格的 UI 設計
 * @returns {JSX.Element} 渲染的首頁頂部組件
 */
const HomeHeader: React.FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3,
      pb: 1,
      borderBottom: '1px solid rgba(0, 120, 255, 0.1)'
    }}>
      <Typography variant="body2" sx={{
        fontFamily: 'monospace',
        color: '#e6f1ff',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(17, 34, 64, 0.6)',
        backdropFilter: 'blur(8px)',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        border: '1px solid rgba(64, 175, 255, 0.3)',
        boxShadow: '0 0 10px rgba(64, 175, 255, 0.3)'
      }}>
        <Box component="span" sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: '#64ffda',
          display: 'inline-block',
          mr: 1,
          boxShadow: '0 0 8px rgba(100, 255, 218, 0.7)',
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 0.5, transform: 'scale(0.8)' },
            '50%': { opacity: 1, transform: 'scale(1.2)' },
            '100%': { opacity: 0.5, transform: 'scale(0.8)' }
          }
        }}/>
        ONLINE • {dayjs().format('YYYY-MM-DD')}
      </Typography>
    </Box>
  );
};

/**
 * @component BigCard
 * @description 大卡片組件，用於顯示首頁的功能區塊
 */
const BigCard = ({ 
  title, 
  description, 
  icon, 
  color, 
  linkTo, 
  linkText 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  color: string; 
  linkTo: string; 
  linkText: string; 
}) => {
  // 根據顏色設置漸變背景
  const getGradient = (color: string) => {
    switch (color) {
      case 'primary':
        return 'linear-gradient(135deg, #40afff, #0078ff)';
      case 'success':
        return 'linear-gradient(135deg, #64ffda, #00d2b4)';
      case 'warning':
        return 'linear-gradient(135deg, #ff9800, #ff6400)';
      case 'info':
        return 'linear-gradient(135deg, #c940ffff, #cc00ffff)';
      default:
        return 'linear-gradient(135deg, #c940ffff, #cc00ffff)';
    }
  };

  return (
    <Paper sx={{
      height: '100%',
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: color === 'primary'
          ? '0 15px 40px rgba(64, 175, 255, 0.6)'
          : color === 'success'
            ? '0 15px 40px rgba(100, 255, 218, 0.6)'
            : color === 'warning'
              ? '0 15px 40px rgba(255, 152, 0, 0.6)'
              : '0 15px 40px rgba(234, 0, 255, 0.6)',
      },
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 頂部漸變色條 */}
      <Box sx={{
        height: '8px',
        background: getGradient(color),
        width: '100%',
        boxShadow: color === 'primary'
          ? '0 0 20px rgba(64, 175, 255, 0.8)'
          : color === 'success'
            ? '0 0 20px rgba(100, 255, 218, 0.8)'
            : color === 'warning'
              ? '0 0 20px rgba(255, 152, 0, 0.8)'
              : '0 0 20px rgba(183, 0, 255, 0.8)',
      }} />

      {/* 卡片內容 */}
      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: getGradient(color),
            color: '#ffffff',
            borderRadius: '50%',
            p: 2,
            mr: 2,
            fontSize: '2rem',
          }}>
            {icon}
          </Box>
          <Typography variant="h4" component="h2" sx={{
            fontWeight: 'bold',
            color: '#0a192f',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
          }}>
            {title}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ 
          color: '#8892b0', 
          mb: 4, 
          fontSize: '1.1rem',
          lineHeight: 1.6,
          flexGrow: 1
        }}>
          {description}
        </Typography>

        <Button
          component={Link}
          to={linkTo}
          variant="contained"
          size="large"
          sx={{
            mt: 'auto',
            py: 1.5,
            px: 4,
            borderRadius: 2,
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            bgcolor: color === 'primary'
              ? 'rgba(0, 30, 60, 0.9)'
              : color === 'success'
                ? 'rgba(0, 50, 40, 0.9)'
                : color === 'warning'
                  ? 'rgba(50, 30, 0, 0.9)'
                  : 'rgba(21, 0, 60, 0.9)',
            backdropFilter: 'blur(8px)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
            },
            '&:hover': {
              bgcolor: color === 'primary'
                ? 'rgba(64, 175, 255, 0.9)'
                : color === 'success'
                  ? 'rgba(100, 255, 218, 0.9)'
                  : color === 'warning'
                    ? 'rgba(255, 197, 111, 1)'
                    : 'rgba(196, 159, 255, 1)',
              color: '#000000',
            }
          }}
        >
          {linkText}
        </Button>
      </Box>
    </Paper>
  );
};

export default function Home() {
  return (
    <Layout title="處方瀏覽系統">
      <Box sx={{ mb: 6 }}>
        <HomeHeader />
        
        <Typography variant="h6" sx={{
          color: '#8892b0',
          mb: 4,
          fontWeight: 'normal',
          maxWidth: '800px'
        }}>
          歡迎使用處方瀏覽系統
        </Typography>

        <Grid container spacing={4}>
          <Grid sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
            <BigCard
              title="儀表板"
              description="儀表板提供直觀的數據視覺化，幫助您快速了解系統狀態。"
              icon={<DashboardIcon fontSize="large" />}
              color="primary"
              linkTo="/dashboard"
              linkText="查看儀表板"
            />
          </Grid>
          
          <Grid sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
            <BigCard
              title="處方查詢"
              description="使用多種方式查詢處方記錄，提供靈活的查詢選項，滿足不同的查詢需求。"
              icon={<SearchIcon fontSize="large" />}
              color="success"
              linkTo="/search"
              linkText="前往查詢"
            />
          </Grid>
          
          <Grid sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
            <BigCard
              title="DBF列表"
              description="瀏覽所有可用的 DBF 檔案，查看每個檔案的詳細信息和記錄。"
              icon={<FolderIcon fontSize="large" />}
              color="warning"
              linkTo="/dbf-files"
              linkText="查看檔案列表"
            />
          </Grid>
          
          <Grid sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
            <BigCard
              title="處方記錄"
              description="查看詳細的處方記錄信息，包括客戶信息、藥品信息、處方日期等。"
              icon={<DescriptionIcon fontSize="large" />}
              color="info"
              linkTo="/dbf-files"
              linkText="瀏覽記錄"
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
        <Box sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.2), rgba(0, 210, 180, 0.1))',
          p: 2,
          borderRadius: 2,
          border: '1px dashed rgba(100, 255, 218, 0.3)',
        }}>
          <LocalHospitalIcon sx={{ color: '#64ffda', mr: 1 }} />
          <Typography variant="body1" sx={{ color: '#0a192f' }}>
            此應用程序連接到 MongoDB 數據庫，從中獲取由 DBF 監控服務處理和存儲的數據。
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
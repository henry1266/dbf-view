import React from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

/**
 * @component DashboardHeader
 * @description 儀表板頁面的頂部組件，顯示標題和當前日期，具有現代科技風格的 UI 設計
 * @returns {JSX.Element} 渲染的儀表板頂部組件
 * @example
 * <DashboardHeader />
 */
const DashboardHeader: React.FC = () => {
  return (
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
        letterSpacing: '0.15em',
        color: '#64ffda',
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(100, 255, 218, 0.8)',
        position: 'relative',
        display: 'inline-block',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '-5px',
          left: '0',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.8), transparent)',
          boxShadow: '0 0 10px rgba(100, 255, 218, 0.6)'
        }
      }}>
        處方儀表板
      </Typography>
      <Typography variant="body2" sx={{
        fontFamily: 'monospace',
        color: '#e6f1ff',
        textShadow: '0 0 5px rgba(230, 241, 255, 0.6)',
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

export default DashboardHeader;
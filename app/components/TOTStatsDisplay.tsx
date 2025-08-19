import React from 'react';
import { Box } from '@mui/material';

interface TOTStats {
  totalSum: number;
}

interface StatValueProps {
  value: string | number;
}

interface TOTStatsDisplayProps {
  stats: TOTStats | null;
}

// 可重用的統計數值顯示組件
const StatValue = ({ value }: StatValueProps) => (
  <Box sx={{
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: '1.8rem',
    color: '#64ffda',
    textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
  }}>
    {value}
  </Box>
);

const TOTStatsDisplay: React.FC<TOTStatsDisplayProps> = ({ stats }) => {
  return (
    <Box sx={{
      flex: 1,
      minWidth: '200px',
      bgcolor: 'rgba(15, 30, 60, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2.5,
      p: 2,
      height: '120px',
      boxShadow: '0 4px 20px rgba(0, 188, 212, 0.2)',
      border: '1px solid rgba(0, 188, 212, 0.2)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(0, 188, 212, 0.3)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, #00bcd4, #64ffda)',
        boxShadow: '0 0 15px rgba(0, 188, 212, 0.5)'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, rgba(10, 25, 50, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%'
      }
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{
          fontFamily: '"Roboto Mono", monospace',
          letterSpacing: '0.05em',
          color: '#e6f1ff',
          fontSize: '0.85rem',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(0, 188, 212, 0), rgba(0, 188, 212, 0.8), rgba(0, 188, 212, 0))'
          }
        }}>
          <Box component="span" sx={{
            fontSize: '0.7rem',
            bgcolor: 'rgba(0, 188, 212, 0.2)',
            px: 0.8,
            py: 0.3,
            borderRadius: 1,
            letterSpacing: '0.05em',
            color: '#00bcd4'
          }}>
            TOT
          </Box>
          總和
        </Box>
        
        {stats ? (
          <Box sx={{
            fontFamily: '"Roboto Mono", monospace',
            fontWeight: 'bold',
            fontSize: '2rem',
            background: 'linear-gradient(135deg, #64ffda, #00bcd4)',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 15px rgba(0, 188, 212, 0.5)',
            mt: 1.5,
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            {stats.totalSum}
            <Box component="span" sx={{
              position: 'absolute',
              top: '0',
              right: '-20px',
              fontSize: '0.8rem',
              color: 'rgba(0, 188, 212, 0.7)'
            }}>
              元
            </Box>
          </Box>
        ) : (
          <Box sx={{
            fontFamily: '"Roboto Mono", monospace',
            fontSize: '0.9rem',
            color: 'rgba(230, 241, 255, 0.7)',
            fontStyle: 'italic',
            mt: 1.5,
            border: '1px dashed rgba(0, 188, 212, 0.3)',
            borderRadius: 1,
            px: 1.5,
            py: 0.5
          }}>
            無TOT欄位數據
          </Box>
        )}
        
        {/* 裝飾元素 */}
        <Box sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          bgcolor: 'rgba(0, 188, 212, 0.5)',
          boxShadow: '0 0 8px rgba(0, 188, 212, 0.8)'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          bgcolor: 'rgba(100, 255, 218, 0.5)',
          boxShadow: '0 0 8px rgba(100, 255, 218, 0.8)'
        }} />
      </Box>
    </Box>
  );
};

export default TOTStatsDisplay;
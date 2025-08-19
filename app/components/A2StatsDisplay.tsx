import React from 'react';
import { Box } from '@mui/material';

interface A2Stats {
  totalSum: number;
}

interface StatValueProps {
  value: string | number;
}

interface A2StatsDisplayProps {
  stats: A2Stats | null;
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

const A2StatsDisplay: React.FC<A2StatsDisplayProps> = ({ stats }) => {
  return (
    <Box sx={{
      flex: 1,
      minWidth: '200px',
      bgcolor: 'rgba(17, 34, 64, 0.6)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      p: 2,
      height: '100%',
      boxShadow: '0 4px 30px rgba(76, 175, 80, 0.3)',
      border: '1px solid rgba(76, 175, 80, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 35px rgba(76, 175, 80, 0.4)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
        boxShadow: '0 0 25px #4caf50'
      }
    }}>
      <Box sx={{
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
        color: '#e6f1ff',
        fontSize: '0.9rem',
        mb: 1
      }}>
        A2 藥費總和
      </Box>
      {stats ? (
        <StatValue value={stats.totalSum} />
      ) : (
        <Box sx={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          color: 'rgba(230, 241, 255, 0.7)',
          fontStyle: 'italic'
        }}>
          無A2欄位數據
        </Box>
      )}
    </Box>
  );
};

export default A2StatsDisplay;
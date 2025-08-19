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
      bgcolor: 'rgba(17, 34, 64, 0.6)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      p: 2,
      height: '120px',
      boxShadow: '0 4px 30px rgba(0, 188, 212, 0.3)',
      border: '1px solid rgba(0, 188, 212, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 35px rgba(0, 188, 212, 0.4)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'linear-gradient(90deg, #00bcd4, #4dd0e1)',
        boxShadow: '0 0 25px #00bcd4'
      }
    }}>
      <Box sx={{
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
        color: '#e6f1ff',
        fontSize: '0.9rem',
        mb: 1
      }}>
        TOT 總和
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
          無TOT欄位數據
        </Box>
      )}
    </Box>
  );
};

export default TOTStatsDisplay;
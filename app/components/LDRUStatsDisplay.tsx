import React from 'react';
import { Box } from '@mui/material';

interface LDRUStats {
  totalRecords: number;
  totalI: number;
  totalO: number;
}

interface StatValueProps {
  value: string | number;
}

interface LDRUStatsDisplayProps {
  stats: LDRUStats | null;
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

const LDRUStatsDisplay: React.FC<LDRUStatsDisplayProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <Box sx={{ 
      flex: 1,
      width: '33.33%',
      bgcolor: 'rgba(17, 34, 64, 0.6)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      p: 2,
      boxShadow: '0 4px 30px rgba(64, 175, 255, 0.3)',
      border: '1px solid rgba(64, 175, 255, 0.3)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
        color: '#e6f1ff',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        mb: 2,
        textShadow: '0 0 5px rgba(230, 241, 255, 0.5)'
      }}>
        LDRU 統計
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {/* LDRU 統計顯示在同一行 */}
        <Box sx={{
          flex: 1,
          minWidth: '200px',
          bgcolor: 'rgba(17, 34, 64, 0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: 2,
          p: 2,
          height: '120px',
          boxShadow: '0 4px 30px rgba(64, 175, 255, 0.3)',
          border: '1px solid rgba(64, 175, 255, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 35px rgba(64, 175, 255, 0.4)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'linear-gradient(90deg, #1976d2, #4791db)',
            boxShadow: '0 0 25px #1976d2'
          }
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#7981cbff',
                mb: 0.5
              }}>
                LDRU=I 已調劑
              </Box>
              <Box sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#64ffda',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
              }}>
                {stats.totalI}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#c868abff',
                mb: 0.5
              }}>
                LDRU=O 未調劑
              </Box>
              <Box sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#64ffda',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
              }}>
                {stats.totalO}
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* 加總線 */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <Box sx={{ flex: 1, height: '2px', background: 'rgba(100, 255, 218, 0.3)' }} />
          <Box sx={{
            color: '#64ffda',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            加總
          </Box>
          <Box sx={{ flex: 1, height: '2px', background: 'rgba(100, 255, 218, 0.3)' }} />
        </Box>
        
        {/* 總記錄數 - 參考 TOT 總和的樣式 */}
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
            總記錄數
          </Box>
          <StatValue value={stats.totalRecords} />
        </Box>
      </Box>
    </Box>
  );
};

export default LDRUStatsDisplay;
import React from 'react';
import { Box } from '@mui/material';

interface A99Stats {
  totalSum: number;
  valueGroups: Record<string, number>;
}

interface A99GroupStatsDisplayProps {
  stats: A99Stats | null;
}

const A99GroupStatsDisplay: React.FC<A99GroupStatsDisplayProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <Box sx={{
      flex: 1,
      width: '33.33%',
      bgcolor: 'rgba(17, 34, 64, 0.6)',
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 4px 30px rgba(255, 193, 7, 0.3)',
      border: '1px solid rgba(255, 193, 7, 0.3)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{
        p: 2,
        borderBottom: '1px solid rgba(255, 193, 7, 0.3)',
        bgcolor: 'rgba(0, 30, 60, 0.3)',
      }}>
        <Box sx={{
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          color: '#e6f1ff',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textShadow: '0 0 5px rgba(230, 241, 255, 0.5)'
        }}>
          A99 欄位分組統計明細
        </Box>
      </Box>
      
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* A99 分組統計 - 橫向長條圖 */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          flex: 1,
          overflow: 'auto'
        }}>
          {(() => {
            // 計算所有值的乘積，找出最大值用於計算比例
            const entries = Object.entries(stats.valueGroups);
            const products = entries.map(([value, count]) => Number(value) * count);
            const maxProduct = Math.max(...products, 1); // 避免除以0
            
            return entries
              .sort(([valueA], [valueB]) => Number(valueB) - Number(valueA)) // 按值降序排序
              .map(([value, count]) => {
                const product = Number(value) * count; // 計算乘積
                const percentage = (product / maxProduct) * 100; // 計算百分比
                
                return (
                  <Box key={value} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    }
                  }}>
                    {/* 標籤 */}
                    <Box sx={{
                      width: '100px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      color: '#e6f1ff',
                      pr: 2,
                      textAlign: 'right'
                    }}>
                      {count} × {value}
                    </Box>
                    
                    {/* 長條 */}
                    <Box sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Box sx={{
                        height: '24px',
                        width: `${percentage}%`,
                        minWidth: '30px', // 確保最小寬度
                        bgcolor: 'rgba(255, 193, 7, 0.6)',
                        borderRadius: '4px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(255, 193, 7, 0.3)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, rgba(255, 193, 7, 0.8), rgba(255, 193, 7, 0.4))',
                          zIndex: 1
                        }
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: 'rgba(0, 0, 0, 0.7)',
                          zIndex: 2
                        }}>
                          {product}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              });
          })()}
        </Box>
      </Box>
    </Box>
  );
};

export default A99GroupStatsDisplay;
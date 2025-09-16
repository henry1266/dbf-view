import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';

interface A99GroupStats {
  totalSum: number;
  valueGroups: Record<string, number>;
}

interface SystemStatusProps {
  a99GroupStats: A99GroupStats;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ a99GroupStats }) => {
  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 140,
          bgcolor: 'rgba(17, 34, 64, 0.6)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 30px rgba(64, 175, 255, 0.4)',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(64, 175, 255, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(64, 175, 255, 0.9), transparent)',
            boxShadow: '0 0 20px rgba(64, 175, 255, 0.8)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(64, 175, 255, 0.6), transparent)',
            boxShadow: '0 0 10px rgba(64, 175, 255, 0.4)'
          }
        }}
      >
        <Typography variant="h6" gutterBottom sx={{
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          fontSize: '0.9rem',
          color: '#64ffda',
          display: 'flex',
          alignItems: 'center',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.6)',
          '&::after': {
            content: '""',
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            bgcolor: '#64ffda',
            ml: 1,
            boxShadow: '0 0 10px rgba(100, 255, 218, 0.8)',
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
          <Box sx={{
            mr: 1,
            color: '#40afff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'rgba(64, 175, 255, 0.2)',
            boxShadow: '0 0 8px rgba(64, 175, 255, 0.5)'
          }}>📈</Box>
          <Typography variant="body2" sx={{
            color: '#e6f1ff',
            textShadow: '0 0 5px rgba(230, 241, 255, 0.5)',
            fontFamily: 'monospace',
            letterSpacing: '0.03em'
          }}>CO02P.DBF 更新</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            mr: 1,
            color: '#64ffda',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'rgba(100, 255, 218, 0.2)',
            boxShadow: '0 0 8px rgba(100, 255, 218, 0.5)'
          }}>☁️</Box>
          <Typography variant="body2" sx={{
            color: '#e6f1ff',
            textShadow: '0 0 5px rgba(230, 241, 255, 0.5)',
            fontFamily: 'monospace',
            letterSpacing: '0.03em'
          }}>CO03L.DBF 上傳</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            mr: 1,
            color: '#ffab40',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 171, 64, 0.2)',
            boxShadow: '0 0 8px rgba(255, 171, 64, 0.5)'
          }}>📊</Box>
          <Typography variant="body2" sx={{
            color: '#e6f1ff',
            textShadow: '0 0 5px rgba(230, 241, 255, 0.5)',
            fontFamily: 'monospace',
            letterSpacing: '0.03em'
          }}>查詢量增加 12%</Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 200,
          bgcolor: 'rgba(17, 34, 64, 0.6)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 30px rgba(100, 255, 218, 0.4)',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(100, 255, 218, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.9), transparent)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.8)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.6), transparent)',
            boxShadow: '0 0 10px rgba(100, 255, 218, 0.4)'
          }
        }}
      >
        <Typography variant="h6" gutterBottom sx={{
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          fontSize: '0.9rem',
          color: '#64ffda',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.6)'
        }}>
          <span>當月 A99 金額</span>
          <Box component="span" sx={{
            fontSize: '0.7rem',
            color: '#64ffda',
            display: 'flex',
            alignItems: 'center',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.6)'
          }}>
            GROUP
          </Box>
        </Typography>
        
        {/* 動態生成 A99 分組數據 */}
        {(() => {
          // 獲取 valueGroups 中的所有條目
          const entries = Object.entries(a99GroupStats.valueGroups);
          
          // 計算總計金額
          const totalSum = a99GroupStats.totalSum || 1; // 避免除以0
          
          // 按乘積降序排序
          const sortedEntries = entries
            .map(([value, count]) => ({
              value,
              count,
              product: Number(value) * count
            }))
            .sort((a, b) => b.product - a.product)
            .slice(0, 3); // 只取前三個最大值
          
          // 顏色配置
          const colors = [
            { bg: 'rgba(64, 175, 255, 0.2)', color: '#40afff', barColor: 'primary.main', shadow: 'rgba(64, 175, 255, 0.5)' },
            { bg: 'rgba(100, 255, 218, 0.2)', color: '#64ffda', barColor: 'success.main', shadow: 'rgba(100, 255, 218, 0.5)' },
            { bg: 'rgba(255, 171, 64, 0.2)', color: '#ffab40', barColor: 'warning.main', shadow: 'rgba(255, 171, 64, 0.5)' }
          ];
          
          return sortedEntries.map((entry, index) => {
            const { value, count, product } = entry;
            const percentage = (product / totalSum) * 100;
            const color = colors[index % colors.length];
            
            return (
              <React.Fragment key={value}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: index === 0 ? 1 : 0 }}>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#e6f1ff',
                    textShadow: '0 0 5px rgba(230, 241, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box component="span" sx={{
                      fontSize: '0.7rem',
                      bgcolor: color.bg,
                      px: 0.6,
                      py: 0.2,
                      borderRadius: 0.8,
                      color: color.color,
                      mr: 0.5
                    }}>
                      {count}×
                    </Box>
                    {value}
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: color.color,
                    textShadow: `0 0 8px ${color.shadow}`
                  }}>
                    {product}
                  </Typography>
                </Box>
                {/* 完全重新設計的長條圖 */}
                <Box sx={{
                  width: '100%',
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  {/* 長條和標籤 */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    {/* 長條 */}
                    <Box sx={{
                      flex: 1,
                      height: 4,
                      bgcolor: '#1e293b',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid #334155'
                    }}>
                      <Box sx={{
                        height: '100%',
                        width: `${percentage}%`,
                        bgcolor: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f97316',
                      }} />
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            );
          });
        })()}
        {/* A99 總計 */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
          borderTop: '1px solid rgba(64, 175, 255, 0.2)',
          pt: 1
        }}>
          <Typography variant="body2" sx={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #40afff, #64ffda)',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 8px rgba(64, 175, 255, 0.5)'
          }}>
            總計: {a99GroupStats.totalSum.toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};

export default SystemStatus;
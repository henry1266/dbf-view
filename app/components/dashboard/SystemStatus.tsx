import React from 'react';
import { Paper, Box, Typography, Stack, Tooltip } from '@mui/material';

interface A99GroupStats {
  totalSum: number;
  valueGroups: Record<string, number>;
}

interface SystemStatusProps {
  a99GroupStats: A99GroupStats;
  totalLdruI?: number;
  totalLldcnEq1?: number;
  totalLldcnEq2Or3?: number;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ a99GroupStats, totalLdruI = 0, totalLldcnEq1 = 0, totalLldcnEq2Or3 = 0 }) => {
  return (
    <Stack spacing={3}>

      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 220,
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

          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '10%',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.6), transparent)',
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
        }}>
          <span>當月調劑 LDRU=I </span>
          <Box component="span" sx={{
            fontSize: '0.9rem',
            color: '#64ffda',
            display: 'flex',
            alignItems: 'center',
          }}>
            MONTH
          </Box>
        </Typography>
        
        {/* 分組顯示 LLDCN=1 | LLDCN=2-3 且 LDRU=I 與其他 LDRU=I */}
        {(() => {
          const c1 = totalLldcnEq1 || 0;
          const c2to3 = totalLldcnEq2Or3 || 0;
          const cOther = totalLdruI - c1 - c2to3;
          const total = totalLdruI || 1;
          return (
            <>
              {/* LLDCN=1 與 LLDCN=2-3 同一條長條圖，數字加總顯示於標題，個別數字標示於長條圖上 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                <Typography variant="body2" sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: '#e6f1ff',
                  textShadow: '0 0 5px rgba(230, 241, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  LLDCN=1  | LLDCN=2-3
                </Typography>
                  <Typography variant="body2" sx={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  color: '#87c8fdff',
                }}>
                  {(c1 + c2to3).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{
                flex: 1,
                height: 20,
                bgcolor: '#1e293b',
                borderRadius: 1,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #334155',
                mb: 2
              }}>
                <Tooltip title={c1.toLocaleString()} arrow>
                  <Box sx={{
                    position: 'absolute',
                    left: 0,
                    height: '100%',
                    width: `${(c1 / total) * 100}%`,
                    bgcolor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '0.75rem', lineHeight: 1 }}>
                      {c1.toLocaleString()}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title={c2to3.toLocaleString()} arrow>
                  <Box sx={{
                    position: 'absolute',
                    left: `${(c1 / total) * 100}%`,
                    height: '100%',
                    width: `${(c2to3 / total) * 100}%`,
                    bgcolor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '0.75rem', lineHeight: 1 }}>
                      {c2to3.toLocaleString()}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
              {/* 其他 LDRU=I */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 0 }}>
                <Typography variant="body2" sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: '#e6f1ff',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  其他
                </Typography>
                <Typography variant="body2" sx={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  color: '#f97316',
                }}>
                  {cOther.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{
                flex: 1,
                height: 5,
                bgcolor: '#1e293b',
                borderRadius: 1,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #334155'
              }}>
                <Tooltip title={cOther.toLocaleString()} arrow>
                  <Box sx={{
                    height: '100%',
                    width: `${(cOther / total) * 100}%`,
                    bgcolor: '#f97316'
                  }} />
                </Tooltip>
              </Box>
            </>
          );
        })()}
        {/* LDRU=I 總計 */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 2,
          borderTop: '1px solid rgba(64, 175, 255, 0.2)',
          pt: 1
        }}>
          <Typography variant="body2" sx={{
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #40afff, #64ffda)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            總計: {totalLdruI.toLocaleString()} 張
          </Typography>
        </Box>
      </Paper>


      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 250,
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
        }}>
          <span>當月調劑費 A99</span>
          <Box component="span" sx={{
            fontSize: '0.9rem',
            color: '#64ffda',
            display: 'flex',
            alignItems: 'center',
          }}>
            MONTH
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
                    fontSize: '0.9rem',
                    color: '#e6f1ff',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Box component="span" sx={{
                      fontSize: '0.9rem',
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
                    fontSize: '0.9rem',
                    color: color.color,
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
                    {/* 長條圖 */}
                    <Box sx={{
                      flex: 1,
                      height: 5,
                      bgcolor: '#1e293b',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid #334155'
                    }}>
                      <Box sx={{
                        height: '100%',
                        width: `${percentage}%`,
                        bgcolor: index === 0 ? '#3360a8ff' : index === 1 ? '#10b981' : '#f97316',
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
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #40afff, #64ffda)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            總計: {a99GroupStats.totalSum.toLocaleString()} 點
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};

export default SystemStatus;
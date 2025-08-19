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
      bgcolor: 'rgba(15, 30, 55, 0.55)',
      backdropFilter: 'blur(12px)',
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(255, 193, 7, 0.4)',
      border: '1px solid rgba(255, 193, 7, 0.35)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(10, 25, 50, 0) 50%, rgba(255, 193, 7, 0.05) 100%)',
        zIndex: 0
      }
    }}>
      {/* 霧面光效果 - 左下角 */}
      <Box sx={{
        position: 'absolute',
        bottom: '-50px',
        left: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(64, 175, 255, 0.2) 0%, rgba(10, 25, 50, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%',
        filter: 'blur(20px)'
      }} />
      
      {/* 霧面光效果 - 中央 */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        background: 'radial-gradient(ellipse, rgba(100, 255, 218, 0.08) 0%, rgba(10, 25, 50, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%',
        filter: 'blur(30px)'
      }} />
      
      {/* 霧面光效果 - 右上角 */}
      <Box sx={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(64, 175, 255, 0.15) 0%, rgba(10, 25, 50, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%',
        filter: 'blur(15px)'
      }} />
      
      {/* 標題區塊 - 更現代化的設計 */}
      <Box sx={{
        p: 2,
        borderBottom: '1px solid rgba(64, 175, 255, 0.3)',
        bgcolor: 'rgba(15, 30, 55, 0.7)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box sx={{
          width: '4px',
          height: '24px',
          background: 'linear-gradient(180deg, #64ffda, #40afff)',
          borderRadius: '2px',
          mr: 1.5,
          boxShadow: '0 0 8px rgba(100, 255, 218, 0.6)'
        }} />
        <Box sx={{
          fontFamily: '"Roboto Mono", monospace',
          letterSpacing: '0.08em',
          color: '#e6f1ff',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(230, 241, 255, 0.4)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span>A99</span>
          <Box component="span" sx={{
            fontSize: '0.7rem',
            background: 'linear-gradient(90deg, #64ffda, #40afff)',
            color: 'transparent',
            backgroundClip: 'text',
            ml: 1,
            fontWeight: 'normal',
            letterSpacing: '0.05em'
          }}>
            GROUP STATISTICS
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* A99 分組統計 - 科技感橫向長條圖 */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: '100%'
        }}>
          {(() => {
            // 計算所有值的乘積，找出最大值用於計算比例
            const entries = Object.entries(stats.valueGroups);
            const products = entries.map(([value, count]) => Number(value) * count);
            const maxProduct = Math.max(...products, 1); // 避免除以0
            
            return entries
              .sort(([valueA], [valueB]) => Number(valueB) - Number(valueA)) // 按值降序排序
              .map(([value, count], index) => {
                const product = Number(value) * count; // 計算乘積
                const percentage = (product / maxProduct) * 100; // 計算百分比
                
                // 使用背光特效顏色
                const glowColor = index % 2 === 0 ? '64, 175, 255' : '100, 255, 218'; // 藍色和青色
                
                return (
                  <Box key={value} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    transition: 'all 0.3s ease-out',
                    p: 0.8,
                    borderRadius: 2,
                    bgcolor: 'rgba(15, 30, 55, 0.3)',
                    border: '1px solid rgba(64, 175, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    '&:hover': {
                      transform: 'translateX(5px) scale(1.01)',
                      bgcolor: 'rgba(15, 30, 55, 0.4)',
                      boxShadow: `0 4px 15px rgba(${glowColor}, 0.2)`,
                      border: `1px solid rgba(${glowColor}, 0.2)`
                    }
                  }}>
                    {/* 標籤 - 從左邊開始 */}
                    <Box sx={{
                      width: '60px',
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: '0.9rem',
                      color: '#e6f1ff',
                      pr: 2,
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        <Box component="span" sx={{
                          fontSize: '0.7rem',
                          bgcolor: `rgba(${glowColor}, 0.2)`,
                          px: 0.6,
                          py: 0.2,
                          borderRadius: 0.8,
                          color: index % 2 === 0 ? '#40afff' : '#64ffda'
                        }}>
                          {count}×
                        </Box>
                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                          {value}
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* 數值和長條圖容器 - 重新設計 */}
                    <Box sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative'
                    }}>
                      
                      {/* 中間長條容器 */}
                      <Box sx={{
                        flex: 1,
                        height: '28px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {/* 長條 */}
                        <Box sx={{
                          height: '100%',
                          width: `${percentage * 0.8}%`, // 最長的條會填滿80%的空間
                          minWidth: '20px', // 確保最小寬度
                          maxWidth: '100%', // 確保不會超出容器
                          borderRadius: '6px',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: `0 2px 20px rgba(${glowColor}, 0.5)`,
                          border: `1px solid rgba(${glowColor}, 0.5)`,
                          backdropFilter: 'blur(5px)',
                          bgcolor: 'rgba(15, 30, 55, 0.5)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(90deg, rgba(${glowColor}, 0.4), rgba(${glowColor}, 0.1))`,
                            zIndex: 1
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                            height: '3px',
                            background: `linear-gradient(90deg, rgba(${glowColor}, 1), transparent)`,
                            zIndex: 2,
                            boxShadow: `0 0 15px rgba(${glowColor}, 1)`
                          },
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { boxShadow: `0 2px 20px rgba(${glowColor}, 0.5)` },
                            '50%': { boxShadow: `0 2px 25px rgba(${glowColor}, 0.7)` },
                            '100%': { boxShadow: `0 2px 20px rgba(${glowColor}, 0.5)` }
                          }
                        }}>
                          {/* 裝飾點 */}
                          <Box sx={{
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 0 8px rgba(255, 255, 255, 1)',
                            zIndex: 2
                          }} />
                        </Box>
                      </Box>
                      
                      {/* 右側數值顯示 */}
                      <Box sx={{
                        width: '80px', // 固定寬度
                        height: '28px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: 'bold',
                        zIndex: 3,
                        gap: 0.3,
                        borderRadius: 1,
                        border: `1px solid rgba(${glowColor}, 0.5)`,
                        background: 'rgba(15, 30, 55, 0.6)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: `0 0 12px rgba(${glowColor}, 0.4)`,
                        position: 'relative',
                        ml: 1, // 左側間距
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '1px',
                          background: `linear-gradient(90deg, rgba(${glowColor}, 0.8), transparent)`,
                          zIndex: 1
                        }
                      }}>
                        <Box component="span" sx={{
                          background: index % 2 === 0 ?
                            'linear-gradient(90deg, #40afff, #64ffda)' :
                            'linear-gradient(90deg, #64ffda, #40afff)',
                          backgroundClip: 'text',
                          color: 'transparent',
                          textShadow: `0 0 10px rgba(${glowColor}, 0.7)`,
                          letterSpacing: '0.05em',
                          position: 'relative',
                          whiteSpace: 'nowrap',
                          fontSize: '0.8rem'
                        }}>
                          {product}
                          <Box component="span" sx={{
                            fontSize: '0.5rem',
                            color: index % 2 === 0 ? '#40afff' : '#64ffda',
                            opacity: 0.9,
                            fontWeight: 'normal',
                            position: 'relative',
                            top: '-2px',
                            ml: 0.2
                          }}>
                            元
                          </Box>
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
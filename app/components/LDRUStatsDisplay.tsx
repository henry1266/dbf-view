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
      bgcolor: 'rgba(10, 25, 50, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: 3,
      p: 2.5,
      boxShadow: '0 8px 32px rgba(64, 175, 255, 0.25)',
      border: '1px solid rgba(64, 175, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(64, 175, 255, 0.15) 0%, rgba(10, 25, 50, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%'
      }
    }}>
      {/* 標題區塊 - 更現代化的設計 */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2.5,
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{
          width: '4px',
          height: '24px',
          background: 'linear-gradient(180deg, #64ffda, #1976d2)',
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
          <span>LDRU</span>
          <Box component="span" sx={{
            fontSize: '0.7rem',
            background: 'linear-gradient(90deg, #64ffda, #1976d2)',
            color: 'transparent',
            backgroundClip: 'text',
            ml: 1,
            fontWeight: 'normal',
            letterSpacing: '0.05em'
          }}>
            STATISTICS
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, position: 'relative', zIndex: 1 }}>
        {/* LDRU 統計顯示 - 更具科技感的卡片 */}
        <Box sx={{
          flex: 1,
          minWidth: '200px',
          bgcolor: 'rgba(15, 30, 60, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2.5,
          p: 2,
          height: '120px',
          boxShadow: '0 4px 20px rgba(64, 175, 255, 0.2)',
          border: '1px solid rgba(64, 175, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(64, 175, 255, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #1976d2, #64ffda)',
            boxShadow: '0 0 15px rgba(100, 255, 218, 0.5)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, rgba(10, 25, 50, 0) 70%)',
            zIndex: 0,
            borderRadius: '50%'
          }
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            position: 'relative',
            zIndex: 1
          }}>
            {/* LDRU=I 已調劑 - 增強特效 */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(121, 129, 203, 0.15) 0%, rgba(10, 25, 50, 0) 100%)',
              border: '1px solid rgba(121, 129, 203, 0.2)',
              boxShadow: '0 0 15px rgba(121, 129, 203, 0.2)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 15px rgba(121, 129, 203, 0.2)' },
                '50%': { boxShadow: '0 0 20px rgba(121, 129, 203, 0.4)' },
                '100%': { boxShadow: '0 0 15px rgba(121, 129, 203, 0.2)' }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-5px',
                left: '10px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#7981cb',
                boxShadow: '0 0 10px #7981cb',
                animation: 'glow 1.5s infinite alternate',
                '@keyframes glow': {
                  '0%': { opacity: 0.6, boxShadow: '0 0 5px #7981cb' },
                  '100%': { opacity: 1, boxShadow: '0 0 15px #7981cb' }
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, #7981cb, rgba(121, 129, 203, 0))',
                borderRadius: '1px'
              }
            }}>
              <Box sx={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#64ffda',
                boxShadow: '0 0 8px #64ffda',
                zIndex: 2
              }} />
              
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '0.85rem',
                color: '#7981cb',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                position: 'relative'
              }}>
                <Box component="span" sx={{
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(121, 129, 203, 0.3)',
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                  letterSpacing: '0.05em',
                  boxShadow: '0 0 10px rgba(121, 129, 203, 0.3)',
                  border: '1px solid rgba(121, 129, 203, 0.3)'
                }}>
                  LDRU=I
                </Box>
                <Box component="span" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  已調劑
                  <Box component="span" sx={{
                    fontSize: '0.6rem',
                    color: '#64ffda',
                    ml: 0.3,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    border: '1px solid rgba(100, 255, 218, 0.5)',
                    boxShadow: '0 0 5px rgba(100, 255, 218, 0.3)'
                  }}>
                    ✓
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontWeight: 'bold',
                fontSize: '1.6rem',
                background: 'linear-gradient(135deg, #64ffda, #7981cb)',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 15px rgba(100, 255, 218, 0.7)',
                position: 'relative',
                padding: '0 5px',
                borderRadius: '4px',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, rgba(100, 255, 218, 0), rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0))',
                  borderRadius: '1px'
                }
              }}>
                {stats.totalI}
                <Box component="span" sx={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-15px',
                  fontSize: '0.7rem',
                  color: 'rgba(100, 255, 218, 0.8)'
                }}>
                  筆
                </Box>
              </Box>
              
              {/* 指示箭頭 */}
              <Box sx={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(121, 129, 203, 0.3)',
                filter: 'drop-shadow(0 0 2px rgba(121, 129, 203, 0.5))'
              }} />
            </Box>
            
            {/* 分隔線 */}
            <Box sx={{
              height: '70%',
              width: '1px',
              background: 'linear-gradient(180deg, rgba(64, 175, 255, 0.1), rgba(64, 175, 255, 0.3), rgba(64, 175, 255, 0.1))',
              mx: 1
            }} />
            
            {/* LDRU=O 未調劑 */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(200, 104, 171, 0.1) 0%, rgba(10, 25, 50, 0) 100%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '30px',
                height: '2px',
                background: '#c868ab',
                borderRadius: '1px'
              }
            }}>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '0.85rem',
                color: '#c868ab',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Box component="span" sx={{
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(200, 104, 171, 0.2)',
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                  letterSpacing: '0.05em'
                }}>
                  LDRU=O
                </Box>
                未調劑
              </Box>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: '#64ffda',
                textShadow: '0 0 12px rgba(100, 255, 218, 0.6)',
                position: 'relative'
              }}>
                {stats.totalO}
                <Box component="span" sx={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-15px',
                  fontSize: '0.7rem',
                  color: 'rgba(100, 255, 218, 0.7)'
                }}>
                  筆
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* 加總線 - 更具科技感的設計 */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          my: 1.5,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '50%',
            top: '-15px',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '15px',
            background: 'linear-gradient(180deg, rgba(100, 255, 218, 0.5), rgba(100, 255, 218, 0))',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            bottom: '-15px',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '15px',
            background: 'linear-gradient(0deg, rgba(0, 188, 212, 0.5), rgba(0, 188, 212, 0))',
            zIndex: 1
          }
        }}>
          <Box sx={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(100, 255, 218, 0), rgba(100, 255, 218, 0.5), rgba(100, 255, 218, 0))',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: '-4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(100, 255, 218, 0.2)',
              boxShadow: '0 0 5px rgba(100, 255, 218, 0.5)'
            }
          }} />
          
          <Box sx={{
            color: 'transparent',
            background: 'linear-gradient(135deg, #64ffda, #00bcd4)',
            backgroundClip: 'text',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            border: '1px solid rgba(100, 255, 218, 0.2)',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 0 10px rgba(100, 255, 218, 0.2)',
            letterSpacing: '0.05em',
            fontFamily: '"Roboto Mono", monospace',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '-5px',
              transform: 'translateY(-50%)',
              width: '10px',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(100, 255, 218, 0), rgba(100, 255, 218, 0.8))'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              right: '-5px',
              transform: 'translateY(-50%)',
              width: '10px',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(0, 188, 212, 0.8), rgba(0, 188, 212, 0))'
            }
          }}>
            TOTAL
          </Box>
          
          <Box sx={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(0, 188, 212, 0), rgba(0, 188, 212, 0.5), rgba(0, 188, 212, 0))',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '-4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(0, 188, 212, 0.2)',
              boxShadow: '0 0 5px rgba(0, 188, 212, 0.5)'
            }
          }} />
        </Box>
        
        {/* 總記錄數 - 更具科技感的設計 */}
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
                TOTAL
              </Box>
              總記錄數
            </Box>
            
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
              {stats.totalRecords}
              <Box component="span" sx={{
                position: 'absolute',
                top: '0',
                right: '-20px',
                fontSize: '0.8rem',
                color: 'rgba(0, 188, 212, 0.7)'
              }}>
                筆
              </Box>
            </Box>
            
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
      </Box>
    </Box>
  );
};

export default LDRUStatsDisplay;
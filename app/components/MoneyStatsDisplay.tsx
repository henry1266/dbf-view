import React from 'react';
import { Box } from '@mui/material';
import TOTStatsDisplay from './TOTStatsDisplay';

interface A2Stats {
  totalSum: number;
}

interface A97Stats {
  totalSum: number;
}

interface A99Stats {
  totalSum: number;
  valueGroups: Record<string, number>;
}

interface TOTStats {
  totalSum: number;
}

interface StatValueProps {
  value: string | number;
}

interface MoneyStatsDisplayProps {
  a2Stats: A2Stats | null;
  a97Stats: A97Stats | null;
  a99Stats: A99Stats | null;
  totStats: TOTStats | null;
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

const MoneyStatsDisplay: React.FC<MoneyStatsDisplayProps> = ({ a2Stats, a97Stats, a99Stats, totStats }) => {
  return (
    <Box sx={{
      flex: 1,
      width: '33.33%',
      bgcolor: 'rgba(15, 30, 55, 0.65)',
      backdropFilter: 'blur(12px)',
      borderRadius: 3,
      p: 2.5,
      boxShadow: '0 8px 32px rgba(64, 175, 255, 0.3)',
      border: '1px solid rgba(64, 175, 255, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.05) 0%, rgba(10, 25, 50, 0) 50%, rgba(255, 193, 7, 0.05) 100%)',
        zIndex: 0
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(64, 175, 255, 0.2) 0%, rgba(10, 25, 50, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%'
      }
    }}>
      {/* 霧面光效果 - 左下角 */}
      <Box sx={{
        position: 'absolute',
        bottom: '-50px',
        left: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, rgba(10, 25, 50, 0) 70%)',
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
        background: 'radial-gradient(ellipse, rgba(255, 193, 7, 0.03) 0%, rgba(10, 25, 50, 0) 70%)',
        zIndex: 0,
        borderRadius: '50%',
        filter: 'blur(30px)'
      }} />
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
          <span>金額</span>
          <Box component="span" sx={{
            fontSize: '0.7rem',
            background: 'linear-gradient(90deg, #64ffda, #1976d2)',
            color: 'transparent',
            backgroundClip: 'text',
            ml: 1,
            fontWeight: 'normal',
            letterSpacing: '0.05em'
          }}>
            FINANCIAL DATA
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, position: 'relative', zIndex: 1 }}>
        {/* 三個總和顯示 - 更具科技感的卡片 */}
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
            {/* A2 藥費總和 */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(10, 25, 50, 0) 100%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '30px',
                height: '2px',
                background: '#4caf50',
                borderRadius: '1px'
              }
            }}>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '0.85rem',
                color: '#4caf50',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Box component="span" sx={{
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                  letterSpacing: '0.05em'
                }}>
                  A2
                </Box>
                藥費
              </Box>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: '#64ffda',
                textShadow: '0 0 12px rgba(100, 255, 218, 0.6)',
                position: 'relative'
              }}>
                {a2Stats ? a2Stats.totalSum : '無數據'}
                <Box component="span" sx={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-15px',
                  fontSize: '0.7rem',
                  color: 'rgba(100, 255, 218, 0.7)'
                }}>
                  元
                </Box>
              </Box>
            </Box>
            
            {/* 分隔線 */}
            <Box sx={{
              height: '70%',
              width: '1px',
              background: 'linear-gradient(180deg, rgba(64, 175, 255, 0.1), rgba(64, 175, 255, 0.3), rgba(64, 175, 255, 0.1))',
              mx: 1
            }} />
            
            {/* A97 總和 */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(10, 25, 50, 0) 100%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '30px',
                height: '2px',
                background: '#ff9800',
                borderRadius: '1px'
              }
            }}>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '0.85rem',
                color: '#ff9800',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Box component="span" sx={{
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(255, 152, 0, 0.2)',
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                  letterSpacing: '0.05em'
                }}>
                  A97
                </Box>
                部分負擔
              </Box>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: '#64ffda',
                textShadow: '0 0 12px rgba(100, 255, 218, 0.6)',
                position: 'relative'
              }}>
                {a97Stats ? a97Stats.totalSum : '無數據'}
                <Box component="span" sx={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-15px',
                  fontSize: '0.7rem',
                  color: 'rgba(100, 255, 218, 0.7)'
                }}>
                  元
                </Box>
              </Box>
            </Box>
            
            {/* 分隔線 */}
            <Box sx={{
              height: '70%',
              width: '1px',
              background: 'linear-gradient(180deg, rgba(64, 175, 255, 0.1), rgba(64, 175, 255, 0.3), rgba(64, 175, 255, 0.1))',
              mx: 1
            }} />
            
            {/* A99 總和 */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(10, 25, 50, 0) 100%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '30px',
                height: '2px',
                background: '#ffc107',
                borderRadius: '1px'
              }
            }}>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '0.85rem',
                color: '#ffc107',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Box component="span" sx={{
                  fontSize: '0.7rem',
                  bgcolor: 'rgba(255, 193, 7, 0.2)',
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                  letterSpacing: '0.05em'
                }}>
                  A99
                </Box>
                調劑費
              </Box>
              <Box sx={{
                fontFamily: '"Roboto Mono", monospace',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: '#64ffda',
                textShadow: '0 0 12px rgba(100, 255, 218, 0.6)',
                position: 'relative'
              }}>
                {a99Stats ? a99Stats.totalSum : '無數據'}
                <Box component="span" sx={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-15px',
                  fontSize: '0.7rem',
                  color: 'rgba(100, 255, 218, 0.7)'
                }}>
                  元
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
        
        {/* TOT總和 */}
        <TOTStatsDisplay stats={totStats} />
      </Box>
    </Box>
  );
};

export default MoneyStatsDisplay;
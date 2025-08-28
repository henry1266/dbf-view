import React from 'react';
import { Paper, Box, Typography, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

// 定義 props 接口
interface CalendarProps {
  ldruICounts?: Record<string, number>;
}

// 將民國年日期轉換為西元年日期
const convertMinguoToGregorian = (minguoDate: string): string => {
  if (!minguoDate || minguoDate.length !== 7) return '';
  
  const year = parseInt(minguoDate.substring(0, 3)) + 1911;
  const month = minguoDate.substring(3, 5);
  const day = minguoDate.substring(5, 7);
  
  return `${year}-${month}-${day}`;
};

const Calendar: React.FC<CalendarProps> = ({ ldruICounts = {} }) => {
  return (
    <Paper
      sx={{

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'rgba(17, 34, 64, 0.6)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 40px rgba(64, 175, 255, 0.5)',
        borderRadius: 2,
        height: '100%',
        border: '1px solid rgba(64, 175, 255, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '10%',
          width: '80%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(64, 175, 255, 0.7), transparent)'
        }
      }}
    >
      <Box sx={{
        width: '100%',
        height: 'auto',
        maxHeight: '180px',
        padding: '15px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, rgba(17, 34, 64, 0.4) 0%, rgba(17, 34, 64, 0.6) 100%)',
        backdropFilter: 'blur(4px)',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 30px rgba(64, 175, 255, 0.3)',
        border: '1px solid rgba(64, 175, 255, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(64, 175, 255, 0.9), transparent)',
          boxShadow: '0 0 20px rgba(64, 175, 255, 0.8)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(64, 175, 255, 0.9), transparent)',
          boxShadow: '0 0 20px rgba(64, 175, 255, 0.8)'
        }
        }}>
        <Typography variant="h4" sx={{
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: '#64ffda',
          textShadow: '0 0 15px rgba(100, 255, 218, 0.8)',
          letterSpacing: '0.05em'
        }}>
          {dayjs().locale('zh-tw').format('YYYY/MM')}
        </Typography>
        <Typography variant="h6" sx={{
          fontFamily: 'monospace',
          color: '#e6f1ff',
          display: 'flex',
          alignItems: 'center',
          textShadow: '0 0 10px rgba(230, 241, 255, 0.6)'
        }}>
          <Box component="span" sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#64ffda',
            display: 'inline-block',
            mr: 1,
            boxShadow: '0 0 8px rgba(100, 255, 218, 0.7)'
          }}/>
          {dayjs().locale('zh-tw').format('dddd')}
        </Typography>
      </Box>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        width: '100%',
        mt: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -10,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 120, 255, 0.2), transparent)'
        }
      }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <Box key={day} sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#64ffda',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            py: 0.5,
            textShadow: '0 0 8px rgba(100, 255, 218, 0.6)'
          }}>
            {day}
          </Box>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const d = dayjs().startOf('month').startOf('week').add(i, 'day');
          const isCurrentMonth = d.month() === dayjs().month();
          const isToday = d.isSame(dayjs(), 'day');
          
          // 格式化日期為民國年格式 (YYYMMDD)
          const year = d.year() - 1911; // 西元年轉民國年
          const month = (d.month() + 1).toString().padStart(2, '0'); // 月份從0開始
          const day = d.date().toString().padStart(2, '0');
          const minguoDate = `${year}${month}${day}`;
          
          // 獲取該日期的 LDRU=I 數量
          const ldruICount = ldruICounts[minguoDate] || 0;
          
          // 根據 LDRU=I 數量設置不同的背景色強度
          let bgIntensity = 0;
          if (ldruICount > 0) {
            // 根據數量設置強度，最大值為 20 (可以根據實際情況調整)
            bgIntensity = Math.min(ldruICount / 20, 1);
          }
          
          return (
            <Tooltip
              key={i}
              title={ldruICount > 0 ? `${minguoDate}: LDRU=I 數量 ${ldruICount} 筆` : ''}
              arrow
              placement="top"
            >
              <Box
                sx={{
                  textAlign: 'center',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: isToday
                    ? 'rgba(64, 175, 255, 0.8)'
                    : isCurrentMonth
                      ? ldruICount > 0
                        ? `rgba(121, 129, 203, ${0.3 + bgIntensity * 0.5})`
                        : 'rgba(17, 34, 64, 0.5)'
                      : 'transparent',
                  color: isToday ? 'white' : isCurrentMonth ? '#e6f1ff' : 'rgba(230, 241, 255, 0.4)',
                  fontWeight: isToday ? 'bold' : 'normal',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  border: isToday
                    ? 'none'
                    : isCurrentMonth
                      ? ldruICount > 0
                        ? '1px solid rgba(121, 129, 203, 0.6)'
                        : '1px solid rgba(64, 175, 255, 0.3)'
                      : 'none',
                  boxShadow: isToday
                    ? '0 0 15px rgba(64, 175, 255, 0.7)'
                    : ldruICount > 0
                      ? `0 0 ${5 + bgIntensity * 10}px rgba(121, 129, 203, ${0.3 + bgIntensity * 0.4})`
                      : 'none',
                  textShadow: isToday
                    ? '0 0 8px rgba(255, 255, 255, 0.8)'
                    : isCurrentMonth
                      ? '0 0 5px rgba(230, 241, 255, 0.5)'
                      : 'none',
                  transition: 'all 0.2s',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: isToday
                      ? 'rgba(64, 175, 255, 0.9)'
                      : ldruICount > 0
                        ? `rgba(121, 129, 203, ${0.4 + bgIntensity * 0.5})`
                        : 'rgba(64, 175, 255, 0.3)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 10px rgba(64, 175, 255, 0.5)'
                  }
                }}
              >
                {/* 顯示 LDRU=I 數量 - 放在中間位置，更加突出 */}
                {ldruICount > 0 ? (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    position: 'relative'
                  }}>
                    <Box sx={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#64ffda',
                      textShadow: '0 0 8px rgba(100, 255, 218, 0.7)',
                      mb: 0.5
                    }}>
                      {ldruICount}
                    </Box>
                    
                    {/* 日期放在右下角 */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: '-8px',
                      right: '-4px',
                      fontSize: '0.7rem',
                      color: 'rgba(230, 241, 255, 0.7)',
                    }}>
                      {d.date()}
                    </Box>
                  </Box>
                ) : (
                  // 沒有數據時只顯示日期
                  <Box sx={{
                    position: 'relative',
                    height: '100%'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      bottom: '-8px',
                      right: '-4px',
                      fontSize: '0.7rem',
                    }}>
                      {d.date()}
                    </Box>
                  </Box>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      
      <Box sx={{
        mt: 3,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        px: 1
      }}>
        <Typography variant="caption" sx={{
          color: '#e6f1ff',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          textShadow: '0 0 5px rgba(230, 241, 255, 0.6)',
          letterSpacing: '0.05em'
        }}>
          SYS.TIME: {dayjs().format('HH:mm:ss')}
        </Typography>
        <Typography variant="caption" sx={{
          color: '#64ffda',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          textShadow: '0 0 8px rgba(100, 255, 218, 0.7)',
          letterSpacing: '0.05em',
          fontWeight: 'bold'
        }}>
          STATUS: ONLINE
        </Typography>
      </Box>
    </Paper>
  );
};

export default Calendar;
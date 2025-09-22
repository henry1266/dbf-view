import React, { useState } from 'react';
import { Paper, Box, Typography, Tooltip, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// 使用 dayjs 的類型
type Dayjs = dayjs.Dayjs;

// 定義 props 接口
interface CalendarProps {
  ldruICounts?: Record<string, number>;
  onMonthChange?: (year: number, month: number) => void;
}


// 擴展 props 接口，添加初始年份和月份
interface CalendarProps {
  ldruICounts?: Record<string, number>;
  onMonthChange?: (year: number, month: number) => void;
  initialYear?: number;
  initialMonth?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  ldruICounts = {},
  onMonthChange,
  initialYear = new Date().getFullYear(),
  initialMonth = new Date().getMonth() + 1
}) => {
  // 使用 props 中的初始年份和月份
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    dayjs(new Date(initialYear, initialMonth - 1, 1))
  );
  
  // 處理月份切換的函數
  const handlePreviousMonth = (e: React.MouseEvent) => {
    // 阻止事件冒泡
    e.preventDefault();
    e.stopPropagation();
    
    const newMonth = currentMonth.subtract(1, 'month');
    setCurrentMonth(newMonth);
    
    // 通知父組件月份已經改變
    if (onMonthChange) {
      onMonthChange(newMonth.year(), newMonth.month() + 1); // 月份從0開始，所以加1
    }
  };
  
  const handleNextMonth = (e: React.MouseEvent) => {
    // 阻止事件冒泡
    e.preventDefault();
    e.stopPropagation();
    
    const newMonth = currentMonth.add(1, 'month');
    setCurrentMonth(newMonth);
    
    // 通知父組件月份已經改變
    if (onMonthChange) {
      onMonthChange(newMonth.year(), newMonth.month() + 1); // 月份從0開始，所以加1
    }
  };
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
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mb: 1
        }}>
          <IconButton
            onClick={handlePreviousMonth}
            sx={{
              color: '#64ffda',
              '&:hover': {
                bgcolor: 'rgba(100, 255, 218, 0.1)',
                boxShadow: '0 0 10px rgba(100, 255, 218, 0.3)'
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          
          <Typography variant="h4" sx={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            color: '#64ffda',
            textShadow: '0 0 15px rgba(100, 255, 218, 0.8)',
            letterSpacing: '0.05em',
            mx: 2
          }}>
            {currentMonth.locale('zh-tw').format('YYYY/MM')}
          </Typography>
          
          <IconButton
            onClick={handleNextMonth}
            sx={{
              color: '#64ffda',
              '&:hover': {
                bgcolor: 'rgba(100, 255, 218, 0.1)',
                boxShadow: '0 0 10px rgba(100, 255, 218, 0.3)'
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        
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
          {currentMonth.locale('zh-tw').format('dddd')}
        </Typography>
      </Box>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
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
        {[...['S', 'M', 'T', 'W', 'T', 'F', 'S'], '總計'].map(day => (
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
        {(() => {
          // 創建一個數組來存儲每周的總和
          const weeklyTotals = [0, 0, 0, 0, 0];
          
          // 渲染日期格子和計算每周總和
          const renderDays = Array.from({ length: 35 }, (_, i) => {
            const d = currentMonth.startOf('month').startOf('week').add(i, 'day');
            const isCurrentMonth = d.month() === currentMonth.month();
            const isToday = d.isSame(dayjs(), 'day');
            
            // 格式化日期為民國年格式 (YYYMMDD)
            const year = d.year() - 1911; // 西元年轉民國年
            const month = (d.month() + 1).toString().padStart(2, '0'); // 月份從0開始
            const day = d.date().toString().padStart(2, '0');
            const minguoDate = `${year}${month}${day}`;
            
            // 獲取該日期的 LDRU=I 數量
            const ldruICount = ldruICounts[minguoDate] || 0;
            
            // 計算該日期屬於哪一周（0-4）
            const weekIndex = Math.floor(i / 7);
            
            // 累加到對應周的總和
            weeklyTotals[weekIndex] += ldruICount;
            
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
                      ? 'rgba(34, 89, 129, 0.8)'
                      : isCurrentMonth
                        ? 'rgba(17, 34, 64, 0.5)'
                        : 'transparent',
                    color: isToday ? 'white' : isCurrentMonth ? '#e6f1ff' : 'rgba(230, 241, 255, 0.4)',
                    fontWeight: isToday ? 'bold' : 'normal',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    border: isToday
                      ? '1px solid rgba(167, 245, 255, 1)'
                      : isCurrentMonth
                        ? ldruICount > 0
                          ? `1px solid rgba(121, 129, 203, ${0.6 + bgIntensity * 0.4})`
                          : '1px solid rgba(64, 175, 255, 0.3)'
                        : 'none',
                    transition: 'all 0.2s',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: isToday
                        ? 'rgba(54, 165, 245, 0.9)'
                        : ldruICount > 0
                          ? `rgba(121, 129, 203, ${0.4 + bgIntensity * 0.5})`
                          : 'rgba(64, 175, 255, 0.3)',
                      transform: 'scale(1.05)',  
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
                        mb: 0.5
                      }}>
                        {ldruICount}
                      </Box>
                      
                      {/* 日期放在右下角 */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: '-8px',
                        right: '-4px',
                        fontSize: '0.75rem',
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
          });
          
          // 渲染每周總和格子
          const renderWeeklyTotals = weeklyTotals.map((total, weekIndex) => {           
            return (
              <Tooltip
                key={`week-total-${weekIndex}`}
                title={`第 ${weekIndex + 1} 周總計: ${total} 筆`}
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'rgba(17, 34, 64, 0.7)',
                    color: '#e6f1ff',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    border: total > 0
                      ? '1px solid rgba(70, 172, 245, 0.6)'
                      : '1px solid rgba(64, 175, 255, 0.3)',
                    transition: 'all 0.2s',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: total > 0
                        ? 'rgba(70, 172, 245, 0.4)'
                        : 'rgba(64, 175, 255, 0.2)',
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  {/* 總和字體顏色 */}
                  <Box sx={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#64dbffff',
                  }}>
                    {total}
                  </Box>
                </Box>
              </Tooltip>
            );
          });
          
          // 將日期格子和每周總和格子組合在一起
          const result = [];
          for (let i = 0; i < 5; i++) {
            // 添加一周的日期格子
            for (let j = 0; j < 7; j++) {
              result.push(renderDays[i * 7 + j]);
            }
            // 添加該周的總和格子
            result.push(renderWeeklyTotals[i]);
          }
          
          return result;
        })()}
      </Box>
      
      <Box sx={{
        mt: 3,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        px: 1
      }}>
      </Box>
    </Paper>
  );
};

export default Calendar;
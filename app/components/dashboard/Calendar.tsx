import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

const Calendar = () => {
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
          return (
            <Box
              key={i}
              sx={{
                textAlign: 'center',
                p: 1,
                borderRadius: 1,
                bgcolor: isToday ? 'rgba(64, 175, 255, 0.8)' : isCurrentMonth ? 'rgba(17, 34, 64, 0.5)' : 'transparent',
                color: isToday ? 'white' : isCurrentMonth ? '#e6f1ff' : 'rgba(230, 241, 255, 0.4)',
                fontWeight: isToday ? 'bold' : 'normal',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                border: isToday ? 'none' : isCurrentMonth ? '1px solid rgba(64, 175, 255, 0.3)' : 'none',
                boxShadow: isToday ? '0 0 15px rgba(64, 175, 255, 0.7)' : 'none',
                textShadow: isToday ? '0 0 8px rgba(255, 255, 255, 0.8)' : isCurrentMonth ? '0 0 5px rgba(230, 241, 255, 0.5)' : 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isToday ? 'rgba(64, 175, 255, 0.9)' : 'rgba(64, 175, 255, 0.3)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 10px rgba(64, 175, 255, 0.5)'
                }
              }}
            >
              {d.date()}
            </Box>
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
import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';

const SystemStatus = () => {
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
          <span>SYSTEM STATUS</span>
          <Box component="span" sx={{
            fontSize: '0.7rem',
            color: '#64ffda',
            display: 'flex',
            alignItems: 'center',
            textShadow: '0 0 8px rgba(100, 255, 218, 0.6)'
          }}>
          </Box>
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#e6f1ff', textShadow: '0 0 5px rgba(230, 241, 255, 0.5)' }}>CPU</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#40afff', textShadow: '0 0 8px rgba(64, 175, 255, 0.7)' }}>32%</Typography>
        </Box>
        <Box sx={{
          width: '100%',
          bgcolor: 'rgba(0,0,0,0.05)',
          height: 6,
          borderRadius: 5,
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite',
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
          }
        }}>
          <Box sx={{
            width: '32%',
            bgcolor: 'primary.main',
            height: 6,
            borderRadius: 5,
            boxShadow: '0 0 5px rgba(25, 118, 210, 0.5)'
          }} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#e6f1ff', textShadow: '0 0 5px rgba(230, 241, 255, 0.5)' }}>MEMORY</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#ffab40', textShadow: '0 0 8px rgba(255, 171, 64, 0.6)' }}>68%</Typography>
        </Box>
        <Box sx={{
          width: '100%',
          bgcolor: 'rgba(0,0,0,0.05)',
          height: 6,
          borderRadius: 5,
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            animation: 'shimmer 2s infinite',
          }
        }}>
          <Box sx={{
            width: '68%',
            bgcolor: 'warning.main',
            height: 6,
            borderRadius: 5,
            boxShadow: '0 0 5px rgba(255, 152, 0, 0.5)'
          }} />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#e6f1ff', textShadow: '0 0 5px rgba(230, 241, 255, 0.5)' }}>DISK</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64ffda', textShadow: '0 0 8px rgba(100, 255, 218, 0.6)' }}>45%</Typography>
        </Box>
        <Box sx={{
          width: '100%',
          bgcolor: 'rgba(0,0,0,0.05)',
          height: 6,
          borderRadius: 5,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite',
          }
        }}>
          <Box sx={{
            width: '45%',
            bgcolor: 'success.main',
            height: 6,
            borderRadius: 5,
            boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)'
          }} />
        </Box>
      </Paper>
    </Stack>
  );
};

export default SystemStatus;
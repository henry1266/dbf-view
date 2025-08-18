import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

// 儀表板卡片組件
const DashboardCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
  <Card sx={{
    height: '100%',
    bgcolor: 'rgba(17, 34, 64, 0.6)',
    backdropFilter: 'blur(8px)',
    boxShadow: `0 4px 30px rgba(${color === 'primary' ? '64, 175, 255' :
                color === 'success' ? '100, 255, 218' :
                color === 'warning' ? '255, 152, 0' :
                color === 'info' ? '0, 120, 255' : '0, 0, 0'}, 0.5)`,
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s',
    border: `1px solid rgba(${color === 'primary' ? '64, 175, 255' :
              color === 'success' ? '100, 255, 218' :
              color === 'warning' ? '255, 152, 0' :
              color === 'info' ? '0, 120, 255' : '0, 0, 0'}, 0.3)`,
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: `0 8px 35px rgba(${color === 'primary' ? '64, 175, 255' :
                  color === 'success' ? '100, 255, 218' :
                  color === 'warning' ? '255, 152, 0' :
                  color === 'info' ? '0, 120, 255' : '0, 0, 0'}, 0.6)`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '3px',
      background: `linear-gradient(90deg, ${color}.main, ${color}.light)`,
      boxShadow: `0 0 25px ${color}.main`
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '10%',
      width: '80%',
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${color}.light, transparent)`,
      opacity: 0.7
    }
  }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{
          color: '#e6f1ff',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          textShadow: '0 0 5px rgba(230, 241, 255, 0.5)'
        }}>
          {title}
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          borderRadius: '50%',
          p: 1,
          boxShadow: `0 0 20px ${color}.light`
        }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" component="div" sx={{
        fontFamily: 'monospace',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        color: '#ffffff',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
      }}>
        {value}
      </Typography>
      <Box sx={{
        mt: 2,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}.light, transparent)`,
        boxShadow: `0 0 10px ${color}.light`
      }} />
    </CardContent>
  </Card>
);

export default DashboardCard;
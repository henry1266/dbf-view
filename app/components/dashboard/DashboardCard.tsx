import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

/**
 * @interface DashboardCardProps
 * @description 儀表板卡片組件的屬性接口
 * @property {string} title - 卡片標題
 * @property {string} value - 卡片顯示的數值
 * @property {React.ReactNode} icon - 卡片圖標
 * @property {string} color - 卡片顏色主題 ('primary', 'success', 'warning', 'info')
 */
interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * @component DashboardCard
 * @description 儀表板卡片組件，用於顯示統計數據和信息，具有現代科技風格的 UI 設計
 * @param {DashboardCardProps} props - 組件屬性
 * @returns {JSX.Element} 渲染的儀表板卡片組件
 * @example
 * <DashboardCard
 *   title="總處方數"
 *   value="1,234"
 *   icon={<DocumentIcon />}
 *   color="primary"
 * />
 */
const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => (
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
          background: color === 'primary'
            ? 'linear-gradient(135deg, rgba(64, 175, 255, 0.9), rgba(0, 120, 255, 0.7))'
            : color === 'success'
              ? 'linear-gradient(135deg, rgba(100, 255, 218, 0.9), rgba(0, 210, 180, 0.7))'
              : color === 'warning'
                ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.9), rgba(255, 100, 0, 0.7))'
                : 'linear-gradient(135deg, rgba(0, 120, 255, 0.9), rgba(0, 80, 200, 0.7))',
          color: '#ffffff',
          borderRadius: '50%',
          p: 1.2,
          boxShadow: color === 'primary'
            ? '0 0 25px rgba(64, 175, 255, 0.8), inset 0 0 15px rgba(64, 175, 255, 0.5)'
            : color === 'success'
              ? '0 0 25px rgba(100, 255, 218, 0.8), inset 0 0 15px rgba(100, 255, 218, 0.5)'
              : color === 'warning'
                ? '0 0 25px rgba(255, 152, 0, 0.8), inset 0 0 15px rgba(255, 152, 0, 0.5)'
                : '0 0 25px rgba(0, 120, 255, 0.8), inset 0 0 15px rgba(0, 120, 255, 0.5)',
          border: color === 'primary'
            ? '1px solid rgba(64, 175, 255, 0.6)'
            : color === 'success'
              ? '1px solid rgba(100, 255, 218, 0.6)'
              : color === 'warning'
                ? '1px solid rgba(255, 152, 0, 0.6)'
                : '1px solid rgba(0, 120, 255, 0.6)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            background: color === 'primary'
              ? 'radial-gradient(circle, rgba(64, 175, 255, 0.3) 0%, rgba(0, 0, 0, 0) 70%)'
              : color === 'success'
                ? 'radial-gradient(circle, rgba(100, 255, 218, 0.3) 0%, rgba(0, 0, 0, 0) 70%)'
                : color === 'warning'
                  ? 'radial-gradient(circle, rgba(255, 152, 0, 0.3) 0%, rgba(0, 0, 0, 0) 70%)'
                  : 'radial-gradient(circle, rgba(0, 120, 255, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(8px)',
            zIndex: -1
          },
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: color === 'primary'
              ? '0 0 25px rgba(64, 175, 255, 0.8), inset 0 0 15px rgba(64, 175, 255, 0.5)'
              : color === 'success'
                ? '0 0 25px rgba(100, 255, 218, 0.8), inset 0 0 15px rgba(100, 255, 218, 0.5)'
                : color === 'warning'
                  ? '0 0 25px rgba(255, 152, 0, 0.8), inset 0 0 15px rgba(255, 152, 0, 0.5)'
                  : '0 0 25px rgba(0, 120, 255, 0.8), inset 0 0 15px rgba(0, 120, 255, 0.5)' },
            '50%': { boxShadow: color === 'primary'
              ? '0 0 35px rgba(64, 175, 255, 0.9), inset 0 0 20px rgba(64, 175, 255, 0.6)'
              : color === 'success'
                ? '0 0 35px rgba(100, 255, 218, 0.9), inset 0 0 20px rgba(100, 255, 218, 0.6)'
                : color === 'warning'
                  ? '0 0 35px rgba(255, 152, 0, 0.9), inset 0 0 20px rgba(255, 152, 0, 0.6)'
                  : '0 0 35px rgba(0, 120, 255, 0.9), inset 0 0 20px rgba(0, 120, 255, 0.6)' },
            '100%': { boxShadow: color === 'primary'
              ? '0 0 25px rgba(64, 175, 255, 0.8), inset 0 0 15px rgba(64, 175, 255, 0.5)'
              : color === 'success'
                ? '0 0 25px rgba(100, 255, 218, 0.8), inset 0 0 15px rgba(100, 255, 218, 0.5)'
                : color === 'warning'
                  ? '0 0 25px rgba(255, 152, 0, 0.8), inset 0 0 15px rgba(255, 152, 0, 0.5)'
                  : '0 0 25px rgba(0, 120, 255, 0.8), inset 0 0 15px rgba(0, 120, 255, 0.5)' }
          }
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
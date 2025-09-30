import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';

/**
 * @interface LayoutProps
 * @description Layout組件的屬性接口
 * @property {React.ReactNode} children - 子組件，將在主內容區域渲染
 * @property {string} title - 頁面標題
 */
interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

// 側邊欄寬度
const DRAWER_WIDTH = 240;

/**
 * @component Layout
 * @description 應用程序的主要佈局組件，提供響應式側邊欄和內容區域
 * @param {LayoutProps} props - 組件屬性
 * @returns {JSX.Element} 渲染的佈局組件
 */
export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * @function handleDrawerToggle
   * @description 切換移動端側邊欄的開關狀態
   * @returns {void}
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 導航項目
  const navItems = [
    { text: '首頁', path: '/', icon: <HomeIcon /> },
    { text: '儀表板', path: '/dashboard', icon: <DashboardIcon /> },
    { text: '查詢', path: '/search', icon: <SearchIcon /> },
    { text: 'DBF 列表', path: '/dbf-files', icon: <FolderIcon /> },
    { text: '報表', path: '/report/LLDCN', icon: <AssessmentIcon /> },
  ];

  // 側邊欄內容
  const drawer = (
    <Box sx={{
      height: '100%',
      background: 'linear-gradient(145deg, #0a192f 0%, #112240 100%)',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(64, 175, 255, 0.07) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(64, 175, 255, 0.07) 0%, transparent 20%),
        radial-gradient(circle at 50% 50%, rgba(0, 30, 60, 0.1) 0%, rgba(0, 30, 60, 0.2) 100%),
        linear-gradient(145deg, #0a192f 0%, #112240 100%)
      `,
      boxShadow: 'inset 0 0 30px rgba(64, 175, 255, 0.1)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* 背景網格線 */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(100, 255, 218, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100, 255, 218, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Logo 區域 */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
        position: 'relative',
        zIndex: 1,
      }}>
        <Typography variant="h6" sx={{
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          color: '#64ffda',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.6)',
        }}>
          藥局處方瀏覽器
        </Typography>
      </Box>

      {/* 導航列表 */}
      <List sx={{ position: 'relative', zIndex: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              mb: 1,
              borderRadius: 1,
              mx: 1,
              color: location.pathname === item.path ? '#64ffda' : '#e6f1ff',
              bgcolor: location.pathname === item.path ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
              border: location.pathname === item.path ? '1px solid rgba(100, 255, 218, 0.3)' : 'none',
              boxShadow: location.pathname === item.path ? '0 0 15px rgba(100, 255, 218, 0.2)' : 'none',
              '&:hover': {
                bgcolor: 'rgba(100, 255, 218, 0.05)',
                boxShadow: '0 0 10px rgba(100, 255, 218, 0.1)',
              },
              transition: 'all 0.3s',
            }}
          >
            <ListItemIcon sx={{
              minWidth: 40,
              color: location.pathname === item.path ? '#64ffda' : '#e6f1ff',
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                fontSize: '0.9rem',
              }}
            />
            {location.pathname === item.path && (
              <Box sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '3px',
                height: '70%',
                bgcolor: '#64ffda',
                borderRadius: '0 4px 4px 0',
                boxShadow: '0 0 10px rgba(100, 255, 218, 0.8)',
              }} />
            )}
          </ListItem>
        ))}
      </List>

      {/* 裝飾元素 */}
      <Box sx={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.5), transparent)',
        boxShadow: '0 0 10px rgba(100, 255, 218, 0.3)',
      }} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* 移動端漢堡菜單 */}
      {isMobile && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100,
          bgcolor: '#0a192f',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: '#64ffda' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{
            color: '#e6f1ff',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
          }}>
            {title}
          </Typography>
        </Box>
      )}

      {/* 側邊欄 - 移動端 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // 提高移動端性能
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* 側邊欄 - 桌面端 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            border: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* 主要內容區域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          mt: { xs: 1, md: 0 }, // 移動端頂部留出空間給漢堡菜單
          height: '100vh', // 設置高度為視口高度
          overflowY: 'auto', // 允許內容區域垂直滾動
        }}
      >
        {!isMobile && (
          <Typography variant="h5" sx={{
            mb: 3,
            fontWeight: 'bold',
            color: '#0a192f',
          }}>
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
};
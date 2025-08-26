import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface TechBreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * 科技風格的麵包屑導航組件
 * 
 * @param items 麵包屑項目數組，每個項目包含 label（顯示文字）、path（可選，連結路徑）和 icon（可選，圖標）
 * 最後一個項目會被視為當前頁面，不會有連結
 */
export default function TechBreadcrumb({ items }: TechBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 3,
      mx: 2,
      mt: 2,
      position: 'relative',
      zIndex: 1
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(17, 34, 64, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        p: '4px 16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(64, 175, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(64, 175, 255, 0.1), transparent)',
          zIndex: -1
        }
      }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          // 渲染項目
          const itemContent = (
            <Box sx={{
              color: isLast ? '#64ffda' : '#e6f1ff',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              fontWeight: isLast ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s',
              textShadow: isLast ? '0 0 10px rgba(100, 255, 218, 0.3)' : 'none',
              '&:hover': {
                color: !isLast ? '#64ffda' : undefined
              }
            }}>
              {item.icon && (
                <Box component="span" sx={{ mr: 1 }}>{item.icon}</Box>
              )}
              <Box component="span">{item.label}</Box>
            </Box>
          );
          
          // 如果不是最後一個項目且有路徑，則渲染為連結
          const renderedItem = (!isLast && item.path) ? (
            <Link to={item.path} style={{ textDecoration: 'none' }}>
              {itemContent}
            </Link>
          ) : itemContent;
          
          // 渲染項目和分隔符（如果不是最後一個項目）
          return (
            <React.Fragment key={index}>
              {renderedItem}
              
              {!isLast && (
                <Box sx={{
                  mx: 1,
                  color: 'rgba(100, 255, 218, 0.7)',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                  transform: 'translateY(-1px)'
                }}>
                  /
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
      
      {/* 裝飾元素 - 發光點 */}
      <Box sx={{
        position: 'absolute',
        right: '-5px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#64ffda',
        boxShadow: '0 0 10px #64ffda, 0 0 20px #64ffda',
        animation: 'pulse 2s infinite'
      }} />
    </Box>
  );
}
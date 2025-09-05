import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { DbfRecord } from '../../types/dbf.types';

interface FieldConfig {
  key: string;
  label: string;
  isMetadata?: boolean;
  renderLink?: {
    path: string;
    color?: string;
    label?: string;
  };
}

interface FieldGroup {
  title: string;
  fields: FieldConfig[];
  layout?: 'full' | 'left' | 'right';
}

interface TechMainFieldsGridProps {
  record: DbfRecord;
  fieldGroups: FieldGroup[];
  title?: string;
}

/**
 * 科技風格的主要欄位表格顯示元件
 * 以分組表格形式顯示記錄中的主要欄位，支持靈活布局
 */
function TechMainFieldsGrid({
  record,
  fieldGroups,
  title = '主要欄位'
}: TechMainFieldsGridProps) {
  // 獲取欄位值
  const getFieldValue = (key: string, isMetadata = false) => {
    if (key === '_recordNo') return record._recordNo;
    if (key === '_created') return new Date(record._created).toLocaleString();
    if (key === '_updated') return new Date(record._updated).toLocaleString();
    if (key === '_file') return record._file;
    if (key === 'TIME' && record.data[key]) return record.data[key];
    return record.data[key] || '';
  };

  // 渲染欄位值（純文字或超連結）
  const renderValue = (field: FieldConfig) => {
    const value = getFieldValue(field.key, field.isMetadata);
    
    // 如果有超連結配置且值存在
    if (field.renderLink && value) {
      const path = field.renderLink.path.replace(':value', encodeURIComponent(value.toString()));
      const color = field.renderLink.color || '#64ffda';
      const label = field.renderLink.label || `查看 ${field.label}: ${value}`;
      
      return (
        <Link
          to={path}
          style={{
            color: color,
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 4px',
            borderRadius: '3px',
            backgroundColor: `${color}20`,
            textShadow: `0 0 5px ${color}80`
          }}
        >
          {value} <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem' }}>→</Box>
        </Link>
      );
    }
    
    // 純文字
    return value;
  };

  // 將表格分組為全寬和半寬（左右並排）
  const fullWidthGroups = fieldGroups.filter(group => group.layout === 'full' || !group.layout);
  const leftGroups = fieldGroups.filter(group => group.layout === 'left');
  const rightGroups = fieldGroups.filter(group => group.layout === 'right');

  // 渲染單個表格
  const renderTable = (group: FieldGroup, index: number | string) => (
    <Box key={index} sx={{ mb: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Typography variant="h6" sx={{
        mb: 0.5,
        color: '#e6f1ff',
        fontWeight: 'bold',
        fontSize: '1rem',
        pl: 0.5,
        fontFamily: 'monospace',
        letterSpacing: '0.05em'
      }}>
        {group.title}
      </Typography>
      
      <TableContainer component={Paper} sx={{
        bgcolor: 'rgba(17, 34, 64, 0.6)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(64, 175, 255, 0.3)',
        boxShadow: '0 4px 30px rgba(0, 120, 255, 0.3)',
        borderRadius: '4px',
        overflow: 'hidden',
        height: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {group.fields.map(({ key, label }) => (
                <TableCell
                  key={key}
                  sx={{
                    bgcolor: 'rgba(10, 25, 47, 0.7)',
                    color: '#64ffda',
                    borderBottom: '2px solid rgba(100, 255, 218, 0.5)',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em'
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{
                bgcolor: 'rgba(17, 34, 64, 0.4)',
                '&:hover': {
                  bgcolor: 'rgba(100, 255, 218, 0.05)',
                },
                transition: 'background-color 0.2s',
              }}
            >
              {group.fields.map((field) => (
                <TableCell
                  key={field.key}
                  sx={{
                    color: '#e6f1ff',
                    borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    padding: '4px 8px',
                    textAlign: 'center',
                    wordBreak: 'break-all'
                  }}
                >
                  {renderValue(field)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Box sx={{
        bgcolor: 'rgba(17, 34, 64, 0.4)',
        p: 1,
        borderRadius: 1,
        border: '1px solid rgba(64, 175, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 120, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #1976d2, #4791db)',
          boxShadow: '0 0 25px #1976d2'
        }
      }}>
        <Typography variant="h5" sx={{
          mb: 1,
          color: '#64ffda',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.5)',
          pl: 0.5,
          fontFamily: 'monospace',
          letterSpacing: '0.05em'
        }}>
          {title}
        </Typography>
        
        {/* 全寬表格 */}
        {fullWidthGroups.map((group, index) => renderTable(group, index))}
        
        {/* 左右並排表格 */}
        {(leftGroups.length > 0 || rightGroups.length > 0) && (
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 0.5
          }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {leftGroups.map((group, index) => renderTable(group, `left-${index}`))}
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {rightGroups.map((group, index) => renderTable(group, `right-${index}`))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default TechMainFieldsGrid;
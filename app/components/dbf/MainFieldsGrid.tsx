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

interface MainFieldsGridProps {
  record: DbfRecord;
  fieldGroups: FieldGroup[];
  title?: string;
}

/**
 * 主要欄位表格顯示元件
 * 以分組表格形式顯示記錄中的主要欄位，支持靈活布局
 */
function MainFieldsGrid({
  record,
  fieldGroups,
  title = '主要欄位'
}: MainFieldsGridProps) {
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
      const color = field.renderLink.color || '#1976d2';
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
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: `${color}15`,
          }}
        >
          {value} <Box component="span" sx={{ ml: 1, fontSize: '0.8rem' }}>→</Box>
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
    <Box key={index} sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{
        mb: 1.5,
        color: '#333333',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        pl: 1
      }}>
        {group.title}
      </Typography>
      
      <TableContainer component={Paper} sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(224, 224, 224, 0.8)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderRadius: '8px',
        overflow: 'hidden',
        height: '100%'
      }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {group.fields.map(({ key, label }) => (
                <TableCell
                  key={key}
                  sx={{
                    bgcolor: '#f5f5f5',
                    color: '#333333',
                    borderBottom: '2px solid #1976d2',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    padding: '12px 16px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
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
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                },
                transition: 'background-color 0.2s',
              }}
            >
              {group.fields.map((field) => (
                <TableCell
                  key={field.key}
                  sx={{
                    color: '#333333',
                    borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                    fontSize: '1.1rem',
                    fontFamily: 'monospace',
                    padding: '12px 16px',
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
    <Box sx={{ mt: 4, mb: 2 }}>
      <Box sx={{
        bgcolor: 'rgba(215, 229, 255, 0.1)',
        p: 2.5,
        borderRadius: 2,
        border: '1px solid rgba(224, 224, 224, 0.8)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography variant="h5" sx={{
          mb: 2.5,
          color: '#1976d2',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.9)'
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
            gap: 2
          }}>
            <Box sx={{ flex: 1 }}>
              {leftGroups.map((group, index) => renderTable(group, `left-${index}`))}
            </Box>
            <Box sx={{ flex: 1 }}>
              {rightGroups.map((group, index) => renderTable(group, `right-${index}`))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MainFieldsGrid;
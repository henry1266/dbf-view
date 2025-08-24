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
  TableCell
} from '@mui/material';
import type { DbfRecord } from '../../types/dbf.types';

interface MainFieldsGridProps {
  record: DbfRecord;
  fields: Array<{
    key: string;
    label: string;
    isMetadata?: boolean;
  }>;
  title?: string;
}

/**
 * 主要欄位表格顯示元件
 * 以表格形式顯示記錄中的主要欄位
 */
function MainFieldsGrid({
  record,
  fields,
  title = '主要欄位'
}: MainFieldsGridProps) {
  // 獲取欄位值
  const getFieldValue = (key: string, isMetadata = false) => {
    if (key === '_recordNo') return record._recordNo;
    if (key === '_created') return new Date(record._created).toLocaleString();
    if (key === '_updated') return new Date(record._updated).toLocaleString();
    if (key === '_file') return record._file;
    return record.data[key] || '';
  };

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Box sx={{
        bgcolor: 'rgba(248, 249, 250, 0.2)',
        p: 2.5,
        borderRadius: 2,
        border: '1px solid rgba(224, 224, 224, 0.8)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <Typography variant="h5" sx={{
          mb: 2.5,
          color: '#98ccffff',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          textShadow: '0 1px 1px rgba(28, 63, 102, 0.9)'
        }}>
          {title}
        </Typography>
        
        <TableContainer component={Paper} sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(224, 224, 224, 0.8)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {fields.map(({ key, label }) => (
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
                {fields.map(({ key, isMetadata }) => (
                  <TableCell
                    key={key}
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
                    {getFieldValue(key, isMetadata)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default MainFieldsGrid;
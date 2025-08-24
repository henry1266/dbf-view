import React from 'react';
import { 
  Box, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import type { DbfRecord } from '../../types/dbf.types';

interface MainFieldsProps {
  record: DbfRecord;
  fields: string[];
  title?: string;
}

/**
 * 主要欄位顯示元件
 * 顯示記錄中的主要欄位
 */
function MainFields({ 
  record, 
  fields, 
  title = '主要欄位' 
}: MainFieldsProps) {
  // 過濾出需要顯示的欄位
  const fieldsToShow = fields.map(field => ({
    key: field,
    value: field === '_recordNo' ? record._recordNo : record.data[field] || ''
  }));

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Box sx={{ bgcolor: 'rgba(100, 255, 218, 0.05)', p: 2, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#64ffda' }}>
          {title}
        </Typography>
        
        <TableContainer component={Paper} sx={{
          bgcolor: 'rgba(10, 25, 47, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 255, 218, 0.1)',
        }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{
                    bgcolor: 'rgba(10, 25, 47, 0.9)',
                    color: 'rgba(230, 241, 255, 0.8);',
                    borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
                    fontSize: '0.9rem',
                    padding: '8px',
                    width: '30%'
                  }}
                >
                  欄位
                </TableCell>
                <TableCell 
                  sx={{
                    bgcolor: 'rgba(10, 25, 47, 0.9)',
                    color: 'rgba(230, 241, 255, 0.8);',
                    borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
                    fontSize: '0.9rem',
                    padding: '8px',
                    width: '70%'
                  }}
                >
                  值
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fieldsToShow.map(({ key, value }) => (
                <TableRow
                  key={key}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(100, 255, 218, 0.05) !important',
                    },
                    '&:nth-of-type(odd)': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: '#e6f1ff',
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                      fontSize: '0.9rem',
                      padding: '8px',
                      fontWeight: 'bold',
                    }}
                  >
                    {key}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: '#e6f1ff',
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                      fontSize: '0.9rem',
                      padding: '8px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default MainFields;
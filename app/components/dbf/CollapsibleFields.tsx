import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Collapse, 
  IconButton, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { DbfRecord } from '../../types/dbf.types';

interface CollapsibleFieldsProps {
  record: DbfRecord;
  excludeFields: string[];
  title?: string;
}

/**
 * 可摺疊欄位元件
 * 顯示記錄中的剩餘欄位
 */
function CollapsibleFields({ 
  record, 
  excludeFields, 
  title = '其他欄位' 
}: CollapsibleFieldsProps) {
  const [open, setOpen] = useState(false);

  // 過濾出需要顯示的欄位
  const fieldsToShow = Object.entries(record.data)
    .filter(([key]) => !excludeFields.includes(key));

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#f8f9fa',
        p: 1.5,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        mb: 1
      }}>
        <IconButton
          aria-label="展開其他欄位"
          size="medium"
          onClick={() => setOpen(!open)}
          sx={{ color: '#1976d2' }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1, color: '#1976d2', fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ p: 1, borderRadius: 1 }}>
          <TableContainer component={Paper} sx={{
            maxHeight: '400px',
            bgcolor: 'white',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: '#f5f5f5',
                      color: '#333333',
                      borderBottom: '1px solid #e0e0e0',
                      fontSize: '1rem',
                      padding: '12px 16px',
                      fontWeight: 'bold',
                      width: '30%'
                    }}
                  >
                    欄位
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: '#f5f5f5',
                      color: '#333333',
                      borderBottom: '1px solid #e0e0e0',
                      fontSize: '1rem',
                      padding: '12px 16px',
                      fontWeight: 'bold',
                      width: '70%'
                    }}
                  >
                    值
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fieldsToShow.map(([key, value]) => (
                  <TableRow
                    key={key}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: '#f9fafb',
                      },
                      '&:nth-of-type(odd)': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: '#1976d2',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '1rem',
                        padding: '12px 16px',
                        fontFamily: 'monospace',
                        fontWeight: '500'
                      }}
                    >
                      {key}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#333333',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '1.1rem',
                        padding: '12px 16px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}
                    >
                      {value || ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </Box>
  );
}

export default CollapsibleFields;
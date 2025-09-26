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

interface TechCollapsibleFieldsProps {
  record: DbfRecord;
  excludeFields: string[];
  title?: string;
}

/**
 * 科技風格的可摺疊欄位元件
 * 顯示記錄中的剩餘欄位
 */
function TechCollapsibleFields({ 
  record, 
  excludeFields, 
  title = '其他欄位' 
}: TechCollapsibleFieldsProps) {
  const [open, setOpen] = useState(false);

  // 過濾出需要顯示的欄位
  const fieldsToShow = Object.entries(record.data)
    .filter(([key]) => !excludeFields.includes(key));

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(17, 34, 64, 0.6)',
        backdropFilter: 'blur(8px)',
        p: 1.5,
        borderRadius: 1,
        border: '1px solid rgba(64, 175, 255, 0.3)',
        boxShadow: '0 4px 30px rgba(0, 120, 255, 0.3)',
        mb: 1,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #9c27b0, #ba68c8)',
          boxShadow: '0 0 25px #9c27b0'
        }
      }}>
        <IconButton
          aria-label="展開其他欄位"
          size="medium"
          onClick={() => setOpen(!open)}
          sx={{ 
            color: '#64ffda',
            '&:hover': {
              bgcolor: 'rgba(100, 255, 218, 0.1)'
            }
          }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography variant="h6" sx={{ 
          ml: 1, 
          color: '#64ffda', 
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.3)'
        }}>
          {title}
        </Typography>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ p: 1, borderRadius: 1 }}>
          <TableContainer component={Paper} sx={{
            maxHeight: '400px',
            bgcolor: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(64, 175, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(0, 120, 255, 0.3)',
            borderRadius: '4px',
            overflowY: 'auto'
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: 'rgba(10, 25, 47, 0.7)',
                      color: '#64ffda',
                      borderBottom: '2px solid rgba(100, 255, 218, 0.5)',
                      fontSize: '0.9rem',
                      padding: '12px 16px',
                      fontWeight: 'bold',
                      width: '30%',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em'
                    }}
                  >
                    欄位
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: 'rgba(10, 25, 47, 0.7)',
                      color: '#64ffda',
                      borderBottom: '2px solid rgba(100, 255, 218, 0.5)',
                      fontSize: '0.9rem',
                      padding: '12px 16px',
                      fontWeight: 'bold',
                      width: '70%',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em'
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
                        bgcolor: 'rgba(100, 255, 218, 0.05)',
                      },
                      '&:nth-of-type(odd)': {
                        bgcolor: 'rgba(17, 34, 64, 0.4)',
                      },
                      '&:nth-of-type(even)': {
                        bgcolor: 'rgba(17, 34, 64, 0.2)',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: '#64ffda',
                        borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
                        fontSize: '0.9rem',
                        padding: '8px 16px',
                        fontFamily: 'monospace',
                        fontWeight: '500'
                      }}
                    >
                      {key}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#e6f1ff',
                        borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
                        fontSize: '0.9rem',
                        padding: '8px 16px',
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

export default TechCollapsibleFields;
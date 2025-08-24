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
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(100, 255, 218, 0.05)', p: 1, borderRadius: 1 }}>
        <IconButton
          aria-label="展開其他欄位"
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ color: '#64ffda' }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography variant="subtitle1" sx={{ ml: 1, color: '#64ffda' }}>
          {title}
        </Typography>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1, bgcolor: 'rgba(0, 0, 0, 0.2)', p: 1, borderRadius: 1 }}>
          <TableContainer component={Paper} sx={{
            maxHeight: '300px',
            bgcolor: 'rgba(10, 25, 47, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
          }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{
                      bgcolor: 'rgba(10, 25, 47, 0.9)',
                      color: 'rgba(230, 241, 255, 0.8);',
                      borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
                      fontSize: '0.9rem',
                      padding: '8px',
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
                        fontFamily: 'monospace',
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
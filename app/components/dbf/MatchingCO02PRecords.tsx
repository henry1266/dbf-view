import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatchingCO02PRecords } from '../../services/api';
import type { DbfRecord, MatchingCO02PRecordsProps } from '../../types/dbf.types';
import { 
  Box, 
  Typography, 
  Collapse, 
  IconButton, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper 
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/**
 * 配對記錄顯示元件
 * 顯示與 CO03L 記錄配對的 CO02P 記錄
 */
function MatchingCO02PRecords({ co03lRecord }: MatchingCO02PRecordsProps) {
  const [open, setOpen] = useState(false);
  const [matchingRecords, setMatchingRecords] = useState<DbfRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 獲取配對的 CO02P 記錄
  const fetchMatchingRecords = async () => {
    if (!co03lRecord || !co03lRecord.data) return;

    const kcstmr = co03lRecord.data.KCSTMR;
    const date = co03lRecord.data.DATE;
    const time = co03lRecord.data.TIME;

    if (!kcstmr || !date || !time) {
      setError('缺少必要的配對欄位：KCSTMR、DATE 或 TIME');
      return;
    }

    try {
      setLoading(true);
      const records = await fetchMatchingCO02PRecords(kcstmr, date, time);
      setMatchingRecords(records);
      setError(null);
    } catch (err) {
      console.error('獲取配對記錄失敗:', err);
      setError('無法獲取配對的 CO02P 記錄');
    } finally {
      setLoading(false);
    }
  };

  // 當展開面板時獲取配對記錄
  useEffect(() => {
    if (open && matchingRecords.length === 0 && !loading) {
      fetchMatchingRecords();
    }
  }, [open]);

  // 定義 CO02P 表格的列
  const co02pColumns = [
    { id: 'recordNo', label: '#', align: 'left' as const },
    { id: 'KCSTMR', label: 'KCSTMR', align: 'left' as const },
    { id: 'PDATE', label: 'PDATE', align: 'left' as const },
    { id: 'PTIME', label: 'PTIME', align: 'left' as const },
    { id: 'PLM', label: 'PLM', align: 'left' as const },
    { id: 'PRMK', label: 'PRMK', align: 'left' as const },
    { id: 'KDRUG', label: 'KDRUG', align: 'left' as const },
    { id: 'PTQTY', label: 'PTQTY', align: 'left' as const },
    { id: 'PPR', label: 'PPR', align: 'left' as const },
    { id: 'actions', label: '操作', align: 'center' as const }
  ];

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(100, 255, 218, 0.05)', p: 1, borderRadius: 1 }}>
        <IconButton
          aria-label="展開配對記錄"
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ color: '#64ffda' }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography variant="subtitle1" sx={{ ml: 1, color: '#64ffda' }}>
          配對的 CO02P 記錄
        </Typography>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1, bgcolor: 'rgba(0, 0, 0, 0.2)', p: 1, borderRadius: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </Box>
          ) : error ? (
            <Box sx={{ bgcolor: 'rgba(255, 0, 0, 0.1)', p: 1, borderRadius: 1, color: '#ff6b6b' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          ) : matchingRecords.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#e6f1ff', p: 1 }}>
              沒有找到配對的 CO02P 記錄
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{
              maxHeight: '300px',
              bgcolor: 'rgba(10, 25, 47, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(100, 255, 218, 0.1)',
            }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {co02pColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          bgcolor: 'rgba(10, 25, 47, 0.9)',
                          color: 'rgba(230, 241, 255, 0.8);',
                          borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
                          fontSize: '0.9rem',
                          padding: '8px',
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchingRecords.map((record) => (
                    <TableRow
                      key={record._id}
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
                      {co02pColumns.map((column) => {
                        let value;
                        if (column.id === 'recordNo') {
                          value = record._recordNo;
                        } else if (column.id === 'actions') {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{
                                color: '#e6f1ff',
                                borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                                fontSize: '0.9rem',
                                padding: '8px',
                              }}
                            >
                              <Link
                                to={`/dbf/CO02P.DBF/${record._recordNo}`}
                                style={{
                                  color: '#64ffda',
                                  textDecoration: 'none',
                                }}
                              >
                                詳情
                              </Link>
                            </TableCell>
                          );
                        } else {
                          value = record.data[column.id];
                        }

                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
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
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

export default MatchingCO02PRecords;
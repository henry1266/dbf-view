import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatchingCO02PRecords } from '../../services/api';
import type { DbfRecord, MatchingCO02PRecordsProps } from '../../types/dbf.types';
import CO09DFieldsForCO02P from './CO09DFieldsForCO02P';
import { 
  Box, 
  Typography, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper 
} from '@mui/material';

/**
 * 科技風格的配對記錄顯示元件 (無摺疊功能)
 * 顯示與 CO03L 記錄配對的 CO02P 記錄
 */
function TechMatchingCO02PRecordsNoCollapse({ co03lRecord }: MatchingCO02PRecordsProps) {
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

  // 組件加載時立即獲取配對記錄
  useEffect(() => {
    fetchMatchingRecords();
  }, []);

  // 定義 CO02P 表格的列
  const co02pColumns = [
    { id: 'recordNo', label: '#', align: 'left' as const },
    { id: 'KCSTMR', label: 'KCSTMR', align: 'left' as const },
    { id: 'PDATE', label: 'PDATE', align: 'left' as const },
    { id: 'PTIME', label: 'PTIME', align: 'left' as const },
    { id: 'PLM', label: 'PLM', align: 'left' as const },
    { id: 'PRMK', label: 'PRMK', align: 'left' as const },
    { id: 'KDRUG', label: 'KDRUG', align: 'left' as const },
    { id: 'DNO', label: 'DNO', align: 'left' as const },
    { id: 'PQTY', label: 'PQTY', align: 'left' as const },
    { id: 'PFQ', label: 'PFQ', align: 'left' as const },
    { id: 'PTQTY', label: 'PTQTY', align: 'left' as const },
    { id: 'PPR', label: 'PPR', align: 'left' as const },
    { id: 'actions', label: '操作', align: 'center' as const }
  ];

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        bgcolor: 'rgba(17, 34, 64, 0.4)', 
        p: 2, 
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
          background: 'linear-gradient(90deg, #2e7d32, #66bb6a)',
          boxShadow: '0 0 25px #2e7d32'
        }
      }}>
        <Typography variant="h5" sx={{ 
          mb: 2, 
          color: '#64ffda', 
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: '0.05em',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.3)'
        }}>
          CO02P 藥物
        </Typography>
        
        <Box sx={{ p: 1, borderRadius: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Box sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                border: '3px solid rgba(100, 255, 218, 0.3)',
                borderTop: '3px solid rgba(100, 255, 218, 0.8)',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                },
                boxShadow: '0 0 15px rgba(100, 255, 218, 0.5)'
              }} />
            </Box>
          ) : error ? (
            <Box sx={{
              bgcolor: 'rgba(255, 100, 100, 0.2)',
              border: '1px solid rgba(255, 100, 100, 0.5)',
              color: '#ffcccc',
              p: 2,
              borderRadius: 1,
              boxShadow: '0 0 15px rgba(255, 100, 100, 0.3)'
            }}>
              <Box component="span" sx={{ fontWeight: 'bold' }}>錯誤！</Box>
              <Box component="span" sx={{ ml: 1 }}>{error}</Box>
            </Box>
          ) : matchingRecords.length === 0 ? (
            <Typography variant="body2" sx={{ 
              color: '#e6f1ff', 
              p: 1,
              opacity: 0.7,
              fontStyle: 'italic'
            }}>
              沒有找到配對的 CO02P 記錄
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{
              maxHeight: '400px',
              bgcolor: 'rgba(17, 34, 64, 0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(64, 175, 255, 0.3)',
              boxShadow: '0 4px 30px rgba(0, 120, 255, 0.3)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <Table stickyHeader size="medium">
                <TableHead>
                  <TableRow>
                    {co02pColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          bgcolor: 'rgba(10, 25, 47, 0.7)',
                          color: '#64ffda',
                          borderBottom: '2px solid rgba(100, 255, 218, 0.5)',
                          fontSize: '0.9rem',
                          padding: '8px 12px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          fontFamily: 'monospace',
                          letterSpacing: '0.05em'
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
                          bgcolor: 'rgba(100, 255, 218, 0.05)',
                        },
                        '&:nth-of-type(odd)': {
                          bgcolor: 'rgba(17, 34, 64, 0.4)',
                        },
                        '&:nth-of-type(even)': {
                          bgcolor: 'rgba(17, 34, 64, 0.2)',
                        },
                        transition: 'background-color 0.2s',
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
                                borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
                                fontSize: '0.9rem',
                                padding: '6px 12px',
                              }}
                            >
                              <Link
                                to={`/dbf/CO02P.DBF/${record._recordNo}`}
                                style={{
                                  color: '#64ffda',
                                  textDecoration: 'none',
                                  fontWeight: 'bold',
                                  textShadow: '0 0 5px rgba(100, 255, 218, 0.3)'
                                }}
                              >
                                詳情
                              </Link>
                            </TableCell>
                          );
                        } else if (column.id === 'DNO') {
                          // 使用 CO09DFieldsForCO02P 組件顯示 DNO 欄位的值
                          const kdrug = record.data.KDRUG || '';
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{
                                color: '#e6f1ff',
                                borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
                                fontSize: '0.9rem',
                                padding: '6px 12px',
                                fontFamily: 'monospace',
                              }}
                            >
                              <CO09DFieldsForCO02P kdrug={kdrug} field="DNO" />
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
                              borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
                              fontSize: '0.9rem',
                              padding: '6px 12px',
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
      </Box>
    </Box>
  );
}

export default TechMatchingCO02PRecordsNoCollapse;
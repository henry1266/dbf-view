import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDbfRecords } from '../../services/api';
import type { DbfRecord } from '../../types/dbf.types';
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

interface MatchingCO02PRecordsForCO09DProps {
  co09dRecord: DbfRecord;
}

/**
 * 配對記錄顯示元件
 * 顯示與 CO09D 記錄配對的 CO02P 記錄
 */
function MatchingCO02PRecordsForCO09D({ co09dRecord }: MatchingCO02PRecordsForCO09DProps) {
  const [open, setOpen] = useState(false);
  const [matchingRecords, setMatchingRecords] = useState<DbfRecord[]>([]);
  const [co09dData, setCO09DData] = useState<DbfRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 獲取配對的 CO02P 記錄 - 使用 fetchDbfRecords (類似 CO03L.DBF 的方法)
  const fetchMatchingRecords = async () => {
    if (!co09dRecord || !co09dRecord.data) return;

    const kdrug = co09dRecord.data.KDRUG;

    if (!kdrug) {
      setError('缺少必要的配對欄位：KDRUG');
      return;
    }

    try {
      setLoading(true);
      
      // 使用 fetchDbfRecords 函數直接獲取 CO02P 記錄，使用 KDRUG 作為搜索條件
      const co02pResult = await fetchDbfRecords(
        'CO02P.DBF',    // 檔案名稱
        1,              // 頁碼
        1000,           // 每頁記錄數 (較大值以獲取所有記錄)
        kdrug,          // 搜索關鍵字
        'KDRUG',        // 搜索欄位
        '_recordNo',    // 排序欄位 - 按照記錄編號排序
        'desc'          // 排序方向 - 從大到小
      );
      
      // 使用 fetchDbfRecords 函數獲取 CO09D 記錄
      const co09dResult = await fetchDbfRecords(
        'CO09D.DBF',  // 檔案名稱
        1,            // 頁碼
        1,            // 每頁記錄數 (只需要一條記錄)
        kdrug,        // 搜索關鍵字
        'KDRUG',      // 搜索欄位
        '',           // 排序欄位
        ''            // 排序方向
      );
      
      // 設置 CO02P 記錄
      if (co02pResult && co02pResult.records && co02pResult.records.length > 0) {
        setMatchingRecords(co02pResult.records);
        setError(null);
      } else {
        setMatchingRecords([]);
        setError('沒有找到配對的 CO02P 記錄');
      }
      
      // 設置 CO09D 記錄
      if (co09dResult && co09dResult.records && co09dResult.records.length > 0) {
        setCO09DData(co09dResult.records[0]);
      } else {
        setCO09DData(null);
      }
    } catch (err) {
      console.error('獲取配對記錄失敗:', err);
      setError('無法獲取配對的記錄');
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
    { id: 'PQTY', label: 'PQTY', align: 'left' as const },
    { id: 'PFQ', label: 'PFQ', align: 'left' as const },
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
          {/* 顯示 CO09D 的 DNO 和 DDESC 欄位 */}
          {co09dData && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(100, 255, 218, 0.05)', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#64ffda', mb: 1 }}>
                藥品資訊
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#e6f1ff', fontWeight: 'bold' }}>
                    KDRUG:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#e6f1ff', fontFamily: 'monospace' }}>
                    {co09dData.data.KDRUG || ''}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#e6f1ff', fontWeight: 'bold' }}>
                    DNO:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#e6f1ff', fontFamily: 'monospace' }}>
                    {co09dData.data.DNO || ''}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#e6f1ff', fontWeight: 'bold' }}>
                    DDESC:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#e6f1ff', fontFamily: 'monospace' }}>
                    {co09dData.data.DDESC || ''}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

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

export default MatchingCO02PRecordsForCO09D;
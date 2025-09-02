import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatchingCO02PRecords, fetchDbfRecords } from '../../services/api';
import type { DbfRecord, MatchingCO02PRecordsProps } from '../../types/dbf.types';
import CO09DFieldsForCO02P from './CO09DFieldsForCO02P';
import axios from 'axios';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Tooltip,
  CircularProgress
} from '@mui/material';

/**
 * 科技風格的配對記錄顯示元件 (無摺疊功能)
 * 顯示與 CO03L 記錄配對的 CO02P 記錄
 */
function TechMatchingCO02PRecordsNoCollapse({ co03lRecord }: MatchingCO02PRecordsProps) {
  const [matchingRecords, setMatchingRecords] = useState<DbfRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costResults, setCostResults] = useState<Record<string, any>>({});
  const [loadingCost, setLoadingCost] = useState<Record<string, boolean>>({});
  const [costErrors, setCostErrors] = useState<Record<string, string>>({});
  
  // 批次查詢成本相關狀態
  const [batchQueryLoading, setBatchQueryLoading] = useState(false);
  const [batchQueryResult, setBatchQueryResult] = useState<{
    totalCost: number;
    successCount: number;
    failCount: number;
  } | null>(null);
  const [batchQueryError, setBatchQueryError] = useState<string | null>(null);

  // 查詢成本的函數
  const queryCost = async (recordId: string, kdrug: string, ptqty: number) => {
    if (!kdrug || !ptqty) {
      setCostErrors(prev => ({
        ...prev,
        [recordId]: '缺少必要的參數：KDRUG 或 PTQTY'
      }));
      return;
    }

    try {
      setLoadingCost(prev => ({
        ...prev,
        [recordId]: true
      }));

      // 先獲取 DNO 值
      const result = await fetchDbfRecords(
        'CO09D.DBF',  // 檔案名稱
        1,            // 頁碼
        1,            // 每頁記錄數 (只需要一條記錄)
        kdrug,        // 搜索關鍵字
        'KDRUG',      // 搜索欄位
        '',           // 排序欄位
        ''            // 排序方向
      );
      
      if (!result || !result.records || result.records.length === 0) {
        throw new Error(`找不到對應的 CO09D 記錄 (KDRUG=${kdrug})`);
      }
      
      // 獲取 DNO 值
      const dno = result.records[0].data.DNO;
      
      if (!dno) {
        throw new Error(`CO09D 記錄中沒有 DNO 值 (KDRUG=${kdrug})`);
      }

      // 調用 API 獲取成本信息
      const response = await axios.get(`http://192.168.68.90:5000/api/fifo/simulate-by-health-insurance/${dno}/${ptqty}`);
      
      // 存儲成本結果
      setCostResults(prev => ({
        ...prev,
        [recordId]: response.data
      }));
      
      // 清除錯誤
      setCostErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[recordId];
        return newErrors;
      });
    } catch (err) {
      console.error(`查詢成本失敗 (DNO=${dno}, PTQTY=${ptqty}):`, err);
      setCostErrors(prev => ({
        ...prev,
        [recordId]: '無法獲取成本信息'
      }));
    } finally {
      setLoadingCost(prev => ({
        ...prev,
        [recordId]: false
      }));
    }
  };

  // 批次查詢所有藥品成本並加總
  const queryAllCosts = async () => {
    if (!matchingRecords || matchingRecords.length === 0) {
      setBatchQueryError('沒有可查詢的藥品記錄');
      return;
    }

    try {
      setBatchQueryLoading(true);
      setBatchQueryError(null);
      setBatchQueryResult(null);

      let totalCost = 0;
      let successCount = 0;
      let failCount = 0;

      // 遍歷所有記錄，獲取 KDRUG 和 PTQTY
      const queries = matchingRecords.map(async (record) => {
        const kdrug = record.data.KDRUG;
        const ptqty = parseFloat(record.data.PTQTY) || 0;

        if (!kdrug || !ptqty) {
          failCount++;
          return null;
        }

        try {
          // 先獲取 DNO 值
          const result = await fetchDbfRecords(
            'CO09D.DBF',  // 檔案名稱
            1,            // 頁碼
            1,            // 每頁記錄數 (只需要一條記錄)
            kdrug,        // 搜索關鍵字
            'KDRUG',      // 搜索欄位
            '',           // 排序欄位
            ''            // 排序方向
          );
          
          if (!result || !result.records || result.records.length === 0) {
            failCount++;
            return null;
          }
          
          // 獲取 DNO 值
          const dno = result.records[0].data.DNO;
          
          if (!dno) {
            failCount++;
            return null;
          }

          // 調用 API 獲取成本信息
          const response = await axios.get(`http://192.168.68.90:5000/api/fifo/simulate-by-health-insurance/${dno}/${ptqty}`);
          
          // 存儲成本結果
          setCostResults(prev => ({
            ...prev,
            [record._id]: response.data
          }));
          
          successCount++;
          return response.data.additionalCost || 0;
        } catch (err) {
          console.error(`批次查詢成本失敗 (KDRUG=${kdrug}):`, err);
          failCount++;
          return null;
        }
      });

      // 等待所有查詢完成
      const results = await Promise.all(queries);
      
      // 計算總成本
      results.forEach(cost => {
        if (cost !== null) {
          totalCost += cost;
        }
      });

      // 設置批次查詢結果
      setBatchQueryResult({
        totalCost,
        successCount,
        failCount
      });
    } catch (err) {
      console.error('批次查詢成本失敗:', err);
      setBatchQueryError('批次查詢成本失敗');
    } finally {
      setBatchQueryLoading(false);
    }
  };

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
    { id: 'PTT', label: 'PTT', align: 'left' as const },
    { id: 'costQuery', label: '成本查詢', align: 'center' as const },
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
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h5" sx={{
            color: '#64ffda',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(100, 255, 218, 0.3)'
          }}>
            CO02P 藥物
          </Typography>
          
          {/* 批次查詢成本按鈕 */}
          <Box>
            {batchQueryLoading ? (
              <CircularProgress size={24} sx={{ color: '#64ffda' }} />
            ) : batchQueryResult ? (
              <Tooltip title={`成功: ${batchQueryResult.successCount} | 失敗: ${batchQueryResult.failCount}`}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'rgba(46, 125, 50, 0.2)',
                  borderRadius: 1,
                  p: '4px 8px',
                  border: '1px solid rgba(46, 125, 50, 0.5)'
                }}>
                  <Typography variant="body2" sx={{
                    color: '#64ffda',
                    fontWeight: 'bold',
                    mr: 1
                  }}>
                    總成本: {batchQueryResult.totalCost.toFixed(2)}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={queryAllCosts}
                    sx={{
                      minWidth: '25px',
                      fontSize: '0.75rem',
                      padding: '1px 4px',
                      color: '#64ffda',
                      borderColor: '#64ffda',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 255, 218, 0.1)',
                        borderColor: '#64ffda',
                      }
                    }}
                  >
                    重新查詢
                  </Button>
                </Box>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                onClick={queryAllCosts}
                sx={{
                  bgcolor: 'rgba(46, 125, 50, 0.8)',
                  color: '#e6f1ff',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'rgba(46, 125, 50, 1)',
                  },
                  boxShadow: '0 0 10px rgba(46, 125, 50, 0.5)',
                  textTransform: 'none',
                  fontSize: '0.85rem'
                }}
              >
                批次查詢成本
              </Button>
            )}
          </Box>
        </Box>
        
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
                        } else if (column.id === 'PTT') {
                          // 計算 PTT 的值（PTQTY*PPR，若小於 0 則顯示 0）
                          const ptqty = parseFloat(record.data.PTQTY) || 0;
                          const ppr = parseFloat(record.data.PPR) || 0;
                          const ptt = ptqty * ppr;
                          const displayValue = ptt < 0 ? 0 : ptt;
                          
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
                              {displayValue}
                            </TableCell>
                          );
                        } else if (column.id === 'costQuery') {
                          // 查詢成本按鈕
                          const recordId = record._id;
                          const dnoElement = <CO09DFieldsForCO02P kdrug={record.data.KDRUG || ''} field="DNO" />;
                          const ptqty = parseFloat(record.data.PTQTY) || 0;
                          
                          // 檢查是否已經查詢過成本
                          const hasCostResult = costResults[recordId];
                          const isLoading = loadingCost[recordId];
                          const errorMessage = costErrors[recordId];
                          
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
                              {hasCostResult ? (
                                <Tooltip title={`產品名稱: ${costResults[recordId].productName || '未知'}`}>
                                  <Box sx={{
                                    color: '#4caf50',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                  }}>
                                    <Typography variant="body2" sx={{ color: '#64ffda' }}>
                                      {costResults[recordId].additionalCost?.toFixed(2) || '未知'}
                                    </Typography>
                                    <Button
                                      size="small"
                                      variant="text"
                                      onClick={() => {
                                        // 重新查詢
                                        queryCost(recordId, dnoElement.props.kdrug, ptqty);
                                      }}
                                      sx={{
                                        minWidth: '25px',
                                        fontSize: '0.7rem',
                                        padding: '1px 4px',
                                        color: '#64ffda',
                                        '&:hover': {
                                          backgroundColor: 'rgba(100, 255, 218, 0.1)',
                                        }
                                      }}
                                    >
                                      重新查詢
                                    </Button>
                                  </Box>
                                </Tooltip>
                              ) : isLoading ? (
                                <CircularProgress size={20} sx={{ color: '#64ffda' }} />
                              ) : errorMessage ? (
                                <Tooltip title={errorMessage}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      // 重試
                                      queryCost(recordId, dnoElement.props.kdrug, ptqty);
                                    }}
                                    sx={{
                                      minWidth: '25px',
                                      fontSize: '0.75rem',
                                      padding: '1px 4px',
                                      color: '#ff6b6b',
                                      borderColor: '#ff6b6b',
                                      '&:hover': {
                                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                        borderColor: '#ff6b6b',
                                      }
                                    }}
                                  >
                                    重試
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    // 查詢成本
                                    queryCost(recordId, dnoElement.props.kdrug, ptqty);
                                  }}
                                  sx={{
                                    minWidth: '25px',
                                    fontSize: '0.75rem',
                                    padding: '1px 4px',
                                    color: '#64ffda',
                                    borderColor: '#64ffda',
                                    '&:hover': {
                                      backgroundColor: 'rgba(100, 255, 218, 0.1)',
                                      borderColor: '#64ffda',
                                    }
                                  }}
                                >
                                  查詢成本
                                </Button>
                              )}
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
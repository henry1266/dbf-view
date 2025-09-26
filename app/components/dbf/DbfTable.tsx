import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { fetchMatchingCO02PRecords } from '../../services/api';
import type { Column, DbfRecord, DbfRecordsResponse } from '../../types/dbf.types';

interface DbfTableProps {
  data: DbfRecordsResponse | null;
  columns: Column[];
  fileName: string;
  orderBy: string;
  order: 'asc' | 'desc';
  onRequestSort: (property: string) => void;
}

/**
 * DBF 表格元件
 * 顯示 DBF 記錄的表格
 */
function DbfTable({
  data,
  columns,
  fileName,
  orderBy,
  order,
  onRequestSort
}: DbfTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matchingCO02PRecords, setMatchingCO02PRecords] = useState<DbfRecord[]>([]);
  const [loadingCO02PRecords, setLoadingCO02PRecords] = useState(false);
  const [lcsFilter, setLcsFilter] = useState<string>(
    searchParams.get('field') === 'LCS' ? searchParams.get('search') || '' : ''
  );

  /**
   * 處理排序請求
   */
  const handleRequestSort = (property: string) => {
    onRequestSort(property);
  };

  /**
   * 檢查記錄是否符合小兒條件（A99=65或70）
   */
  const isPediatricMedication = (record: DbfRecord): boolean => {
    if (!record || !record.data) return false;
    const a99Value = record.data['A99'];
    return a99Value === '65' || a99Value === '70' || a99Value === 65 || a99Value === 70;
  };

  /**
   * 檢查數值是否大於1
   */
  const isGreaterThanOne = (value: any): boolean => {
    if (!value) return false;
    return (typeof value === 'string' && parseInt(value, 10) > 1) ||
           (typeof value === 'number' && value > 1);
  };

  /**
   * 獲取與CO03L記錄相關的CO02P記錄
   */
  const fetchCO02PRecords = async (record: DbfRecord) => {
    if (!record || !record.data || fileName.toUpperCase() !== 'CO03L.DBF') return;

    const kcstmr = record.data.KCSTMR;
    const date = record.data.DATE;
    const time = record.data.TIME;

    if (!kcstmr || !date || !time) {
      console.error('缺少必要的配對欄位：KCSTMR、DATE 或 TIME');
      return;
    }

    try {
      setLoadingCO02PRecords(true);
      const records = await fetchMatchingCO02PRecords(kcstmr, date, time);
      setMatchingCO02PRecords(records);
      return records;
    } catch (err) {
      console.error('獲取配對記錄失敗:', err);
      return [];
    } finally {
      setLoadingCO02PRecords(false);
    }
  };

  /**
   * 處理列印按鈕點擊事件
   */
  const handlePrint = async (record: DbfRecord) => {
    try {
      const lname = record.data['LNAME'] || '';
      
      // 獲取與CO03L記錄相關的CO02P記錄
      const co02pRecords = await fetchCO02PRecords(record);
      
      if (!co02pRecords || co02pRecords.length === 0) {
        console.log('沒有可列印的記錄');
        return;
      }
      
      // 過濾出PQTY > 1的記錄
      const filteredRecords = co02pRecords.filter((record: DbfRecord) => isGreaterThanOne(record.data['PQTY']));
      
      if (filteredRecords.length === 0) {
        console.log('沒有PQTY > 1的記錄');
        return;
      }
      
      // 顯示正在處理的提示
      console.log(`開始批次列印 ${filteredRecords.length} 個項目`);
      
      // 依序發送API請求
      for (const record of filteredRecords) {
        try {
          const pqty = record.data['PQTY'];
          const pfq = record.data['PFQ'];
          
          // 發送API請求
          const response = await axios.post('http://192.168.68.56:6001/generate-and-print-pdf', {
            value1: pqty,
            value2: lname,
            value3: pfq
          });
          
          console.log(`列印成功 KDRUG: ${record.data['KDRUG']}, PQTY: ${pqty}, PFQ: ${pfq}`);
        } catch (error) {
          console.error(`列印失敗 KDRUG: ${record.data['KDRUG']}:`, error);
        }
      }
      
      console.log('批次列印完成');
    } catch (error) {
      console.error('列印失敗:', error);
    }
  };

  return (
    <Paper sx={{
      width: '100%',
      overflow: 'hidden',
      bgcolor: 'rgba(10, 25, 47, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 255, 218, 0.1)',
    }}>
      <TableContainer sx={{
        maxHeight: 'calc(85vh - 250px)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '0px',
          background: 'transparent'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        <Table
          stickyHeader
          aria-label="數據表格"
          size="small"
          sx={{ tableLayout: 'auto' }} // 改為 auto，讓列寬可以根據內容自動調整
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    bgcolor: 'rgba(10, 25, 47, 0.9)',
                    color: 'rgba(230, 241, 255, 0.8);',
                    borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
                    // 調整表頭字體
                    fontSize: '1rem',
                    padding: '11px',
                  }}
                >
                  {column.id === 'LCS' && data ? (
                    <Select
                      value={lcsFilter}
                      onChange={(e) => {
                        const value = e.target.value as string;
                        setLcsFilter(value);
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('page', '1');
                        if (value) {
                          newParams.set('field', 'LCS');
                          newParams.set('search', value);
                        } else {
                          newParams.delete('field');
                          newParams.delete('search');
                        }
                        setSearchParams(newParams);
                      }}
                      displayEmpty
                      size="small"
                      sx={{ color: '#e6f1ff', minWidth: 80 }}
                    >
                      <MenuItem value="">所有</MenuItem>
                      {[...new Set(data.records.map((r) => r.data.LCS || ''))]
                        .filter((v) => v)
                        .map((v) => (
                          <MenuItem key={v} value={v}>
                            {v}
                          </MenuItem>
                        ))}
                    </Select>
                  ) : column.id !== 'actions' ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                      sx={{
                        color: '#e6f1ff !important',
                        '&.Mui-active': {
                          color: '#64ffda !important',
                        },
                        '& .MuiTableSortLabel-icon': {
                          color: 'inherit !important',
                        },
                      }}
                    >
                      {column.label}
                      {column.id === 'PDATE' && (
                        <span style={{ marginLeft: '4px', fontSize: '0.8rem', color: '#64ffda' }}>
                          (民國年)
                        </span>
                      )}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(data?.records || []).map((record) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={record._id}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(100, 255, 218, 0.05) !important',
                    },
                    '&:nth-of-type(odd)': {
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {columns.map((column) => {
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
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '15px',
                            padding: '8px 16px'
                          }}
                        >
                          <Link
                            to={`/dbf/${fileName}/${record._recordNo}`}
                            style={{
                              color: '#64ffda',
                              textDecoration: 'none',
                            }}
                          >
                            詳情
                          </Link>
                          
                          {/* 列印按鈕 - 僅在CO03L.DBF且A99=65或70時顯示 */}
                          {fileName.toUpperCase() === 'CO03L.DBF' && isPediatricMedication(record) && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handlePrint(record)}
                              sx={{
                                minWidth: '25px',
                                fontSize: '0.75rem',
                                padding: '1px 4px',
                                color: '#ff9800',
                                borderColor: '#ff9800',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                  borderColor: '#ff9800',
                                }
                              }}
                            >
                              印
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
                          borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                          // 調整字體大小和行高
                          fontSize: '1rem',
                          padding: '12px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {column.format ? column.format(value, record) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default DbfTable;
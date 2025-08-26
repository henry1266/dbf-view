import React from 'react';
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
  Button
} from '@mui/material';
import axios from 'axios';
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
  const [searchParams] = useSearchParams();

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
   * 處理列印按鈕點擊事件
   */
  const handlePrint = async (record: DbfRecord) => {
    try {
      const lname = record.data['LNAME'] || '';
      const pqty = 1; // 預設值
      const pfq = 1;  // 預設值
      
      // 發送API請求
      const response = await axios.post('http://192.168.68.56:6001/generate-and-print-pdf', {
        value1: pqty,
        value2: lname,
        value3: pfq
      });
      
      console.log('列印成功:', response.data);
      // 可以添加成功提示
    } catch (error) {
      console.error('列印失敗:', error);
      // 可以添加錯誤提示
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
                  {column.id !== 'actions' ? (
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
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TablePagination } from '@mui/material';
import type { FC } from 'react';

interface DbfPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number, newPageSize?: number) => void;
}

/**
 * DBF 分頁元件
 * 處理表格的分頁控制
 */
function DbfPagination({ 
  total, 
  page, 
  pageSize, 
  onPageChange 
}: DbfPaginationProps) {
  /**
   * 處理頁碼變更
   */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage + 1);
  };

  /**
   * 處理每頁顯示數量變更
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onPageChange(1, parseInt(event.target.value, 10));
  };

  return (
    <TablePagination
      rowsPerPageOptions={[10, 20, 50, 100]}
      component="div"
      count={total}
      rowsPerPage={pageSize}
      page={page - 1}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
      labelRowsPerPage="每頁筆數:"
      sx={{
        color: '#e6f1ff',
        '.MuiTablePagination-select': {
          color: '#e6f1ff',
        },
        '.MuiTablePagination-selectIcon': {
          color: '#e6f1ff',
        },
        '.MuiTablePagination-actions': {
          color: '#64ffda',
        },
      }}
    />
  );
}

export default DbfPagination;
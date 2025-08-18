import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecords } from '../services/api';
import { TextField, Select, MenuItem, Button, Box, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, Typography } from '@mui/material';

// 只引入 TechBackground 組件
import TechBackground from '../components/TechBackground';

interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
}

interface DbfRecordsResponse {
  fileName: string;
  records: DbfRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    pageSize: number;
  };
}

// 定義列的接口
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

// 計算表格的列定義
function getColumns(priorityFields: string[], availableFields: string[], fileName: string): Column[] {
  // 基本列定義
  const baseColumns: Column[] = [
    {
      id: 'recordNo',
      label: '記錄編號',
      minWidth: 100,
      align: 'left'
    }
  ];
  
  // 優先顯示欄位
  const priorityColumns = priorityFields.map(field => ({
    id: field,
    label: field,
    minWidth: 150,
    align: 'left' as const
  }));
  
  // 其他欄位
  const otherColumns = availableFields
    .filter(field => !priorityFields.includes(field))
    .map(field => ({
      id: field,
      label: field,
      minWidth: 150,
      align: 'left' as const
    }));
  
  // 操作列
  const actionColumn = {
    id: 'actions',
    label: '操作',
    minWidth: 100,
    align: 'center' as const
  };
  
  return [...baseColumns, ...priorityColumns, ...otherColumns, actionColumn];
}

export default function DbfFile() {
  const params = useParams<{ fileName: string }>();
  const fileName = params.fileName ? decodeURIComponent(params.fileName) : '';
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search') || '';
  const field = searchParams.get('field') || '';
  // 默認按PDATE降序排序（最新優先）
  const sortField = searchParams.get('sortField') || 'PDATE';
  const sortDirection = searchParams.get('sortDirection') || 'desc';

  const [data, setData] = useState<DbfRecordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(search);
  const [searchField, setSearchField] = useState(field);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  
  // 記錄是否正在加載數據
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 設置優先顯示欄位
  const getPriorityFields = (fileName: string) => {
    if (fileName.toUpperCase() === 'CO02P.DBF') {
      return ['KCSTMR', 'PDATE', 'PTIME', 'PLM', 'PRMK', 'KDRUG', 'PTQTY'];
    } else if (fileName.toUpperCase() === 'CO03L.DBF') {
      return ['KCSTMR', 'LNAME', 'DATE', 'TIME', 'LPID', 'LCS', 'DAYQTY', 'LDRU', 'LLDCN', 'LLDTT', 'A2', 'A99', 'TOT'];
    }
    return [];
  };

  const priorityFields = fileName ? getPriorityFields(fileName) : [];
  
  // 在組件頂層計算列定義，確保 hooks 調用一致性
  const columns = React.useMemo(
    () => getColumns(priorityFields, availableFields, fileName),
    [priorityFields, availableFields, fileName]
  );

  // 加載數據的函數
  const loadData = async (): Promise<void> => {
    if (!fileName) return Promise.resolve();

    try {
      setLoading(true);
      
      // 使用 URL 中的排序參數，確保有默認值
      const currentSortField = sortField || 'PDATE';
      const currentSortDirection = sortDirection || 'desc';
      
      // 詳細調試信息
      console.log('請求參數 (詳細):', {
        fileName,
        page,
        pageSize,
        search,
        field,
        sortField: currentSortField,
        sortDirection: currentSortDirection,
        orderBy,
        order
      });

      console.log('使用排序參數:', {
        sortField: currentSortField,
        sortDirection: currentSortDirection
      });

      const result = await fetchDbfRecords(
        fileName,
        page,
        pageSize,
        search,
        field,
        currentSortField,
        currentSortDirection
      );
      
      // 詳細調試信息
      console.log('返回結果 (詳細):', {
        pagination: result.pagination,
        recordCount: result.records.length,
        firstRecord: result.records[0],
        sortApplied: {
          field: currentSortField,
          direction: currentSortDirection
        }
      });
      
      setData(result);
      
      // 從第一筆記錄中提取可用的欄位名稱
      if (result.records.length > 0 && result.records[0].data) {
        setAvailableFields(Object.keys(result.records[0].data));
      }

      setError(null);
      return Promise.resolve();
    } catch (err) {
      console.error(`Failed to fetch ${fileName} records:`, err);
      setError(`無法載入 ${fileName} 的記錄。請稍後再試。`);
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  // 使用 ref 來防止無限循環
  const initialSortApplied = React.useRef(false);
  
  // 初始化排序參數 - 只在組件首次加載時執行一次
  useEffect(() => {
    // 如果已經應用過初始排序，則不再執行
    if (initialSortApplied.current) return;
    
    // 標記為已應用初始排序
    initialSortApplied.current = true;
    
    // 強制設置為PDATE降序排序，不管URL中是否已有排序參數
    console.log('強制設置排序參數: PDATE 降序');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortField', 'PDATE');
    newParams.set('sortDirection', 'desc');
    
    // 直接設置內部狀態
    setOrder('desc');
    setOrderBy('PDATE');
    
    // 更新URL參數
    setSearchParams(newParams);
    
    console.log('排序參數已設置:', {
      sortField: 'PDATE',
      sortDirection: 'desc',
      order: 'desc',
      orderBy: 'PDATE'
    });
    
    // 強制加載數據，確保使用正確的排序參數
    loadData();
  }, []); // 空依賴數組，確保只在組件首次加載時執行一次

  // 加載數據
  useEffect(() => {
    loadData();
  }, [fileName, page, pageSize, search, field, sortField, sortDirection]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    newParams.set('search', searchValue);
    if (searchField) {
      newParams.set('field', searchField);
    } else {
      newParams.delete('field');
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    if (newPageSize) {
      newParams.set('pageSize', newPageSize.toString());
    }
    setSearchParams(newParams);
  };

  // 這些函數已經不再需要，因為我們完全使用後端排序和分頁

  // 排序相關狀態 - 默認按PDATE降序排序
  const [order, setOrder] = useState<'asc' | 'desc'>(sortDirection as 'asc' | 'desc' || 'desc');
  const [orderBy, setOrderBy] = useState<string>(sortField || 'PDATE');
  
  // 處理排序變化
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    
    // 先更新內部狀態
    setOrder(newOrder);
    setOrderBy(property);
    
    // 詳細調試信息
    console.log('排序變化 - 更新內部狀態:', {
      property,
      newOrder,
      previousOrderBy: orderBy,
      previousOrder: order
    });
    
    const newParams = new URLSearchParams(searchParams);
    
    // 清除頁碼，回到第一頁
    newParams.set('page', '1');
    newParams.set('sortField', property);
    newParams.set('sortDirection', newOrder);
    
    // 調試信息
    console.log('排序變化 - 更新URL參數:', {
      sortField: property,
      sortDirection: newOrder,
      page: '1'
    });
    
    // 更新 URL 參數，觸發 useEffect 重新加載數據
    setSearchParams(newParams);
    
    // 直接調用 loadData 確保數據立即重新加載
    console.log('排序變化 - 直接調用 loadData');
    setTimeout(() => loadData(), 0);
  };
  
  // 處理按日期排序按鈕點擊 - 總是按照日期降序排序（最新優先）
  const handleSortByDate = () => {
    // 直接設置為 PDATE 降序排序
    setOrder('desc');
    setOrderBy('PDATE');
    
    // 詳細調試信息
    console.log('按日期排序 - 更新內部狀態:', {
      property: 'PDATE',
      order: 'desc',
      previousOrderBy: orderBy,
      previousOrder: order
    });
    
    const newParams = new URLSearchParams(searchParams);
    
    // 清除頁碼，回到第一頁
    newParams.set('page', '1');
    newParams.set('sortField', 'PDATE');
    newParams.set('sortDirection', 'desc');
    
    // 調試信息
    console.log('按日期排序 - 更新URL參數:', {
      sortField: 'PDATE',
      sortDirection: 'desc',
      page: '1'
    });
    
    // 更新 URL 參數，觸發 useEffect 重新加載數據
    setSearchParams(newParams);
    
    // 直接調用 loadData 確保數據立即重新加載
    console.log('按日期排序 - 直接調用 loadData');
    setTimeout(() => loadData(), 0);
  };

  return (
    <Layout title="">
      <TechBackground>
        <Box sx={{ width: '98%', mx: 'auto', my: '1%'  }}>
          <Typography variant="h5" sx={{ mb: '1%', color: '#64ffda', fontWeight: 'bold' }}>
            {fileName} 數據瀏覽
          </Typography>
          
          <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', p: '1%', borderRadius: 2, backdropFilter: 'blur(10px)' }}>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </Box>
              ) : error ? (
                <Box sx={{ bgcolor: 'rgba(255, 0, 0, 0.1)', p: 1, borderRadius: 1, color: '#ff6b6b' }}>
                  <Typography variant="body1">{error}</Typography>
                </Box>
              ) : (
                <>
                  {/* 搜尋表單 */}
                  <Box sx={{ mb: '2%', p: '1%', bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                      <TextField
                        id="searchValue"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="輸入搜尋值"
                        size="small"
                        fullWidth
                        sx={{
                          flexGrow: 1,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(100, 255, 218, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(100, 255, 218, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#64ffda',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#e6f1ff',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#e6f1ff',
                          },
                        }}
                      />
                      <FormControl sx={{ minWidth: 180 }} size="small">
                        <InputLabel id="search-field-label" sx={{ color: '#e6f1ff' }}>欄位</InputLabel>
                        <Select
                          labelId="search-field-label"
                          id="searchField"
                          value={searchField}
                          onChange={(e) => setSearchField(e.target.value as string)}
                          label="欄位"
                          sx={{
                            color: '#e6f1ff',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(100, 255, 218, 0.3)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(100, 255, 218, 0.5)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#64ffda',
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#e6f1ff',
                            },
                          }}
                        >
                          <MenuItem value="">所有欄位</MenuItem>
                          {availableFields.map((field) => (
                            <MenuItem key={field} value={field}>
                              {field}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: 'rgba(100, 255, 218, 0.1)',
                          color: '#64ffda',
                          border: '1px solid rgba(100, 255, 218, 0.3)',
                          '&:hover': {
                            bgcolor: 'rgba(100, 255, 218, 0.2)',
                          },
                        }}
                      >
                        搜尋
                      </Button>
                    </form>
                  </Box>

                  {/* 數據表格 */}
                  {data && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1%' }}>
                        <Typography variant="body2" sx={{ color: '#e6f1ff' }}>
                          共 {data.pagination.total} 筆記錄 | 第 {data.pagination.currentPage} / {data.pagination.totalPages} 頁
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleSortByDate}
                          sx={{
                            color: '#64ffda',
                            borderColor: 'rgba(100, 255, 218, 0.3)',
                            '&:hover': {
                              borderColor: '#64ffda',
                              bgcolor: 'rgba(100, 255, 218, 0.1)',
                            },
                          }}
                        >
                          依日期排序 (最新優先)
                        </Button>
                      </Box>
                      
                      <Paper sx={{
                        width: '100%',
                        overflow: 'hidden',
                        bgcolor: 'rgba(10, 25, 47, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(100, 255, 218, 0.1)',
                      }}>
                        <TableContainer sx={{
                          maxHeight: 'calc(80vh - 240px)',
                          overflowY: 'auto',
                          '&::-webkit-scrollbar': {
                            width: '0px',
                            background: 'transparent'
                          },
                          msOverflowStyle: 'none',
                          scrollbarWidth: 'none'
                        }}>
                          <Table stickyHeader aria-label="數據表格" size="small">
                            <TableHead>
                              <TableRow>
                                {columns.map((column) => (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{
                                      bgcolor: 'rgba(10, 25, 47, 0.9)',
                                      color: '#e6f1ff',
                                      borderBottom: '1px solid rgba(100, 255, 218, 0.2)',
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
                                          <span style={{ marginLeft: '4px', fontSize: '0.7rem', color: '#64ffda' }}>
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
                                          }}
                                        >
                                          {column.format ? column.format(value) : value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[10, 20, 50, 100]}
                          component="div"
                          count={data?.pagination.total || 0}
                          rowsPerPage={pageSize}
                          page={page - 1}
                          onPageChange={(event, newPage) => handlePageChange(newPage + 1)}
                          onRowsPerPageChange={(event) => {
                            handlePageChange(1, parseInt(event.target.value, 10));
                          }}
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
                      </Paper>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </TechBackground>
      </Layout>
  );
}

export function meta({ params }: { params: { fileName: string } }) {
  return [
    { title: `${params.fileName} - DBF 檔案瀏覽器` },
    { name: "description", content: `瀏覽 ${params.fileName} 的記錄` },
  ];
}
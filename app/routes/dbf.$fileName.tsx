import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecords } from '../services/api';
import { Button, Box, Typography, Paper } from '@mui/material';
import TechBackground from '../components/TechBackground';
import TechBreadcrumb from '../components/TechBreadcrumb';

// 引入型別定義
import type { DbfRecordsResponse } from '../types/dbf.types';

// 引入工具函數
import { getColumns, getPriorityFields } from '../utils/dbf-table.utils';

// 引入元件
import DbfSearchForm from '../components/dbf/DbfSearchForm';
import DbfTable from '../components/dbf/DbfTable';
import DbfPagination from '../components/dbf/DbfPagination';

/**
 * DBF 檔案瀏覽元件
 * 顯示 DBF 檔案的記錄列表
 */
export default function DbfFile() {
  // 路由參數
  const params = useParams<{ fileName: string }>();
  const fileName = params.fileName ? decodeURIComponent(params.fileName) : '';
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL 參數
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search') || '';
  const field = searchParams.get('field') || '';
  // 默認按PDATE降序排序（最新優先）
  const sortField = searchParams.get('sortField') || 'PDATE';
  const sortDirection = searchParams.get('sortDirection') || 'desc';

  // 狀態
  const [data, setData] = useState<DbfRecordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // 排序相關狀態
  const [order, setOrder] = useState<'asc' | 'desc'>(sortDirection as 'asc' | 'desc' || 'desc');
  const [orderBy, setOrderBy] = useState<string>(sortField || 'PDATE');

  // 設置優先顯示欄位
  const priorityFields = fileName ? getPriorityFields(fileName) : [];
  
  // 計算列定義
  const columns = React.useMemo(
    () => getColumns(priorityFields, availableFields, fileName),
    [priorityFields, availableFields, fileName]
  );

  // 使用 ref 來防止無限循環
  const initialSortApplied = React.useRef(false);
  
  // 初始化排序參數 - 只在組件首次加載時執行一次
  useEffect(() => {
    // 如果已經應用過初始排序，則不再執行
    if (initialSortApplied.current) return;
    
    // 標記為已應用初始排序
    initialSortApplied.current = true;
    
    // 檢查URL中是否已有排序參數
    const urlSortField = searchParams.get('sortField');
    const urlSortDirection = searchParams.get('sortDirection');
    
    // 只有在URL中沒有排序參數時，才設置默認排序
    if (!urlSortField || !urlSortDirection) {
      console.log('URL中沒有排序參數，設置默認排序');
      
      // 根據檔案名稱設置不同的默認排序
      let defaultSortField = 'PDATE';
      let defaultSortDirection = 'desc';
      
      // 根據不同檔案設置不同的默認排序
      if (fileName.toUpperCase() === 'CO03L.DBF') {
        defaultSortField = '_recordNo';
        console.log('檔案是CO03L.DBF，默認按記錄編號排序');
      } else if (fileName.toUpperCase() === 'CO02P.DBF') {
        defaultSortField = '_recordNo';
        console.log('檔案是CO02P.DBF，默認按記錄編號從大到小排序');
      } else if (fileName.toUpperCase() === 'CO01M.DBF') {
        defaultSortField = 'KCSTMR';
        defaultSortDirection = 'asc';
        console.log('檔案是CO01M.DBF，默認按KCSTMR升序排序');
      } else if (fileName.toUpperCase() === 'CO09D.DBF') {
        defaultSortField = 'KDRUG';
        defaultSortDirection = 'asc';
        console.log('檔案是CO09D.DBF，默認按KDRUG升序排序');
      }
      
      const newParams = new URLSearchParams(searchParams);
      newParams.set('sortField', defaultSortField);
      newParams.set('sortDirection', defaultSortDirection);
      
      // 直接設置內部狀態
      setOrder(defaultSortDirection as 'asc' | 'desc');
      setOrderBy(defaultSortField);
      
      // 更新URL參數
      setSearchParams(newParams);
      
      console.log('排序參數已設置:', {
        sortField: defaultSortField,
        sortDirection: defaultSortDirection,
        order: defaultSortDirection,
        orderBy: defaultSortField
      });
      
      // 強制加載數據，確保使用正確的排序參數
      loadData();
    } else {
      console.log('使用URL中的排序參數:', {
        sortField: urlSortField,
        sortDirection: urlSortDirection
      });
      
      // 直接設置內部狀態，與URL參數保持一致
      setOrder(urlSortDirection as 'asc' | 'desc');
      setOrderBy(urlSortField);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依賴數組，確保只在組件首次加載時執行一次

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

  // 加載數據
  useEffect(() => {
    loadData();
  }, [fileName, page, pageSize, search, field, sortField, sortDirection]);

  // 處理頁碼變更
  const handlePageChange = (newPage: number, newPageSize?: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    if (newPageSize) {
      newParams.set('pageSize', newPageSize.toString());
    }
    setSearchParams(newParams);
  };
  
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
        <TechBreadcrumb
          items={[
            { label: '首頁', path: '/', icon: '🏠' },
            { label: '檔案列表', path: '/dbf-files', icon: '📁' },
            { label: fileName, icon: '📄' }
          ]}
        />
        <Box sx={{ width: '98%', mx: 'auto', my: '1%'  }}>
          
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
                {/* 搜尋表單和統計按鈕 */}
                <Box sx={{ mb: '2%', p: '1%', bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    {fileName.toUpperCase() === 'CO03L.DBF' && (
                      <Button
                        component={Link}
                        to={`/dbf-stats/${fileName}`}
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
                        LDRU 統計分析
                      </Button>
                    )}
                  </Box>
                  
                  {/* 搜尋表單元件 */}
                  <DbfSearchForm 
                    availableFields={availableFields}
                    initialSearch={search}
                    initialField={field}
                  />
                </Box>

                {/* 數據表格 */}
                {data && (
                  <Box>      
                    {/* 表格元件 */}
                    <DbfTable 
                      data={data}
                      columns={columns}
                      fileName={fileName}
                      orderBy={orderBy}
                      order={order}
                      onRequestSort={handleRequestSort}
                    />
                    
                    {/* 分頁元件 */}
                    <DbfPagination 
                      total={data?.pagination.total || 0}
                      page={page}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
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
    { title: `${params.fileName} - DBF 處方瀏覽器` },
    { name: "description", content: `瀏覽 ${params.fileName} 的記錄` },
  ];
}
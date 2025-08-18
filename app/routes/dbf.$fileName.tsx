import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecords } from '../services/api';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { TextField, Select, MenuItem, Button, Box, InputLabel, FormControl } from '@mui/material';

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

// 計算 DataGrid 的列定義
function getColumns(priorityFields: string[], availableFields: string[], fileName: string): GridColDef[] {
  // 基本列定義
  const baseColumns: GridColDef[] = [
    {
      field: 'recordNo',
      headerName: '記錄編號',
      width: 100,
      filterable: true
    }
  ];
  
  // 優先顯示欄位
  const priorityColumns = priorityFields.map(field => ({
    field,
    headerName: field,
    width: 150,
    filterable: true
  }));
  
  // 其他欄位
  const otherColumns = availableFields
    .filter(field => !priorityFields.includes(field))
    .map(field => ({
      field,
      headerName: field,
      width: 150,
      filterable: true
    }));
  
  // 操作列
  const actionColumn = {
    field: 'actions',
    headerName: '操作',
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params: any) => (
      <Link
        to={`/dbf/${fileName}/${params.value}`}
        className="text-blue-600 hover:text-blue-900"
      >
        詳情
      </Link>
    )
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

  const [data, setData] = useState<DbfRecordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(search);
  const [searchField, setSearchField] = useState(field);
  const [availableFields, setAvailableFields] = useState<string[]>([]);

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

  useEffect(() => {
    const loadDbfRecords = async () => {
      if (!fileName) return;

      try {
        setLoading(true);
        const result = await fetchDbfRecords(fileName, page, pageSize, search, field);
        setData(result);

        // 從第一筆記錄中提取可用的欄位名稱
        if (result.records.length > 0 && result.records[0].data) {
          setAvailableFields(Object.keys(result.records[0].data));
        }

        setError(null);
      } catch (err) {
        console.error(`Failed to fetch ${fileName} records:`, err);
        setError(`無法載入 ${fileName} 的記錄。請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    loadDbfRecords();
  }, [fileName, page, pageSize, search, field]);


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

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <Layout title={`${fileName || 'DBF 檔案'} 瀏覽`}>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <>
          {/* 搜尋表單 */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <TextField
                id="searchValue"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="輸入搜尋值"
                size="small"
                fullWidth
                sx={{ flexGrow: 1 }}
              />
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel id="search-field-label">欄位</InputLabel>
                <Select
                  labelId="search-field-label"
                  id="searchField"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value as string)}
                  label="欄位"
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
                color="primary"
              >
                搜尋
              </Button>
            </form>
          </div>

          {/* 使用 DataGrid 顯示記錄 */}
          {data && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    記錄列表 ({data.pagination.total} 筆記錄)
                  </h2>
                </div>
              </div>
              
              <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                  rows={data.records.map(record => ({
                    id: record._id,
                    recordNo: record._recordNo,
                    ...record.data,
                    actions: record._recordNo
                  }))}
                  columns={getColumns(priorityFields, availableFields, fileName)}
                  pagination
                  paginationMode="server"
                  rowCount={data.pagination.total}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: data.pagination.pageSize,
                        page: data.pagination.currentPage - 1,
                      },
                    },
                  }}
                  pageSizeOptions={[10, 20, 50, 100]}
                  onPaginationModelChange={(model) => handlePageChange(model.page + 1)}
                  disableRowSelectionOnClick
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                  sx={{
                    '& .MuiDataGrid-cell': {
                      whiteSpace: 'normal',
                      lineHeight: 'normal',
                      padding: '8px',
                    },
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export function meta({ params }: { params: { fileName: string } }) {
  return [
    { title: `${params.fileName} - DBF 檔案瀏覽器` },
    { name: "description", content: `瀏覽 ${params.fileName} 的記錄` },
  ];
}
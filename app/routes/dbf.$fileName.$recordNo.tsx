import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecord, fetchMatchingCO02PRecords } from '../services/api';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
}

// 配對記錄顯示組件
interface MatchingCO02PRecordsProps {
  co03lRecord: DbfRecord;
}

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
    { id: 'actions', label: '操作', align: 'center' as const }
  ];

  return (
    <Box sx={{ mt: 4, mb: 4, bgcolor: 'rgba(255, 255, 255, 0.05)', p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton
          aria-label="展開配對記錄"
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ color: '#3b82f6', mr: 1 }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography variant="h6" sx={{ color: '#3b82f6' }}>
          配對的 CO02P 記錄
        </Typography>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </Box>
          ) : error ? (
            <Box sx={{ bgcolor: 'rgba(254, 226, 226, 0.5)', p: 2, borderRadius: 1, color: '#dc2626' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          ) : matchingRecords.length === 0 ? (
            <Typography variant="body1" sx={{ p: 2, color: '#6b7280' }}>
              沒有找到配對的 CO02P 記錄
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: '400px' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {co02pColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          bgcolor: '#f3f4f6',
                          fontWeight: 'bold'
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
                          bgcolor: '#f9fafb',
                        },
                        '&:nth-of-type(odd)': {
                          bgcolor: '#f3f4f6',
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
                            >
                              <Link
                                to={`/dbf/CO02P.DBF/${record._recordNo}`}
                                className="text-blue-600 hover:text-blue-900"
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

export default function DbfRecordDetail() {
  const params = useParams<{ fileName: string; recordNo: string }>();
  const fileName = params.fileName ? decodeURIComponent(params.fileName) : '';
  const recordNo = params.recordNo || '';
  const [record, setRecord] = useState<DbfRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 設置優先顯示欄位
  const getPriorityFields = (fileName: string) => {
    if (fileName.toUpperCase() === 'CO02P.DBF') {
      return ['KCSTMR', 'PDATE', 'PTIME', 'PLM', 'PRMK', 'KDRUG', 'PTQTY'];
    } else if (fileName.toUpperCase() === 'CO03L.DBF') {
      return ['KCSTMR', 'LNAME', 'DATE', 'TIME', 'LPID', 'LISRS' ,'LCS', 'DAYQTY', 'LDRU', 'LLDCN', 'LLDTT', 'A2', 'A99', 'TOT'];
    }
    return [];
  };

  const priorityFields = fileName ? getPriorityFields(fileName) : [];

  useEffect(() => {
    const loadDbfRecord = async () => {
      if (!fileName || !recordNo) return;

      try {
        setLoading(true);
        const result = await fetchDbfRecord(fileName, parseInt(recordNo));
        setRecord(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch ${fileName} record #${recordNo}:`, err);
        setError(`無法載入 ${fileName} 的記錄 #${recordNo}。請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    loadDbfRecord();
  }, [fileName, recordNo]);

  return (
    <Layout title={`${fileName || 'DBF 檔案'} 記錄 #${recordNo || ''}`}>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : record ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">
                記錄詳情
              </h2>
              <Link
                to={`/dbf/${encodeURIComponent(fileName)}`}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
              >
                返回列表
              </Link>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-500 mb-2">記錄編號</h3>
                <p className="text-gray-900">{record._recordNo}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-500 mb-2">檔案名稱</h3>
                <p className="text-gray-900">{record._file}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-500 mb-2">建立時間</h3>
                <p className="text-gray-900">{new Date(record._created).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-500 mb-2">更新時間</h3>
                <p className="text-gray-900">{new Date(record._updated).toLocaleString()}</p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-700 mb-3">記錄資料</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      欄位
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      值
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 優先顯示欄位 */}
                  {priorityFields.map((field) => (
                    <tr key={field} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {field}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.data[field] || ''}
                      </td>
                    </tr>
                  ))}
                  {/* 其他欄位 */}
                  {Object.entries(record.data)
                    .filter(([key]) => !priorityFields.includes(key))
                    .map(([key, value]) => (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {key}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value || ''}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* 特殊處理：如果是 co02p.DBF 記錄，提供 KCSTMR 和 KDRUG 的快速鏈接 */}
            {fileName?.toUpperCase() === 'CO02P.DBF' && record.data.KCSTMR && (
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to={`/kcstmr/${encodeURIComponent(record.data.KCSTMR)}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  查看 KCSTMR: {record.data.KCSTMR}
                </Link>
                {record.data.KDRUG && (
                  <Link
                    to={`/kdrug/${encodeURIComponent(record.data.KDRUG)}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    查看 KDRUG: {record.data.KDRUG}
                  </Link>
                )}
              </div>
            )}

            {/* 特殊處理：如果是 CO03L.DBF 記錄，提供 KCSTMR 的快速鏈接和配對資料 */}
            {fileName?.toUpperCase() === 'CO03L.DBF' && (
              <>
                {record.data.KCSTMR && (
                  <div className="mt-6">
                    <Link
                      to={`/kcstmr/${encodeURIComponent(record.data.KCSTMR)}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      查看 KCSTMR: {record.data.KCSTMR}
                    </Link>
                  </div>
                )}
                
                {/* 添加配對資料顯示區塊 */}
                <MatchingCO02PRecords co03lRecord={record} />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">找不到記錄！</strong>
          <span className="block sm:inline"> 找不到指定的記錄。</span>
        </div>
      )}
    </Layout>
  );
}

export function meta({ params }: { params: { fileName: string; recordNo: string } }) {
  return [
    { title: `${params.fileName} 記錄 #${params.recordNo} - DBF 檔案瀏覽器` },
    { name: "description", content: `查看 ${params.fileName} 的記錄 #${params.recordNo} 的詳細資訊` },
  ];
}
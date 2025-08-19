import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchKdrugRecords } from '../services/api';
import { Grid, Box } from '@mui/material';
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

interface KdrugResponse {
  kdrugValue: string;
  records: DbfRecord[];
  totalRecords: number;
  totalPTQTY: number;
  totalPTQTY_I: number;
  totalPTQTY_O: number;
  startDate: string;
  endDate: string;
  allDates: string[];
}

export default function KdrugQuery() {
  const { value } = useParams<{ value: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const [data, setData] = useState<KdrugResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ startDate, endDate });

  // 設置優先顯示欄位
  const priorityFields = ['KCSTMR', 'PDATE', 'PTIME', 'PLM', 'LDRU', 'KDRUG', 'DNO', 'DDESC', 'PTQTY'];

  useEffect(() => {
    const loadKdrugRecords = async () => {
      if (!value) return;

      try {
        setLoading(true);
        const result = await fetchKdrugRecords(value, startDate, endDate);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch KDRUG=${value} records:`, err);
        setError(`無法載入 KDRUG=${value} 的記錄。請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    loadKdrugRecords();
  }, [value, startDate, endDate]);

  const handleDateRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    if (dateRange.startDate) {
      newParams.set('startDate', dateRange.startDate);
    } else {
      newParams.delete('startDate');
    }
    
    if (dateRange.endDate) {
      newParams.set('endDate', dateRange.endDate);
    } else {
      newParams.delete('endDate');
    }
    
    setSearchParams(newParams);
  };

  return (
    <Layout title={`KDRUG: ${value || ''}`}>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : data ? (
        <TechBackground>
          {/* 日期範圍篩選表單 */}
          <Box sx={{
            bgcolor: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: '0 4px 30px rgba(64, 175, 255, 0.3)',
            border: '1px solid rgba(64, 175, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, #1976d2, #4791db)',
              boxShadow: '0 0 25px #1976d2'
            }
          }}>
            <Box sx={{
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              color: '#e6f1ff',
              fontSize: '1.2rem',
              mb: 2,
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(230, 241, 255, 0.5)'
            }}>
              日期範圍
            </Box>
            <form onSubmit={handleDateRangeSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 1, color: '#e6f1ff' }}>開始</Box>
                  <input
                    type="text"
                    id="startDate"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    style={{
                      width: '90%',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(0, 30, 60, 0.5)',
                      border: '1px solid rgba(64, 175, 255, 0.3)',
                      borderRadius: '4px',
                      color: '#e6f1ff',
                      outline: 'none'
                    }}
                    placeholder="YYYYMMDD"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 1, color: '#e6f1ff' }}>結束</Box>
                  <input
                    type="text"
                    id="endDate"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    style={{
                      width: '90%',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(0, 30, 60, 0.5)',
                      border: '1px solid rgba(64, 175, 255, 0.3)',
                      borderRadius: '4px',
                      color: '#e6f1ff',
                      outline: 'none'
                    }}
                    placeholder="YYYYMMDD"
                  />
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 'auto'
                }}>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      backgroundColor: 'rgba(64, 175, 255, 0.3)',
                      border: '1px solid rgba(64, 175, 255, 0.5)',
                      borderRadius: '4px',
                      color: '#e6f1ff',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 0 10px rgba(64, 175, 255, 0.2)'
                    }}
                  >
                    篩選
                  </button>
                </Box>
              </Box>
            </form>
          </Box>

          {/* 統計信息 - 水平排列 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{
              flex: 1,
              minWidth: '200px',
              bgcolor: 'rgba(17, 34, 64, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              p: 2,
              height: '100%',
              boxShadow: '0 4px 30px rgba(64, 175, 255, 0.3)',
              border: '1px solid rgba(64, 175, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 35px rgba(64, 175, 255, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'linear-gradient(90deg, #1976d2, #4791db)',
                boxShadow: '0 0 25px #1976d2'
              }
            }}>
              <Box sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                color: '#e6f1ff',
                fontSize: '0.9rem',
                mb: 1
              }}>
                總記錄數
              </Box>
              <Box sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                color: '#64ffda',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
              }}>
                {data.totalRecords}
              </Box>
            </Box>
            <Box sx={{
              flex: 1,
              minWidth: '200px',
              bgcolor: 'rgba(17, 34, 64, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              p: 2,
              height: '100%',
              boxShadow: '0 4px 30px rgba(100, 255, 218, 0.3)',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 35px rgba(100, 255, 218, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'linear-gradient(90deg, #4caf50, #81c784)',
                boxShadow: '0 0 25px #4caf50'
              }
            }}>
              <Box sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                color: '#e6f1ff',
                fontSize: '0.9rem',
                mb: 1
              }}>
                加總 PTQTY
              </Box>
              <Box sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                color: '#64ffda',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
              }}>
                {data.totalPTQTY.toFixed(1)}
              </Box>
            </Box>
            {/* 已調劑 */}
            <Box sx={{
              flex: 1,
              minWidth: '200px',
              bgcolor: 'rgba(17, 34, 64, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              p: 2,
              height: '100%',
              boxShadow: '0 4px 30px rgba(63, 81, 181, 0.3)',
              border: '1px solid rgba(63, 81, 181, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 35px rgba(63, 81, 181, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'linear-gradient(90deg, #3f51b5, #7986cb)',
                boxShadow: '0 0 25px #3f51b5'
              }
            }}>
              <Box sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                color: '#e6f1ff',
                fontSize: '0.9rem',
                mb: 1
              }}>
                LDRU=I 已調劑
              </Box>
              <Box sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                color: '#64ffda',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
              }}>
                {data.totalPTQTY_I.toFixed(1)}
              </Box>
            </Box>
            {/* 未調劑 */}
            <Box sx={{
              flex: 1,
              minWidth: '200px',
              bgcolor: 'rgba(17, 34, 64, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              p: 2,
              height: '100%',
              boxShadow: '0 4px 30px rgba(156, 39, 176, 0.3)',
              border: '1px solid rgba(156, 39, 176, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 35px rgba(176, 39, 123, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'linear-gradient(90deg, #b02767ff, #c868abff)',
                boxShadow: '0 0 25px #b02767ff'
              }
            }}>
              <Box sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                color: '#e6f1ff',
                fontSize: '0.9rem',
                mb: 1
              }}>
                LDRU=O 未調劑
              </Box>
              <Box sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                color: '#64ffda',
                textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
              }}>
                {data.totalPTQTY_O.toFixed(1)}
              </Box>
            </Box>
          </Box>

          {/* 記錄表格 */}
          <Box sx={{
            bgcolor: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 30px rgba(64, 175, 255, 0.3)',
            border: '1px solid rgba(64, 175, 255, 0.3)',
            position: 'relative',
          }}>
            <Box sx={{
              p: 2,
              borderBottom: '1px solid rgba(64, 175, 255, 0.3)',
              bgcolor: 'rgba(0, 30, 60, 0.3)',
            }}>
              <Box sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                color: '#e6f1ff',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textShadow: '0 0 5px rgba(230, 241, 255, 0.5)'
              }}>
                KDRUG={data.kdrugValue} 的記錄 ({data.records.length} 筆)
              </Box>
            </Box>
            <Box sx={{ overflow: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                color: '#e6f1ff'
              }}>
                <thead style={{ backgroundColor: 'rgba(0, 30, 60, 0.5)' }}>
                  <tr>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                    }}>
                      記錄編號
                    </th>
                    {/* 優先顯示欄位 */}
                    {priorityFields.map((field) => (
                      <th key={field} style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                      }}>
                        {field}
                      </th>
                    ))}
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                    }}>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.length === 0 ? (
                    <tr>
                      <td colSpan={priorityFields.length + 2} style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: 'rgba(230, 241, 255, 0.7)',
                        borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                      }}>
                        沒有找到記錄
                      </td>
                    </tr>
                  ) : (
                    data.records.map((record) => (
                      <tr key={record._id} style={{
                        transition: 'background-color 0.3s'
                      }} className="hover:bg-opacity-10 hover:bg-blue-400">
                        <td style={{
                          padding: '12px 16px',
                          whiteSpace: 'nowrap',
                          borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                        }}>
                          {record._recordNo}
                        </td>
                        {/* 優先顯示欄位 */}
                        {priorityFields.map((field) => (
                          <td key={field} style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            color: 'rgba(230, 241, 255, 0.8)',
                            borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                          }}>
                            {record.data[field] || ''}
                          </td>
                        ))}
                        <td style={{
                          padding: '12px 16px',
                          whiteSpace: 'nowrap',
                          borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                        }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Link
                              to={`/dbf/co02p.DBF/${record._recordNo}`}
                              style={{
                                color: '#64ffda',
                                textDecoration: 'none',
                                transition: 'all 0.3s'
                              }}
                              className="hover:text-teal-300 hover:shadow-glow"
                            >
                              詳情
                            </Link>
                            {record.data.KCSTMR && (
                              <Link
                                to={`/kcstmr/${record.data.KCSTMR}`}
                                style={{
                                  color: '#64ffda',
                                  textDecoration: 'none',
                                  transition: 'all 0.3s'
                                }}
                                className="hover:text-teal-300 hover:shadow-glow"
                              >
                                KCSTMR
                              </Link>
                            )}
                          </Box>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
        </TechBackground>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">找不到記錄！</strong>
          <span className="block sm:inline"> 找不到與 KDRUG={value} 相關的記錄。</span>
        </div>
      )}
    </Layout>
  );
}

export function meta({ params }: { params: { value: string } }) {
  return [
    { title: `KDRUG: ${params.value} - DBF 檔案瀏覽器` },
    { name: "description", content: `查看與 KDRUG=${params.value} 相關的所有記錄` },
  ];
}
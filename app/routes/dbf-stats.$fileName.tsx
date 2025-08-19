import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecords } from '../services/api';
import { Box, Button, Grid } from '@mui/material';
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

interface LdruStats {
  totalRecords: number;
  totalI: number;
  totalO: number;
  totalOther: number;
  byDate: Record<string, {
    total: number;
    I: number;
    O: number;
    other: number;
  }>;
}

export default function DbfStats() {
  const { fileName } = useParams<{ fileName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const [data, setData] = useState<DbfRecordsResponse | null>(null);
  const [stats, setStats] = useState<LdruStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ startDate, endDate });

  // 可重用的統計數值顯示組件
  const StatValue = ({ value }: { value: string | number }) => (
    <Box sx={{
      fontFamily: 'monospace',
      fontWeight: 'bold',
      fontSize: '1.8rem',
      color: '#64ffda',
      textShadow: '0 0 10px rgba(100, 255, 218, 0.5)'
    }}>
      {value}
    </Box>
  );

  // 創建科技風格的麵包屑導航
  const TechBreadcrumb = () => (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 3,
      position: 'relative',
      zIndex: 1
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(17, 34, 64, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        p: '4px 16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(64, 175, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(64, 175, 255, 0.1), transparent)',
          zIndex: -1
        }
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{
            color: '#e6f1ff',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s',
            '&:hover': {
              color: '#64ffda'
            }
          }}>
            <Box component="span" sx={{ mr: 1 }}>🏠</Box>
            <Box component="span">首頁</Box>
          </Box>
        </Link>
        
        <Box sx={{
          mx: 1,
          color: 'rgba(100, 255, 218, 0.7)',
          fontSize: '1.2rem',
          lineHeight: 1,
          transform: 'translateY(-1px)'
        }}>
          /
        </Box>
        
        <Link to="/dbf-files" style={{ textDecoration: 'none' }}>
          <Box sx={{
            color: '#e6f1ff',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s',
            '&:hover': {
              color: '#64ffda'
            }
          }}>
            <Box component="span" sx={{ mr: 1 }}>📁</Box>
            <Box component="span">檔案</Box>
          </Box>
        </Link>
        
        <Box sx={{
          mx: 1,
          color: 'rgba(100, 255, 218, 0.7)',
          fontSize: '1.2rem',
          lineHeight: 1,
          transform: 'translateY(-1px)'
        }}>
          /
        </Box>
        
        <Link to={`/dbf/${fileName}`} style={{ textDecoration: 'none' }}>
          <Box sx={{
            color: '#e6f1ff',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s',
            '&:hover': {
              color: '#64ffda'
            }
          }}>
            <Box component="span" sx={{ mr: 1 }}>📊</Box>
            <Box component="span">{fileName}</Box>
          </Box>
        </Link>
        
        <Box sx={{
          mx: 1,
          color: 'rgba(100, 255, 218, 0.7)',
          fontSize: '1.2rem',
          lineHeight: 1,
          transform: 'translateY(-1px)'
        }}>
          /
        </Box>
        
        <Box sx={{
          color: '#64ffda',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          textShadow: '0 0 10px rgba(100, 255, 218, 0.3)'
        }}>
          <Box component="span" sx={{ mr: 1 }}>📈</Box>
          <Box component="span">LDRU 統計分析</Box>
        </Box>
      </Box>
      
      {/* 裝飾元素 - 發光點 */}
      <Box sx={{
        position: 'absolute',
        right: '-5px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#64ffda',
        boxShadow: '0 0 10px #64ffda, 0 0 20px #64ffda',
        animation: 'pulse 2s infinite'
      }} />
    </Box>
  );

  // 計算 LDRU 統計數據
  const calculateLdruStats = (records: DbfRecord[]): LdruStats => {
    const stats: LdruStats = {
      totalRecords: records.length,
      totalI: 0,
      totalO: 0,
      totalOther: 0,
      byDate: {}
    };

    records.forEach(record => {
      const ldruValue = record.data.LDRU || '';
      const dateValue = record.data.DATE || '';

      // 增加總計數
      if (ldruValue === 'I') {
        stats.totalI++;
      } else if (ldruValue === 'O') {
        stats.totalO++;
      } else {
        stats.totalOther++;
      }

      // 按日期分組
      if (dateValue) {
        if (!stats.byDate[dateValue]) {
          stats.byDate[dateValue] = {
            total: 0,
            I: 0,
            O: 0,
            other: 0
          };
        }

        stats.byDate[dateValue].total++;
        
        if (ldruValue === 'I') {
          stats.byDate[dateValue].I++;
        } else if (ldruValue === 'O') {
          stats.byDate[dateValue].O++;
        } else {
          stats.byDate[dateValue].other++;
        }
      }
    });

    return stats;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!fileName) return;

      try {
        setLoading(true);
        
        // 獲取所有記錄（不分頁）
        const result = await fetchDbfRecords(
          fileName,
          1,
          1000, // 大頁面大小以獲取更多記錄
          '',
          '',
          '_recordNo',
          'desc',
          startDate,
          endDate
        );
        
        setData(result);
        
        // 計算統計數據
        const ldruStats = calculateLdruStats(result.records);
        setStats(ldruStats);
        
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch ${fileName} records:`, err);
        setError(`無法載入 ${fileName} 的記錄。請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fileName, startDate, endDate]);

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
    <Layout title="">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : stats ? (
        <TechBackground>
          <TechBreadcrumb />
          
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
                boxShadow: '0 8px 35px rgba(197, 229, 255, 0.4)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'linear-gradient(90deg, #d2e6faff, #d4eaffff)',
                boxShadow: '0 0 25px #d2e6faff'
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
              <StatValue value={stats.totalRecords} />
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
                background: 'linear-gradient(90deg, #3f68b5ff, #7981cbff)',
                boxShadow: '0 0 25px #3f68b5ff'
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
              <StatValue value={stats.totalI} />
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
              <StatValue value={stats.totalO} />
            </Box>
            
            {/* 其他 */}
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
                background: 'linear-gradient(90deg, #4caf78ff, #81c784)',
                boxShadow: '0 0 25px #4caf78ff'
              }
            }}>
              <Box sx={{
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                color: '#e6f1ff',
                fontSize: '0.9rem',
                mb: 1
              }}>
                其他值
              </Box>
              <StatValue value={stats.totalOther} />
            </Box>
          </Box>

          {/* 按日期統計表格 */}
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
                按日期統計 LDRU 值
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
                      日期
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                    }}>
                      總記錄數
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                    }}>
                      LDRU=I (已調劑)
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                    }}>
                      LDRU=O (未調劑)
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                    }}>
                      其他值
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(stats.byDate).length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: 'rgba(230, 241, 255, 0.7)',
                        borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                      }}>
                        沒有找到記錄
                      </td>
                    </tr>
                  ) : (
                    Object.entries(stats.byDate)
                      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // 按日期降序排序
                      .map(([date, dateStat]) => (
                        <tr key={date} style={{
                          transition: 'background-color 0.3s'
                        }} className="hover:bg-opacity-10 hover:bg-blue-400">
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                          }}>
                            {date}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            color: 'rgba(230, 241, 255, 0.8)',
                            borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                          }}>
                            {dateStat.total}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            color: '#7981cbff',
                            borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                          }}>
                            {dateStat.I}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            color: '#c868abff',
                            borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                          }}>
                            {dateStat.O}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            color: '#81c784',
                            borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                          }}>
                            {dateStat.other}
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
          <span className="block sm:inline"> 找不到與 {fileName} 相關的記錄。</span>
        </div>
      )}
    </Layout>
  );
}

export function meta({ params }: { params: { fileName: string } }) {
  return [
    { title: `${params.fileName} LDRU 統計分析 - DBF 檔案瀏覽器` },
    { name: "description", content: `${params.fileName} 的 LDRU 欄位統計分析` },
  ];
}
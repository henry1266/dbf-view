import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfFiles } from '../services/api';
import TechBackground from '../components/TechBackground';
import { Box } from '@mui/material';

interface DbfFile {
  fileName: string;
  baseName: string;
  collectionName: string;
}

export default function DbfFiles() {
  const [dbfFiles, setDbfFiles] = useState<DbfFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDbfFiles = async () => {
      try {
        setLoading(true);
        const files = await fetchDbfFiles();
        setDbfFiles(files);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch DBF files:', err);
        setError('無法載入 DBF 檔案列表。請稍後再試。');
      } finally {
        setLoading(false);
      }
    };

    loadDbfFiles();
  }, []);

  return (
    <Layout title="DBF 檔案列表">
      <TechBackground>
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 6
            }}>
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
          ) : (
            <Box sx={{
              bgcolor: 'rgba(17, 34, 64, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid rgba(64, 175, 255, 0.3)',
              boxShadow: '0 4px 30px rgba(0, 120, 255, 0.5)'
            }}>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  color: '#e6f1ff'
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid rgba(64, 175, 255, 0.3)',
                      background: 'rgba(10, 25, 47, 0.7)'
                    }}>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#64ffda',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace'
                      }}>
                        檔案名稱
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#64ffda',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace'
                      }}>
                        集合名稱
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#64ffda',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace'
                      }}>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbfFiles.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{
                          padding: '16px',
                          textAlign: 'center',
                          color: 'rgba(230, 241, 255, 0.7)',
                          borderBottom: '1px solid rgba(64, 175, 255, 0.2)'
                        }}>
                          沒有找到 DBF 檔案
                        </td>
                      </tr>
                    ) : (
                      dbfFiles.map((file) => (
                        <tr key={file.fileName} style={{
                          borderBottom: '1px solid rgba(64, 175, 255, 0.2)',
                          transition: 'background-color 0.3s'
                        }} className="hover:bg-[rgba(100,255,218,0.05)]">
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            fontFamily: 'monospace',
                            color: '#e6f1ff'
                          }}>
                            {file.fileName}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            color: 'rgba(230, 241, 255, 0.7)'
                          }}>
                            {file.collectionName}
                          </td>
                          <td style={{
                            padding: '12px 16px',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem'
                          }}>
                            <Link
                              to={`/dbf/${encodeURIComponent(file.fileName)}?sortField=${file.fileName.toUpperCase() === 'CO03L.DBF' ? '_recordNo' : 'PDATE'}&sortDirection=desc&page=1`}
                              style={{
                                color: '#64ffda',
                                textDecoration: 'none',
                                position: 'relative'
                              }}
                              className="hover:text-[#64ffda] hover:text-shadow-[0_0_8px_rgba(100,255,218,0.8)]"
                            >
                              瀏覽資料
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Box>
            </Box>
          )}
        </Box>
      </TechBackground>
    </Layout>
  );
}

export function meta() {
  return [
    { title: "DBF 檔案列表 - 處方瀏覽系統" },
    { name: "description", content: "瀏覽所有可用的 DBF 檔案" },
  ];
}
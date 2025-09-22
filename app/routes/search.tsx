import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Box, Typography, Paper, Grid, TextField, Button, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { searchCO01MRecords } from '../services/api';

interface PatientRecord {
  KCSTMR: string;
  MNAME: string;
  MBIRTHDT: string;
  MPERSONID: string;
}

export function meta() {
  return [
    { title: "處方查詢系統" },
    { name: "description", content: "查詢 DBF 檔案的記錄" },
  ];
}
export default function Search() {
  const [searchResults, setSearchResults] = useState<PatientRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMultiConditionSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const formData = new FormData(e.currentTarget);
const name = formData.get('patientName')?.toString().trim() || '';
const birthDate = formData.get('birthDate')?.toString().trim() || '';
const mpersonid = formData.get('mpersonid')?.toString().trim() || '';

if (!name && !birthDate && !mpersonid) {
  alert('請至少輸入姓名、生日或 MPERSONID 其中一個條件');
  return;
}

    setIsLoading(true);
    setError(null);

    try {
      // 使用實際的 API 查詢 CO01M.DBF
      const records = await searchCO01MRecords(name, birthDate, mpersonid);

      // 轉換 API 返回的記錄格式為我們需要的格式
      const results: PatientRecord[] = records.map((record: any) => ({
        KCSTMR: record.data.KCSTMR || '',
        MNAME: record.data.MNAME || '',
        MBIRTHDT: record.data.MBIRTHDT || '',
        MPERSONID: record.data.MPERSONID || ''
      }));


      setSearchResults(results);
      setShowResults(true);
      setSelectedRecord(null);
    } catch (error) {
      console.error('搜索失敗:', error);
      setError('搜索過程中發生錯誤，請稍後再試');
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecord = (record: PatientRecord) => {
    setSelectedRecord(record);
  };

  const handleConfirmSelection = () => {
    if (selectedRecord) {
      window.location.href = `/kcstmr/${selectedRecord.KCSTMR}`;
    }
  };

  return (
    <Layout title="處方查詢系統">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ 
          mb: 2, 
          fontWeight: 'bold',
          color: '#0a192f',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SearchIcon /> 處方查詢
        </Typography>
        <Typography variant="body1" sx={{ color: '#8892b0', mb: 4 }}>
          使用以下選項查詢處方記錄，您可以通過 KCSTMR 查詢客戶處方或通過 KDRUG 查詢藥品處方。
        </Typography>

        <Grid container spacing={3}>
          <Grid>
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(100, 255, 218, 0.2)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.9), rgba(0, 210, 180, 0.7))',
                  color: '#ffffff',
                  borderRadius: '50%',
                  p: 1.2,
                  mr: 2,
                  boxShadow: '0 0 25px rgba(100, 255, 218, 0.5)'
                }}>
                  <PersonIcon />
                </Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#0a192f' }}>
                  KCSTMR 客戶查詢
                </Typography>
              </Box>

              {/* 多條件搜索表單 */}
              <form onSubmit={handleMultiConditionSearch} className="flex flex-col space-y-3 mb-4">
                <TextField
                  name="patientName"
                  label="姓名"
                  placeholder="輸入姓名 (可輸入部分姓名，例如: 陳)"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <TextField
                  name="birthDate"
                  label="生日"
                  placeholder="輸入民國生日 (可輸入部分生日，例如: 840619)"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <TextField
                  name="mpersonid"
                  label="身分證"
                  placeholder="輸入身分證 (例如: A123456789)"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    backgroundColor: isLoading ? '#9ca3af' : '#10b981',
                    '&:hover': isLoading ? {} : { backgroundColor: '#059669' },
                    color: 'white',
                    fontWeight: 'medium',
                    py: 1.5
                  }}
                  fullWidth
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      搜索中...
                    </>
                  ) : (
                    '多條件查詢'
                  )}
                </Button>
              </form>

              <Divider sx={{ my: 2 }}>或</Divider>

              {/* 直接 KCSTMR 查詢表單 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = (e.currentTarget.elements.namedItem('kcstmrValue') as HTMLInputElement).value.trim();
                  if (value) {
                    window.location.href = `/kcstmr/${value}`;
                  }
                }}
                className="flex flex-col space-y-3"
              >
                <TextField
                  name="kcstmrValue"
                  label="KCSTMR 值"
                  placeholder="輸入 KCSTMR 值 (例如: 0000008)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#10b981',
                    '&:hover': { backgroundColor: '#059669' },
                    color: 'white',
                    fontWeight: 'medium',
                    py: 1.5
                  }}
                  fullWidth
                >
                  直接查詢
                </Button>
              </form>

              {/* 搜索結果顯示區域 */}
              {showResults && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#0a192f' }}>
                    搜索結果 ({searchResults.length} 筆記錄)
                  </Typography>

                  {error ? (
                    <Typography variant="body2" sx={{ color: '#ef4444', mb: 2 }}>
                      {error}
                    </Typography>
                  ) : searchResults.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      沒有找到符合條件的記錄
                    </Typography>
                  ) : (
                    <List>
                      {searchResults.map((record, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            mb: 1,
                            backgroundColor: selectedRecord?.KCSTMR === record.KCSTMR ? '#e0f2fe' : 'white',
                            border: `1px solid ${selectedRecord?.KCSTMR === record.KCSTMR ? '#0891b2' : '#e2e8f0'}`,
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                          }}
                          onClick={() => handleSelectRecord(record)}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {record.MNAME}
                                </Typography>
                                {selectedRecord?.KCSTMR === record.KCSTMR && (
                                  <CheckCircleIcon sx={{ color: '#0891b2', fontSize: 20 }} />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                KCSTMR: {record.KCSTMR} | 生日: {record.MBIRTHDT} | MPERSONID: {record.MPERSONID}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}

                  {searchResults.length > 0 && (
                    <Button
                      variant="contained"
                      onClick={handleConfirmSelection}
                      disabled={!selectedRecord}
                      sx={{
                        mt: 2,
                        backgroundColor: selectedRecord ? '#0891b2' : '#cbd5e1',
                        '&:hover': selectedRecord ? { backgroundColor: '#0e7490' } : {},
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                      fullWidth
                    >
                      {selectedRecord ? `確認選擇: ${selectedRecord.MNAME}` : '請選擇一個記錄'}
                    </Button>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 6' } }}>
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(100, 255, 218, 0.2)',
                transform: 'translateY(-5px)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.9), rgba(255, 100, 0, 0.7))',
                  color: '#ffffff',
                  borderRadius: '50%',
                  p: 1.2,
                  mr: 2,
                  boxShadow: '0 0 25px rgba(255, 152, 0, 0.5)'
                }}>
                  <MedicationIcon />
                </Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#0a192f' }}>
                  KDRUG 藥品查詢
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8892b0', mb: 3 }}>
                使用 KDRUG 值查詢相關的記錄，查看特定藥品的所有處方記錄。
              </Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = (e.currentTarget.elements.namedItem('kdrugValue') as HTMLInputElement).value.trim();
                  if (value) {
                    window.location.href = `/kdrug/${value}`;
                  }
                }}
                className="flex flex-col space-y-3"
              >
                <input
                  type="text"
                  name="kdrugValue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="輸入 KDRUG 值 (例如: ME500)"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  查詢
                </button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ 
          mb: 2, 
          fontWeight: 'bold',
          color: '#0a192f',
        }}>
          其他查詢選項
        </Typography>
        <Paper sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            您也可以瀏覽所有可用的 DBF 檔案，並查看每個檔案的記錄。
          </Typography>
          <Link
            to="/dbf-files"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          >
            查看 DBF 檔案
          </Link>
        </Paper>
      </Box>
    </Layout>
  );
}
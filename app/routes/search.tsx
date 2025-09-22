import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Box, Typography, Paper, Grid, TextField, Button, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { searchCO01MRecords, fetchDbfRecords } from '../services/api';

interface PatientRecord {
  KCSTMR: string;
  MNAME: string;
  MBIRTHDT: string;
  MPERSONID: string;
}

interface DrugRecord {
  DNO: string;
  DDESC: string;
  KDRUG: string;
}

export function meta() {
  return [
    { title: "處方查詢系統" },
    { name: "description", content: "查詢 DBF 檔案的記錄" },
  ];
}
export default function Search() {
  const [searchResults, setSearchResults] = useState<PatientRecord[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 藥品搜索相關狀態
  const [drugSearchResults, setDrugSearchResults] = useState<DrugRecord[]>([]);
  const [showDrugResults, setShowDrugResults] = useState(false);
  const [isDrugLoading, setIsDrugLoading] = useState(false);
  const [drugError, setDrugError] = useState<string | null>(null);

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
    // 直接跳轉到 KCSTMR 頁面
    window.location.href = `/kcstmr/${record.KCSTMR}`;
  };

  const handleMultiConditionDrugSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const drugCode = formData.get('drugCode')?.toString().trim() || '';
    const drugName = formData.get('drugName')?.toString().trim() || '';

    if (!drugCode && !drugName) {
      alert('請至少輸入藥品編號或藥品名稱其中一個條件');
      return;
    }

    setIsDrugLoading(true);
    setDrugError(null);

    try {
      // 使用 fetchDbfRecords 查詢 CO09D.DBF
      const result = await fetchDbfRecords(
        'CO09D.DBF',
        1,
        100,
        drugCode || drugName,
        drugCode ? 'DNO' : 'DDESC',
        'DNO',
        'asc'
      );

      const records = result.records || [];

      // 如果同時提供了藥品編號和藥品名稱，需要在前端進行額外的過濾
      let filteredRecords = records;

      if (drugCode && drugName) {
        filteredRecords = records.filter((record: any) => {
          const recordDrugCode = record.data.DNO || '';
          const recordDrugName = record.data.DDESC || '';
          const codeMatch = recordDrugCode.indexOf(drugCode) !== -1;
          const nameMatch = recordDrugName.indexOf(drugName) !== -1;
          return codeMatch && nameMatch;
        });
      } else if (drugCode) {
        filteredRecords = records.filter((record: any) => {
          const recordDrugCode = record.data.DNO || '';
          return recordDrugCode.indexOf(drugCode) !== -1;
        });
      } else if (drugName) {
        filteredRecords = records.filter((record: any) => {
          const recordDrugName = record.data.DDESC || '';
          return recordDrugName.indexOf(drugName) !== -1;
        });
      }

      // 轉換為 DrugRecord 格式
      const drugResults: DrugRecord[] = filteredRecords.map((record: any) => ({
        DNO: record.data.DNO || '',
        DDESC: record.data.DDESC || '',
        KDRUG: record.data.KDRUG || ''
      }));

      setDrugSearchResults(drugResults);
      setShowDrugResults(true);
    } catch (error) {
      console.error('藥品搜索失敗:', error);
      setDrugError('藥品搜索過程中發生錯誤，請稍後再試');
      setDrugSearchResults([]);
      setShowDrugResults(true);
    } finally {
      setIsDrugLoading(false);
    }
  };

  const handleSelectDrugRecord = (record: DrugRecord) => {
    // 直接跳轉到 KDRUG 頁面
    window.location.href = `/kdrug/${record.KDRUG}`;
  };

  return (
    <Layout title="處方查詢系統">
      <Box sx={{ mb: 4 }}>

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
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#0891b2' }
                          }}
                          onClick={() => handleSelectRecord(record)}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {record.MNAME}
                                </Typography>
                                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
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

                  <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontStyle: 'italic' }}>
                    點擊任一記錄即可直接查看詳情
                  </Typography>
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



              {/* 多條件藥品搜索表單 */}
              <form onSubmit={handleMultiConditionDrugSearch} className="flex flex-col space-y-3 mb-4">
                <TextField
                  name="drugCode"
                  label="健保碼"
                  placeholder="健保碼 (例如: AC479811G0)"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <TextField
                  name="drugName"
                  label="藥品名稱"
                  placeholder="藥品名稱 (可輸入部分名稱，例如: 史蒂諾斯)"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isDrugLoading}
                  sx={{
                    backgroundColor: isDrugLoading ? '#9ca3af' : '#8b5cf6',
                    '&:hover': isDrugLoading ? {} : { backgroundColor: '#7c3aed' },
                    color: 'white',
                    fontWeight: 'medium',
                    py: 1.5
                  }}
                  fullWidth
                >
                  {isDrugLoading ? (
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

              {/* 直接 KDRUG 查詢表單 */}
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
                <TextField
                  name="kdrugValue"
                  label="KDRUG 值"
                  placeholder="輸入 KDRUG 值 (例如: ME500)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#8b5cf6',
                    '&:hover': { backgroundColor: '#7c3aed' },
                    color: 'white',
                    fontWeight: 'medium',
                    py: 1.5
                  }}
                  fullWidth
                >
                  直接查詢
                </Button>
              </form>

              {/* 藥品搜索結果顯示區域 */}
              {showDrugResults && (
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#faf5ff', borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#7c3aed' }}>
                    藥品搜索結果 ({drugSearchResults.length} 筆記錄)
                  </Typography>

                  {drugError ? (
                    <Typography variant="body2" sx={{ color: '#ef4444', mb: 2 }}>
                      {drugError}
                    </Typography>
                  ) : drugSearchResults.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      沒有找到符合條件的藥品記錄
                    </Typography>
                  ) : (
                    <List>
                      {drugSearchResults.map((record, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            mb: 1,
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f3e8ff', borderColor: '#8b5cf6' }
                          }}
                          onClick={() => handleSelectDrugRecord(record)}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {record.DDESC}
                                </Typography>
                                <CheckCircleIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                DNO: {record.DNO} | KDRUG: {record.KDRUG}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}

                  <Typography variant="body2" sx={{ mt: 2, color: '#64748b', fontStyle: 'italic' }}>
                    點擊任一藥品記錄即可直接查看詳情
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
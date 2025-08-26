import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecord, fetchMatchingCO02PRecords } from '../services/api';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import TechBackground from '../components/TechBackground';
import TechBreadcrumb from '../components/TechBreadcrumb';

// 引入型別定義
import type { DbfRecord } from '../types/dbf.types';

// 引入元件
import TechMatchingCO02PRecordsNoCollapse from '../components/dbf/TechMatchingCO02PRecordsNoCollapse';
import TechMainFieldsGrid from '../components/dbf/TechMainFieldsGrid';
import TechCollapsibleFields from '../components/dbf/TechCollapsibleFields';

export default function DbfRecordDetail() {
  const params = useParams<{ fileName: string; recordNo: string }>();
  const fileName = params.fileName ? decodeURIComponent(params.fileName) : '';
  const recordNo = params.recordNo || '';
  const [record, setRecord] = useState<DbfRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPediatricDialog, setShowPediatricDialog] = useState(false);
  const [matchingCO02PRecords, setMatchingCO02PRecords] = useState<DbfRecord[]>([]);
  const [loadingCO02PRecords, setLoadingCO02PRecords] = useState(false);

  // 設置優先顯示欄位
  const getPriorityFields = (fileName: string) => {
    if (fileName.toUpperCase() === 'CO02P.DBF') {
      return ['KCSTMR', 'PDATE', 'PTIME', 'PLM', 'PRMK', 'KDRUG', 'PQTY', 'PFQ', 'PTQTY', 'PPR'];
    } else if (fileName.toUpperCase() === 'CO03L.DBF') {
      return ['KCSTMR', 'LNAME', 'DATE', 'TIME', 'LPID', 'LISRS' ,'LCS', 'DAYQTY', 'LDRU', 'LLDCN', 'LLDTT', 'A2', 'A99', 'TOT'];
    }
    return [];
  };

  const priorityFields = fileName ? getPriorityFields(fileName) : [];
  
  // 檢查是否為小兒用藥（A99=65或70）
  const isPediatricMedication = () => {
    if (!record || !record.data) return false;
    const a99Value = record.data['A99'];
    return a99Value === '65' || a99Value === '70' || a99Value === 65 || a99Value === 70;
  };

  // 檢查數值是否大於1
  const isGreaterThanOne = (value: any): boolean => {
    if (!value) return false;
    return (typeof value === 'string' && parseInt(value, 10) > 1) ||
           (typeof value === 'number' && value > 1);
  };

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

  // 獲取與CO03L記錄相關的CO02P記錄
  const fetchCO02PRecords = async () => {
    if (!record || !record.data || fileName.toUpperCase() !== 'CO03L.DBF') return;

    const kcstmr = record.data.KCSTMR;
    const date = record.data.DATE;
    const time = record.data.TIME;

    if (!kcstmr || !date || !time) {
      console.error('缺少必要的配對欄位：KCSTMR、DATE 或 TIME');
      return;
    }

    try {
      setLoadingCO02PRecords(true);
      const records = await fetchMatchingCO02PRecords(kcstmr, date, time);
      setMatchingCO02PRecords(records);
    } catch (err) {
      console.error('獲取配對記錄失敗:', err);
    } finally {
      setLoadingCO02PRecords(false);
    }
  };

  // 處理打開小兒用藥訊息框
  const handleOpenPediatricDialog = async () => {
    // 獲取與CO03L記錄相關的CO02P記錄
    await fetchCO02PRecords();
    setShowPediatricDialog(true);
  };

  // 處理關閉小兒用藥訊息框
  const handleClosePediatricDialog = () => {
    setShowPediatricDialog(false);
  };

  return (
    <Layout title="">
      {/* 小兒用藥按鈕 - 當A99=65或70時顯示 */}
      {!loading && record && isPediatricMedication() && (
        <Button
          variant="contained"
          color="warning"
          onClick={handleOpenPediatricDialog}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            zIndex: 1000,
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)',
            '&:hover': {
              backgroundColor: '#ff9800',
              boxShadow: '0 0 15px rgba(255, 152, 0, 0.7)',
            }
          }}
        >
          小兒
        </Button>
      )}

      {/* 小兒用藥訊息框 */}
      <Dialog
        open={showPediatricDialog}
        onClose={handleClosePediatricDialog}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 34, 64, 0.95)',
            color: '#e6f1ff',
            border: '1px solid rgba(255, 152, 0, 0.5)',
            boxShadow: '0 0 20px rgba(255, 152, 0, 0.3)',
            borderRadius: '8px',
            minWidth: '300px'
          }
        }}
      >
        <DialogTitle sx={{
          color: '#ff9800',
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 152, 0, 0.3)',
          textAlign: 'center'
        }}>
          小兒用藥提醒
        </DialogTitle>
        <DialogContent sx={{ my: 2, minWidth: '500px' }}>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 1 }}>
            小兒用藥
          </Typography>
          
          {record && record.data && record.data['LNAME'] && (
            <Typography variant="subtitle1" sx={{
              textAlign: 'center',
              mb: 2,
              color: '#e6f1ff',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: '4px',
              padding: '8px',
              backgroundColor: 'rgba(255, 152, 0, 0.1)'
            }}>
              病人姓名: {record.data['LNAME']}
            </Typography>
          )}
          
          {loadingCO02PRecords ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
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
          ) : matchingCO02PRecords.length === 0 ? (
            <Typography variant="body2" sx={{
              color: '#e6f1ff',
              p: 1,
              opacity: 0.7,
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              沒有找到配對的 CO02P 記錄
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{
                color: '#ff9800',
                fontWeight: 'bold',
                mb: 1
              }}>
                多數量項目 (PQTY {'>'} 1):
              </Typography>
              <TableContainer component={Paper} sx={{
                maxHeight: '300px',
                bgcolor: 'rgba(17, 34, 64, 0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                boxShadow: '0 4px 30px rgba(255, 152, 0, 0.2)',
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{
                        bgcolor: 'rgba(10, 25, 47, 0.7)',
                        color: '#ff9800',
                        borderBottom: '2px solid rgba(255, 152, 0, 0.5)',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        textAlign: 'center',
                        fontFamily: 'monospace'
                      }}>KDRUG</TableCell>
                      <TableCell sx={{
                        bgcolor: 'rgba(10, 25, 47, 0.7)',
                        color: '#ff9800',
                        borderBottom: '2px solid rgba(255, 152, 0, 0.5)',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        textAlign: 'center',
                        fontFamily: 'monospace'
                      }}>PQTY</TableCell>
                      <TableCell sx={{
                        bgcolor: 'rgba(10, 25, 47, 0.7)',
                        color: '#ff9800',
                        borderBottom: '2px solid rgba(255, 152, 0, 0.5)',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        textAlign: 'center',
                        fontFamily: 'monospace'
                      }}>PFQ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {matchingCO02PRecords
                      .filter(record => isGreaterThanOne(record.data['PQTY']))
                      .map((record, index) => (
                        <TableRow key={index} sx={{
                          bgcolor: 'rgba(17, 34, 64, 0.4)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 152, 0, 0.05)',
                          },
                          '&:nth-of-type(odd)': {
                            bgcolor: 'rgba(17, 34, 64, 0.4)',
                          },
                          '&:nth-of-type(even)': {
                            bgcolor: 'rgba(17, 34, 64, 0.2)',
                          }
                        }}>
                          <TableCell sx={{
                            color: '#e6f1ff',
                            borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
                            fontSize: '0.9rem',
                            fontFamily: 'monospace',
                            padding: '6px 12px',
                            textAlign: 'center'
                          }}>{record.data['KDRUG']}</TableCell>
                          <TableCell sx={{
                            color: '#e6f1ff',
                            borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
                            fontSize: '0.9rem',
                            fontFamily: 'monospace',
                            padding: '6px 12px',
                            textAlign: 'center'
                          }}>{record.data['PQTY']}</TableCell>
                          <TableCell sx={{
                            color: '#e6f1ff',
                            borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
                            fontSize: '0.9rem',
                            fontFamily: 'monospace',
                            padding: '6px 12px',
                            textAlign: 'center'
                          }}>{record.data['PFQ']}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleClosePediatricDialog}
            variant="contained"
            color="warning"
            sx={{
              minWidth: '100px',
              '&:hover': {
                backgroundColor: '#ff9800',
                boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)',
              }
            }}
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>

      <TechBackground>
        <TechBreadcrumb
          items={[
            { label: '首頁', path: '/', icon: '🏠' },
            { label: '檔案列表', path: '/dbf-files', icon: '📁' },
            { label: fileName, path: `/dbf/${fileName}`, icon: '📄' },
            { label: `記錄 #${recordNo}`, icon: '🔍' }
          ]}
        />
        
        <Box sx={{ width: '98%', mx: 'auto', my: '1%' }}>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
          ) : record ? (
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              p: '1%',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 30px rgba(0, 120, 255, 0.3)',
              border: '1px solid rgba(64, 175, 255, 0.2)'
            }}>

            {/* 第一區：主要欄位（分組） - 根據檔案類型顯示不同布局 */}
            {fileName?.toUpperCase() === 'CO03L.DBF' ? (
              <TechMainFieldsGrid
                record={record}
                fieldGroups={[
                  {
                    title: "處方資訊",
                    fields: [
                      { key: '_recordNo', label: '記錄編號' },
                      { key: 'DATE', label: 'DATE' },
                      { key: 'TIME', label: 'TIME' },
                      { key: 'LPID', label: 'LPID' },
                      { key: 'LDRU', label: 'LDRU' },
                      { key: 'LCS', label: 'LCS' },
                      { key: '_created', label: '建立時間', isMetadata: true },
                      { key: '_updated', label: '更新時間', isMetadata: true }
                    ],
                    layout: 'full'
                  },
                  {
                    title: "病人資訊",
                    fields: [
                      {
                        key: 'KCSTMR',
                        label: 'KCSTMR',
                        renderLink: {
                          path: '/kcstmr/:value',
                          color: '#64ffda'
                        }
                      },
                      { key: 'LNAME', label: 'LNAME' },
                      { key: 'MPERSONID', label: 'MPERSONID' }
                    ],
                    layout: 'left'
                  },
                  {
                    title: "調劑資訊",
                    fields: [
                      { key: 'LISRS', label: 'LISRS' },
                      { key: 'DAYQTY', label: 'DAYQTY' },
                      { key: 'A2', label: 'A2' },
                      { key: 'A99', label: 'A99' },
                      { key: 'A97', label: 'A97' },
                      { key: 'TOT', label: 'TOT' }
                    ],
                    layout: 'right'
                  }
                ]}
                title="主要欄位"
              />
            ) : fileName?.toUpperCase() === 'CO02P.DBF' ? (
              <TechMainFieldsGrid
                record={record}
                fieldGroups={[
                  {
                    title: "藥品資訊",
                    fields: [
                      { key: '_recordNo', label: '記錄編號' },
                      { key: 'PDATE', label: 'PDATE' },
                      { key: 'PTIME', label: 'PTIME' },
                      { key: 'PLM', label: 'PLM' },
                      { key: 'PRMK', label: 'PRMK' },
                      {
                        key: 'KDRUG',
                        label: 'KDRUG',
                        renderLink: {
                          path: '/kdrug/:value',
                          color: '#64ffda'
                        }
                      },
                      { key: 'PQTY', label: 'PQTY' },
                      { key: 'PFQ', label: 'PFQ' },
                      { key: 'PTQTY', label: 'PTQTY' },
                      { key: 'PPR', label: 'PPR' },
                      { key: '_created', label: '建立時間', isMetadata: true },
                      { key: '_updated', label: '更新時間', isMetadata: true }
                    ]
                  },
                  {
                    title: "病人資訊",
                    fields: [
                      {
                        key: 'KCSTMR',
                        label: 'KCSTMR',
                        renderLink: {
                          path: '/kcstmr/:value',
                          color: '#1976d2'
                        }
                      }
                    ]
                  }
                ]}
                title="主要欄位"
              />
            ) : (
              // 其他 DBF 檔案的通用布局
              <TechMainFieldsGrid
                record={record}
                fieldGroups={[
                  {
                    title: "主要欄位",
                    fields: [
                      { key: '_recordNo', label: '記錄編號' },
                      ...priorityFields.map(field => ({ key: field, label: field })),
                      { key: '_created', label: '建立時間', isMetadata: true },
                      { key: '_updated', label: '更新時間', isMetadata: true }
                    ]
                  }
                ]}
                title="記錄詳情"
              />
            )}

            

            {/* 超連結已整合到表格中 */}
            
            {/* 第二區：配對資料（如果是 CO03L.DBF 記錄） */}
            {fileName?.toUpperCase() === 'CO03L.DBF' && (
              <TechMatchingCO02PRecordsNoCollapse co03lRecord={record} />
            )}
          
          {/* 第三區：剩餘欄位（摺疊） */}
            <TechCollapsibleFields
              record={record}
              excludeFields={[
                'KCSTMR', 'LNAME', 'MPERSONID',
                'DATE', 'TIME', 'LPID', 'LDRU', 'LCS',
                'LISRS', 'A2', 'A99', 'A97', 'TOT', 'DAYQTY',
                'LLDCN', 'LLDTT'
              ]}
              title="其他欄位"
            />
          
            </Box>
          ) : (
            <Box sx={{
              bgcolor: 'rgba(255, 204, 0, 0.1)',
              border: '1px solid rgba(255, 204, 0, 0.3)',
              color: '#ffcc00',
              p: 2,
              borderRadius: 1,
              boxShadow: '0 0 15px rgba(255, 204, 0, 0.2)'
            }}>
              <Box component="span" sx={{ fontWeight: 'bold' }}>找不到記錄！</Box>
              <Box component="span" sx={{ ml: 1 }}>找不到指定的記錄。</Box>
            </Box>
          )}
        </Box>
      </TechBackground>
    </Layout>
  );
}

export function meta({ params }: { params: { fileName: string; recordNo: string } }) {
  return [
    { title: `${params.fileName} 記錄 #${params.recordNo} - DBF 處方瀏覽器` },
    { name: "description", content: `查看 ${params.fileName} 的記錄 #${params.recordNo} 的詳細資訊` },
  ];
}
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecord, fetchMatchingCO02PRecords, saveWhiteboard, loadWhiteboard, deleteDbfRecord } from '../services/api';
import axios from 'axios';
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
  Paper,
  TextField,
  IconButton
} from '@mui/material';
import TechBackground from '../components/TechBackground';
import TechBreadcrumb from '../components/TechBreadcrumb';

// 引入型別定義
import type { DbfRecord } from '../types/dbf.types';

// 引入元件
import TechMatchingCO02PRecordsNoCollapse from '../components/dbf/TechMatchingCO02PRecordsNoCollapse';
import MatchingCO02PRecordsForCO09D from '../components/dbf/MatchingCO02PRecordsForCO09D';
import CO09DInfoForCO02P from '../components/dbf/CO09DInfoForCO02P';
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
  const [textNote, setTextNote] = useState('');
  const [loadingTextNote, setLoadingTextNote] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  

  // 生成檔案列表的完整路徑，包含必要的查詢參數
  const getFileListPath = (fileName: string) => {
    let sortField = 'PDATE';
    let sortDirection = 'desc';

    // 根據檔案名稱設置不同的默認排序
    if (fileName.toUpperCase() === 'CO03L.DBF') {
      sortField = '_recordNo';
    } else if (fileName.toUpperCase() === 'CO02P.DBF') {
      sortField = '_recordNo';
    } else if (fileName.toUpperCase() === 'CO01M.DBF') {
      sortField = 'KCSTMR';
      sortDirection = 'asc';
    } else if (fileName.toUpperCase() === 'CO09D.DBF') {
      sortField = 'KDRUG';
      sortDirection = 'asc';
    }

    return `/dbf/${encodeURIComponent(fileName)}?sortField=${sortField}&sortDirection=${sortDirection}&page=1`;
  };

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

  // 當記錄載入完成後，載入文字筆記
  useEffect(() => {
    if (record && fileName?.toUpperCase() === 'CO03L.DBF') {
      const recordId = `${fileName}_${record._recordNo}`;
      loadTextNote();
    }
  }, [record, fileName]);

  // 載入文字筆記
  const loadTextNote = async () => {
    if (!record) return;
    const recordId = `${fileName}_${record._recordNo}`;

    try {
      setLoadingTextNote(true);
      const savedText = await loadWhiteboard(recordId);
      if (savedText) {
        setTextNote(savedText);
        
        // 設置文字筆記
        setTextNote(savedText);
      }
    } catch (error) {
      console.error('載入文字筆記失敗:', error);
    } finally {
      setLoadingTextNote(false);
    }
  };

  // 儲存文字筆記
  const saveTextNote = async () => {
    if (!record) return;
    const recordId = `${fileName}_${record._recordNo}`;

    try {
      await saveWhiteboard(recordId, textNote);
      alert('文字筆記已儲存！');
      setOpenNoteDialog(false);
    } catch (error) {
      console.error('儲存文字筆記失敗:', error);
      alert('儲存失敗，請檢查網路連線或重試。');
    }
  };
  
  // 處理打開筆記編輯對話框
  const handleOpenNoteDialog = () => {
    setOpenNoteDialog(true);
  };
  
  // 處理關閉筆記編輯對話框
  const handleCloseNoteDialog = () => {
    setOpenNoteDialog(false);
  };

  // 處理打開刪除確認對話框
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // 處理關閉刪除確認對話框
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // 處理確認刪除記錄
  const handleConfirmDelete = async () => {
    if (!fileName || !recordNo) return;

    try {
      setDeleting(true);
      await deleteDbfRecord(fileName, parseInt(recordNo));

      // 刪除成功後關閉對話框並跳轉到檔案列表頁面
      setOpenDeleteDialog(false);
      alert('記錄已成功刪除！');
      window.location.href = getFileListPath(fileName);
    } catch (error) {
      console.error('刪除記錄失敗:', error);
      alert('刪除失敗，請稍後再試。');
    } finally {
      setDeleting(false);
    }
  };
  
  // 獲取筆記摘要（顯示前100個字符）
  const getNoteSummary = () => {
    if (!textNote) return '無筆記內容...';
    return textNote.length > 100 ? textNote.substring(0, 100) + '...' : textNote;
  };

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

  // 處理列印按鈕點擊事件
  const handlePrint = async (pqty: string | number, pfq: string | number) => {
    try {
      const lname = record?.data?.['LNAME'] || '';

      // 發送API請求
      const response = await axios.post('http://192.168.68.56:6001/generate-and-print-pdf', {
        value1: pqty,
        value2: lname,
        value3: pfq
      });

      console.log('列印成功:', response.data);
      // 可以添加成功提示
    } catch (error) {
      console.error('列印失敗:', error);
      // 可以添加錯誤提示
    }
  };

  // 處理批次列印按鈕點擊事件
  const handleBatchPrint = async () => {
    if (!matchingCO02PRecords || matchingCO02PRecords.length === 0) {
      console.log('沒有可列印的記錄');
      return;
    }

    const lname = record?.data?.['LNAME'] || '';
    const filteredRecords = matchingCO02PRecords.filter(record => isGreaterThanOne(record.data['PQTY']));

    if (filteredRecords.length === 0) {
      console.log('沒有PQTY > 1的記錄');
      return;
    }

    // 顯示正在處理的提示
    console.log(`開始批次列印 ${filteredRecords.length} 個項目`);

    // 依序發送API請求
    for (const record of filteredRecords) {
      try {
        const pqty = record.data['PQTY'];
        const pfq = record.data['PFQ'];

        // 發送API請求
        const response = await axios.post('http://192.168.68.56:6001/generate-and-print-pdf', {
          value1: pqty,
          value2: lname,
          value3: pfq
        });

        console.log(`列印成功 KDRUG: ${record.data['KDRUG']}, PQTY: ${pqty}, PFQ: ${pfq}`);
      } catch (error) {
        console.error(`列印失敗 KDRUG: ${record.data['KDRUG']}:`, error);
      }
    }

    console.log('批次列印完成');
  };

  return (
    <Layout title="">
      {/* 小兒用藥按鈕和彈出框已移除，保留批次列印功能 */}

      <TechBackground>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <TechBreadcrumb
            items={[
              { label: '首頁', path: '/', icon: '🏠' },
              { label: '檔案列表', path: '/dbf-files', icon: '📁' },
              { label: fileName, path: getFileListPath(fileName), icon: '📄' },
              { label: `記錄 #${recordNo}`, icon: '🔍' }
            ]}
          />

          {/* 刪除按鈕 - 所有記錄都顯示 */}
          {!loading && record && (
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenDeleteDialog}
              disabled={deleting}
              sx={{
                position: 'absolute',
                right: fileName?.toUpperCase() === 'CO03L.DBF' && isPediatricMedication() ? '140px' : '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #d32f2f, #f44336)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #b71c1c, #d32f2f)',
                  boxShadow: '0 0 15px rgba(211, 47, 47, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(211, 47, 47, 0.5)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            >
              {deleting ? '刪除中...' : '🗑️ 刪除'}
            </Button>
          )}

          {/* 批次列印按鈕 - 僅在CO03L.DBF且A99=65或70時顯示 */}
          {!loading && record && fileName?.toUpperCase() === 'CO03L.DBF' && isPediatricMedication() && (
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                await fetchCO02PRecords();
                handleBatchPrint();
              }}
              sx={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #1976d2, #4791db)',
                border: '1px solid rgba(64, 175, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0, #1976d2)',
                  boxShadow: '0 0 15px rgba(25, 118, 210, 0.5)',
                }
              }}
            >
              批次列印
            </Button>
          )}
        </Box>

        <Box sx={{ width: '98%', mx: 'auto', mt: '0.5%', mb: '1%' }}>

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
              <>
                {/* 處方資訊 - 全寬 */}
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
                    }
                  ]}
                  title="主要欄位"
                />

                {/* 三欄佈局：病人資訊 | 調劑資訊 | 文字筆記 */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 1,
                  mt: 1
                }}>
                  {/* 病人資訊 */}
                  <Box sx={{ flex: 1 }}>
                    <TechMainFieldsGrid
                      record={record}
                      fieldGroups={[
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
                          ]
                        }
                      ]}
                      title=""
                    />
                  </Box>

                  {/* 調劑資訊 */}
                  <Box sx={{ flex: 1 }}>
                    <TechMainFieldsGrid
                      record={record}
                      fieldGroups={[
                        {
                          title: "調劑資訊",
                          fields: [
                            { key: 'LISRS', label: 'LISRS' },
                            { key: 'DAYQTY', label: 'DAYQTY' },
                            { key: 'A2', label: 'A2' },
                            { key: 'A99', label: 'A99' },
                            { key: 'A97', label: 'A97' },
                            { key: 'TOT', label: 'TOT' }
                          ]
                        }
                      ]}
                      title=""
                    />
                  </Box>

                  {/* 文字筆記 */}
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <TechMainFieldsGrid
                      record={{
                        _id: 'note-record',
                        _recordNo: 0,
                        _file: '',
                        _created: new Date().toISOString(),
                        _updated: new Date().toISOString(),
                        hash: 'note-hash',
                        data: {
                          NOTE: loadingTextNote ? '載入中...' : getNoteSummary()
                        }
                      }}
                      fieldGroups={[
                        {
                          title: "文字筆記",
                          fields: [
                            { key: 'NOTE', label: '內容' }
                          ]
                        }
                      ]}
                      title=""
                    />
                    
                    {/* 編輯按鈕 - 絕對定位到框內右上方 */}
                    <Button
                      size="small"
                      onClick={handleOpenNoteDialog}
                      sx={{
                        position: 'absolute',
                        top: '32px',
                        right: '12px',
                        zIndex: 10,
                        color: '#64ffda',
                        minWidth: 'auto',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(17, 34, 64, 0.7)',
                        '&:hover': {
                          bgcolor: 'rgba(100, 255, 218, 0.1)',
                        }
                      }}
                    >
                      ✏️ 編輯
                    </Button>
                    
                    {/* 筆記編輯對話框 */}
                    <Dialog
                      open={openNoteDialog}
                      onClose={handleCloseNoteDialog}
                      maxWidth="md"
                      fullWidth
                      PaperProps={{
                        sx: {
                          bgcolor: 'rgba(17, 34, 64, 0.95)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(64, 175, 255, 0.3)',
                          boxShadow: '0 4px 30px rgba(0, 120, 255, 0.3)',
                        }
                      }}
                    >
                      <DialogTitle sx={{
                        color: '#e6f1ff',
                        fontFamily: 'monospace',
                        borderBottom: '1px solid rgba(64, 175, 255, 0.3)'
                      }}>
                        編輯文字筆記
                      </DialogTitle>
                      <DialogContent sx={{ mt: 2, minHeight: '400px' }}>
                        <Box>
                          <TextField
                            multiline
                            rows={6}
                            fullWidth
                            variant="outlined"
                            value={textNote}
                            onChange={(e) => setTextNote(e.target.value)}
                            sx={{
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
                                fontSize: '0.9rem',
                              },
                              bgcolor: 'rgba(17, 34, 64, 0.4)',
                            }}
                          />
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ borderTop: '1px solid rgba(64, 175, 255, 0.3)' }}>
                        <Button
                          onClick={handleCloseNoteDialog}
                          sx={{
                            color: '#e6f1ff',
                            '&:hover': {
                              bgcolor: 'rgba(230, 241, 255, 0.1)',
                            },
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          onClick={saveTextNote}
                          variant="contained"
                          sx={{
                            bgcolor: 'rgba(100, 255, 218, 0.2)',
                            color: '#64ffda',
                            '&:hover': {
                              bgcolor: 'rgba(100, 255, 218, 0.3)',
                            },
                            fontFamily: 'monospace',
                          }}
                        >
                          儲存筆記
                        </Button>
                      </DialogActions>
                    </Dialog>

                    {/* 刪除確認對話框 */}
                    <Dialog
                      open={openDeleteDialog}
                      onClose={handleCloseDeleteDialog}
                      maxWidth="sm"
                      fullWidth
                      PaperProps={{
                        sx: {
                          bgcolor: 'rgba(17, 34, 64, 0.95)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                          boxShadow: '0 4px 30px rgba(211, 47, 47, 0.3)',
                        }
                      }}
                    >
                      <DialogTitle sx={{
                        color: '#ffcccc',
                        fontFamily: 'monospace',
                        borderBottom: '1px solid rgba(244, 67, 54, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <span>⚠️</span>
                        確認刪除記錄
                      </DialogTitle>
                      <DialogContent sx={{ mt: 2 }}>
                        <Box sx={{ color: '#e6f1ff', fontSize: '0.9rem' }}>
                          <p>您確定要刪除以下記錄嗎？</p>
                          <Box sx={{
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid rgba(244, 67, 54, 0.3)',
                            mt: 2
                          }}>
                            <strong>檔案：</strong>{fileName}<br />
                            <strong>記錄編號：</strong>#{recordNo}<br />
                            {record?.data?.KCSTMR && <><strong>客戶編號：</strong>{record.data.KCSTMR}<br /></>}
                            {record?.data?.LNAME && <><strong>姓名：</strong>{record.data.LNAME}<br /></>}
                          </Box>
                          <p style={{ color: '#ff9999', marginTop: '16px', fontSize: '0.8rem' }}>
                            ⚠️ 此操作無法撤銷，刪除後的資料將永久遺失。
                          </p>
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ borderTop: '1px solid rgba(244, 67, 54, 0.3)' }}>
                        <Button
                          onClick={handleCloseDeleteDialog}
                          disabled={deleting}
                          sx={{
                            color: '#e6f1ff',
                            '&:hover': {
                              bgcolor: 'rgba(230, 241, 255, 0.1)',
                            },
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          onClick={handleConfirmDelete}
                          disabled={deleting}
                          variant="contained"
                          sx={{
                            bgcolor: 'rgba(244, 67, 54, 0.2)',
                            color: '#ffcccc',
                            '&:hover': {
                              bgcolor: 'rgba(244, 67, 54, 0.3)',
                            },
                            '&:disabled': {
                              bgcolor: 'rgba(244, 67, 54, 0.1)',
                              color: 'rgba(255, 204, 204, 0.5)',
                            },
                            fontFamily: 'monospace',
                          }}
                        >
                          {deleting ? '刪除中...' : '確認刪除'}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </Box>
              </>
            ) : fileName?.toUpperCase() === 'CO02P.DBF' ? (
              <>
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

                {/* 顯示 CO09D 藥品資訊 */}
                <CO09DInfoForCO02P co02pRecord={record} />
              </>
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

           {/* 第二區：配對資料（如果是 CO03L.DBF 或 CO09D.DBF 記錄） */}
            {fileName?.toUpperCase() === 'CO03L.DBF' && (
              <TechMatchingCO02PRecordsNoCollapse co03lRecord={record} />
            )}
            {fileName?.toUpperCase() === 'CO09D.DBF' && (
              <MatchingCO02PRecordsForCO09D co09dRecord={record} />
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
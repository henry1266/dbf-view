import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecord, fetchMatchingCO02PRecords } from '../services/api';
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
  Paper
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
import TouchWhiteboard from '../components/dbf/TouchWhiteboard';

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
              { label: fileName, path: `/dbf/${fileName}`, icon: '📄' },
              { label: `記錄 #${recordNo}`, icon: '🔍' }
            ]}
          />
          
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
          
          {/* 觸控書寫小白板 - 僅在 CO03L.DBF 記錄中顯示 */}
           {fileName?.toUpperCase() === 'CO03L.DBF' && (
             <Box sx={{ mt: 3, mb: 3 }}>
               <TouchWhiteboard width={800} height={400} />
             </Box>
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
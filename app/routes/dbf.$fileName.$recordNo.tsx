import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecord, fetchMatchingCO02PRecords } from '../services/api';
import { Box, Typography } from '@mui/material';
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
    <Layout title="">
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
              <MainFieldsGrid
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
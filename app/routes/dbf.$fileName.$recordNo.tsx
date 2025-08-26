import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecord, fetchMatchingCO02PRecords } from '../services/api';
import { Box, Typography } from '@mui/material';

// 引入型別定義
import type { DbfRecord } from '../types/dbf.types';

// 引入元件
import MatchingCO02PRecordsNoCollapse from '../components/dbf/MatchingCO02PRecordsNoCollapse';
import MainFieldsGrid from '../components/dbf/MainFieldsGrid';
import CollapsibleFields from '../components/dbf/CollapsibleFields';

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
          <div className="p-4 pt-0">

            {/* 第一區：主要欄位（分組） - 根據檔案類型顯示不同布局 */}
            {fileName?.toUpperCase() === 'CO03L.DBF' ? (
              <MainFieldsGrid
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
                          color: '#1976d2'
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
              <MainFieldsGrid
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
                          color: '#2e7d32'
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
              <MatchingCO02PRecordsNoCollapse co03lRecord={record} />
            )}
          
          {/* 第三區：剩餘欄位（摺疊） */}
            <CollapsibleFields
              record={record}
              excludeFields={[
                'KCSTMR', 'LNAME', 'MPERSONID',
                'DATE', 'TIME', 'LPID', 'LDRU', 'LCS',
                'LISRS', 'A2', 'A99', 'A97', 'TOT', 'DAYQTY',
                'LLDCN', 'LLDTT'
              ]}
              title="其他欄位"
            />
          
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
    { title: `${params.fileName} 記錄 #${params.recordNo} - DBF 處方瀏覽器` },
    { name: "description", content: `查看 ${params.fileName} 的記錄 #${params.recordNo} 的詳細資訊` },
  ];
}
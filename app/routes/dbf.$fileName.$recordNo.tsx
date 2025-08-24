import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfRecord, fetchMatchingCO02PRecords } from '../services/api';
import { Box, Typography } from '@mui/material';

// 引入型別定義
import type { DbfRecord } from '../types/dbf.types';

// 引入元件
import MatchingCO02PRecordsNoCollapse from '../components/dbf/MatchingCO02PRecordsNoCollapse';
import MainFields from '../components/dbf/MainFields';
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
      return ['KCSTMR', 'PDATE', 'PTIME', 'PLM', 'PRMK', 'KDRUG', 'PTQTY'];
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
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">
                記錄詳情
              </h2>
              <Link
                to={`/dbf/${encodeURIComponent(fileName)}`}
                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
              >
                返回列表
              </Link>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-500 mb-2">建立時間</h3>
                <p className="text-gray-900">{new Date(record._created).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-medium text-gray-500 mb-2">更新時間</h3>
                <p className="text-gray-900">{new Date(record._updated).toLocaleString()}</p>
              </div>
            </div>

            {/* 第一區：主要欄位 */}
            <MainFields
              record={record}
              fields={['_recordNo', 'KCSTMR', 'LNAME', 'MPERSONID', 'DATE', 'LISRS', 'DAYQTY', 'LDRU', 'LLDCN', 'LLDTT']}
              title="主要欄位"
            />

            {/* 第三區：剩餘欄位（摺疊） */}
            <CollapsibleFields
              record={record}
              excludeFields={['KCSTMR', 'LNAME', 'MPERSONID', 'DATE', 'LISRS', 'DAYQTY', 'LDRU', 'LLDCN', 'LLDTT']}
              title="其他欄位"
            />

            {/* 特殊處理：如果是 co02p.DBF 記錄，提供 KCSTMR 和 KDRUG 的快速鏈接 */}
            {fileName?.toUpperCase() === 'CO02P.DBF' && record.data.KCSTMR && (
              <div className="mt-6 mb-6 flex flex-wrap gap-2">
                <Link
                  to={`/kcstmr/${encodeURIComponent(record.data.KCSTMR)}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  查看 KCSTMR: {record.data.KCSTMR}
                </Link>
                {record.data.KDRUG && (
                  <Link
                    to={`/kdrug/${encodeURIComponent(record.data.KDRUG)}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    查看 KDRUG: {record.data.KDRUG}
                  </Link>
                )}
              </div>
            )}

            {/* 特殊處理：如果是 CO03L.DBF 記錄，提供 KCSTMR 的快速鏈接 */}
            {fileName?.toUpperCase() === 'CO03L.DBF' && record.data.KCSTMR && (
              <div className="mt-6 mb-6">
                <Link
                  to={`/kcstmr/${encodeURIComponent(record.data.KCSTMR)}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  查看 KCSTMR: {record.data.KCSTMR}
                </Link>
              </div>
            )}
            
            {/* 第二區：配對資料（如果是 CO03L.DBF 記錄） */}
            {fileName?.toUpperCase() === 'CO03L.DBF' && (
              <MatchingCO02PRecordsNoCollapse co03lRecord={record} />
            )}
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
    { title: `${params.fileName} 記錄 #${params.recordNo} - DBF 檔案瀏覽器` },
    { name: "description", content: `查看 ${params.fileName} 的記錄 #${params.recordNo} 的詳細資訊` },
  ];
}
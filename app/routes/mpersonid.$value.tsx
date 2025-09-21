import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchMpersonidRecords } from '../services/api';

interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
}

interface MpersonidResponse {
  mpersonidValue: string;
  records: DbfRecord[];
  totalRecords: number;
  uniqueKcstmrValues: string[];
}

export default function MpersonidQuery() {
  const { value } = useParams<{ value: string }>();
  const [data, setData] = useState<MpersonidResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMpersonidRecords = async () => {
      if (!value) return;

      try {
        setLoading(true);
        const result = await fetchMpersonidRecords(value);
        setData(result);
        setError(null);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setError(`查無 MPERSONID=${value} 的資料`);
          setData(null);
        } else {
          console.error(`Failed to fetch MPERSONID=${value} records:`, err);
          setError(`載入 MPERSONID=${value} 時發生錯誤，請稍後再試`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMpersonidRecords();
  }, [value]);

  return (
    <Layout title={`MPERSONID: ${value || ''}`}>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-blue-700">
                找到 <span className="font-semibold">{data.totalRecords}</span> 筆 MPERSONID=
                <span className="font-mono">{data.mpersonidValue}</span> 的 CO01M.DBF 記錄
              </div>

              {data.uniqueKcstmrValues.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-blue-600 font-medium">關連 KCSTMR：</span>
                  {data.uniqueKcstmrValues.map((kcstmr) => (
                    <Link
                      key={kcstmr}
                      to={`/kcstmr/${encodeURIComponent(kcstmr)}`}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      {kcstmr}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700">CO01M.DBF</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">記錄號</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KCSTMR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MNAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MBIRTHDT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MPERSONID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.records.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record._recordNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {record.data.KCSTMR || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.data.MNAME || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.data.MBIRTHDT || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.data.MPERSONID || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <Link
                            to={`/dbf/CO01M.DBF/${record._recordNo}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            詳細
                          </Link>
                          {record.data.KCSTMR && (
                            <Link
                              to={`/kcstmr/${encodeURIComponent(record.data.KCSTMR)}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              KCSTMR
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">沒有資料</strong>
          <span className="block sm:inline"> 查無 MPERSONID={value} 的 CO01M.DBF 記錄</span>
        </div>
      )}
    </Layout>
  );
}

export function meta({ params }: { params: { value: string } }) {
  return [
    { title: `MPERSONID: ${params.value} - DBF 病患查詢` },
    { name: 'description', content: `查詢 MPERSONID=${params.value} 在 CO01M.DBF 中的病患資料` },
  ];
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchKcstmrRecords } from '../services/api';

interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
}

interface KcstmrResponse {
  kcstmrValue: string;
  recordsByFile: Record<string, {
    records: DbfRecord[];
    count: number;
    isGrouped?: boolean;
    groups?: {
      key: string;
      pdate: string;
      ptime: string;
      records: DbfRecord[];
    }[];
  }>;
  totalRecords: number;
}

export default function KcstmrQuery() {
  const { value } = useParams<{ value: string }>();
  const [data, setData] = useState<KcstmrResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 設置各檔案的優先顯示欄位
  const priorityFieldsByFile: Record<string, string[]> = {
    'CO02P.DBF': ['KCSTMR', 'PDATE', 'PTIME', 'PLM', 'PRMK', 'KDRUG', 'PTQTY', 'PPR'],
    'CO03L.DBF': ['KCSTMR', 'LNAME', 'DATE', 'TIME', 'LPID', 'LCS', 'DAYQTY', 'LDRU', 'LLDCN', 'LLDTT', 'A2', 'A99', 'TOT'],
  };

  useEffect(() => {
    const loadKcstmrRecords = async () => {
      if (!value) return;

      try {
        setLoading(true);
        const result = await fetchKcstmrRecords(value);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch KCSTMR=${value} records:`, err);
        setError(`無法載入 KCSTMR=${value} 的記錄。請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    loadKcstmrRecords();
  }, [value]);

  return (
    <Layout title={`KCSTMR: ${value || ''}`}>
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
        <div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  共找到 <span className="font-medium">{data.recordsByFile['CO03L.DBF']?.count || 0}</span> 筆與 KCSTMR={data.kcstmrValue} 相關的 CO03L.DBF 記錄。
                </p>
              </div>
            </div>
          </div>

          {Object.entries(data.recordsByFile)
            .filter(([fileName]) => fileName === 'CO03L.DBF') // 只顯示 CO03L.DBF 的記錄
            .map(([fileName, fileData]) => (
            <div key={fileName} className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-700">
                  {fileName} ({fileData.count} 筆記錄)
                </h2>
              </div>

              {/* CO02P.DBF 特殊處理 - 按 PDATE 和 PTIME 分組 */}
              {fileName === 'CO02P.DBF' && fileData.groups && (
                <div className="p-4">
                  {fileData.groups.map((group) => (
                    <div key={group.key} className="mb-6 last:mb-0">
                      <div className="bg-gray-100 p-3 mb-3 rounded">
                        <h3 className="text-md font-medium">
                          日期: {group.pdate}, 時間: {group.ptime}
                        </h3>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                記錄編號
                              </th>
                              {/* 優先顯示欄位 */}
                              {priorityFieldsByFile[fileName].map((field) => (
                                <th key={field} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {field}
                                </th>
                              ))}
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {group.records.map((record) => (
                              <tr key={record._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {record._recordNo}
                                </td>
                                {/* 優先顯示欄位 */}
                                {priorityFieldsByFile[fileName].map((field) => (
                                  <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.data[field] || ''}
                                  </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <Link
                                    to={`/dbf/${fileName}/${record._recordNo}`}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    詳情
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 其他檔案的一般處理 */}
              {fileName !== 'CO02P.DBF' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          記錄編號
                        </th>
                        {/* 優先顯示欄位 */}
                        {priorityFieldsByFile[fileName]?.map((field) => (
                          <th key={field} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {field}
                          </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fileData.records.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record._recordNo}
                          </td>
                          {/* 優先顯示欄位 */}
                          {priorityFieldsByFile[fileName]?.map((field) => (
                            <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {record.data[field] || ''}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              to={`/dbf/${fileName}/${record._recordNo}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              詳情
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">找不到記錄！</strong>
          <span className="block sm:inline"> 找不到與 KCSTMR={value} 相關的 CO03L.DBF 記錄。</span>
        </div>
      )}
    </Layout>
  );
}

export function meta({ params }: { params: { value: string } }) {
  return [
    { title: `KCSTMR: ${params.value} - DBF 處方瀏覽器` },
    { name: "description", content: `查看與 KCSTMR=${params.value} 相關的所有記錄` },
  ];
}
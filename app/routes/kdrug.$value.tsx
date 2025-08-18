import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchKdrugRecords } from '../services/api';

interface DbfRecord {
  _id: string;
  _recordNo: number;
  _file: string;
  hash: string;
  data: Record<string, any>;
  _created: string;
  _updated: string;
}

interface KdrugResponse {
  kdrugValue: string;
  records: DbfRecord[];
  totalRecords: number;
  totalPTQTY: number;
  totalPTQTY_I: number;
  totalPTQTY_O: number;
  startDate: string;
  endDate: string;
  allDates: string[];
}

export default function KdrugQuery() {
  const { value } = useParams<{ value: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const [data, setData] = useState<KdrugResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ startDate, endDate });

  // 設置優先顯示欄位
  const priorityFields = ['KCSTMR', 'PDATE', 'PTIME', 'PLM', 'LDRU', 'KDRUG', 'DNO', 'DDESC', 'PTQTY'];

  useEffect(() => {
    const loadKdrugRecords = async () => {
      if (!value) return;

      try {
        setLoading(true);
        const result = await fetchKdrugRecords(value, startDate, endDate);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch KDRUG=${value} records:`, err);
        setError(`無法載入 KDRUG=${value} 的記錄。請稍後再試。`);
      } finally {
        setLoading(false);
      }
    };

    loadKdrugRecords();
  }, [value, startDate, endDate]);

  const handleDateRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    if (dateRange.startDate) {
      newParams.set('startDate', dateRange.startDate);
    } else {
      newParams.delete('startDate');
    }
    
    if (dateRange.endDate) {
      newParams.set('endDate', dateRange.endDate);
    } else {
      newParams.delete('endDate');
    }
    
    setSearchParams(newParams);
  };

  return (
    <Layout title={`KDRUG: ${value || ''}`}>
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
          {/* 日期範圍篩選表單 */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">日期範圍篩選</h2>
            <form onSubmit={handleDateRangeSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  開始日期
                </label>
                <input
                  type="text"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="格式: YYYYMMDD"
                />
              </div>
              <div className="flex-grow">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  結束日期
                </label>
                <input
                  type="text"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="格式: YYYYMMDD"
                />
              </div>
              <div className="md:flex-shrink-0 md:self-end">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  篩選
                </button>
              </div>
            </form>

            {/* 可用日期列表 */}
            {data.allDates.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">可用日期:</h3>
                <div className="flex flex-wrap gap-2">
                  {data.allDates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setDateRange({ ...dateRange, startDate: date, endDate: date })}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 統計信息 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-blue-800 mb-1">總記錄數</h3>
              <p className="text-2xl font-bold text-blue-600">{data.totalRecords}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-green-800 mb-1">總 PTQTY</h3>
              <p className="text-2xl font-bold text-green-600">{data.totalPTQTY.toFixed(2)}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-indigo-800 mb-1">LDRU=I 的 PTQTY</h3>
              <p className="text-2xl font-bold text-indigo-600">{data.totalPTQTY_I.toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-purple-800 mb-1">LDRU=O 的 PTQTY</h3>
              <p className="text-2xl font-bold text-purple-600">{data.totalPTQTY_O.toFixed(2)}</p>
            </div>
          </div>

          {/* 記錄表格 */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700">
                KDRUG={data.kdrugValue} 的記錄 ({data.records.length} 筆)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      記錄編號
                    </th>
                    {/* 優先顯示欄位 */}
                    {priorityFields.map((field) => (
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
                  {data.records.length === 0 ? (
                    <tr>
                      <td colSpan={priorityFields.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                        沒有找到記錄
                      </td>
                    </tr>
                  ) : (
                    data.records.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record._recordNo}
                        </td>
                        {/* 優先顯示欄位 */}
                        {priorityFields.map((field) => (
                          <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.data[field] || ''}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/dbf/co02p.DBF/${record._recordNo}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              詳情
                            </Link>
                            {record.data.KCSTMR && (
                              <Link
                                to={`/kcstmr/${record.data.KCSTMR}`}
                                className="text-green-600 hover:text-green-900"
                              >
                                KCSTMR
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">找不到記錄！</strong>
          <span className="block sm:inline"> 找不到與 KDRUG={value} 相關的記錄。</span>
        </div>
      )}
    </Layout>
  );
}

export function meta({ params }: { params: { value: string } }) {
  return [
    { title: `KDRUG: ${params.value} - DBF 檔案瀏覽器` },
    { name: "description", content: `查看與 KDRUG=${params.value} 相關的所有記錄` },
  ];
}
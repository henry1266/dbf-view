import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { fetchDbfFiles } from '../services/api';

interface DbfFile {
  fileName: string;
  baseName: string;
  collectionName: string;
}

export default function DbfFiles() {
  const [dbfFiles, setDbfFiles] = useState<DbfFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDbfFiles = async () => {
      try {
        setLoading(true);
        const files = await fetchDbfFiles();
        setDbfFiles(files);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch DBF files:', err);
        setError('無法載入 DBF 檔案列表。請稍後再試。');
      } finally {
        setLoading(false);
      }
    };

    loadDbfFiles();
  }, []);

  return (
    <Layout title="DBF 檔案列表">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">錯誤！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    檔案名稱
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    集合名稱
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dbfFiles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      沒有找到 DBF 檔案
                    </td>
                  </tr>
                ) : (
                  dbfFiles.map((file) => (
                    <tr key={file.fileName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {file.fileName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.collectionName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/dbf/${encodeURIComponent(file.fileName)}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          瀏覽資料
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

export function meta() {
  return [
    { title: "DBF 檔案列表 - DBF 檔案瀏覽器" },
    { name: "description", content: "瀏覽所有可用的 DBF 檔案" },
  ];
}
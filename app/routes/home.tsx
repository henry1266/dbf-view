import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export function meta() {
  return [
    { title: "DBF 檔案瀏覽器" },
    { name: "description", content: "瀏覽和查詢 DBF 檔案的記錄" },
  ];
}

export default function Home() {
  return (
    <Layout title="歡迎使用 DBF 檔案瀏覽器">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">關於 DBF 檔案瀏覽器</h2>
        <p className="text-gray-600 mb-4">
          DBF 檔案瀏覽器是一個用於瀏覽和查詢 DBF 檔案記錄的工具。您可以瀏覽所有可用的 DBF 檔案，
          查看每個檔案的記錄，並使用 KCSTMR 或 KDRUG 值進行查詢。
        </p>
        <p className="text-gray-600">
          此應用程序連接到 MongoDB 數據庫，從中獲取由 DBF 監控服務處理和存儲的數據。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h3 className="text-lg font-semibold">DBF 檔案列表</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              瀏覽所有可用的 DBF 檔案，並查看每個檔案的記錄。
            </p>
            <Link
              to="/dbf-files"
              className="inline-block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              查看 DBF 檔案
            </Link>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-500 text-white p-4">
            <h3 className="text-lg font-semibold">KCSTMR 查詢</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              使用 KCSTMR 值查詢相關的記錄，查看特定客戶的所有處方記錄。
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const value = (e.currentTarget.elements.namedItem('kcstmrValue') as HTMLInputElement).value.trim();
                if (value) {
                  window.location.href = `/kcstmr/${value}`;
                }
              }}
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                name="kcstmrValue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="輸入 KCSTMR 值 (例如: 0000008)"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
              >
                查詢
              </button>
            </form>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-500 text-white p-4">
            <h3 className="text-lg font-semibold">KDRUG 查詢</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              使用 KDRUG 值查詢相關的記錄，查看特定藥品的所有處方記錄。
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const value = (e.currentTarget.elements.namedItem('kdrugValue') as HTMLInputElement).value.trim();
                if (value) {
                  window.location.href = `/kdrug/${value}`;
                }
              }}
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                name="kdrugValue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="輸入 KDRUG 值 (例如: ME500)"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md"
              >
                查詢
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

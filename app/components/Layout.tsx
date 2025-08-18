import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [kcstmrValue, setKcstmrValue] = React.useState('');
  const [kdrugValue, setKdrugValue] = React.useState('');

  const handleKcstmrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kcstmrValue.trim()) {
      window.location.href = `/kcstmr/${kcstmrValue.trim()}`;
    }
  };

  const handleKdrugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kdrugValue.trim()) {
      window.location.href = `/kdrug/${kdrugValue.trim()}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">DBF 檔案瀏覽器</Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:text-gray-300">首頁</Link>
                </li>
                <li>
                  <Link to="/dbf-files" className="hover:text-gray-300">DBF 檔案列表</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* KCSTMR 查詢表單 */}
          <div className="bg-white shadow rounded-lg p-4 border-t-4 border-blue-500">
            <h2 className="text-lg font-semibold mb-3">KCSTMR 查詢</h2>
            <form onSubmit={handleKcstmrSubmit} className="flex flex-col space-y-3">
              <div>
                <label htmlFor="kcstmrValue" className="block text-sm font-medium text-gray-700 mb-1">
                  KCSTMR 值
                </label>
                <input
                  type="text"
                  id="kcstmrValue"
                  value={kcstmrValue}
                  onChange={(e) => setKcstmrValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="輸入 KCSTMR 值 (例如: 0000008)"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
              >
                查詢
              </button>
            </form>
          </div>

          {/* KDRUG 查詢表單 */}
          <div className="bg-white shadow rounded-lg p-4 border-t-4 border-green-500">
            <h2 className="text-lg font-semibold mb-3">KDRUG 查詢</h2>
            <form onSubmit={handleKdrugSubmit} className="flex flex-col space-y-3">
              <div>
                <label htmlFor="kdrugValue" className="block text-sm font-medium text-gray-700 mb-1">
                  KDRUG 值
                </label>
                <input
                  type="text"
                  id="kdrugValue"
                  value={kdrugValue}
                  onChange={(e) => setKdrugValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="輸入 KDRUG 值 (例如: ME500)"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
              >
                查詢
              </button>
            </form>
          </div>
        </div>

        {children}
      </main>

      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>DBF 檔案瀏覽器 &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};
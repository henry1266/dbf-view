import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">處方瀏覽器</Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:text-gray-300">首頁</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-gray-300">儀表板</Link>
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

        {children}
      </main>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Box, Typography, Paper, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';

export function meta() {
  return [
    { title: "處方查詢系統" },
    { name: "description", content: "查詢 DBF 檔案的記錄" },
  ];
}

export default function Search() {
  return (
    <Layout title="處方查詢系統">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ 
          mb: 2, 
          fontWeight: 'bold',
          color: '#0a192f',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SearchIcon /> 處方查詢
        </Typography>
        <Typography variant="body1" sx={{ color: '#8892b0', mb: 4 }}>
          使用以下選項查詢處方記錄，您可以通過 KCSTMR 查詢客戶處方或通過 KDRUG 查詢藥品處方。
        </Typography>

        <Grid container spacing={3}>
          <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 6' } }}>
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(100, 255, 218, 0.2)',
                transform: 'translateY(-5px)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.9), rgba(0, 210, 180, 0.7))',
                  color: '#ffffff',
                  borderRadius: '50%',
                  p: 1.2,
                  mr: 2,
                  boxShadow: '0 0 25px rgba(100, 255, 218, 0.5)'
                }}>
                  <PersonIcon />
                </Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#0a192f' }}>
                  KCSTMR 客戶查詢
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8892b0', mb: 3 }}>
                使用 KCSTMR 值查詢相關的記錄，查看特定客戶的所有處方記錄。
              </Typography>
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
            </Paper>
          </Grid>

          <Grid sx={{ gridColumn: { xs: 'span 12', lg: 'span 6' } }}>
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(100, 255, 218, 0.2)',
                transform: 'translateY(-5px)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.9), rgba(255, 100, 0, 0.7))',
                  color: '#ffffff',
                  borderRadius: '50%',
                  p: 1.2,
                  mr: 2,
                  boxShadow: '0 0 25px rgba(255, 152, 0, 0.5)'
                }}>
                  <MedicationIcon />
                </Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#0a192f' }}>
                  KDRUG 藥品查詢
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8892b0', mb: 3 }}>
                使用 KDRUG 值查詢相關的記錄，查看特定藥品的所有處方記錄。
              </Typography>
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
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ 
          mb: 2, 
          fontWeight: 'bold',
          color: '#0a192f',
        }}>
          其他查詢選項
        </Typography>
        <Paper sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            您也可以瀏覽所有可用的 DBF 檔案，並查看每個檔案的記錄。
          </Typography>
          <Link
            to="/dbf-files"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          >
            查看 DBF 檔案
          </Link>
        </Paper>
      </Box>
    </Layout>
  );
}
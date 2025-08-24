import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Paper
} from '@mui/material';
import type { DbfRecord } from '../../types/dbf.types';

interface MainFieldsGridProps {
  record: DbfRecord;
  fields: Array<{
    key: string;
    label: string;
    isMetadata?: boolean;
  }>;
  title?: string;
}

/**
 * 主要欄位網格顯示元件
 * 以網格布局顯示記錄中的主要欄位
 */
function MainFieldsGrid({ 
  record, 
  fields, 
  title = '主要欄位' 
}: MainFieldsGridProps) {
  // 獲取欄位值
  const getFieldValue = (key: string, isMetadata = false) => {
    if (key === '_recordNo') return record._recordNo;
    if (key === '_created') return new Date(record._created).toLocaleString();
    if (key === '_updated') return new Date(record._updated).toLocaleString();
    if (key === '_file') return record._file;
    return record.data[key] || '';
  };

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
          {title}
        </Typography>
        
        <Paper sx={{
          bgcolor: 'white',
          border: '1px solid #e0e0e0',
          p: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Grid container spacing={2}>
            {fields.map(({ key, label, isMetadata }) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  height: '100%'
                }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#1976d2',
                      fontWeight: 'bold',
                      display: 'block',
                      mb: 0.5,
                      fontSize: '0.95rem'
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#333333',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}
                  >
                    {getFieldValue(key, isMetadata)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default MainFieldsGrid;
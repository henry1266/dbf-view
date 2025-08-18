import React from 'react';
import { Grid } from '@mui/material';
import DashboardCard from './DashboardCard';

const StatisticsCards = () => {
  return (
    <Grid container>
      <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
        <DashboardCard 
          title="總檔案數" 
          value="128" 
          icon="📁" 
          color="primary"
        />
      </Grid>
      <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
        <DashboardCard 
          title="總記錄數" 
          value="24,512" 
          icon="📊" 
          color="success"
        />
      </Grid>
      <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
        <DashboardCard 
          title="今日查詢" 
          value="142" 
          icon="🔍" 
          color="warning"
        />
      </Grid>
      <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
        <DashboardCard 
          title="系統效能" 
          value="94%" 
          icon="⚡" 
          color="info"
        />
      </Grid>
    </Grid>
  );
};

export default StatisticsCards;
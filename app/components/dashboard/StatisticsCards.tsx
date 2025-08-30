import React from 'react';
import { Grid } from '@mui/material';
import DashboardCard from './DashboardCard';

// 定義 props 接口
interface StatisticsCardsProps {
  totalLdruI?: number;
  weeklyLdruI?: number;
  a99Count75?: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalLdruI = 0,
  weeklyLdruI = 0,
  a99Count75 = 0
}) => {
  return (
    <Grid container>
      
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
          title="當月調劑"
          value={totalLdruI.toString()}
          icon="💊"
          color="primary"
        />
      </Grid>
      <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
        <DashboardCard
          title="當週調劑"
          value={weeklyLdruI.toString()}
          icon="📅"
          color="warning"
        />
      </Grid>
      <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, p: 1.5 }}>
        <DashboardCard
          title="A99=75 數量"
          value={a99Count75.toString()}
          icon="🔢"
          color="info"
        />
      </Grid>
    </Grid>
  );
};

export default StatisticsCards;
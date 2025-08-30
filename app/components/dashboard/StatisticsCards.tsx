import React from 'react';
import { Grid, Box } from '@mui/material';
import DashboardCard from './DashboardCard';

// 定義 props 接口
interface StatisticsCardsProps {
  totalLdruI?: number;
  weeklyLdruI?: number;
  a99Count75?: number;
  totalA99?: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalLdruI = 0,
  weeklyLdruI = 0,
  a99Count75 = 0,
  totalA99 = 0
}) => {
  return (
    <Grid container>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
        <DashboardCard
          title="當月A99調劑費總和"
          value={totalA99.toString()}
          icon="📊"
          color="success"
        />
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
        <DashboardCard
          title="當月調劑"
          value={totalLdruI.toString()}
          icon="💊"
          color="primary"
        />
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
        <DashboardCard
          title="當週調劑"
          value={weeklyLdruI.toString()}
          icon="📅"
          color="warning"
        />
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1.5 }}>
        <DashboardCard
          title="A99=75 數量"
          value={a99Count75.toString()}
          icon="🔢"
          color="info"
        />
      </Box>
    </Grid>
  );
};

export default StatisticsCards;
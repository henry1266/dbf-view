import React from 'react';
import { Grid, Box } from '@mui/material';
import DashboardCard from './DashboardCard';

// 定義 props 接口
export interface StatisticsCardsProps {
  totalLdruI?: number;
  totalLldcnEq1?: number;
  totalLldcnEq2Or3?: number;
  a99Count75?: number;
  totalA99?: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalLldcnEq1 = 0,
  totalLldcnEq2Or3 = 0,
  a99Count75 = 0,
  totalA99 = 0
}) => {
  return (
    <Grid container  spacing={1}>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1 }}>
        <DashboardCard
          title="當月A99調劑費總和"
          value={totalA99.toString()}
          icon="📊"
          color="success"
        />
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1 }}>
        <DashboardCard
          title="當月 LLDCN ＝1 且 LDRU=I 件數"
          value={totalLldcnEq1.toString()}
          icon="💊"
          color="primary"
        />
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1 }}>
        <DashboardCard
          title="當月 LLDCN ＝2 或 LLDCN ＝3 的項目總計"
          value={totalLldcnEq2Or3.toString()}
          icon="💊"
          color="warning"
        />
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '50%', lg: '23%' }, p: 1 }}>
        <DashboardCard
          title="(LLDCN＝1 OR LLDCN＝2 OR LLDCN＝3) 且 LDRU=I"
          value={(totalLldcnEq1 + totalLldcnEq2Or3).toString()}
          icon="🔢"
          color="info"
        />
      </Box>
    </Grid>
  );
};

export default StatisticsCards;
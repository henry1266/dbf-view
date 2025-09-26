import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

interface LLDCNChartProps {
  data: Array<{
    month: string;
    lldcn1: number;
    lldcn2to3: number;
    total: number;
  }>;
}

/**
 * @component LLDCNChart
 * @description LLDCN 統計數據疊合區域圖組件
 * @param {LLDCNChartProps} props - 組件屬性
 * @returns {JSX.Element} 渲染的疊合區域圖
 */
const LLDCNChart: React.FC<LLDCNChartProps> = ({ data }) => {
  // 格式化月份顯示 (民國年轉西元年顯示)
  const formatMonth = (monthStr: string) => {
    if (monthStr.length === 5) {
      const year = parseInt(monthStr.substring(0, 3)) + 1911;
      const month = monthStr.substring(3);
      return `${year}/${month}`;
    }
    return monthStr;
  };

  // 自定義 Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(17, 34, 64, 0.9)',
          border: '1px solid rgba(100, 255, 218, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          fontFamily: 'monospace',
          color: '#e6f1ff',
          boxShadow: '0 4px 20px rgba(100, 255, 218, 0.2)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#64ffda' }}>
            {`月份: ${formatMonth(label)}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{
              margin: '4px 0',
              color: entry.color,
              fontSize: '0.9rem'
            }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(100, 255, 218, 0.2)"
        />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          stroke="#e6f1ff"
          fontFamily="monospace"
          fontSize={12}
        />
        <YAxis
          stroke="#e6f1ff"
          fontFamily="monospace"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontFamily: 'monospace',
            color: '#e6f1ff',
            fontSize: '0.9rem'
          }}
        />
        {/* LLDCN=1 在底部 */}
        <Area
          type="monotone"
          dataKey="lldcn1"
          stackId="1"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.8}
          name="LLDCN=1"
        >
          <LabelList
            dataKey="lldcn1"
            position="center"
            fill="#ffffff"
            fontSize={12}
            fontFamily="monospace"
            formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() : value}
          />
        </Area>
        {/* LLDCN=2-3 疊加在上面 */}
        <Area
          type="monotone"
          dataKey="lldcn2to3"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.8}
          name="LLDCN=2-3"
        >
          <LabelList
            dataKey="lldcn2to3"
            position="center"
            fill="#ffffff"
            fontSize={12}
            fontFamily="monospace"
            formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() : value}
          />
        </Area>
        {/* 總和線條 */}
        <Area
          type="monotone"
          dataKey="total"
          stackId="2"
          stroke="#f97316"
          fill="transparent"
          strokeWidth={3}
          name="總計"
          dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
        >
          <LabelList
            dataKey="total"
            position="top"
            fill="#f97316"
            fontSize={12}
            fontFamily="monospace"
            fontWeight="bold"
            formatter={(value: any) => typeof value === 'number' ? `總:${value.toLocaleString()}` : value}
          />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LLDCNChart;
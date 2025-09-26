import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
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
 * @description LLDCN 統計數據折線圖組件
 * @param {LLDCNChartProps} props - 組件屬性
 * @returns {JSX.Element} 渲染的折線圖
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
      <LineChart
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
        <Line
          type="monotone"
          dataKey="lldcn1"
          stroke="#3b82f6"
          strokeWidth={3}
          name="LLDCN=1"
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e40af' }}
        />
        <Line
          type="monotone"
          dataKey="lldcn2to3"
          stroke="#10b981"
          strokeWidth={3}
          name="LLDCN=2-3"
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#047857' }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#f97316"
          strokeWidth={3}
          name="總計"
          dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#c2410c' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LLDCNChart;
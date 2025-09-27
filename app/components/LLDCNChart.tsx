import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line,
  LineChart,
  ReferenceLine
} from 'recharts';

interface LLDCNChartProps {
  data: Array<{
    month: string;
    lldcn1: number;
    lldcn2to3: number;
    total: number;
  }>;
}

interface ChartEntry extends LLDCNChartProps['data'][number] {
  refillShare: number | null;
  recoveryRate: number | null;
}

const LLDCNChart: React.FC<LLDCNChartProps> = ({ data }) => {
  const formatMonth = (monthStr: string) => {
    if (monthStr.length === 5) {
      const year = parseInt(monthStr.substring(0, 3), 10) + 1911;
      const month = monthStr.substring(3);
      return `${year}/${month}`;
    }
    return monthStr;
  };

  const formatPercent = (value: number | null | undefined, digits = 1) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 'N/A';
    }
    return `${(value * 100).toFixed(digits)}%`;
  };

  const chartData: ChartEntry[] = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map((row, index) => {
      const total = typeof row.total === 'number' ? row.total : 0;
      const refillShare = total > 0 ? row.lldcn2to3 / total : null;
      const nextRow = data[index + 1];
      const recoveryRate =
        nextRow && typeof row.lldcn1 === 'number' && row.lldcn1 > 0
          ? nextRow.lldcn2to3 / row.lldcn1
          : null;
      return {
        ...row,
        refillShare,
        recoveryRate
      };
    });
  }, [data]);

  const lag1Correlation = useMemo(() => {
    if (!Array.isArray(data) || data.length < 2) {
      return null;
    }

    const seriesN: number[] = [];
    const seriesRNext: number[] = [];

    for (let i = 0; i < data.length - 1; i += 1) {
      const currentN = data[i]?.lldcn1;
      const nextR = data[i + 1]?.lldcn2to3;

      if (typeof currentN === 'number' && typeof nextR === 'number') {
        seriesN.push(currentN);
        seriesRNext.push(nextR);
      }
    }

    if (seriesN.length < 2) {
      return null;
    }

    const mean = (arr: number[]) =>
      arr.reduce((acc, value) => acc + value, 0) / arr.length;

    const meanN = mean(seriesN);
    const meanR = mean(seriesRNext);

    let numerator = 0;
    let denomLeft = 0;
    let denomRight = 0;

    for (let i = 0; i < seriesN.length; i += 1) {
      const diffN = seriesN[i] - meanN;
      const diffR = seriesRNext[i] - meanR;
      numerator += diffN * diffR;
      denomLeft += diffN ** 2;
      denomRight += diffR ** 2;
    }

    const denominator = Math.sqrt(denomLeft * denomRight);

    if (denominator === 0) {
      return null;
    }

    return numerator / denominator;
  }, [data]);

  const ratioAxisMax = useMemo(() => {
    const maxValue = chartData.reduce((max, row) => {
      if (typeof row.recoveryRate === 'number') {
        return Math.max(max, row.recoveryRate);
      }
      return max;
    }, 0);
    const upper = Math.max(1.8, maxValue);
    return Number.isFinite(upper) && upper > 0 ? Math.max(upper * 1.1, 2) : 2;
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const row = payload[0]?.payload as ChartEntry | undefined;

      return (
        <div
          style={{
            backgroundColor: 'rgba(17, 34, 64, 0.9)',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            fontFamily: 'monospace',
            color: '#e6f1ff',
            boxShadow: '0 4px 20px rgba(100, 255, 218, 0.2)'
          }}
        >
          <p
            style={{
              margin: '0 0 8px 0',
              fontWeight: 'bold',
              color: '#64ffda'
            }}
          >
            {`月份: ${formatMonth(label)}`}
          </p>
          {payload.map((entry: any, index: number) => {
            const displayValue =
              typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value;

            return (
              <p
                key={index}
                style={{
                  margin: '4px 0',
                  color: entry.color,
                  fontSize: '0.9rem'
                }}
              >
                {`${entry.name}: ${displayValue}`}
              </p>
            );
          })}
          <p
            style={{
              margin: '8px 0 0 0',
              color: '#facc15',
              fontSize: '0.85rem'
            }}
          >
            {`續領占比: ${formatPercent(row?.refillShare, 1)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const RecoveryTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'rgba(17, 34, 64, 0.9)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            fontFamily: 'monospace',
            color: '#fefce8',
            boxShadow: '0 4px 20px rgba(234, 179, 8, 0.2)'
          }}
        >
          <p
            style={{
              margin: '0 0 8px 0',
              fontWeight: 'bold',
              color: '#facc15'
            }}
          >
            {`月份: ${formatMonth(label)}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{
                margin: '4px 0',
                color: entry.color,
                fontSize: '0.9rem'
              }}
            >
              {`${entry.name}: ${formatPercent(entry.value, 1)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const correlationLabel =
    typeof lag1Correlation === 'number'
      ? `Lag-1 Pearson: ${lag1Correlation.toFixed(2)}`
      : 'Lag-1 Pearson: N/A';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        height: '100%'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: 400 }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            fontFamily: 'monospace',
            color: '#64ffda',
            fontSize: '0.95rem',
            letterSpacing: '0.05em'
          }}
        >
          表一：LLDCN 月度趨勢
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 40,
              right: 40,
              left: 20,
              bottom: 20
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
              fontSize={15}
            />
            <YAxis
              yAxisId="left"
              stroke="#e6f1ff"
              fontFamily="monospace"
              fontSize={15}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontFamily: 'monospace',
                color: '#e6f1ff',
                fontSize: '0.9rem'
              }}
            />
            <Area
              type="monotone"
              dataKey="lldcn1"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b83f681"
              fillOpacity={0.8}
              name="LLDCN=1"
              yAxisId="left"
            >
              <LabelList
                dataKey="lldcn1"
                position="bottom"
                fill="#ffffff"
                fontSize={15}
                fontFamily="monospace"
                formatter={(value: any) =>
                  typeof value === 'number' ? value.toLocaleString() : value
                }
              />
            </Area>
            <Area
              type="monotone"
              dataKey="lldcn2to3"
              stackId="1"
              stroke="#10b981"
              fill="#10b9818c"
              fillOpacity={0.8}
              name="LLDCN=2-3"
              yAxisId="left"
            >
              <LabelList
                dataKey="lldcn2to3"
                position="bottom"
                fill="#ffffff"
                fontSize={15}
                fontFamily="monospace"
                formatter={(value: any) =>
                  typeof value === 'number' ? value.toLocaleString() : value
                }
              />
            </Area>
            <Area
              type="monotone"
              dataKey="total"
              stackId="2"
              stroke="#f97316"
              fill="transparent"
              strokeWidth={3}
              name="總量"
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              yAxisId="left"
            >
              <LabelList
                dataKey="total"
                position="top"
                fill="#f97316"
                fontSize={14}
                fontFamily="monospace"
                fontWeight="bold"
                formatter={(value: any) =>
                  typeof value === 'number'
                    ? `總 ${value.toLocaleString()}`
                    : value
                }
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 320 }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            fontFamily: 'monospace',
            color: '#facc15',
            fontSize: '0.95rem',
            letterSpacing: '0.05em'
          }}
        >
          表二：T+1 續領回補率
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 40,
              right: 40,
              left: 20,
              bottom: 20
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(250, 204, 21, 0.2)" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              stroke="#fbed96"
              fontFamily="monospace"
              fontSize={15}
            />
            <YAxis
              stroke="#fbed96"
              fontFamily="monospace"
              fontSize={15}
              tickFormatter={(value: number) => formatPercent(value, 0)}
              domain={[0, ratioAxisMax]}
              allowDecimals
            />
            <Tooltip content={<RecoveryTooltip />} />
            <Legend
              wrapperStyle={{
                fontFamily: 'monospace',
                color: '#facc15',
                fontSize: '0.9rem'
              }}
            />
            <ReferenceLine
              y={1}
              stroke="#ef4444"
              strokeDasharray="6 6"
              label={{
                position: 'insideTopRight',
                value: '警戒線 1.0',
                fill: '#ef4444',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
            />
            <ReferenceLine
              y={1.8}
              stroke="#dc2626"
              strokeDasharray="4 4"
              label={{
                position: 'insideTopRight',
                value: '警戒線 1.8',
                fill: '#dc2626',
                fontSize: 12,
                fontFamily: 'monospace'
              }}
            />
            <Line
              type="monotone"
              dataKey="recoveryRate"
              stroke="#facc15"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#facc15', fill: '#111a2b', strokeWidth: 2 }}
              name="T+1 續領回補率"
              isAnimationActive={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            backgroundColor: 'rgba(17, 34, 64, 0.9)',
            border: '1px solid rgba(100, 255, 218, 0.4)',
            borderRadius: 6,
            padding: '6px 10px',
            fontFamily: 'monospace',
            color: '#e6f1ff',
            fontSize: '0.85rem',
            pointerEvents: 'none'
          }}
        >
          {correlationLabel}
        </div>
      </div>
    </div>
  );
};

export default LLDCNChart;

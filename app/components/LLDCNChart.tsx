import React, { useMemo, useState } from 'react';
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
  ComposedChart,
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
  normalBandLow: number | null;
  normalBandHigh: number | null;
  bandSpan: number | null;
}

const getMedian = (values: number[]): number => {
  if (values.length === 0) {
    return Number.NaN;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

const getStandardDeviation = (values: number[], meanValue: number): number => {
  if (values.length === 0) {
    return 0;
  }
  const variance =
    values.reduce((acc, value) => acc + (value - meanValue) ** 2, 0) /
    values.length;
  return Math.sqrt(variance);
};

const formatPercent = (value: number | null | undefined, digits = 1) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'N/A';
  }
  return `${(value * 100).toFixed(digits)}%`;
};

const LLDCNChart: React.FC<LLDCNChartProps> = ({ data }) => {
  const [noteOpen, setNoteOpen] = useState(false);

  const formatMonth = (monthStr: string) => {
    if (monthStr.length === 5) {
      const year = parseInt(monthStr.substring(0, 3), 10) + 1911;
      const month = monthStr.substring(3);
      return `${year}/${month}`;
    }
    return monthStr;
  };

  const chartData: ChartEntry[] = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    const baseRows = data.map((row, index) => {
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
        recoveryRate,
        normalBandLow: null,
        normalBandHigh: null,
        bandSpan: null
      };
    });

    return baseRows.map((row, index, rows) => {
      const windowSlice = rows
        .slice(Math.max(0, index - 11), index + 1)
        .map((entry) => entry.recoveryRate)
        .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));

      if (windowSlice.length >= 6) {
        const medianValue = getMedian(windowSlice);
        if (!Number.isNaN(medianValue)) {
          const deviations = windowSlice.map((value) => Math.abs(value - medianValue));
          const mad = getMedian(deviations);

          let lowerBound: number | null = null;
          let upperBound: number | null = null;

          if (mad > 0) {
            const offset = mad * 1.5;
            lowerBound = medianValue - offset;
            upperBound = medianValue + offset;
          } else {
            const meanValue =
              windowSlice.reduce((acc, value) => acc + value, 0) / windowSlice.length;
            const sd = getStandardDeviation(windowSlice, meanValue);
            const offset = sd * 2;
            lowerBound = meanValue - offset;
            upperBound = meanValue + offset;
          }

          if (
            typeof lowerBound === 'number' &&
            typeof upperBound === 'number' &&
            Number.isFinite(lowerBound) &&
            Number.isFinite(upperBound)
          ) {
            const normalizedLow = Math.max(lowerBound, 0);
            const normalizedHigh = Math.max(upperBound, normalizedLow);
            const span = normalizedHigh - normalizedLow;

            return {
              ...row,
              normalBandLow: normalizedLow,
              normalBandHigh: normalizedHigh,
              bandSpan: span >= 0 ? span : 0
            };
          }
        }
      }

      return row;
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
    if (!chartData.length) {
      return 2;
    }

    const maxValue = chartData.reduce((acc, row) => {
      const candidates = [row.recoveryRate, row.normalBandHigh];
      const rowMax = candidates.reduce((innerMax, value) => {
        if (typeof value === 'number' && Number.isFinite(value)) {
          return Math.max(innerMax, value);
        }
        return innerMax;
      }, acc);
      return Math.max(acc, rowMax);
    }, 0);

    const upper = Math.max(1.8, maxValue);
    const padded = upper * 1.1;
    return Number.isFinite(padded) && padded > 0 ? Math.max(padded, 2) : 2;
  }, [chartData]);

  const correlationLabel =
    typeof lag1Correlation === 'number'
      ? `Lag-1 Pearson: ${lag1Correlation.toFixed(2)}`
      : 'Lag-1 Pearson: N/A';

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
      const row = payload[0]?.payload as ChartEntry | undefined;
      if (!row) {
        return null;
      }

      const hasBand =
        typeof row.normalBandLow === 'number' && typeof row.normalBandHigh === 'number';

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
          <p
            style={{
              margin: '4px 0',
              color: '#facc15',
              fontSize: '0.9rem'
            }}
          >
            {`T+1 續領回補率: ${formatPercent(row.recoveryRate, 1)}`}
          </p>
          <p
            style={{
              margin: '4px 0',
              color: '#fde68a',
              fontSize: '0.85rem'
            }}
          >
            {`常態帶: ${hasBand ? `${formatPercent(row.normalBandLow, 1)} ~ ${formatPercent(row.normalBandHigh, 1)}` : 'N/A'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const noteDialogId = 'recovery-interpretation-dialog';

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
      <div style={{ position: 'relative', width: '100%', height: 400, overflow: 'visible' }}>
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
        {noteOpen && (
          <div
            id={noteDialogId}
            role="dialog"
            aria-modal="false"
            aria-labelledby="recovery-interpretation-title"
            style={{
              position: 'absolute',
              top: -25,
              right: 16,
              width: 'min(420px, 90%)',
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '10px',
              padding: '16px',
              color: '#fefce8',
              fontFamily: 'monospace',
              backdropFilter: 'blur(100px)',           // 模糊濾鏡
              WebkitBackdropFilter: 'blur(100px)',     // Safari 相容
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // 建議加柔和陰影
              zIndex: 5
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}
            >
              <div
                id="recovery-interpretation-title"
                style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#facc15'
                }}
              >
                判讀說明
              </div>
              <button
                type="button"
                onClick={() => setNoteOpen(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(250, 204, 21, 0.4)',
                  borderRadius: '4px',
                  color: '#facc15',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  padding: '2px 8px',
                  cursor: 'pointer'
                }}
              >
                關閉
              </button>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', lineHeight: 1.6 }}>
              觀察窗口：最近 6–12 個月的 T+1 續領回補率，確保資料量足夠但保持新鮮度。
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', lineHeight: 1.6 }}>
              常態帶計算：以移動中位數為中心，常態時使用 ±1.5×MAD 作為監測區間；當 MAD 近似 0 時改用 ±2×標準差避免區間坍縮。
            </p>
            <div
              style={{
                border: '1px solid rgba(250, 204, 21, 0.35)',
                borderRadius: '8px',
                padding: '12px',
                background: 'rgba(250, 204, 21, 0.2)',
                display: 'grid',
                rowGap: '8px',
                fontSize: '0.85rem',
                lineHeight: 1.6
              }}
            >
              <div style={{ color: '#facc15', fontWeight: 'bold' }}>T+1 續領回補率判讀提示</div>
              <div>
                <strong>常態帶內</strong>：視為穩定。
                <br />
                <strong>警戒線 1.0 與 1.8</strong>：搭配常態帶作為分級監控門檻。
              </div>
              <div>
                <strong>1.2–1.8（健康區間）</strong>：續領節奏正常，2nd/3rd fill 管線供應充足。
              </div>
              <div>
                <strong>{'< 1.0'} 偏弱警訊</strong>：可能續領流失，或 t 月首開暴增造成分母放大但隔月回補不足，需檢視首開轉續流程與用藥黏著度。
              </div>
              <div>
                <strong>{'> 1.8'} 偏高警訊</strong>：可能因 t−1 月首開高峰集中於 t+1 回補，或月度結算／連假前後的提前/延後領藥。代表續領動能偏高，需留意供應緊俏或政策拉貨。
              </div>
            </div>
          </div>
        )}
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
                    ? ` ${value.toLocaleString()}`
                    : value
                }
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 12px',
            background: 'linear-gradient(90deg, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 0.6))',
            borderRadius: '6px 6px 0 0'
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              color: '#facc15',
              fontSize: '0.95rem'
            }}
          >
            表二：T+1 續領回補率
          </span>
          <button
            type="button"
            onClick={() => setNoteOpen((prev) => !prev)}
            aria-expanded={noteOpen}
            aria-controls={noteDialogId}
            style={{
              backgroundColor: 'rgba(250, 204, 21, 0)',
              border: '1px solid rgba(250, 204, 21, 0.6)',
              borderRadius: '6px',
              color: '#facc15',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            判讀註解
          </button>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 20,
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
              <Area
                type="monotone"
                dataKey="normalBandLow"
                stackId="band"
                stroke="none"
                fill="transparent"
                isAnimationActive={false}
                legendType="none"
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="bandSpan"
                stackId="band"
                stroke="none"
                fill="rgba(250, 204, 21, 0.2)"
                name="常態帶"
                isAnimationActive={false}
                connectNulls
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
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 110,
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




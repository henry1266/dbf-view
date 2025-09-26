import React from 'react';
import { Grid, Box, Paper, Typography, Stack, Tooltip } from '@mui/material';

export interface DailyA99AmountPanelProps {
  dailyA99GroupStats: {
    totalSum: number;
    valueGroups: Record<string, number>;
  };
  dailyLdruI?: number;
  dailyLldcnEq1?: number;
  dailyLldcnEq2Or3?: number;
}

const DailyA99AmountPanel: React.FC<DailyA99AmountPanelProps> = ({ dailyA99GroupStats, dailyLdruI = 0, dailyLldcnEq1 = 0, dailyLldcnEq2Or3 = 0 }) => {
  const entries = Object.entries(dailyA99GroupStats.valueGroups);
  const totalSum = dailyA99GroupStats.totalSum || 1;
  const sortedEntries = entries
    .map(([value, count]) => ({
      value,
      count,
      product: Number(value) * count,
    }))
    .sort((a, b) => b.product - a.product)
    .slice(0, 3);

  const colors = [
    { bg: 'rgba(64, 175, 255, 0.2)', color: '#40afff', barColor: 'primary.main', shadow: 'rgba(64, 175, 255, 0.5)' },
    { bg: 'rgba(100, 255, 218, 0.2)', color: '#64ffda', barColor: 'success.main', shadow: 'rgba(100, 255, 218, 0.5)' },
    { bg: 'rgba(255, 171, 64, 0.2)', color: '#ffab40', barColor: 'warning.main', shadow: 'rgba(255, 171, 64, 0.5)' },
  ];

  return (
    <Grid sx={{ width: { xs: '100%', lg: '24%' }, p: 1 }}>
      <Stack spacing={3}>

        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 220,
            bgcolor: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 30px rgba(100, 255, 218, 0.4)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.9), transparent)',

            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '10%',
              width: '80%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.6), transparent)',
            }
          }}
        >
          <Typography variant="h6" gutterBottom sx={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: '#b3ddffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>當日調劑 LDRU=I </span>
            <Box component="span" sx={{
              fontSize: '0.9rem',
              color: '#b3ddffff',
              display: 'flex',
              alignItems: 'center',
            }}>
              DAY
            </Box>
          </Typography>

          {/* 分組顯示 LLDCN=1 | LLDCN=2-3 且 LDRU=I 與其他 LDRU=I */}
          {(() => {
            const c1 = dailyLldcnEq1 || 0;
            const c2to3 = dailyLldcnEq2Or3 || 0;
            const cOther = dailyLdruI - c1 - c2to3;
            const total = dailyLdruI || 1;
            return (
              <>
                {/* LLDCN=1 與 LLDCN=2-3 同一條長條圖，數字加總顯示於標題，個別數字標示於長條圖上 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: '#e6f1ff',
                    textShadow: '0 0 5px rgba(230, 241, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    LLDCN=1  | LLDCN=2-3
                  </Typography>
                    <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: '#87c8fdff',
                  }}>
                    {(c1 + c2to3).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{
                  flex: 1,
                  height: 20,
                  bgcolor: '#1e293b',
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #334155',
                  mb: 2
                }}>
                  <Tooltip title={c1.toLocaleString()} arrow>
                    <Box sx={{
                      position: 'absolute',
                      left: 0,
                      height: '100%',
                      width: `${(c1 / total) * 100}%`,
                      bgcolor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '0.75rem', lineHeight: 1 }}>
                        {c1.toLocaleString()}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title={c2to3.toLocaleString()} arrow>
                    <Box sx={{
                      position: 'absolute',
                      left: `${(c1 / total) * 100}%`,
                      height: '100%',
                      width: `${(c2to3 / total) * 100}%`,
                      bgcolor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '0.75rem', lineHeight: 1 }}>
                        {c2to3.toLocaleString()}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
                {/* 其他 LDRU=I */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 0 }}>
                  <Typography variant="body2" sx={{
                    fontSize: '1rem',
                    color: '#e6f1ff',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    其他
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    color: '#f97316',
                  }}>
                    {cOther.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{
                  flex: 1,
                  height: 5,
                  bgcolor: '#1e293b',
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #334155'
                }}>
                  <Tooltip title={cOther.toLocaleString()} arrow>
                    <Box sx={{
                      height: '100%',
                      width: `${(cOther / total) * 100}%`,
                      bgcolor: '#f97316'
                    }} />
                  </Tooltip>
                </Box>
              </>
            );
          })()}
          {/* LDRU=I 總計 */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
            borderTop: '1px solid rgba(64, 175, 255, 0.2)',
            pt: 1
          }}>
            <Typography variant="body2" sx={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #40afff, #64ffda)',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              總計: {dailyLdruI.toLocaleString()} 張
            </Typography>
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 250,
            bgcolor: 'rgba(17, 34, 64, 0.6)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 30px rgba(100, 255, 218, 0.4)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(100, 255, 218, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.9), transparent)',
              boxShadow: '0 0 20px rgba(100, 255, 218, 0.8)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '10%',
              width: '80%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.6), transparent)',
              boxShadow: '0 0 10px rgba(100, 255, 218, 0.4)',
            },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: '0.9rem',
              color: '#b3ddffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>當日調劑費 A99</span>
            <Box
              component="span"
              sx={{
                fontSize: '0.9rem',
                color: '#b3ddffff',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              DAY
            </Box>
          </Typography>

          {sortedEntries.map((entry, index) => {
            const { value, count, product } = entry;
            const percentage = (product / totalSum) * 100;
            const color = colors[index % colors.length];

            return (
              <React.Fragment key={value}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: index === 0 ? 1 : 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      color: '#e6f1ff',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: '0.9rem',
                        bgcolor: color.bg,
                        px: 0.6,
                        py: 0.2,
                        borderRadius: 0.8,
                        color: color.color,
                        mr: 0.5,
                      }}
                    >
                      {count}×
                    </Box>
                    {value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      color: color.color,
                    }}
                  >
                    {product}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        flex: 1,
                        height: 5,
                        bgcolor: '#1e293b',
                        borderRadius: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid #334155',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${percentage}%`,
                          bgcolor: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f97316',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
              borderTop: '1px solid rgba(64, 175, 255, 0.2)',
              pt: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #40afff, #64ffda)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              總計: {dailyA99GroupStats.totalSum.toLocaleString()} 點
            </Typography>
          </Box>
        </Paper>
      </Stack>
    </Grid>
  );
};

export default DailyA99AmountPanel;
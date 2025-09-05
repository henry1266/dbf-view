import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Paper, Typography, Slider, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { saveWhiteboard, loadWhiteboard, deleteWhiteboard } from '../../services/api';

interface TouchWhiteboardProps {
  width?: number;
  height?: number;
  recordId?: string; // 用於儲存特定記錄的畫布
  useDatabase?: boolean; // 是否使用資料庫儲存，預設為 false (使用 localStorage)
}

export default function TouchWhiteboard({ width = 800, height = 400, recordId, useDatabase = false }: TouchWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [brushColor, setBrushColor] = useState('#64ffda');
  const [brushSize, setBrushSize] = useState(2);

  const storageKey = recordId ? `whiteboard_${recordId}` : 'whiteboard_default';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
        setContext(ctx);
      }
    }
  }, [recordId]); // 添加 recordId 作為依賴，當記錄改變時重新初始化

  // 當 context 設置完成後載入畫布
  useEffect(() => {
    if (context && recordId) {
      loadCanvas();
    }
  }, [context, recordId]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
    }
  }, [brushColor, brushSize, context]);

  const startDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;

    setIsDrawing(true);
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      context.beginPath();
      context.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const draw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      context.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.beginPath();
    }
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const saveCanvas = async () => {
    if (canvasRef.current) {
      try {
        const dataURL = canvasRef.current.toDataURL('image/png');

        if (useDatabase && recordId) {
          // 使用資料庫儲存
          await saveWhiteboard(recordId, dataURL);
          console.log('畫布已儲存到資料庫', recordId);
        } else {
          // 使用 localStorage 儲存
          localStorage.setItem(storageKey, dataURL);
          console.log('畫布已儲存到 localStorage', storageKey);
        }

        // 添加成功提示
        alert('畫布已成功儲存！');
      } catch (error) {
        console.error('儲存畫布失敗:', error);
        alert('儲存失敗，請檢查網路連線或重試。');
      }
    } else {
      console.error('畫布參考不存在');
      alert('畫布尚未初始化，請稍後再試。');
    }
  };

  const loadCanvas = async () => {
    try {
      let savedData: string | null = null;

      if (useDatabase && recordId) {
        // 從資料庫載入
        savedData = await loadWhiteboard(recordId);
        console.log('從資料庫載入畫布:', recordId, '資料長度:', savedData?.length || 0);
      } else {
        // 從 localStorage 載入
        savedData = localStorage.getItem(storageKey);
        console.log('從 localStorage 載入畫布:', storageKey, '資料長度:', savedData?.length || 0);
      }

      if (savedData && canvasRef.current && context) {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current && context) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            context.drawImage(img, 0, 0);
            console.log('畫布已成功載入');
          }
        };
        img.onerror = () => {
          console.error('載入畫布圖片失敗');
        };
        img.src = savedData;
      } else {
        console.log('沒有找到已儲存的畫布資料');
      }
    } catch (error) {
      console.error('載入畫布失敗:', error);
    }
  };

  const exportCanvas = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `whiteboard_${recordId || 'export'}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(100, 255, 218, 0.3)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 120, 255, 0.3)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: '#64ffda',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        觸控書寫小白板
      </Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        {/* 工具列 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={clearCanvas}
            sx={{
              color: '#64ffda',
              borderColor: '#64ffda',
              '&:hover': {
                borderColor: '#64ffda',
                bgcolor: 'rgba(100, 255, 218, 0.1)',
              },
              fontFamily: 'monospace',
              fontSize: '0.8rem',
            }}
          >
            清除
          </Button>
          <Button
            variant="outlined"
            onClick={saveCanvas}
            sx={{
              color: '#64ffda',
              borderColor: '#64ffda',
              '&:hover': {
                borderColor: '#64ffda',
                bgcolor: 'rgba(100, 255, 218, 0.1)',
              },
              fontFamily: 'monospace',
              fontSize: '0.8rem',
            }}
          >
            儲存
          </Button>
          <Button
            variant="outlined"
            onClick={exportCanvas}
            sx={{
              color: '#64ffda',
              borderColor: '#64ffda',
              '&:hover': {
                borderColor: '#64ffda',
                bgcolor: 'rgba(100, 255, 218, 0.1)',
              },
              fontFamily: 'monospace',
              fontSize: '0.8rem',
            }}
          >
            匯出
          </Button>
        </Box>

        {/* 筆刷設定 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel sx={{ color: '#64ffda', fontFamily: 'monospace' }}>顏色</InputLabel>
            <Select
              value={brushColor}
              label="顏色"
              onChange={(e) => setBrushColor(e.target.value)}
              sx={{
                color: '#64ffda',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#64ffda',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#64ffda',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#64ffda',
                },
                fontFamily: 'monospace',
              }}
            >
              <MenuItem value="#64ffda" sx={{ fontFamily: 'monospace' }}>青色</MenuItem>
              <MenuItem value="#ff6b6b" sx={{ fontFamily: 'monospace' }}>紅色</MenuItem>
              <MenuItem value="#4ecdc4" sx={{ fontFamily: 'monospace' }}>藍綠</MenuItem>
              <MenuItem value="#45b7d1" sx={{ fontFamily: 'monospace' }}>藍色</MenuItem>
              <MenuItem value="#f9ca24" sx={{ fontFamily: 'monospace' }}>黃色</MenuItem>
              <MenuItem value="#6c5ce7" sx={{ fontFamily: 'monospace' }}>紫色</MenuItem>
              <MenuItem value="#fd79a8" sx={{ fontFamily: 'monospace' }}>粉色</MenuItem>
              <MenuItem value="#00b894" sx={{ fontFamily: 'monospace' }}>綠色</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
            <Typography sx={{ color: '#64ffda', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              筆刷大小: {brushSize}
            </Typography>
            <Slider
              value={brushSize}
              onChange={(_, newValue) => setBrushSize(newValue as number)}
              min={1}
              max={20}
              sx={{
                color: '#64ffda',
                '& .MuiSlider-thumb': {
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(100, 255, 218, 0.16)',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            border: '2px solid rgba(100, 255, 218, 0.5)',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            touchAction: 'none',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </Box>
    </Paper>
  );
}
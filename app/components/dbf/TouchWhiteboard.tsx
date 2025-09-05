import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

interface TouchWhiteboardProps {
  width?: number;
  height?: number;
}

export default function TouchWhiteboard({ width = 800, height = 400 }: TouchWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#64ffda';
        setContext(ctx);
      }
    }
  }, []);

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

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
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
          }}
        >
          清除
        </Button>
      </Box>

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
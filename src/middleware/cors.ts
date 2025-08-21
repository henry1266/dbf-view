/**
 * @file cors.ts
 * @description CORS 中間件設定
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @function corsMiddleware
 * @description 允許跨域請求的中間件
 * @param {Request} req - Express 請求對象
 * @param {Response} res - Express 回應對象
 * @param {NextFunction} next - Express 下一個中間件函數
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 允許所有來源的請求
  res.header('Access-Control-Allow-Origin', '*');
  
  // 允許的請求頭
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  // 如果是預檢請求 (OPTIONS)，則回應 200
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  
  // 繼續下一個中間件
  next();
}
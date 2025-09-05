import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

// 使用現有的環境變數配置
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DB || 'dbf-view';
const COLLECTION_NAME = 'whiteboards';

// 獲取 MongoDB 客戶端
async function getMongoClient() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}

/**
 * 儲存畫布資料
 */
export const saveWhiteboard = async (req: Request, res: Response) => {
  try {
    const { recordId, canvasData } = req.body;

    if (!recordId || !canvasData) {
      return res.status(400).json({
        error: '缺少必要參數: recordId 或 canvasData'
      });
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // 更新或插入畫布資料
    const result = await collection.updateOne(
      { recordId },
      {
        $set: {
          canvasData,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    await client.close();

    res.json({
      success: true,
      message: '畫布已儲存',
      result
    });
  } catch (error) {
    console.error('儲存畫布失敗:', error);
    res.status(500).json({
      error: '儲存畫布失敗',
      details: error.message
    });
  }
};

/**
 * 載入畫布資料
 */
export const loadWhiteboard = async (req: Request, res: Response) => {
  try {
    const { recordId } = req.params;

    if (!recordId) {
      return res.status(400).json({
        error: '缺少必要參數: recordId'
      });
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const whiteboard = await collection.findOne({ recordId });

    await client.close();

    if (!whiteboard) {
      return res.status(404).json({
        error: '找不到畫布資料'
      });
    }

    res.json({
      recordId: whiteboard.recordId,
      canvasData: whiteboard.canvasData,
      createdAt: whiteboard.createdAt,
      updatedAt: whiteboard.updatedAt
    });
  } catch (error) {
    console.error('載入畫布失敗:', error);
    res.status(500).json({
      error: '載入畫布失敗',
      details: error.message
    });
  }
};

/**
 * 刪除畫布資料
 */
export const deleteWhiteboard = async (req: Request, res: Response) => {
  try {
    const { recordId } = req.params;

    if (!recordId) {
      return res.status(400).json({
        error: '缺少必要參數: recordId'
      });
    }

    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.deleteOne({ recordId });

    await client.close();

    res.json({
      success: true,
      message: '畫布已刪除',
      result
    });
  } catch (error) {
    console.error('刪除畫布失敗:', error);
    res.status(500).json({
      error: '刪除畫布失敗',
      details: error.message
    });
  }
};

/**
 * 獲取所有畫布列表
 */
export const getWhiteboards = async (req: Request, res: Response) => {
  try {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const whiteboards = await collection.find({}).toArray();

    await client.close();

    res.json({
      whiteboards: whiteboards.map(wb => ({
        recordId: wb.recordId,
        createdAt: wb.createdAt,
        updatedAt: wb.updatedAt
      }))
    });
  } catch (error) {
    console.error('獲取畫布列表失敗:', error);
    res.status(500).json({
      error: '獲取畫布列表失敗',
      details: error.message
    });
  }
};
/**
 * @file mongo.ts
 * @description MongoDB 連接和集合管理
 */

import { MongoClient, Collection, Db } from 'mongodb';
import { DbfRecord, DbfCollections } from '../types';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

// MongoDB 連接
let db: Db | null = null;
let dbfRecordsCollections: DbfCollections = {};

/**
 * @async
 * @function connect
 * @description 連接到MongoDB數據庫並初始化DBF檔案集合引用
 * @returns {Promise<Db>} 返回MongoDB數據庫實例
 * @throws {Error} 如果連接失敗則拋出錯誤
 */
export async function connect(): Promise<Db> {
  // 如果已經連接，直接返回數據庫實例
  if (db) return db;
  
  try {
    // 創建MongoDB客戶端並連接
    const mongoClient = new MongoClient(process.env.MONGO_URI || '');
    await mongoClient.connect();
    
    // 獲取數據庫實例
    db = mongoClient.db(process.env.MONGO_DB);
    
    // 獲取所有集合
    const collections = await db.listCollections().toArray();
    
    // 為每個 DBF 檔案創建集合引用
    for (const collection of collections) {
      if (collection.name.startsWith(process.env.MONGO_COLLECTION_PREFIX || '')) {
        const fileName = collection.name.replace(process.env.MONGO_COLLECTION_PREFIX || '', '');
        dbfRecordsCollections[fileName] = db.collection<DbfRecord>(collection.name);
      }
    }
    
    console.log('API server connected to MongoDB');
    return db;
  } catch (err) {
    console.error('API server failed to connect to MongoDB:', err);
    throw err;
  }
}

/**
 * @function getDb
 * @description 獲取MongoDB數據庫實例
 * @returns {Db | null} 返回MongoDB數據庫實例，如果未連接則返回null
 */
export function getDb(): Db | null {
  return db;
}

/**
 * @function getCollection
 * @description 獲取指定DBF檔案的集合
 * @param {string} fileName - DBF檔案名稱（不含副檔名）
 * @returns {Collection<DbfRecord> | undefined} 返回集合實例，如果不存在則返回undefined
 */
export function getCollection(fileName: string): Collection<DbfRecord> | undefined {
  return dbfRecordsCollections[fileName.toLowerCase()];
}

/**
 * @function getAllCollections
 * @description 獲取所有DBF檔案的集合
 * @returns {DbfCollections} 返回所有集合的映射
 */
export function getAllCollections(): DbfCollections {
  return dbfRecordsCollections;
}
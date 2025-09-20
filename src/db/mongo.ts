/**
 * @file mongo.ts
 * @description MongoDB 連線與集合管理
 */

import { MongoClient, Collection, Db } from 'mongodb';
import { DbfRecord, DbfCollections } from '../types';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

let client: MongoClient | null = null;
let db: Db | null = null;
let dbfRecordsCollections: DbfCollections = {};

const REQUIRED_ENV_VARS = ['MONGO_URI', 'MONGO_DB'] as const;

function assertEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing MongoDB environment variables: ${missing.join(', ')}`);
  }
}

async function buildDbfCollectionCache(targetDb: Db): Promise<void> {
  const prefix = process.env.MONGO_COLLECTION_PREFIX || '';

  let collections;
  try {
    collections = await targetDb.listCollections().toArray();
  } catch (err) {
    console.error('Failed to list MongoDB collections:', err);
    throw err;
  }

  const nextCollections: DbfCollections = {};

  for (const collection of collections) {
    const { name } = collection;
    if (!name) continue;

    const shouldInclude = prefix ? name.startsWith(prefix) : true;
    if (!shouldInclude) {
      continue;
    }

    const baseName = name.replace(prefix, '').toLowerCase();
    nextCollections[baseName] = targetDb.collection<DbfRecord>(name);
  }

  dbfRecordsCollections = nextCollections;
}

/**
 * @async
 * @function connect
 * @description 建立 MongoDB 連線並快取 DBF 檔案對應集合
 * @returns {Promise<Db>} 返還 MongoDB 資料庫實例
 * @throws {Error} 如連線失敗則拋出錯誤
 */
export async function connect(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    assertEnv();

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI || '');
      await client.connect();
    }

    db = client.db(process.env.MONGO_DB);

    await buildDbfCollectionCache(db);

    console.log('API server connected to MongoDB');
    return db;
  } catch (err) {
    console.error('API server failed to connect to MongoDB:', err);
    client = null;
    db = null;
    throw err;
  }
}

/**
 * @function getDb
 * @description 取得 MongoDB 資料庫實例
 * @returns {Db | null} 返還資料庫實例，若尚未連線則為 null
 */
export function getDb(): Db | null {
  return db;
}

/**
 * @function getMongoClient
 * @description 取得 MongoClient 實例
 * @returns {MongoClient | null} 返還 MongoClient 實例，若尚未連線則為 null
 */
export function getMongoClient(): MongoClient | null {
  return client;
}

/**
 * @function getCollection
 * @description 取得指定 DBF 檔案的集合引用
 * @param {string} fileName - DBF 檔案名稱（不含副檔名）
 * @returns {Collection<DbfRecord> | undefined} 返還集合實例，若不存在則為 undefined
 */
export function getCollection(fileName: string): Collection<DbfRecord> | undefined {
  const key = fileName.toLowerCase();
  return dbfRecordsCollections[key];
}

/**
 * @async
 * @function refreshDbfCollections
 * @description 重新載入 DBF 檔案對應集合快取
 * @returns {Promise<DbfCollections>} 返還最新的集合快取對象
 */
export async function refreshDbfCollections(): Promise<DbfCollections> {
  if (!db) {
    throw new Error('MongoDB connection has not been established yet.');
  }

  await buildDbfCollectionCache(db);
  return dbfRecordsCollections;
}

/**
 * @function getAllCollections
 * @description 取得所有 DBF 檔案集合的引用快取
 * @returns {DbfCollections} 返還集合快取對象
 */
export function getAllCollections(): DbfCollections {
  return dbfRecordsCollections;
}

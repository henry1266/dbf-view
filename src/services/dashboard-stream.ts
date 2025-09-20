/**
 * @file dashboard-stream.ts
 * @description 使用 MongoDB Change Streams 搭配 SSE 推播儀表板更新
 */

import type { Request, Response } from 'express';
import {
  ChangeStream,
  ChangeStreamDocument,
  ChangeStreamOptions,
  Document
} from 'mongodb';
import { connect } from '../db/mongo';

interface DashboardChangePayload {
  operationType: ChangeStreamDocument['operationType'];
  collection: string;
  fullCollection: string;
}

interface DashboardClient {
  id: number;
  res: Response;
  keepAliveTimer: NodeJS.Timeout;
}

const KEEP_ALIVE_INTERVAL = 25_000; // 25 秒傳送一次心跳，避免連線中斷
const RESTART_DELAY = 3_000; // Change Stream 發生錯誤時的重新連線延遲

const clients = new Map<number, DashboardClient>();
let nextClientId = 1;

let changeStream: ChangeStream | null = null;
let resumeToken: Document | undefined;
let streamInitPromise: Promise<void> | null = null;
let restartTimer: NodeJS.Timeout | null = null;

function broadcast(payload: DashboardChangePayload): void {
  const serialized = `event: change\ndata: ${JSON.stringify(payload)}\n\n`;

  for (const [clientId, client] of clients.entries()) {
    try {
      client.res.write(serialized);
    } catch (err) {
      console.error(`Failed to write SSE message to client ${clientId}:`, err);
      removeClient(clientId);
    }
  }
}

function sendHeartbeat(client: DashboardClient): void {
  try {
    client.res.write(`: heartbeat\n\n`);
  } catch (err) {
    console.error(`Failed to send heartbeat to client ${client.id}:`, err);
    removeClient(client.id);
  }
}

function removeClient(clientId: number): void {
  const client = clients.get(clientId);
  if (!client) return;

  clearInterval(client.keepAliveTimer);
  clients.delete(clientId);
}

function scheduleStreamRestart(): void {
  if (restartTimer) {
    return;
  }

  restartTimer = setTimeout(() => {
    restartTimer = null;
    void ensureDashboardChangeStream(true);
  }, RESTART_DELAY);
}

function handleChangeEvent(change: ChangeStreamDocument<Document>): void {
  resumeToken = change._id;

  const fullCollection = change.ns?.coll ?? '';
  const prefix = process.env.MONGO_COLLECTION_PREFIX || '';
  const normalized = prefix && fullCollection.startsWith(prefix)
    ? fullCollection.slice(prefix.length)
    : fullCollection;

  const payload: DashboardChangePayload = {
    operationType: change.operationType,
    collection: normalized.toLowerCase(),
    fullCollection: fullCollection.toLowerCase()
  };

  broadcast(payload);
}

async function openChangeStream(shouldResume: boolean): Promise<void> {
  const db = await connect();
  const prefix = process.env.MONGO_COLLECTION_PREFIX || '';

  const operations: ChangeStreamDocument['operationType'][] = [
    'insert',
    'update',
    'replace',
    'delete'
  ];

  const pipeline: Document[] = [
    {
      $match: {
        operationType: { $in: operations },
        ...(prefix ? { 'ns.coll': { $regex: `^${prefix}` } } : {})
      }
    }
  ];

  const options: ChangeStreamOptions = {
    fullDocument: 'updateLookup'
  };

  if (shouldResume && resumeToken) {
    options.resumeAfter = resumeToken;
  }

  changeStream = db.watch(pipeline, options);
  changeStream.on('change', handleChangeEvent);
  changeStream.on('error', (err) => {
    console.error('Dashboard change stream error:', err);
    void closeChangeStream().finally(scheduleStreamRestart);
  });
  changeStream.on('close', () => {
    console.warn('Dashboard change stream closed. Scheduling restart.');
    void closeChangeStream().finally(scheduleStreamRestart);
  });
}

async function closeChangeStream(): Promise<void> {
  if (!changeStream) {
    return;
  }

  try {
    changeStream.removeAllListeners();
    await changeStream.close();
  } catch (err) {
    console.error('Failed to close dashboard change stream:', err);
  } finally {
    changeStream = null;
  }
}

/**
 * @async
 * @function ensureDashboardChangeStream
 * @description 確保變更監聽管線已建立，如有需要可使用 resume token 重新串流
 * @param {boolean} [forceResume=false] - 是否強制使用最新的 resume token 重新建立串流
 */
export async function ensureDashboardChangeStream(forceResume = false): Promise<void> {
  if (changeStream) {
    return;
  }

  if (streamInitPromise) {
    await streamInitPromise;
    return;
  }

  streamInitPromise = openChangeStream(forceResume || Boolean(resumeToken));

  try {
    await streamInitPromise;
  } finally {
    streamInitPromise = null;
  }
}

/**
 * @function registerDashboardSse
 * @description 將請求註冊為 SSE 連線並建立 MongoDB Change Stream
 * @param {Request} req - Express 請求
 * @param {Response} res - Express 回應
 */
export function registerDashboardSse(req: Request, res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = nextClientId++;
  const keepAliveTimer = setInterval(() => {
    const client = clients.get(clientId);
    if (!client) {
      return;
    }

    sendHeartbeat(client);
  }, KEEP_ALIVE_INTERVAL);

  const client: DashboardClient = { id: clientId, res, keepAliveTimer };
  clients.set(clientId, client);

  res.write(`event: connected\ndata: {"clientId": ${clientId}}\n\n`);

  void ensureDashboardChangeStream();

  req.on('close', () => {
    removeClient(clientId);
  });
}

/**
 * @function activeDashboardSubscribers
 * @description 取得目前 SSE 訂閱數量，僅供除錯
 * @returns {number} 已註冊的客戶端數量
 */
export function activeDashboardSubscribers(): number {
  return clients.size;
}

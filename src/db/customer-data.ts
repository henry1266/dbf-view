/**
 * @file customer-data.ts
 * @description 客戶資料相關功能
 */

import { getCollection } from './mongo';
import { DbfRecord } from '../types';
import { Document } from 'mongodb';

/**
 * 客戶資料介面
 */
export interface CustomerData {
  mname: string;
  mbirthdt: string;
  mpersonid: string;
}

/**
 * 根據KCSTMR值獲取客戶資料映射
 * @param kcstmrValues KCSTMR值陣列
 * @returns KCSTMR -> 客戶資料的映射
 */
export async function getCustomerDataMap(kcstmrValues: string[]): Promise<Record<string, CustomerData>> {
  // 獲取 CO01M 集合
  const co01mCollection = getCollection('co01m');
  
  if (!co01mCollection) {
    console.error('找不到 CO01M 集合');
    return {};
  }
  
  // 如果沒有提供KCSTMR值，則返回空映射
  if (!kcstmrValues || kcstmrValues.length === 0) {
    return {};
  }
  
  try {
    // 從 CO01M 集合中獲取 KCSTMR -> MNAME, MBIRTHDT, MPERSONID 的映射
    const co01mRecords = await co01mCollection.find(
      { 'data.KCSTMR': { $in: kcstmrValues.map(k => k.trim()) } }, 
      { 
        projection: { 
          'data.KCSTMR': 1, 
          'data.MNAME': 1, 
          'data.MBIRTHDT': 1, 
          'data.MPERSONID': 1 
        } 
      }
    ).toArray();
    
    // 建立 KCSTMR -> 客戶資料 的映射
    const customerDataMap: Record<string, CustomerData> = {};
    
    for (const record of co01mRecords) {
      if (record.data && record.data.KCSTMR) {
        customerDataMap[record.data.KCSTMR.trim()] = {
          mname: record.data.MNAME ? record.data.MNAME.trim() : '',
          mbirthdt: record.data.MBIRTHDT ? record.data.MBIRTHDT.trim() : '',
          mpersonid: record.data.MPERSONID ? record.data.MPERSONID.trim() : ''
        };
      }
    }
    
    return customerDataMap;
  } catch (err) {
    console.error('獲取客戶資料映射時發生錯誤:', err);
    return {};
  }
}

/**
 * 根據KCSTMR值獲取客戶資料
 * @param kcstmr KCSTMR值
 * @returns 客戶資料
 */
export async function getCustomerData(kcstmr: string): Promise<CustomerData | null> {
  // 獲取 CO01M 集合
  const co01mCollection = getCollection('co01m');
  
  if (!co01mCollection) {
    console.error('找不到 CO01M 集合');
    return null;
  }
  
  try {
    // 從 CO01M 集合中查找對應的客戶資料
    const co01mRecord = await co01mCollection.findOne(
      { 'data.KCSTMR': kcstmr.trim() },
      { 
        projection: { 
          'data.MNAME': 1, 
          'data.MBIRTHDT': 1, 
          'data.MPERSONID': 1 
        } 
      }
    );
    
    // 如果找到對應記錄，則返回客戶資料
    if (co01mRecord && co01mRecord.data) {
      return {
        mname: co01mRecord.data.MNAME ? co01mRecord.data.MNAME.trim() : '',
        mbirthdt: co01mRecord.data.MBIRTHDT ? co01mRecord.data.MBIRTHDT.trim() : '',
        mpersonid: co01mRecord.data.MPERSONID ? co01mRecord.data.MPERSONID.trim() : ''
      };
    }
    
    return null;
  } catch (err) {
    console.error(`獲取KCSTMR=${kcstmr}的客戶資料時發生錯誤:`, err);
    return null;
  }
}

/**
 * 為記錄添加客戶資料欄位
 * @param records 記錄陣列
 * @returns 添加了客戶資料欄位的記錄陣列
 */
export async function addCustomerDataToRecords<T extends Document>(records: T[]): Promise<T[]> {
  if (!records || records.length === 0) {
    return records;
  }
  
  // 提取所有記錄中的KCSTMR值
  const kcstmrValues = records
    .filter(record => record.data && record.data.KCSTMR)
    .map(record => record.data.KCSTMR.trim());
  
  // 如果沒有KCSTMR值，則直接返回原始記錄
  if (kcstmrValues.length === 0) {
    return records;
  }
  
  // 獲取客戶資料映射
  const customerDataMap = await getCustomerDataMap(kcstmrValues);
  
  // 為每條記錄添加客戶資料欄位
  for (const record of records) {
    if (record.data && record.data.KCSTMR) {
      const kcstmr = record.data.KCSTMR.trim();
      const customerData = customerDataMap[kcstmr];
      
      if (customerData) {
        record.data.MNAME = customerData.mname;
        record.data.MBIRTHDT = customerData.mbirthdt;
        record.data.MPERSONID = customerData.mpersonid;
      } else {
        record.data.MNAME = '';
        record.data.MBIRTHDT = '';
        record.data.MPERSONID = '';
      }
    }
  }
  
  return records;
}

/**
 * 為單個記錄添加客戶資料欄位
 * @param record 記錄
 * @returns 添加了客戶資料欄位的記錄
 */
export async function addCustomerDataToRecord<T extends Document>(record: T): Promise<T> {
  if (!record || !record.data || !record.data.KCSTMR) {
    return record;
  }
  
  // 獲取客戶資料
  const kcstmr = record.data.KCSTMR.trim();
  const customerData = await getCustomerData(kcstmr);
  
  // 如果找到客戶資料，則添加到記錄中
  if (customerData) {
    record.data.MNAME = customerData.mname;
    record.data.MBIRTHDT = customerData.mbirthdt;
    record.data.MPERSONID = customerData.mpersonid;
  } else {
    record.data.MNAME = '';
    record.data.MBIRTHDT = '';
    record.data.MPERSONID = '';
  }
  
  return record;
}
# 服務目錄 (services/)

這個目錄包含了 DBF Viewer 應用程序的所有服務層代碼，負責處理 API 通信和數據處理邏輯。

## 文件列表

- `api.ts` - 包含與後端 API 通信的函數和 axios 實例配置

## API 服務

`api.ts` 文件提供了以下 API 服務函數：

- `fetchDbfFiles()` - 獲取所有 DBF 檔案列表
- `fetchDbfRecords(fileName, page, pageSize, ...)` - 獲取特定 DBF 檔案的記錄
- `fetchDbfRecord(fileName, recordNo)` - 獲取特定記錄的詳情
- `fetchKcstmrRecords(value)` - 執行 KCSTMR 查詢
- `fetchKdrugRecords(value, startDate, endDate)` - 執行 KDRUG 查詢

## API 端點

服務層與以下 API 端點通信：

- `GET /api/dbf-files` - 獲取所有 DBF 檔案列表
- `GET /api/dbf/:fileName` - 獲取特定 DBF 檔案的記錄
- `GET /api/dbf/:fileName/:recordNo` - 獲取特定記錄的詳情
- `GET /api/KCSTMR/:value` - KCSTMR 查詢
- `GET /api/KDRUG/:value` - KDRUG 查詢

## 錯誤處理

服務層實現了統一的錯誤處理邏輯：

1. 捕獲 API 請求錯誤
2. 記錄錯誤信息到控制台
3. 將錯誤向上傳播，由調用者處理

## 使用示例

```tsx
import { fetchDbfFiles, fetchDbfRecords } from '../services/api';

// 獲取 DBF 檔案列表
const loadDbfFiles = async () => {
  try {
    const files = await fetchDbfFiles();
    setDbfFiles(files);
  } catch (error) {
    setError('無法加載 DBF 檔案列表');
  }
};

// 獲取特定 DBF 檔案的記錄
const loadDbfRecords = async (fileName) => {
  try {
    const result = await fetchDbfRecords(fileName, page, pageSize);
    setRecords(result.records);
    setTotalCount(result.totalCount);
  } catch (error) {
    setError(`無法加載 ${fileName} 的記錄`);
  }
};
```

## 開發指南

擴展服務層時，請遵循以下原則：

1. 保持服務函數的單一職責
2. 使用 TypeScript 類型定義確保類型安全
3. 實現一致的錯誤處理邏輯
4. 使用 axios 攔截器處理通用邏輯（如認證）
5. 添加適當的註釋和文檔
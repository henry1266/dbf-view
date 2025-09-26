import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchDbfRecords } from '../api';

vi.mock('axios');
const mockedGet = axios.get as unknown as vi.Mock;

describe('fetchDbfRecords LCS 精確匹配參數', () => {
  beforeEach(() => {
    mockedGet.mockClear();
  });

  it('應該對 CO03L.DBF 且 field=LCS 呼叫精確匹配參數', async () => {
    const mockData = { records: [], totalCount: 0 };
    mockedGet.mockResolvedValue({ data: mockData });

    const result = await fetchDbfRecords(
      'CO03L.DBF',
      2,
      50,
      'ABC',
      'LCS'
    );

    expect(mockedGet).toHaveBeenCalledWith('/dbf/CO03L.DBF', {
      params: {
        page: 2,
        pageSize: 50,
        search: 'ABC',
        field: 'LCS',
        sortField: '',
        sortDirection: '',
        startDate: '',
        endDate: '',
        statsPage: 'false'
      }
    });
    expect(result).toEqual(mockData);
  });
});
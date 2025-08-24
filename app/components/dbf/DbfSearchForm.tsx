import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Box 
} from '@mui/material';

import type { FC } from 'react';

interface DbfSearchFormProps {
  availableFields: string[];
  initialSearch?: string;
  initialField?: string;
  onSearch?: () => void;
}

/**
 * DBF 搜尋表單元件
 * 提供搜尋欄位和值的輸入界面
 */
function DbfSearchForm({ 
  availableFields, 
  initialSearch = '', 
  initialField = '', 
  onSearch 
}: DbfSearchFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [searchField, setSearchField] = useState(initialField);

  /**
   * 處理搜尋表單提交
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    newParams.set('search', searchValue);
    if (searchField) {
      newParams.set('field', searchField);
    } else {
      newParams.delete('field');
    }
    setSearchParams(newParams);
    
    // 如果提供了回調函數，則調用它
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
      <TextField
        id="searchValue"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="輸入搜尋值"
        size="small"
        fullWidth
        sx={{
          flexGrow: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(100, 255, 218, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(100, 255, 218, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#64ffda',
            },
          },
          '& .MuiInputBase-input': {
            color: '#e6f1ff',
          },
          '& .MuiInputLabel-root': {
            color: '#e6f1ff',
          },
        }}
      />
      <FormControl sx={{ minWidth: 180 }} size="small">
        <InputLabel id="search-field-label" sx={{ color: '#e6f1ff' }}>欄位</InputLabel>
        <Select
          labelId="search-field-label"
          id="searchField"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as string)}
          label="欄位"
          sx={{
            color: '#e6f1ff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(100, 255, 218, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(100, 255, 218, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#64ffda',
            },
            '& .MuiSvgIcon-root': {
              color: '#e6f1ff',
            },
          }}
        >
          <MenuItem value="">所有欄位</MenuItem>
          {availableFields.map((field) => (
            <MenuItem key={field} value={field}>
              {field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        sx={{
          bgcolor: 'rgba(100, 255, 218, 0.1)',
          color: '#64ffda',
          border: '1px solid rgba(100, 255, 218, 0.3)',
          '&:hover': {
            bgcolor: 'rgba(100, 255, 218, 0.2)',
          },
        }}
      >
        搜尋
      </Button>
    </form>
  );
}

export default DbfSearchForm;
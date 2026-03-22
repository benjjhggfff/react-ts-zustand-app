import React from 'react';
import { Input, Form } from 'antd';

interface SearchInputProps {
  title: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  title, 
  value, 
  onChange, 
  placeholder = "请输入"
}) => (
  <Form.Item label={title} style={{ marginBottom: 0 }}>
    <Input 
      style={{ 
        width: '100%', 
        borderRadius: '8px', 
        border: '1px solid #e8e8e8',
        transition: 'all 0.3s ease'
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </Form.Item>
);

export default SearchInput;
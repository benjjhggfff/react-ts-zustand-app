import React from 'react';
import { Select, Form } from 'antd';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  title: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ 
  title, 
  options, 
  value, 
  onChange, 
  placeholder = "请选择",
  disabled = false
}) => (
  <Form.Item label={title} style={{ marginBottom: 0 }}>
    <Select
      showSearch={{
        optionFilterProp: 'label',
        filterSort: (optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase()),
      }}
      style={{ 
        width: '100%', 
        borderRadius: '8px', 
        border: '1px solid #e8e8e8',
        transition: 'all 0.3s ease'
      }}
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </Form.Item>
);

export default SelectInput;
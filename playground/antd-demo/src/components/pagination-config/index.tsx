import React, { useEffect, useState } from 'react';
import { Checkbox, InputNumber, Select } from 'antd';

export type PaginationAlign = 'start' | 'center' | 'end';

export interface PaginationConfig {
  pageSize?: number;
  position?: PaginationAlign;
  hideOnSinglePage?: boolean;
  showQuickJumper?: boolean;
}

interface PaginationConfigProps {
  value?: PaginationConfig;
  onChange?: (value: PaginationConfig) => void;
}

export const PaginationConfig: React.FC<PaginationConfigProps> = (props) => {
  const { value, onChange } = props;

  const [config, setConfig] = useState<PaginationConfig>({
    pageSize: value?.pageSize ?? 10,
    position: value?.position ?? 'end',
    hideOnSinglePage: value?.hideOnSinglePage ?? false,
    showQuickJumper: value?.showQuickJumper ?? false,
  });

  useEffect(() => {
    if (value) {
      setConfig({
        pageSize: value?.pageSize ?? 10,
        position: value?.position ?? 'end',
        hideOnSinglePage: value?.hideOnSinglePage ?? false,
        showQuickJumper: value?.showQuickJumper ?? false,
      });
    }
  }, [value]);

  const handleChange = (field: keyof PaginationConfig, newValue: any) => {
    const newConfig = { ...config, [field]: newValue };
    setConfig(newConfig);
    onChange?.(newConfig);
  };

  const alignOptions = [
    { label: '左对齐', value: 'start' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'end' },
  ];

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs text-gray-600'>每页条数</label>
          <InputNumber
            value={config.pageSize}
            onChange={(v) => handleChange('pageSize', v)}
            min={1}
            style={{ width: '100%' }}
            placeholder='请输入每页条数'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-gray-600'>对齐方式</label>
          <Select
            value={config.position}
            onChange={(v) => handleChange('position', v)}
            options={alignOptions}
            style={{ width: '100%' }}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Checkbox
            checked={config.hideOnSinglePage}
            onChange={(e) => handleChange('hideOnSinglePage', e.target.checked)}
          >
            只有一页时隐藏分页器
          </Checkbox>

          <Checkbox
            checked={config.showQuickJumper}
            onChange={(e) => handleChange('showQuickJumper', e.target.checked)}
          >
            可快速跳转至某页
          </Checkbox>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Input, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useContextOptions } from '@/hooks/use-context-options';
import { cn } from '@/utils/cn';
import type { Param } from '@/interfaces/custom-types';

interface IProps {
  className?: string;
  value?: Param[];
  onChange?: (value: Param[]) => void;
}

export const ParamsSetter = (props: IProps) => {
  const { className, value, onChange } = props;
  const [list, setList] = useState<Param[]>([]);
  const { variableOptions, globalVariableOptions } = useContextOptions();

  useEffect(() => {
    if (Array.isArray(value) && value.length) {
      setList(value);
    } else {
      setList([
        {
          name: undefined,
          value: undefined,
        },
      ]);
    }
  }, [value]);

  const handleSelectChange = (index: number, value: string, option: any) => {
    setList((prev) => {
      const newList = [...prev];
      newList[index].value = value;
      if (option?.name) {
        newList[index].name = option.name;
      }
      if (onChange) {
        onChange(newList);
      }
      return newList;
    });
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setList((prev) => {
      const newList = [...prev];
      newList[index].name = e.target.value;
      if (onChange) {
        onChange(newList);
      }
      return newList;
    });
  };

  const addItem = (index: number) => {
    setList([
      ...list.slice(0, index + 1),
      { name: undefined, value: undefined },
      ...list.slice(index + 1),
    ]);
  };

  const removeItem = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('border border-solid border-gray-300 p-2 rounded-sm', className)}>
      {list.map((item, index) => (
        <div
          className={cn('flex items-center', {
            'mb-2': index != list.length - 1,
          })}
          key={index}
        >
          <Space.Compact className='flex-1 flex'>
            <Select
              className='flex-1'
              placeholder='请选择'
              value={item.value}
              options={[...variableOptions, ...globalVariableOptions]}
              onChange={handleSelectChange.bind(this, index)}
              allowClear
            />
            <Input
              className='w-80!'
              placeholder='请输入变量别名'
              value={item.name}
              onChange={handleInputChange.bind(this, index)}
            />
          </Space.Compact>
          <div className='w-10 ml-2'>
            <PlusCircleOutlined onClick={addItem.bind(this, index)} className='mr-2' />
            {index > 0 && <MinusCircleOutlined onClick={removeItem.bind(this, index)} />}
          </div>
        </div>
      ))}
    </div>
  );
};

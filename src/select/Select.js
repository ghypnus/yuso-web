/**
 * 选择框
 * @author ghypnus
 * @date 2020/09/29
 */
import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';

const YusoSelect = (data) => {
  const {
    options = {},
    ...restProps
  } = data;

  const [dataList, setDataList] = useState([]);
  const isMountedRef = useRef(null);

  const getData = async () => {
    const { url,
      params = {},
      valueProperty = 'code',
      nameProperty = 'name',
      path = 'returnList' } = options;
    const res = await axios.post(url, params);
    const list = res[path].map((item) => ({
      value: item[valueProperty],
      name: item[nameProperty],
    }));
    if (isMountedRef.current) {
      setDataList(list);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (Array.isArray(options)) {
      setDataList(options);
    } else {
      getData();
    }
    return () => isMountedRef.current = false;
  }, [data.options]);
  return (
    <Select {...restProps}>
      {dataList.map(({ value, name }) => <Select.Option key={value} value={value}>{name}</Select.Option>)}
    </Select>
  );
};

export default YusoSelect;

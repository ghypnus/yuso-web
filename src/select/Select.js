import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

const YusoSelect = (data) => {
  const {
    options = {},
    ...restProps
  } = data;

  const [dataList, setDataList] = useState([]);

  const getData = () => {
    const { url,
      params = {},
      valueProperty = 'code',
      nameProperty = 'name',
      path = 'returnList' } = options;
    axios.post(url, params).then((res) => {
      const list = res[path].map((item) => ({
        value: item[valueProperty],
        name: item[nameProperty],
      }));
      setDataList(list);
    });
  };

  useEffect(() => {
    getData();
  }, [data.options]);
  return (
    <Select {...restProps}>
      {dataList.map(({ value, name }) => <Select.Option key={value} value={value}>{name}</Select.Option>)}
    </Select>
  );
};

export default YusoSelect;

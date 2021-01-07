/**
 * 远程选择框
 * @author ghypnus
 * @date 2021/01/07
 */
import React, { useEffect, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';


const YusoRemoteSelect = (data) => {
    const {
        options = {},
        ...restProps
    } = data;

    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const lastFetchIdRef = useRef(0);

    useEffect(() => {
        getData();
    }, [])

    const getData = async (text = '') => {
        lastFetchIdRef.current += 1;
        const fetchId = lastFetchIdRef.current;
        setLoading(true);
        setDataList([]);
        const { url,
            params = {},
            valueProperty = 'code',
            nameProperty = 'name',
            path = 'returnList' } = options;
        const res = await axios.post(url, { ...params, text: text });
        if (fetchId !== lastFetchIdRef.current) {
            return;
        }
        const list = res[path].map((item) => ({
            value: item[valueProperty],
            name: item[nameProperty],
        }));
        setLoading(false);
        setDataList(list);
    };

    return <Select
        {...restProps}
        showSearch
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={debounce(getData, 800)}>
        {dataList.map(({ value, name }) => <Select.Option key={value} value={value}>{name}</Select.Option>)}
    </Select>
}

export default YusoRemoteSelect;
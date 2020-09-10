/*
 * 表格
 * @author ghypnus
 * @date 2020-08-27
 */
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import Search from './Search';

const columns = [
  {
    title: '角色名',
    dataIndex: 'rolename',
    key: 'rolename',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  }];

const YusoTable = (props) => {
  const { prefixCls, search } = props;
  const [pageNum, setPageNum] = useState(1);
  const [rowCount, setRowCount] = useState(15);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    setLoading({
      loading: true,
    });
    let params = {
      pageNum,
      rowCount,
      request_type: 'table|query|Role',
    };
    if (!BaseUtil.isEmptyObject(searchParams)) {
      params = {
        ...params,
        ...searchParams,
      };
    }
    axios.post('/action.php', params).then((res) => {
      const { returnList, totalRowCount } = res;
      setLoading(false);
      setDataSource(returnList);
    });
  }, [pageNum, rowCount]);
  return (
    <div className={prefixCls}>
      <Search
        data={search}
        onSearch={(values) => {
          console.log(values);
        }}
      />
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

YusoTable.defaultProps = {
  prefixCls: 'yuso-table',
};

YusoTable.Search = Search;

export default YusoTable;

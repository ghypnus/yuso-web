/**
 * 列设置
 * @author john.gao
 * @date 2020/09/16
 */
import React, { useState } from 'react';
import { Popover, Checkbox, Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const ColumnSet = (props) => {
  const [visible, setVisible] = useState(false);

  const { prefixCls, columns = [], onChange, ...restProps } = props;

  const checkedList = columns.filter((col) => col.checked);
  const isCheckAll = checkedList.length === columns.length;
  const indeterminate = !!checkedList.length && checkedList.length < columns.length;
  return (
    <Popover
      placement="bottomRight"
      title={(
        <div className={`${prefixCls}-title`}>
          <Checkbox
            checked={isCheckAll}
            indeterminate={indeterminate}
            onChange={(e) => {
              if (onChange) {
                const columnList = [...columns];
                onChange(columnList.map((item) => ({ ...item, checked: e.target.checked })));
              }
            }}
          >
            列展示
          </Checkbox>
          {/* <a>重置</a> */}
        </div>
      )}
      content={(
        <div className={`${prefixCls}-list`}>
          {columns.map((item) => (
            <div key={item.dataIndex}
              className={`${prefixCls}-list-item`}
            >
              <Checkbox
                checked={item.checked}
                onChange={(e) => {
                  if (onChange) {
                    const columnList = [...columns];
                    const column = columnList.find((col) => col.dataIndex === item.dataIndex);
                    column.checked = e.target.checked;
                    onChange(columnList);
                  }
                }}
              >
                {item.title}

              </Checkbox>
            </div>
          ))}
        </div>
      )}
      trigger="click"
      visible={visible}
      onVisibleChange={(v) => setVisible(v)}
    >
      <Tooltip title="列设置">
        <SettingOutlined {...restProps} />
      </Tooltip>
    </Popover>
  );
};

ColumnSet.defaultProps = {
  prefixCls: 'yuso-column-set',
};

export default ColumnSet;

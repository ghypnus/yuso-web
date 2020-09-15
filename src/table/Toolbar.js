/*
 * 表格工具栏
 * @author ghypnus
 * @date 2020-09-11
 */
import React from 'react';
import classnames from 'classnames';
import { Form, Input, Row, Col, Space, Button } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

const components = {
  Input,
  Button,
  PlusOutlined,
};

const Toolbar = (props) => {
  const { prefixCls, data = {} } = props;
  const { children = [] } = data;
  const { align = 'right' } = data.props;
  const wrapCls = classnames(prefixCls, {
    [`${prefixCls}-align-${align}`]: align,
  });
  return (
    <div className={wrapCls}>
      <Space>
        {children.map((item) => {
          const Comp = components[item.type];
          return (
            <Comp {...item.props}>
              {item.children.map((child) => {
                if (typeof child === 'object') {
                  const ChildComp = components[child.type];
                  return <ChildComp {...child.props} />;
                }
                return child;
              })}
            </Comp>
          );
        })}
      </Space>
    </div>
  );
};

Toolbar.defaultProps = {
  prefixCls: 'yuso-table-toolbar',
};

export default Toolbar;

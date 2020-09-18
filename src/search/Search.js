/*
 * 搜索
 * @author ghypnus
 * @date 2020-09-10
 */
import React from 'react';
import * as antds from 'antd';
import { Form, Row, Col, Space } from 'antd';

const components = {
  ...antds,
};

export default ({ prefixCls = 'yuso-search', cols = 3, onSearch, loading = false, props }) => {
  const [form] = Form.useForm();
  const { children = [], actions = [] } = props;

  const getValue = () => form.getFieldsValue();

  return (
    <div className={prefixCls}>
      <Form form={form}>
        <Row gutter={16}>
          {children.map((item, idx) => {
            let Comp = components[item.type];
            const compProps = item.props || {};
            return (
              <Col key={idx} span={24 / cols}>
                <Form.Item
                  label={item.ui.label}
                  name={item.name}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Comp {...compProps} />
                </Form.Item>
              </Col>
            );
          })}
          <Col span={24 / cols}>
            <Space>
              {actions.map((action) => {
                const { key, type, props, children = [] } = action;
                let Comp = components[type];
                return <Comp key={key} {...props}>{children}</Comp>;
              })}
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

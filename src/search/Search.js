/*
 * 搜索
 * @author ghypnus
 * @date 2020-09-10
 */
import React from 'react';
import * as antds from 'antd';
import { Form, Row, Col, Space, Button } from 'antd';

const components = {
  ...antds,
};

export default (data) => {
  const { prefixCls = 'yuso-search', cols = 3, onSearch, onReset, loading = false, props } = data;
  const [form] = Form.useForm();
  const { children = [] } = props;

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
                  label={item.label}
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
              <Button onClick={() => {
                form.resetFields();
                if (onReset) {
                  onReset(form.getFieldsValue());
                }
              }}
              >
                重置
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  if (onSearch) {
                    onSearch(form.getFieldsValue());
                  }
                }}
              >
                查询
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

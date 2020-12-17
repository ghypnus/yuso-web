/*
 * 搜索
 * @author ghypnus
 * @date 2020-09-10
 */
import React, { useEffect } from 'react';
import { Form, Row, Col, Space, Button } from 'antd';

export default props => {
  const {
    prefixCls = 'yuso-search',
    cols = 3,
    loading = false,
    data = {},
    children,
    onSearch,
    onReset } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  return (
    <div className={prefixCls}>
      <Form form={form}>
        <Row gutter={16}>
          {children}
          <Col span={24 / cols}>
            <Space>
              {onReset && <Button
                className={`${prefixCls}-button`}
                onClick={() => {
                  form.resetFields();
                  if (onReset) {
                    onReset(form.getFieldsValue());
                  }
                }}
              >
                重置
              </Button>}
              <Button
                className={`${prefixCls}-button`}
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

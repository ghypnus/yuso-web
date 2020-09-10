/*
 * 表格搜索
 * @author ghypnus
 * @date 2020-09-10
 */
import React from 'react';
import { Form, Input, Row, Col, Space, Button } from 'antd';

const components = {
  Input,
};

export default (props) => {
  const {
    prefixCls = 'yuso-table-search',
    cols = 3,
    data = [],
    onSearch,
  } = props;
  const [form] = Form.useForm();

  return (
    <div className={prefixCls}>
      <Form form={form}>
        <Row gutter={16}>
          {data.map((item) => {
            let Comp = components[item.type];
            return (
              <Col span={24 / cols}>
                <Form.Item
                  label={item.ui.label}
                  name={item.name}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Comp />
                </Form.Item>
              </Col>
            );
          })}
          <Col span={24 / cols}>
            <Space>
              <Button>重置</Button>
              <Button
                type="primary"
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

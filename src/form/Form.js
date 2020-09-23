import React, { useEffect, useState } from 'react';
import * as antds from 'antd';
import { Form, Row, Col } from 'antd';

const components = {
  ...antds,
};

export default (d) => {
  const { prefixCls = 'yuso-form',
    props = {},
    options = {},
    data = {},
    submitOptions = {},
    onSubmit } = d;
  const {
    cols = 2,
    labelCol = 8,
    wrapperCol = 16,
    children,
    submit = false,
  } = props;

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  useEffect(() => {
    if (submit) {
      form.validateFields().then((fieldsValue) => {
        const { url, params = {} } = submitOptions;
        axios.post(url, {
          ...params,
          ...data,
          ...fieldsValue,
        }).then(() => {
          if (onSubmit) {
            onSubmit();
          }
        });
      });
    }
  }, [submit]);

  return (
    <div className={prefixCls}>
      <Form form={form}>
        <Row gutter={16}>
          {children.map((item) => {
            let Comp = components[item.type];
            const compProps = item.props || {};
            return (
              <Col key={item.key} span={24 / cols}>
                <Form.Item
                  label={item.label}
                  name={item.name}
                  rules={item.rules}
                  labelCol={{ span: labelCol }}
                  wrapperCol={{ span: wrapperCol }}
                >
                  <Comp {...compProps} />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </div>
  );
};

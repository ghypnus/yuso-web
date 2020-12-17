import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'antd';

const YusoForm = (d) => {
  const {
    prefixCls = 'yuso-form',
    children,
    data = {},
    submit = false,
    submitOptions = {},
    onSubmit,
    ...restProps } = d;

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  useEffect(() => {
    if (submit) {
      form.validateFields().then((fieldsValue) => {
        const { url, idProperty, params = {} } = submitOptions;
        const newParams = {
          ...params,
          ...fieldsValue,
        };
        if (data[idProperty]) newParams.id = data[idProperty];
        axios.post(url, newParams).then(() => {
          if (onSubmit) {
            onSubmit({ success: true });
          }
        }).catch(err => {
          if (onSubmit) {
            onSubmit({ success: false });
          }
        });
      });
    }
  }, [submit]);

  return (
    <div className={prefixCls}>
      <Form
        form={form}
        {...restProps}
      >
        <Row gutter={16}>
          {children}
        </Row>
      </Form>
    </div>
  );
};

YusoForm.Item = Form.Item;
export default YusoForm;

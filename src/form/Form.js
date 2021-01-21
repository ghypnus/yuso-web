import React, { useEffect } from 'react';
import { Form, Row } from 'antd';

const YusoForm = (d) => {
  const {
    prefixCls = 'yuso-form',
    children,
    data = {},
    reset = false,
    submit = false,
    submitOptions = {},
    onError,
    onSubmit,
    onReset,
    ...restProps } = d;

  const [form] = Form.useForm();

  useEffect(() => {
    if (reset) {
      form.resetFields();
      onReset();
    }
  }, [reset])

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
            form.resetFields();
          }
        }).catch(_ => {
          if (onSubmit) {
            onSubmit({ success: false });
          }
        });
      }).catch(_ => {
        onError();
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

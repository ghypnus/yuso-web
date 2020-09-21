import * as antds from 'antd';
import { Form, Row, Col } from 'antd';

const components = {
    ...antds,
};

export default (data) => {
    const { prefixCls, children } = data;
    return (
        <div className={prefixCls}>
            <Row gutter={16}>
                {children.map((item) => {
                    let Comp = components[item.type];
                    const compProps = item.props || {};
                    return (
                        <Col key={item.key} span={24 / cols}>
                            <Form.Item
                                label={item.ui.label}
                                name={item.name}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                <Comp {...compProps} />
                            </Form.Item>
                        </Col>
        })}
            </Row>
        </div>
    );
};

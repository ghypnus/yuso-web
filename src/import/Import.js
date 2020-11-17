import React, { useState } from 'react';
import {
    Modal,
    Button,
    Table
} from 'antd';
import { useEffect } from 'react';

/**
 * 导入模块
 * @author ghypnus
 * @date 2020/11/17
 */
export default data => {
    const {
        title = '导入',
        visible = false,
        width = "70%",
        onCancel,
        onOk
    } = data;

    const [checkLoading, setCheckLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setColumns([{
            dataIndex: 'name',
            title: '姓名'
        }, {
            dataIndex: 'age',
            title: '年龄'
        }])
        setDataSource([{
            oid: 1,
            name: '张飞',
            age: 23
        }, {
            oid: 2,
            name: '诸葛亮',
            age: 30
        }])
    }, []);
    /**
     * 提交导入
     */
    const handleImport = () => {
        setLoading(true);
        axios.post('test', {

        }).then(res => {
            setLoading(false);
            if (onOk) {
                onOk()
            }
        })
    }

    /**
     * 校验数据
     */
    const handleCheck = () => {
        setCheckLoading(true);
        axios.post('test', {

        }).then(res => {
            setCheckLoading(false);
            setDisabled(false);
        })
    }

    return <Modal
        title={title}
        width={width}
        visible={visible}
        onCancel={() => {
            if (onCancel) {
                onCancel()
            }
        }}
        footer={[
            <Button
                loading={checkLoading}
                onClick={() => {
                    handleCheck();
                }}>
                检验
            </Button>,
            <Button type="primary"
                disabled={disabled}
                loading={loading}
                onClick={() => {
                    handleImport()
                }}>
                导入
            </Button>,
        ]}
    >
        <Table
            size="small"
            rowKey="oid"
            dataSource={dataSource}>
            {columns.map(col => {
                return <Table.Column title={col.title} dataIndex={col.dataIndex} />
            })}
        </Table>
    </Modal>
}
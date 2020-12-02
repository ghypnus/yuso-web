import React, { useState } from 'react';
import {
    Modal,
    Button,
    Table,
    Form,
    Col,
    Input,
    Upload,
    Space,
    message,
    Progress,
    Tag,
    Tooltip,
    Divider,
    Typography
} from 'antd';
import {
    EditOutlined,
    SaveOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import Search from '../search/Search';
import Toolbar from '../toolbar/Toolbar';
import { useEffect } from 'react';

const COLUMN_WIDTH = 120;
/**
 * 导入模块
 * @author ghypnus
 * @date 2020/11/17
 */
export default data => {
    const {
        title = '导入',
        visible = false,
        type,
        width = "90%",
        onCancel,
        onOk
    } = data;

    const [checkLoading, setCheckLoading] = useState(false); //校验Loading
    const [loading, setLoading] = useState(false); //导入Loading
    const [uploadLoading, setUploadLoading] = useState(false); //表格Loading
    const [saveLoading, setSaveLoading] = useState(false); //单条数据保存Loading
    const [disabled, setDisabled] = useState(true); //导入禁用
    const [columns, setColumns] = useState([]); //列头
    const [dataSource, setDataSource] = useState([]); //表格数据
    const [pageNum, setPageNum] = useState(1); //当前页码
    const [rowCount, setRowCount] = useState(10); //每页条数
    const [total, setTotal] = useState(0); //总数
    const [batchid, setBatchid] = useState(null); //批次号
    const [selectedRowKeys, setSelectedRowKeys] = ([]); //当前选中
    const [isEditId, setIsEditId] = useState(null); //当前编辑行的ID
    const [percent, setPercent] = useState(0); //校验/导入的进度条百分比
    const [progressVisible, setProgressVisible] = useState(false); //校验/导入结果是否显示
    const [progressTotal, setProgressTotal] = useState(0); //校验/导入总数
    const [progressSuccess, setProgressSuccess] = useState(0); //校验/导入成功数
    const [progressFail, setProgressFail] = useState(0); //校验/导入失败数

    let interval = null;

    useEffect(() => {
        if (batchid) {
            setUploadLoading(true);
            getDataList(batchid);
        }
    }, [pageNum, rowCount]);

    /**
     * 初始化轮询
     */
    const initInterval = (type = 1) => {
        interval = setInterval(() => {
            axios.post('/action.php', {
                request_type: 'IH|49',
                batchid
            }).then(res => {
                if (interval) {
                    const { btgcount, tgcount, totalCount } = res;
                    let percent = (parseInt(btgcount) + parseInt(tgcount)) / totalCount;
                    setPercent(percent * 100 > 100 ? 100 : percent * 100);
                    setProgressTotal(totalCount);
                    setProgressSuccess(tgcount);
                    setProgressFail(btgcount);
                    if (parseInt(btgcount) + parseInt(tgcount) == parseInt(totalCount)) {
                        message.success(`数据${type == 1 ? '校验' : '导入'}完成！`);
                        clearInterval(interval);
                        interval = null;
                        setProgressVisible(true);
                        getDataList(batchid);
                        setTimeout(() => {
                            if (type == 1) {
                                setCheckLoading(false);
                                setDisabled(false);
                            } else {
                                setLoading(false);
                            }
                        }, 1000);

                    }
                }
            })
        }, 2000);
    }
    /**
     * 提交导入
     */
    const handleImport = () => {
        setLoading(true);
        setProgressVisible(false);
        setPercent(0);
        axios.post('/action.php', {
            request_type: 'IH|48',
            batchid: batchid
        }, {
            timeout: 500
        });
        initInterval(2);
    }

    /**
     * 校验数据
     */
    const handleCheck = () => {
        setPercent(0);
        setCheckLoading(true);
        setProgressVisible(false);
        setDisabled(true);
        axios.post('/action.php', {
            request_type: 'IH|46',
            batchid: batchid

        }, {
            timeout: 500
        });
        initInterval(1);
    }

    /**
     * 文件上传
     * @param {Object} info 文件信息
     */
    const uploadChange = info => {
        let { status, response } = info.file;
        if (status === 'done') {
            if (response.error == 1) {
                message.error(response.message);
                return;
            }
            setUploadLoading(true);
            axios.post('/action.php', {
                request_type: 'table|import1|ImportData',
                url: response.url,
                type: type
            }).then(res => {
                setProgressVisible(false);
                setBatchid(res.batchid);
                getDataList(res.batchid);
            })
        }
    }

    /**
     * 获取导入数据
     * @param {Number} batchid 批次Id
     */
    const getDataList = id => {
        if (!id) return;
        axios.post('/action.php', {
            request_type: 'table|query|ImportData',
            batchid: id,
            pageNum: pageNum,
            rowCount: rowCount
        }).then(res => {
            setUploadLoading(false);
            if (id != batchid) {
                setProgressVisible(false);
            }
            if (res) {
                if (res.columnName) {
                    setColumns(res.columnName.map((col, idx) => {
                        let data = {
                            dataIndex: `key_${idx}`,
                            title: col,
                            width: COLUMN_WIDTH
                        }
                        if (idx < 1) {
                            data.fixed = 'left';
                        }
                        return data;
                    }))
                }
                setDataSource(res.returnList.map(item => {
                    let data = { ...item };
                    let d = {}
                    item.data.map((v, k) => {
                        d[`key_${k}`] = v;
                    })
                    data.data = d;
                    return data;
                }));
                setTotal(res.totalRowCount);
            }
        })
    }

    /**
     * 表格列渲染
     * @param {*} col 列数据 
     * @param {*} record 行数据
     */
    const renderColumn = ({ dataIndex }, record) => {
        const { oid } = record;
        const text = record.data[dataIndex];
        if (oid == isEditId) {
            return <Input
                value={text}
                size="small"
                onChange={e => {
                    record.data[dataIndex] = e.target.value;
                    setDataSource([...dataSource]);
                }} />;
        } else {
            return text;
        }
    }
    /**
     * 编辑表格行
     * @param {Object} record 数据
     */
    const handleEdit = (record) => {
        setIsEditId(record.oid);
    }

    /**
     * 保存数据
     * @param {Object}} record 数据
     */
    const handleSave = (record) => {
        let { oid } = record;
        setSaveLoading(true);
        axios.post('/action.php', {
            request_type: 'IH|47',
            oid: oid,
            data: JSON.stringify(Object.keys(record.data).map(k => record.data[k]))
        }).then(res => {
            setSaveLoading(false);
            setIsEditId(null);
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
        ]}>
        <Search
            onSearch={data => {
                setUploadLoading(true);
                getDataList(batchid);
            }}>
            <>
                <Col span={6}>
                    <Form.Item
                        label="批次号"
                        name="batchid">
                        <Input
                            allowClear
                            placeholder="请输入批次号"
                            value={batchid}
                            onChange={e => {
                                setBatchid(e.target.value);
                            }}
                        />
                    </Form.Item>
                </Col>
            </>
        </Search>
        <Toolbar align={progressVisible ? 'between' : 'right'}>
            {progressVisible && <Space split={<Divider type="vertical" />}>
                <Typography.Text>总共：{progressTotal}条</Typography.Text>
                <Typography.Text type="success">通过：{progressSuccess}条</Typography.Text>
                <Typography.Text type="danger">不通过：{progressFail}条</Typography.Text>
            </Space>}
            <Upload
                name="imgFile"
                showUploadList={false}
                action={`${process.env.REACT_APP_PROXY_URL}/crm/plugins3th/kindeditor/upload_json.php?dir=file&type=file`}
                loading={uploadLoading}
                onChange={info => {
                    uploadChange(info)
                }}>
                <Button>上传文件</Button>
            </Upload>
        </Toolbar>
        <Table
            size="small"
            rowKey="oid"
            bordered={true}
            loading={uploadLoading}
            scroll={{
                x: "100%"
            }}

            dataSource={dataSource}
            rowSelection={{
                fixed: "left",
                selectedRowKeys,
                onChange: (keys) => {
                    setSelectedRowKeys(keys);
                },
            }}
            pagination={{
                current: pageNum,
                pageSize: rowCount,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) => `共${total}条`,
                onChange: ((page, pageSize) => {
                    setPageNum(page);
                    setRowCount(pageSize);
                }),
                onShowSizeChange: ((current, size) => {
                    setPageNum(current);
                    setRowCount(size);
                }),
            }}>
            {columns.map(col => {
                return <Table.Column {...col} render={(text, record) => {
                    return renderColumn(col, record);
                }}>
                </Table.Column>
            })}
            <Table.Column
                ellipsis
                width={150}
                title="错误信息"
                fixed="right"
                render={(text, record) => {
                    let { errormessage } = record;
                    if (errormessage) {
                        return <Tooltip
                            forceRender
                            placement="topLeft"
                            title={errormessage}
                        >
                            <span>{errormessage}</span>
                        </Tooltip>
                    }
                    return null
                }} />
            <Table.Column
                width={100}
                title="验证状态"
                fixed="right"
                render={(text, record) => {
                    let { validstate, validstatename } = record;
                    let color = validstate == 1 ? 'default' : validstate == 2 ? 'error' : 'success';
                    return <Tag color={color}>{validstatename}</Tag>
                }} />
            <Table.Column
                width={100}
                title="导入状态"
                fixed="right"
                render={(text, record) => {
                    let { importstate, importstatename } = record;
                    let color = importstate == 0 ? 'default' : 'success';
                    return <Tag color={color}>{importstatename}</Tag>
                }} />
            <Table.Column
                title="操作"
                width={120}
                fixed="right"
                render={(text, record) => {
                    return <Space>
                        {isEditId != record.oid && <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                handleEdit(record)
                            }}>编辑</Button>}
                        {isEditId == record.oid && <Space>
                            <Button
                                type="link"
                                size="small"
                                icon={<SaveOutlined />}
                                loading={saveLoading}
                                style={{ padding: 0 }}
                                onClick={() => {
                                    handleSave(record)
                                }}>
                                保存
                        </Button>
                            <Button
                                type="link"
                                size="small"
                                icon={<CloseCircleOutlined />}
                                style={{ padding: 0 }}
                                onClick={() => {
                                    setIsEditId(null)
                                }}>
                                取消
                        </Button>
                        </Space>}
                    </Space>

                }}
            >
            </Table.Column>
        </Table>
        {(checkLoading || loading) && <Progress percent={percent} size="small" />}
    </Modal>
}
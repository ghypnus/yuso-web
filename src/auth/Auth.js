/**
 * 设置权限
 * @author ghypnus
 * @date 2021/1/11
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Modal, Row, Checkbox, Divider, message } from 'antd';
import { v4 } from "uuid";

const getDataList = (menuList = [], value = []) => {
    return menuList.map(menu => {
        let checkedList = menu.children.filter(item => value.indexOf(item.id) !== -1).map(item => item.id);
        return {
            value: menu.id,
            label: menu.name,
            checkAll: checkedList.length === menu.children.length,
            checkedList: checkedList,
            indeterminate: !!checkedList.length && checkedList.length < menu.children.length,
            children: menu.children.map(child => {
                return {
                    value: child.id,
                    label: child.name,
                }
            })
        }
    })
}

const Auth = (d) => {
    const { visible, id, value, data, onCancel, onOk } = d;

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dataList, setDataList] = useState(getDataList(data, value));

    useEffect(() => {
        let dataList = getDataList(data, value);
        setDataList([...dataList]);
    }, [value]);

    const onCheckAllChange = (menu, e) => {
        let checked = e.target.checked;
        menu.checkAll = checked;
        menu.checkedList = checked ? menu.children.map(item => item.value) : [];
        menu.indeterminate = false;
        setDataList([...dataList]);
    };

    const onChange = (menu, list) => {
        menu.checkedList = list;
        menu.indeterminate = !!list.length && list.length < menu.children.length;
        menu.checkAll = list.length === menu.children.length;
        setDataList([...dataList]);
    };



    return <Modal
        title='设置权限'
        okText='保存'
        cancelText='取消'
        destroyOnClose
        maskClosable={false}
        confirmLoading={confirmLoading}
        visible={visible}
        width={520}
        onOk={() => {
            let ids = [];
            setConfirmLoading(true);
            dataList.map(menu => {
                ids = ids.concat(menu.checkedList);
            })
            axios.post('/action.php', {
                request_type: 'IH|40',
                oid: id,
                ids: ids
            }).then(res => {
                setConfirmLoading(false);
                message.success('保存成功');
                if (onOk) {
                    onOk();
                }
            }).catch(error=>{
                setConfirmLoading(false);
            })

        }}
        onCancel={() => {
            if (onCancel) {
                onCancel();
            }
        }}
    >
        <div>
            {dataList.map(menu => {
                return <Fragment key={v4()}>
                    <Row style={{ paddingBottom: '10px' }}>
                        <Checkbox
                            checked={menu.checkAll}
                            indeterminate={menu.indeterminate}
                            onChange={e => {
                                onCheckAllChange(menu, e);
                            }} >{menu.label}</Checkbox>
                    </Row>
                    <Checkbox.Group
                        options={menu.children}
                        value={menu.checkedList}
                        onChange={list => {
                            onChange(menu, list);
                        }} />
                    <Divider style={{ margin: '15px 0' }} />
                </Fragment>
            })}
        </div>
    </Modal>
}

export default Auth;
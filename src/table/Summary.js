/*
 * 表格总结栏
 * @author ghypnus
 * @date 2021-08-27
 */
import React from 'react';
import { Table } from 'antd';
import { NumberUtil, FunctionUtil } from 'yuso-util';

const Summary = (props) => {

    const { columns, dataSource, selectedRowKeys } = props;

    /**
     * 获取单元格的值
     * @param {Object} col 列信息
     * @param {Object} data 数据
     */
    const getCellValue = (col, data) => {
        let result = 0;
        if (!data[col.dataIndex] && col.actions) {
            let content = col.actions[0].value.value;
            let cellVal = FunctionUtil.newFunction(data, content);
            if (typeof cellVal == 'string') {
                if (cellVal.indexOf(',') !== -1) {
                    result = Number(cellVal.replace(/,/g, ''));
                } else {
                    result = Number(cellVal);
                }
            }
        } else {
            result = data[col.dataIndex];
        }
        return result;
    }

    const renderCell = (col) => {
        if (col.summary) {
            let list = dataSource.filter(d => selectedRowKeys.indexOf(d.oid) !== -1);
            let sum = list.reduce((total, current) => {
                return NumberUtil.numberAdd(total, getCellValue(col, current));
            }, 0);
            return NumberUtil.thousands(sum);
        } else {
            return null
        }
    }

    dataSource
    return <Table.Summary.Row>
        <Table.Summary.Cell
            className="ant-table-cell-fix-left fix-left-0">
        </Table.Summary.Cell>
        <Table.Summary.Cell
            className="ant-table-cell-fix-left ant-table-cell-fix-left-last fix-left-32">
            合计
        </Table.Summary.Cell>
        {
            columns.map((col, idx) => {
                if (idx > 0) {
                    let classNames = [];
                    if (col.fixed == 'right') {
                        classNames.push("ant-table-cell-fix-right");
                        let cols = columns.filter(c => c.fixed == 'right');
                        let colIndex = cols.findIndex(c => c.dataIndex == col.dataIndex);
                        if (colIndex == 0) {
                            classNames.push("ant-table-cell-fix-right-last");
                        }
                        let fixedWidth = cols.slice(colIndex + 1).reduce((t, c) => {
                            return t + (c.width || 0)
                        }, 0);
                        classNames.push(`fix-right-${fixedWidth}`);
                    }
                    return <Table.Summary.Cell key={idx} className={classNames.join(" ")}>
                        {renderCell(col)}
                    </Table.Summary.Cell>
                }
            })
        }
    </Table.Summary.Row>
}

export default Summary;


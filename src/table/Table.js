/*
 * 表格
 * @author ghypnus
 * @date 2020-08-27
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import classnames from 'classnames';
import { ElementUtil, InterfaceUtil } from 'yuso-util';
import { convertChildrenToColumns } from './hooks/useColumns';

const prefixCls = 'yuso-table';
const type = 'DragableTitle';

const RNDContext = createDndContext(HTML5Backend);

const DragableTitle = ({
  // TODO 看一下Th接受哪些参数，重新处理一下。
  index,
  onResize,
  width,
  fixed,
  title,
  moveColumn,
  style,
  children,
  ...restProps }) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveColumn(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const isResize = !fixed && width;
  const isDrag = !fixed && title;
  if (isDrag) drop(drag(ref));
  const th = isDrag ? (
    <th
      style={style}
      {...restProps}
    >
      <span
        ref={ref}
        className={`${prefixCls}-drop-handle ${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move' }}
      >
        {children}
      </span>
    </th>
  ) : <th style={style} {...restProps}>{children}</th>;
  if (!isResize) return th;
  return (
    <Resizable
      width={width}
      height={0}
      handle={(
        <span
          className={`${prefixCls}-resizable-handle`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      )}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      {th}
    </Resizable>
  );
};

const YusoTable = (data) => {
  const {
    prefixCls,
    children,
    bordered,
    rowKey,
    columns,
    fullscreen,
    refresh,
    onLoad,
    onSelect,
    onChange,
    ...restProps } = data;

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columnList, setColumnList] = useState([]);
  const rootRef = useRef();

  useEffect(() => {
    if (columns) {
      setColumnList(columns);
    }
  }, [columns]);

  useEffect(() => {
    // TODO children改变做比较，有必要再setColumnList
    const newColumns = columns || convertChildrenToColumns(children);
    setColumnList(newColumns.map((col) => ({ ...col, checked: col.checked !== undefined ? col.checked : true })));
  }, [children]);

  useEffect(() => {
    if (fullscreen) {
      ElementUtil.requestFullscreen(rootRef.current);
    } else {
      ElementUtil.exitFullscreen(rootRef.current);
    }
  }, [fullscreen]);

  const getData = async () => {
    setLoading(true);
    const { params = {} } = data.options;
    const res = await InterfaceUtil.post({
      ...data.options,
      params: {
        ...params,
        pageNum: current,
        rowCount: pageSize,
      },
    });
    const { returnList, totalRowCount } = res;
    setLoading(false);
    setTotal(totalRowCount);
    const cols = convertChildrenToColumns(children).filter((o) => !!o.dataIndexMapping);
    setDataSource(returnList.map((item) => {
      let d = {};
      cols.map((col) => {
        d[col.dataIndexMapping[0]] = item[col.dataIndexMapping[1]];
      });
      return {
        ...item,
        ...d,
      };
    }));
    if (onLoad) {
      onLoad();
    }
  };

  useEffect(() => {
    getData();
  }, [current, pageSize, data.options, data.options.params]);

  useEffect(() => {
    if (refresh) {
      getData();
    }
  }, [refresh]);

  const convertColumns = useCallback(() => {

  }, [columns, children]);

  const moveColumn = useCallback((dragIndex, hoverIndex) => {
    const dragColumn = columnList[dragIndex];
    setColumnList(
      update(columnList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragColumn],
        ],
      }),
    );
  }, [columnList]);

  const tableProps = {
    loading,
    bordered,
    rowKey,
    onChange,
    components: {
      header: {
        cell: DragableTitle,
      },
    },
    rowSelection: {
      fixed: true,
      selectedRowKeys,
      onChange: (keys) => {
        setSelectedRowKeys(keys);
        if (onSelect) {
          onSelect(keys);
        }
      },
    },
    pagination: {
      current,
      pageSize,
      total,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total, range) => `共${total}条`,
      onChange: ((page, pageSize) => {
        setCurrent(page);
        setPageSize(pageSize);
      }),
      onShowSizeChange: ((current, size) => {
        setCurrent(current);
        setPageSize(size);
      }),
    },
    columns: columnList.filter((col) => col.checked).map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        index,
        width: column.width,
        fixed: column.fixed,
        title: column.title,
        className: `${prefixCls}-header-cell`,
        moveColumn,
        onResize: (e, { size }) => {
          setColumnList(() => {
            const nextColumns = [...columnList];
            nextColumns[index] = {
              ...nextColumns[index],
              width: size.width < 100 ? 100 : size.width,
            };
            return nextColumns;
          });
        },
      }),
    })),
    dataSource,
    ...restProps,
  };

  const manager = useRef(RNDContext);

  return (
    <div ref={rootRef}
      className={classnames(prefixCls, {
        [`${prefixCls}-fullscreen`]: fullscreen,
      })}
    >
      <DndProvider manager={manager.current.dragDropManager}>
        <Table {...tableProps} />
      </DndProvider>
    </div>
  );
};

YusoTable.Column = Table.Column;

YusoTable.defaultProps = {
  prefixCls,
  bordered: false,
};

export default YusoTable;

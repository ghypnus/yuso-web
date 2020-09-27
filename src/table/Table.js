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
import { ElementUtil } from 'yuso-util';
import { convertChildrenToColumns } from './hooks/useColumns';

const prefixCls = 'yuso-table';
const type = 'DragableTitle';

const RNDContext = createDndContext(HTML5Backend);

const DragableTitle = ({ index, onResize, width, moveColumn, style, children, ...restProps }) => {
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
  drop(drag(ref));
  if (!width) {
    return (
      <th
        {...restProps}
      >
        <span
          ref={ref}
          className={`${prefixCls}-drop-handle ${isOver ? dropClassName : ''}`}
          style={{ cursor: 'move', ...style }}
        >
          {children}
        </span>
      </th>
    );
  }
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
      <th
        {...restProps}
      >
        <span
          ref={ref}
          className={`${prefixCls}-drop-handle ${isOver ? dropClassName : ''}`}
          style={{ cursor: 'move', ...style }}
        >
          {children}
        </span>
      </th>
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
    onChange } = data;

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

  const getData = () => {
    setLoading(true);
    const {
      url,
      params = {},
    } = data.options;
    axios.post(url, {
      pageNum: current,
      rowCount: pageSize,
      ...params,
    }).then((res) => {
      const { returnList, totalRowCount } = res;
      setLoading(false);
      setTotal(totalRowCount);
      setDataSource(returnList);
      if (onLoad) {
        onLoad();
      }
    });
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
  },
  [columnList]);

  const tableProps = {
    loading,
    bordered,
    rowKey,
    onChange,
    rowSelection: {
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
    components: {
      header: {
        cell: DragableTitle,
      },
    },
    columns: columnList.filter((col) => col.checked).map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        index,
        width: column.width,
        className: `${prefixCls}-header-cell`,
        moveColumn,
        onResize: (e, { size }) => {
          setColumnList(() => {
            const nextColumns = [...columnList];
            nextColumns[index] = {
              ...nextColumns[index],
              width: size.width,
            };
            return nextColumns;
          });
        },
      }),
    })),
    dataSource,
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

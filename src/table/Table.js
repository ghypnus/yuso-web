/*
 * 表格
 * @author ghypnus
 * @date 2020-08-27
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';
import { BaseUtil } from 'yuso-util';
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Search from './Search';
import Toolbar from './Toolbar';

const prefixCls = 'yuso-table';

const type = 'DragableTitle';

const RNDContext = createDndContext(HTML5Backend);

const DragableTitle = (props) => {
  const { index, onResize, width, moveColumn, style, children, ...restProps } = props;
  const ref = React.useRef();
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


const YusoTable = (props) => {
  const { prefixCls, bordered, rowKey, search, title, columns = [] } = props;
  const [pageNum, setPageNum] = useState(1);
  const [rowCount, setRowCount] = useState(15);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columnList, setColumnList] = useState(columns);

  useEffect(() => {
    setLoading({
      loading: true,
    });
    let params = {
      pageNum,
      rowCount,
      request_type: 'table|query|Role',
    };
    if (!BaseUtil.isEmptyObject(searchParams)) {
      params = {
        ...params,
        ...searchParams,
      };
    }
    axios.post('/action.php', params).then((res) => {
      const { returnList, totalRowCount } = res;
      setLoading(false);
      setSearchLoading(false);
      setDataSource(returnList);
    });
  }, [pageNum, rowCount, searchParams]);

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
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => setSelectedRowKeys(keys),
    },
    components: {
      header: {
        cell: DragableTitle,
      },
    },
    columns: columnList.map((col, index) => ({
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
  if (title) tableProps.title = () => <Toolbar data={title} />;

  const manager = useRef(RNDContext);

  return (
    <div className={prefixCls}>
      {search && (
        <Search
          data={search}
          loading={searchLoading}
          onSearch={(values) => {
            setSearchLoading(true);
            setSearchParams(values);
          }}
        />
      )}
      <DndProvider manager={manager.current.dragDropManager}>
        <Table {...tableProps} />
      </DndProvider>
    </div>
  );
};

YusoTable.defaultProps = {
  prefixCls,
  bordered: false,
};

YusoTable.Search = Search;

export default YusoTable;

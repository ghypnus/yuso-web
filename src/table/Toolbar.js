/*
 * 表格工具栏
 * @author ghypnus
 * @date 2020-09-11
 */
import React from 'react';
import classnames from 'classnames';
import * as antds from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import ColumnSet from './ColumnSet';
import Fullscreen from './Fullscreen';

const components = {
  ...antds,
  PlusOutlined,
  ColumnSet,
  Fullscreen,
};

const Toolbar = (props) => {
  const { prefixCls, schema = {}, columns = [], onFilter, onFullscreen } = props;
  const { align = 'right' } = schema.props;
  const wrapCls = classnames(prefixCls, {
    [`${prefixCls}-align-${align}`]: align,
  });

  const recurrenceRender = (children) => {
    if (!children) return null;
    return (
      <>
        {children.map((item) => {
          if (typeof item === 'object') {
            const Comp = components[item.type];
            const compProps = { ...item.props };
            switch (item.type) {
              case 'ColumnSet':
                compProps.columns = columns;
                compProps.onChange = (cols) => {
                  if (onFilter) {
                    onFilter(cols);
                  }
                };
                break;
              case 'Fullscreen':
                compProps.onChange = (isFullscreen) => {
                  if (onFullscreen) {
                    onFullscreen(isFullscreen);
                  }
                };
              default:
                break;
            }
            return (
              <Comp {...compProps}>
                {recurrenceRender(item.children)}
              </Comp>
            );
          }
          return item;
        })}
      </>
    );
  };

  return (
    <div className={wrapCls}>
      <div className={`${prefixCls}-wrap`}>
        {recurrenceRender(schema.children)}
      </div>
    </div>
  );
};

Toolbar.defaultProps = {
  prefixCls: 'yuso-table-toolbar',
};

export default Toolbar;

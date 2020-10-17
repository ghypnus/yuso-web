/*
 * 工具栏
 * @author ghypnus
 * @date 2020-09-11
 */
import React from 'react';
import classnames from 'classnames';

const Toolbar = (data) => {
  const { prefixCls, style, align = 'right', children } = data;
  const wrapCls = classnames(prefixCls, {
    [`${prefixCls}-align-${align}`]: align,
  });

  return (
    <div className={wrapCls} style={style}>
      <div className={`${prefixCls}-wrap`}>
        {children}
      </div>
    </div>
  );
};

Toolbar.defaultProps = {
  prefixCls: 'yuso-toolbar',
};

export default Toolbar;

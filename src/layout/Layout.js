/*
 * 布局
 * @author ghypnus
 * @date 2020-08-27
 */
import React, { useEffect, useRef } from 'react';
import { Layout } from 'antd';
import { ElementUtil } from 'yuso-util';
import classnames from 'classnames';

export default (data) => {
  const { prefixCls = 'yuso-layout', children, props = {} } = data;
  const rootRef = useRef();

  // TODO监听ESC/F11 退出全屏以后需要把fullcreen改成false，包括表格的
  // TODO 实现useFullscreen hooks，以解决逻辑复用

  useEffect(() => {
    if (props.fullscreen) {
      ElementUtil.requestFullscreen(rootRef.current);
    } else {
      ElementUtil.exitFullscreen(rootRef.current);
    }
  }, [props.fullscreen]);

  return (
    <div ref={rootRef}
      className={classnames(prefixCls, {
        [`${prefixCls}-fullscreen`]: props.fullscreen,
      })}
    >
      <Layout {...props}>{children}</Layout>
    </div>
  );
};

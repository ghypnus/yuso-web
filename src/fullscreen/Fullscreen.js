/**
 * 全屏
 * @author john.gao
 * @date 2020/09/16
 */
import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';

const Fullscreen = (data) => {
  const [isFullscreen, setIsFullsreen] = useState(false);
  const { prefixCls, onClick, ...restProps } = data;
  return (
    <Tooltip title="全屏">
      <FullscreenOutlined
        {...restProps}
        onClick={() => {
          if (onClick) {
            setIsFullsreen(!isFullscreen);
            onClick(!isFullscreen);
          }
        }}
      />
    </Tooltip>
  );
};

Fullscreen.defaultProps = {
  prefixCls: 'yuso-table-fullscreen',
};

export default Fullscreen;

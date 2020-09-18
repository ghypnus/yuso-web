/**
 * 全屏
 * @author john.gao
 * @date 2020/09/16
 */
import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';

const Fullscreen = (props) => {
  const [isFullscreen, setIsFullsreen] = useState(false);
  const { prefixCls, onChange, ...restProps } = props;
  return (
    <Tooltip title="全屏">
      <FullscreenOutlined
        {...restProps}
        onClick={() => {
          if (onChange) {
            setIsFullsreen(!isFullscreen);
            onChange(!isFullscreen);
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

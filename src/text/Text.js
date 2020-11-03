import React from 'react';

export default data => {

    const { prefixCls = 'yuso-text', children } = data;
    return <div className={prefixCls}>
        {children}
    </div>
}
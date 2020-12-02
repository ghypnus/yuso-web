import React from 'react';
import classnames from 'classnames';

export default data => {
    const { prefixCls = 'yuso-text', type = 'default',  children } = data;

    const wrapCls = classnames(prefixCls, {
        [`${prefixCls}-${type}`]: type
    })
    return <div className={wrapCls}>
        {children}
    </div>
}
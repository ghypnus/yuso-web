import React from 'react';
import classnames from 'classnames';

export default data => {
    const {
        prefixCls = 'yuso-text',
        style = {},
        type = 'default',
        value,
        html = false,
        children
    } = data;
    const wrapCls = classnames(prefixCls, {
        [`${prefixCls}-${type}`]: type
    })
    let textProps = {
        className: wrapCls,
        style: style,

    }
    if (html) {
        textProps.dangerouslySetInnerHTML = { __html: value || children };
        return <div {...textProps} />
    } else {
        return <div {...textProps}>
            {value || children}
        </div>
    }
}
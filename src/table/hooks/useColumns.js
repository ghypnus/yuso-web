import React from 'react';
import { isFragment } from 'react-is';

export const toArray = (children, options = {}) => {
  let ret = [];
  React.Children.forEach(children, (child) => {
    if (child === undefined || child === null && !options.keepEmpty) {
      return;
    }
    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children, options));
    } else {
      ret.push(child);
    }
  });
  return ret;
};

export const convertChildrenToColumns = (children) => toArray(children).filter((node) => React.isValidElement(node)).map(({ key, props }) => {
  const { children: nodeChildren, ...restProps } = props;
  const column = {
    key,
    ...restProps,
  };
  if (nodeChildren) {
    column.children = convertChildrenToColumns(nodeChildren);
  }
  return column;
});

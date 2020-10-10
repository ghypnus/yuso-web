/**
 * 日期选择框
 * @author ghypnus
 * @date 2020/09/30
 */
import { DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';

const getValue = (val) => {
  if (val) {
    if (val._isAMomentObject) {
      return val;
    } if (typeof val === 'string') {
      return moment(val);
    }
  }
  return val;
};

export default ({ value, onChange, ...restProps }) => (
  <DatePicker
    value={getValue(value)}
    {...restProps}
    onChange={(date, dateStr) => {
      if (onChange) {
        onChange(dateStr);
      }
    }}
  />
);

export const isEmpty = (v) => {
  if (v && typeof v === 'object') {
    return Object.keys(v).length === 0;
  }
  return v === undefined || v === null || v === '';
};

/**
* 递归
* @param {Array} data 数组
* @param {Object} opts 参数
* @param {String} childrenKey 子集的key名
* @param {String} idKey 唯一编号ID
* @param {String} parentKey 父级ID
* @param {String} valueKey 显示ID
* @param {String} labelKey 显示Label
*/
export const recurrence = (data = [], opts = {}) => {
  var idKey = opts.idKey || 'code';
  var nameKey = opts.nameKey || 'name';
  var parentKey = opts.parentKey || 'parentCode';
  var childrenKey = opts.childrenKey || 'children';
  var valueKey = opts.valueKey || 'value';
  var labelKey = opts.labelKey || 'label';
  var dataList = data.map((item) => ({
    [valueKey]: item[idKey],
    [labelKey]: item[nameKey],
    [parentKey]: item[parentKey],
  }));
  var __recurrenceList = function (list) {
    return list.map((item) => {
      var childList = dataList.filter((child) => child[parentKey] === item[valueKey]);
      var array = __recurrenceList(childList);
      return array.length > 0 ? ({ ...item, path: [], [childrenKey]: array }) : item;
    });
  };
  var result = dataList.filter((item) => item[parentKey] == '-1').map((item) => ({ ...item, path: [item[valueKey]] }));
  return __recurrenceList(result);
};

/**
 * 根据最后层级的值，递归获取所有层级的值
 * @param {Array} data 数组
 * @param {Any} value 值
 * @param {Object} opts 参数
 * @param {String} idKey 唯一编号ID
 * @param {String} parentKey 父级ID
 */
export const recurrenceValue = (data = [], value, opts = {}) => {
  var idKey = opts.idKey || 'code';
  var parentKey = opts.parentKey || 'parentCode';
  var result = [];
  var __recurrenceList = function (list, val) {
    var item = list.find((obj) => obj[idKey] === val);
    result.unshift(item[idKey]);
    if (item[parentKey] !== '-1') {
      __recurrenceList(data, item[parentKey]);
    }
    return result;
  };
  return __recurrenceList(data, value);
};

/**
 * 防抖（立即执行）
 * @param {Function} func 函数
 * @param {Number} wait 频率
 * @param {Boolean} immediate 是否立即执行
 */
export const debounce = (func, wait, immediate) => {
  let timeout;
  return () => {
    let context = this;
    let args = arguments;
    console.log(666, timeout);
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      if (!timeout) func.apply(context, args);
      timeout = setTimeout(() => {
        func.apply(context, args);
        timeout = null;
      }, wait);
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
        timeout = null;
      }, wait);
    }
  };
};

export const isEmpty = (v) => {
  if ( v && typeof v === 'object') {
    return Object.keys(v).length === 0;
  }else {
    return v === undefined || v === null || v === '';
  }
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
  var dataList = data.map(function (item) {
    return {
      [valueKey]: item[idKey],
      [labelKey]: item[nameKey],
      [parentKey]: item[parentKey]
    }
  })
  var __recurrenceList = function (list) {
    return list.map(function (item) {
      var childList = dataList.filter(function (child) {
        return child[parentKey] === item[valueKey];
      });
      var array = __recurrenceList(childList);
      return array.length > 0 ? Object.assign({}, item, { path: [], [childrenKey]: array }) : item;
    })
  }
  var result = dataList.filter(function (item) {
    return item[parentKey] == '-1';
  }).map(function (item) {
    return Object.assign({}, item, { path: [item[valueKey]] })
  })
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
export const recurrenceValue = (data = [], value, opts = {})=> {
  var idKey = opts.idKey || 'code';
  var parentKey = opts.parentKey || 'parentCode';
  var result = [];
  var __recurrenceList = function (list, val) {
    var item = list.find(function (obj) {
      return obj[idKey] === val
    })
    result.unshift(item[idKey]);
    if (item[parentKey] !== '-1') {
      __recurrenceList(data, item[parentKey]);
    }
    return result;
  }
  return __recurrenceList(data, value);
};
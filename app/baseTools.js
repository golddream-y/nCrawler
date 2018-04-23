/**
 * 基本工具
 * @Author: erwin
 * @Date:   2018-04-23 13-04-82
 * @Last modified by:   erwin
 * @Last modified time: 2018-04-23 14-04-64
 */



/**
 * 为数组对象增加迭代器接口
 * @method
 * @param  {[type]} obj
 * @return {[type]}
 */
function* objectEntries(obj) {
  let propKeys = Object.keys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}






module.exports = {
  objectEntries
};
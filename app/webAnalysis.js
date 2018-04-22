/**
 * web分析服务（for taobaoMirror）
 * @Author: Erwin
 * @Date:   2018-04-22 13-04-78
 * @Last modified by:   erwin
 * @Last modified time: 2018-04-22 16-04-05
 */

const cheerio = require('cheerio')


/**
 * 获取镜像的目录结构
 * @method
 * @param  {[type]} domString
 * @return {[type]}
 */
const getDirList = function(domString) {
  if (typeof domString !== 'string') {
    throw new Error('参数输入类型错误：希望得到的类型 string ，实际得到的类型 ' + typeof domString);
  }
  const $ = cheerio.load(domString);
  const doms = $('pre a');
  let linkArray = [];
  Object.values(doms).forEach(function(ele) {
    if (ele.attribs) {
      // TODO: 考虑将非常规路径配置成数组，统一过滤
      if (ele.attribs.href !== '../') {
        linkArray.push(ele.attribs.href);
      }
    }
  })

  return linkArray;
}

module.exports = {
  getDirList
};
  /**
   * 文件下载服务
   * @Author: Erwin
   * @Date:   2018-04-22 13-04-43
   * @Last modified by:   erwin
   * @Last modified time: 2018-04-23 16-04-36
   */

  const request = require('request');
  const fs = require('fs');

  /**
   * 通过文件地址获取文件名称
   * @method
   * @param  {[string]} url
   * @return {[string]}
   */
  const getNameByUrl = function(url) {
    // 默认规则为，当前路径最后一级为文件名称
    let urlArray = url.split('/');
    return urlArray[urlArray.length - 1];
  };


  /**
   * 删除绝对路径的头（AbsolutePathHeader，英语很抠脚，见个谅）
   * @type {[string]}
   */
  const delAPH = function(ap) {
    if (ap.indexOf('/') === 0) {
      return ap.substr(1, ap.length);
    }
    return ap;
  };


  /**
   * 创建目录
   * @method
   * @param  {[string]} path
   * @return {[type]}
   */
  const mkdir = function(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  };

  /**
   * 获取远程文件
   * @param  {string} method
   * @param  {string} proxy
   * @param  {string} uri
   * @param  {function} callBack
   * @return {[type]}
   */
  const getRemoteFile = function({
    method,
    proxy,
    uri,
    dir
  }) {

    // 文件目录（缺省值为url中截取的文件名称）
    const fileDir = delAPH(dir ? dir + '/' + getNameByUrl(uri) : getNameByUrl(uri));

    return new Promise(function(resolve, reject) {
      request({
          method: method,
          proxy: proxy,
          uri: uri
        },
        function(error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }).pipe(fs.createWriteStream(fileDir))
    })
  };

  /**
   * 根据长地址创建多级目录
   * @method
   * @param  {[type]} dirStr
   * @return {[type]}
   */
  const createDir = function(dirStr) {
    // TODO: 需要根据不同的系统获取不同的系统分隔符（path模块）
    const dirArray = dirStr.split('/');
    // 初始化地址，用于循环叠加
    let dir = '';
    // 用于记录叠加的目录级别
    let dirIndex = 0;
    // 生成目录
    dirArray.forEach(function(path, index) {
      if (path === '') {
        return;
      }
      // 叠加目录
      dirIndex !== 0 ? dir += ('/' + path) : dir += path;
      // 创建目录
      mkdir(dir);
      // 增加目录级别
      dirIndex++;
    })

    // fs.existsSync('mirrors/node-sass')
  };


  module.exports = {
    getRemoteFile,
    createDir
  }
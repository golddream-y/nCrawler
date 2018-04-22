  /**
   * @Author: Erwin
   * @Date:   2018-04-22 11-04-67
   * @Last modified by:   erwin
   * @Last modified time: 2018-04-22 21-04-55
   */

  const request = require('request');
  const proxyConf = require('./conf.json').proxy;
  const Promise = require("bluebird");

  // 临时引用
  const fs = require('fs');
  const cheerio = require('cheerio')
  // 内部依赖
  const fileDown = require('./fileDownload');
  const webAnalysis = require('./webAnalysis');


  // 代理服务器地址
  const proxyUrl = proxyConf.hasOwnProperty('url') ? 'http://' + proxyConf.name + ':' + proxyConf.password + '@' + proxyConf.url : null;
  // 淘宝镜像域
  const taobaoHost = 'https://npm.taobao.org';

  request({
    method: 'get',
    proxy: proxyUrl,
    uri: taobaoHost + '/mirrors/node-sass/'
  }, function(error, response, body) {
    if (error) {
      return;
    }
    // 当前镜像类别的版本清单
    const dirList = webAnalysis.getDirList(body);


    // TODO: 必须将一下代码改为迭代器实现，将一个版本下载完成后再下载下一个，否则会报文件系统超过最大连接数错误
    dirList.forEach(function(dl) {
      // 创建文件夹
      fileDown.createDir(dl);
      // 版本目录
      const versionDir = dl;

      request({
        method: 'get',
        proxy: proxyUrl,
        uri: taobaoHost + versionDir
      }, function(error, response, body) {
        if (error) {
          return;
        }
        // 当前版本的文件列表
        const fileList = webAnalysis.getDirList(body);
        // 当前版本下文件下载成功数量
        let fileDownSuccessNum = 0;
        // 根据当前文件列表，下载当前版本的文件
        fileList.forEach(function(fl, index) {
          console.log(index + '开始下载文件:', fl);
          fileDown.getRemoteFile({
            method: 'get',
            proxy: proxyUrl,
            uri: 'https://npm.taobao.org' + fl,
            dir: versionDir
          }).then(function(info) {
            console.log('文件下载成功:', fl);
            fileDownSuccessNum++;
            if (fileDownSuccessNum === fileList.length) {
              console.log('当前版本所有文件下载成功:', versionDir);
            }
          }, function(error) {
            console.log('文件下载失败：', error);
          })
        })
      })


    })
  })






  // if (!fs.existsSync('mirrors')) {
  //   fs.mkdirSync('mirrors');
  // }
  // fs.mkdirSync('mirrors/node-sass');
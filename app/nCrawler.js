  /**
   * @Author: Erwin
   * @Date:   2018-04-22 11-04-67
   * @Last modified by:   erwin
   * @Last modified time: 2018-04-23 16-04-41
   */

  const request = require('request');
  const {
    proxy,
    fileVersion
  } = require('./conf.json');
  const Promise = require("bluebird");

  // 内部依赖
  const fileDown = require('./fileDownload');
  const webAnalysis = require('./webAnalysis');
  const baseTools = require('./baseTools');


  // 代理服务器地址
  const proxyUrl = proxy.hasOwnProperty('url') ? 'http://' + proxy.name + ':' + proxy.password + '@' + proxy.url : null;
  // 淘宝镜像域
  const taobaoHost = 'https://npm.taobao.org';


  /**
   * 通过版本目录获取文件
   * @method
   * @param  {[type]} versionDir
   * @param  {[type]} completeDown
   * @return {[type]}
   */
  const getFileWithVersion = function(versionDir, completeDown) {

    request({
      method: 'get',
      proxy: proxyUrl,
      uri: taobaoHost + versionDir
    }, function(error, response, body) {
      if (error) {
        console.log('当前版本的文件列表下载失败：', versionDir);
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
            completeDown();
          }
        }, function(error) {
          console.log('文件下载失败：', error);
        })
      })
    })
  }



  request({
    method: 'get',
    proxy: proxyUrl,
    uri: taobaoHost + '/mirrors/node-sass/'
  }, function(error, response, body) {
    if (error) {
      console.log('获取node-sass版本目录错误：', error);
      return;
    }
    // 当前镜像类别的版本清单
    const dirList = webAnalysis.getDirList(body);
    // 创建迭代器接口
    const baseToolsGen = baseTools.objectEntries(dirList.splice(-fileVersion.recentVer));

    /**
     * 递归执行版本下载迭代器
     * @method
     * @return {[type]}
     */
    const runDirGen = function() {
      const dirItem = baseToolsGen.next();
      if (!dirItem.done) {
        // 创建文件夹
        fileDown.createDir(dirItem.value[1]);

        getFileWithVersion(dirItem.value[1], function() {
          runDirGen();
        });
      }

    }

    // 压死骆驼的最后一个方法
    runDirGen();
  })
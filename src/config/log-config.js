import log4js from 'log4js';
import path from 'path';
import fs from 'fs';

const basePath = path.resolve(__dirname, '../logs');

const errorPath = basePath + '/errors/';
const resPath = basePath + '/responses/';
const openAPIErrorPath = basePath + '/openAPIErrors/';
const openAPIResPath = basePath + '/openAPIResponses/';

const errorFilename = errorPath + '/error';
const resFilename = resPath + '/response';
const openAPIErrorFilename = openAPIErrorPath + '/open-api-error';
const openAPIResFilename = openAPIResPath + '/open-api-response';

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
const confirmPath = function(pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr);
    console.log('createPath: ' + pathStr);
  }
};
log4js.configure({
  appenders: {
    errorLog: {
      type: 'dateFile', //日志类型
      filename: errorFilename, //日志输出位置
      alwaysIncludePattern: true, //是否总是有后缀名
      pattern: 'yyyy-MM-dd.log' //后缀，每小时创建一个新的日志文件
    },
    responseLog: {
      type: 'dateFile',
      filename: resFilename,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log'
    },
    openAPIErrorLog: {
      type: 'dateFile',
      filename: openAPIErrorFilename,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log'
    },
    openAPIResLog: {
      type: 'dateFile',
      filename: openAPIResFilename,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log'
    }
  },
  categories: {
    errorLog: { appenders: ['errorLog'], level: 'error' },
    responseLog: { appenders: ['responseLog'], level: 'info' },
    openAPIErrorLog: { appenders: ['openAPIErrorLog'], level: 'error' },
    openAPIResLog: { appenders: ['openAPIResLog'], level: 'info' },
    default: { appenders: ['responseLog','errorLog',], level: 'trace' }
  },
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  disableClustering: true
});
//创建log的根目录'logs'
if (basePath) {
  confirmPath(basePath);
  //根据不同的logType创建不同的文件目录
  confirmPath(errorPath);
  confirmPath(resPath);
  confirmPath(openAPIErrorPath);
  confirmPath(openAPIResPath);
}

module.exports = log4js;
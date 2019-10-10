/**
 * 请求校验中间件
 *
 */

// 验签白名单
const redis = require("redis");
const {promisify} = require('util');
import { checkSign } from '../libs/common';
import responseCode from '../config/response-code-config';
import redisConfig from '../config/redis-config';
const sign_white_list = [];


const client = redis.createClient(redisConfig);
const hgetAsync = promisify(client.hget).bind(client);

export default async function(req, res, next) {
  // 请求方法校验
  if (req.method !== 'POST') {
    res.json({
      code: responseCode.METHOD_NOT_ALLOWED.ID,
      msg: responseCode.METHOD_NOT_ALLOWED.MESSAGE
    });
    return;
  }

  // 系统参数校验
  if (!req.body.appKey || !req.body.version || !req.body.timestamp || !req.body.sign) {
    res.json({
      code: responseCode.INVALID_SYS_PARAM.ID,
      msg: responseCode.INVALID_SYS_PARAM.MESSAGE
    });
    return;
  }

  // 请求回放校验
  let req_time = new Date(req.body.timestamp).getTime();
  let now_time = new Date().getTime();
  let time_out = process.env.NODE_ENV === 'debug' ? 600000 : 60000;
  if (Math.abs(now_time - req_time) > time_out) {
    res.json({
      code: responseCode.REQUEST_REPLAY.ID,
      msg: responseCode.REQUEST_REPLAY.MESSAGE
    });
    return;
  }

  const appSecret = await hgetAsync(`APP_KEY_${req.body.appKey}`, 'appSecret');
  if (!appSecret) {
    res.json({
      code: responseCode.INVALID_APP_KEY.ID,
      msg: responseCode.INVALID_APP_KEY.MESSAGE
    });
    return;
  }
  // 请求签名校验
  if (process.env.APP_ENABLE_SIGN && sign_white_list.indexOf(req.originalUrl) === -1) {
    if (!checkSign(req, appSecret)) {
      res.json({
        code: responseCode.INVALID_SIGN.ID,
        msg: responseCode.INVALID_SIGN.MESSAGE
      });
      return;
    }
  }

  next();
}

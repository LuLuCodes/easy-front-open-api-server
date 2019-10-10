import { Router } from 'express';
import { checkSign } from '../libs/common';
import appKey from '../config/app-key-config';
import responseCode from '../config/response-code-config';

const router = Router();

// 检验参数完整性
router.use(async (req, res, next) => {
  if (!req.body.appKey || !req.body.version || !req.body.timestamp || !req.body.sign) {
    res.json({
      code: responseCode.INVALID_SYS_PARAM.ID,
      msg: responseCode.INVALID_SYS_PARAM.MESSAGE
    });
    return;
  }
  next();
});

// 验证请求合法性
router.use(async (req, res, next) => {
  if (!appKey[req.body.appKey]) {
    res.json({
      code: responseCode.INVALID_APP_KEY.ID,
      msg: responseCode.INVALID_APP_KEY.MESSAGE
    });
    return;
  }
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

  if (!process.env.APP_ENABLE_SIGN) {
    next();
    return;
  }

  if (!checkSign(req)) {
    res.json({
      code: responseCode.INVALID_SIGN.ID,
      msg: responseCode.INVALID_SIGN.MESSAGE
    });
    return;
  }

  next();
});

export default router;

import './env';

import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import corsConfig from './config/cors-config';
import verify from './middleware/verify';
import log from './log';
import index from './routes/index';
import responseCode from './config/response-code-config';

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 1, // limit each IP to 100 requests per windowMs
  keyGenerator: function(req) {
    return req.body.appKey;
  }
});

app.locals.title = process.env.APP_NAME;
app.locals.version = process.env.APP_VERSION;


app.use(cors(corsConfig));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser(process.env.APP_COOKIE_KEY));

// logger
app.post('*', async (req, res, next) => {
  //响应开始时间
  const start = new Date();
  try {
    //开始进入到下一个中间件
    await next();
    //记录响应日志
    log.i(req, res, new Date() - start);
  } catch (error) {
    //记录异常日志
    log.e(req, error, new Date() - start);
  }
});

// 请求验证
app.use(
  verify
);

app.use(limiter);

app.use('/', index);

app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  // CSRF验证失败
  res.status(403);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'debug' ? err : {}
  });
});

// 未携带token请求接口会出错，触发这个
app.use(function(err, req, res, next) {
  if (err.name !== 'UnauthorizedError') return next(err);
  // token验证失败
  res.status(401);
  res.json({
    msg: err.message,
    code: responseCode.UNKOWN_ERROR.ID
  });
});

// catch 404 and forward to error handler
app.use(function(req, res /* next */) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(err.status);
  res.json({
    msg: err.message,
    code: responseCode.UNKOWN_ERROR.ID
  });
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res /* next */) {
  res.status(err.status || 500);
  res.json({
    msg: err.message,
    code: responseCode.UNKOWN_ERROR.ID
  });
});

export default app;

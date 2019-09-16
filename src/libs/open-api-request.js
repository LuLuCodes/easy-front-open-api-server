import axios from 'axios';
import log from './open-api-log';
import config from '../config/open-api-config';

const { baseURL } = config;

export default async function (url, json, timeout = 25000) {
  if (!url || !json) {
    throw new Error('缺少必要参数');
  }
  let start = new Date();
  try {
    let res = await axios({
      method: 'post',
      baseURL,
      timeout: timeout,
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      url: url,
      data: json
    });
    let end = new Date();
    let data = res.data;
    if (!data) {
      log.e(baseURL, url, json, '第三方未返回data', start, end);
      return { IsSuccess: false, ErrorMsg: '第三方未返回data' };
    }
    if (!data.success) {
      log.e(baseURL, url, json, data.reason_code, start, end);
      return { IsSuccess: false, ErrorMsg: `${data.reason_code}` };
    }
    log.i(baseURL, url, json, data, start, end);
    delete data.success;
    delete data.reason_code;
    return { IsSuccess: true, Data: data };
  } catch (error) {
    let end = new Date();
    log.e(baseURL, url, json, error.message, start, end);
    return { IsSuccess: false, ErrorMsg: error.message };
  }
}

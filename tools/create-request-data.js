// 模拟创建请求数据
const appKey = '1991';
const appSecret = 'b45287e938df25da29f7fa7024975454';
const crypto = require('crypto');

function sortAsc(o) {
  let n = [];
  for (var k in o) n.push(k);
  n.sort();
  let str = '';
  for (let i = 0; i < n.length; i++) {
    var v = o[n[i]];
    if (v !== '') {
      if ({}.toString.call(v) === '[object Object]') {
        v = `{${sortAsc(v)}}`;
      } else if ({}.toString.call(v) === '[object Array]') {
        let ary = '';
        for (let t of v) {
          ary += `,{${sortAsc(t)}}`;
        }
        v = '[' + ary.slice(1) + ']';
      }
      str += '&' + n[i] + '=' + v;
    }
  }
  return str.slice(1);
}

function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (typeof date === 'string') {
    return date;
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

const data = {
  name: 'qianqing'
};
data.appKey = appKey;
data.version = '1.0.0';
data.timestamp = dateFormat(new Date());

let sign = sortAsc(data);
sign = appSecret + sign + appSecret;
data.sign = crypto
  .createHash('md5')
  .update(sign, 'utf8')
  .digest('hex');

console.log(JSON.stringify(data));

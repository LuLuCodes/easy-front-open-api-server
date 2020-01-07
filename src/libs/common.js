import crypto from 'crypto';

export function transArrayToObject(ary, key) {
  let obj = {};
  for (let item of ary) {
    obj[item[key]] = {
      ...item
    };
  }
  return obj;
}

export function transGlobalObject(ary) {
  let obj = {};
  for (let item of ary) {
    obj[item['ParamKey']] = item.ParamValue;
  }
  return obj;
}

export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
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

export function sortAsc(o) {
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
          if ({}.toString.call(t) === "[object Object]") {
            ary += `,{${sortAsc(t)}}`;
          } else {
            ary += `,${sortAsc(t)}`;
          }
        }
        v = '[' + ary.slice(1) + ']';
      }
      str += '&' + n[i] + '=' + v;
    }
  }
  return str.slice(1);
}

export function checkSign(req, appSecret) {
  try {
    let req_sign = req.body.sign;
    delete req.body.sign;
    let sign = sortAsc(req.body);
    req.body.sign = req_sign;
    sign = appSecret + sign + appSecret;
    sign = crypto
      .createHash('md5')
      .update(sign, 'utf8')
      .digest('hex');
    return req_sign === sign;
  } catch (e) {
    return false;
  }
}
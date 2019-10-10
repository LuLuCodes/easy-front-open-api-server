// 新增app小工具

const redis = require("redis");
const {promisify} = require('util');
const crypto = require('crypto');
const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  db: 1
});

const OrganizationSysNo = 19;
const SellerSysNo = 91;

const setAsync = promisify(client.set).bind(client);
const appKey = `${OrganizationSysNo}${SellerSysNo}`;

async function addAppKey() {
  let appSecret = crypto
      .createHash('md5')
      .update(`APP_KEY_${appKey}`, 'utf8')
      .digest('hex');
  const res = await setAsync(`APP_KEY_${appKey}`, appSecret);
  console.log(res);
}

addAppKey();
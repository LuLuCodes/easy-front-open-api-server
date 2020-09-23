// 发布小火箭白名单
const inquirer = require('./libs/inquirer');
const crypto = require('crypto');

const { promisify } = require('util');
const redis = require('redis');
const redis_client = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  db: 0,
});
const hmget = promisify(redis_client.hmget).bind(redis_client);
const hmset = promisify(redis_client.hmset).bind(redis_client);
const del = promisify(redis_client.del).bind(redis_client);
const keys = promisify(redis_client.keys).bind(redis_client);

function makeSalt(len = 3) {
  return crypto.randomBytes(len).toString('base64');
}

async function addAppkey(config) {
  try {
    let res = await keys(`APP_KEY_${config.appKey}`);
    if (res.length) {
      console.error(`AppKey 已存在: ${config.appKey}`);
      return;
    }
    const appSecret = makeSalt(32);
    await hmset(
      `APP_KEY_${config.appKey}`,
      'appKey',
      config.appKey,
      'appSecret',
      appSecret,
      'developName',
      config.developName
    );
    console.log(
      `AppKey 已创建: ${config.appKey}，AppSecret: ${appSecret}, DevelopName: ${config.developName}`
    );
  } catch (error) {
    console.error(`${error.message}`);
  }
}

async function queryAppkey(config) {
  try {
    let res = await keys(`APP_KEY_${config.appKey}`);
    if (!res.length) {
      console.error(`AppKey 不存在: ${config.appKey}`);
      return;
    }
    res = await hmget(
      `APP_KEY_${config.appKey}`,
      'appKey',
      'appSecret',
      'developName'
    );
    console.log(
      `AppKey: ${res[0]}，AppSecret: ${res[1]}, DevelopName: ${res[2]}`
    );
  } catch (error) {
    console.error(`${error.message}`);
  }
}

async function listAppkey() {
  try {
    let res = await keys(`APP_KEY_*`);
    if (!res.length) {
      return;
    }
    for (let item of res) {
      let result = await hmget(item, 'appKey', 'appSecret', 'developName');
      console.log(
        `AppKey: ${result[0]}，AppSecret: ${result[1]}, DevelopName: ${result[2]}`
      );
    }
  } catch (error) {
    console.error(`${error.message}`);
  }
}

async function delAppkey(config) {
  try {
    let res = await keys(`APP_KEY_${config.appKey}`);
    if (!res.length) {
      console.error(`AppKey 不存在: ${config.appKey}`);
      return;
    }
    res = await hmget(
      `APP_KEY_${config.appKey}`,
      'appKey',
      'appSecret',
      'developName'
    );
    await del(`APP_KEY_${config.appKey}`);
    console.log(
      `已删除，AppKey: ${res[0]}，AppSecret: ${res[1]}, DevelopName: ${res[2]}`
    );
  } catch (error) {
    console.error(`${error.message}`);
  }
}

const launch = async () => {
  const config = await inquirer.getQuestions();
  if (config.function === 'add-app-key') {
    await addAppkey(config);
  } else if (config.function === 'query-app-key') {
    await queryAppkey(config);
  } else if (config.function === 'list-app-key') {
    await listAppkey(config);
  } else if (config.function === 'del-app-key') {
    await delAppkey(config);
  }
  process.exit(0);
};
launch();

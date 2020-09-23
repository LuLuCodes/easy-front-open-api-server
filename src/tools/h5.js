const globalConfig = require('../config/global-config');
const redis_config = globalConfig.redis_config;
const redis_keys = globalConfig.redis_keys;

const redis = require('redis');

const redis_client = redis.createClient(redis_config);
const { promisify } = require('util');
const get = promisify(redis_client.get).bind(redis_client);
const set = promisify(redis_client.set).bind(redis_client);

const publish = {
  async setVersion(version) {
    if (Number.isNaN(version)) {
      return '版本号必须是数字';
    }
    let newVersion = parseInt(version);
    let oldVersion = await get(redis_keys.H5_VERSION);
    oldVersion = parseInt(oldVersion);
    if (oldVersion >= newVersion) {
      return '最新版本号必须大于当前版本号';
    }
    await set(redis_keys.H5_VERSION, newVersion);
    return `设置成功，当前版本为 ${newVersion}`;
  },
  async getVersion() {
    return await get(redis_keys.H5_VERSION);
  },
};

module.exports = publish;

const globalConfig = require('../config/global-config');
const redis_config = globalConfig.redis_config;
const redis_keys = globalConfig.redis_keys;

const redis = require('redis');

const redis_client = redis.createClient(redis_config);
const { promisify } = require('util');
const get = promisify(redis_client.get).bind(redis_client);
const set = promisify(redis_client.set).bind(redis_client);
const sadd = promisify(redis_client.sadd).bind(redis_client);
const del = promisify(redis_client.del).bind(redis_client);
const smembers = promisify(redis_client.smembers).bind(redis_client);
const srem = promisify(redis_client.srem).bind(redis_client);

const ad = {
  async setWhite(pt, isOpen = 0) {
    await set(`${pt}_${redis_keys.AD}`, isOpen);
  },
  async getWhiteStatus(pt) {
    let status = await get(`${pt}_${redis_keys.AD}`);
    return status;
  },
  async addPerson(persons, isAppend = false) {
    const list = persons.split(',');
    if (list && list.length) {
      if (!isAppend) {
        await del(redis_keys.AD_WHITE_PERSONS);
      }
      await sadd(redis_keys.AD_WHITE_PERSONS, ...list);
      return list.length;
    }
    return 0;
  },
  async delPerson(persons) {
    const list = persons.split(',');
    if (list && list.length) {
      await srem(redis_keys.AD_WHITE_PERSONS, ...list);
      return list.length;
    }
    return 0;
  },
  async queryPerson() {
    return await smembers(redis_keys.AD_WHITE_PERSONS);
  },
  async cleanPerson() {
    await del(redis_keys.AD_WHITE_PERSONS);
  },
};

module.exports = ad;

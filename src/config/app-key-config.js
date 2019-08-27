'use strict';
const config_dev = {
  '34245677': '417e98fe2dc19d44d47752c7fd8c8886d83d8bfc'
};

const config_pro = {
  '34245677': '417e98fe2dc19d44d47752c7fd8c8886d83d8bfc'
};

export default process.env.NODE_ENV === 'debug' ? config_dev : config_pro;
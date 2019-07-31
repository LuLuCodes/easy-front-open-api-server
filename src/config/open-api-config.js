'use strict';
const config_dev = {
};

const config_pro = {
};

export default process.env.NODE_ENV === 'debug' ? config_dev : config_pro;
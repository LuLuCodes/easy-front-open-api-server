export default {
  cookie: { secure: false, maxAge: 3 * 24 * 3600 * 1000, httpOnly: true },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 15
  },
  secret: process.env.APP_COOKIE_KEY || 'Easy Front Open API 123!@#',
  key: process.env.APP_COOKIE_KEY || 'easy-front-open-api-server'
};

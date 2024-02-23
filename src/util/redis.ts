const redis = require('redis');
//당장은 로컬에서
const redisClient = redis.createClient( {host: 'localhost',port:process.env.REDIS_PORT});

  
module.exports = redisClient
const redis = require('redis');
//당장은 로컬에서
const redisClient = redis.createClient( {host: 'localhost',port:6379});

  
module.exports = redisClient
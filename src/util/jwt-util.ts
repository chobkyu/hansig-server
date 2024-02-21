const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const secret =process.env.SECRET;
const refreshSecret=process.env.REFRESH_SECRET;
const redisClient=require('./redis');
import { Logger } from "winston";
const logger = new Logger();
module.exports = {
    sign : (user:any) => {
        const payload = {
            id: user.id,
            userId : user.userId,
            userNickName : user.userNickName
        };
        if((process.env.NODE_ENV==='test') && ((process.env.TEST_MODE==='refresh')||(process.env.TEST_MODE==='access')))//refreshToken시험시
        {
            return jwt.sign(payload, secret,{
                algorithm:'HS256',
                expiresIn:'0',
            });
        }
        return jwt.sign(payload, secret,{
            algorithm:'HS256',
            expiresIn:'3h',
        });
    },
    verify: (token:string) => {
        let decoded = null;
        
        if(token == 'testtoken') {
            console.log('test user token')
            return {success:true,decodedData:{id:137,userId:'test',userNickName:'giwon'}}  //테스트용 코드
        }

        if(token == 'ownertoken') {
            console.log('test owner token');
            return {success:true, decodedDate:{}} //테스트용 오너 아이디 내용 추가 예정
        }
        try{
            decoded = jwt.verify(token,secret);
            return {success:true, decodedData : decoded}
        }catch(err){
            return {success:false,msg:err.message};
        }
    },
    refresh: () => { // refresh token 발급
      if((process.env.NODE_ENV==='test') && (process.env.TEST_MODE==='refresh'))
      {
        console.log('refresh_expired????');
        return jwt.sign({}, refreshSecret, {
          algorithm: 'HS256',
          expiresIn: '0',
        });
      }
        return jwt.sign({}, refreshSecret, { // refresh token은 payload 없이 발급
          algorithm: 'HS256',
          expiresIn: '1d',
        });
      },
      refreshVerify: async (token:any, userId:string) => { // refresh token 검증
        try {
          const data = await redisClient.get(userId); // refresh token 가져오기
          console.log(data,token);
          if (token === data) {
            try {
              const jr=jwt.verify(token, refreshSecret);
              return true;
            } catch (err) { 
              return false;
            }
          } else {
            return false;
          }
        } catch (err) {
          return false;
        }
      },
}
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const secret =process.env.SECRET;
const refreshSecret=process.env.REFRESH_SECRET;
const redisClient=require('./redis');
module.exports = {
    sign : (user:any) => {
        const payload = {
            id: user.id,
            userId : user.userId,
            userNickName : user.userNickName
        };
        if(payload.id==='refreshToken')
        {
            return jwt.sign(payload, secret,{
                algorithm:'HS256',
                expiresIn:'0',
            });
        }
        return jwt.sign(payload, secret,{
            algorithm:'HS256',
            expiresIn:'30m',
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
        if(token=='refreshtest')
        {
            throw new Error("jwt expired");
        }
        try{
            decoded = jwt.verify(token,secret);
            return {success:true, decodedData : decoded}
        }catch(err){
            //console.log(err);
            return {success:false,msg:err};
        }
    },
    refresh: () => { // refresh token 발급
        return jwt.sign({}, refreshSecret, { // refresh token은 payload 없이 발급
          algorithm: 'HS256',
          expiresIn: '1d',
        });
      },
      refreshVerify: async (token:string, userId:number) => { // refresh token 검증
        /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
           promisify를 이용하여 promise를 반환하게 해줍니다.*/
        const getAsync = promisify(redisClient.get).bind(redisClient);
        
        try {
          const data = await getAsync(userId); // refresh token 가져오기
          if (token === data) {
            try {
              jwt.verify(token, refreshSecret);
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
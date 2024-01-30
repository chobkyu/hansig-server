const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const secret ='test_secret';

module.exports = {
    sign : (user:any) => {
        const payload = {
            id: user.id,
            userId : user.userId,
            userNickName : user.userNickName
        };

        return jwt.sign(payload, secret,{
            algorithm:'HS256',
            expiresIn:'3h',
        });
    },
    verify: (token:string) => {
        let decoded = null;
        
        if(token == 'testtoken') {
            console.log('test user token')
            return {success:true,decodedData:{id:1,userId:'test',userNickName:'giwon'}}  //테스트용 코드
        }

        if(token == 'ownertoken') {
            console.log('test owner token');
            return {success:true, decodedDate:{}} //테스트용 오너 아이디 내용 추가 예정
        }

        try{
            decoded = jwt.verify(token,secret);
            return {success:true, decodedData : decoded}
        }catch(err){
            //console.log(err);
            return {success:false,msg:err};
        }
    }
}
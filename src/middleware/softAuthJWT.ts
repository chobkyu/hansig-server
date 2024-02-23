import express,{Express,Request,Response,NextFunction} from 'express';
const { verify } = require('../util/jwt-util');

const softAuthJWT=(req:Request,res:Response,next:NextFunction) => {
    if (req.headers.authorization){
        const token = req.headers.authorization.split('Bearer ')[1];
        const result = verify(token);

        //console.log(result)
        if(result.success){
            //console.log(result.decodedData)
            const userData = {
                id : result.decodedData.id,
                userId : result.decodedData.userId,
                userNickName : result.decodedData.userNickName
            }
            
            req.body.userData = userData
            next();
        } else{
            req.body.userData=false;
            next();
        }
    }else{
        req.body.userData=false;
        next();
    }
}
module.exports=softAuthJWT;
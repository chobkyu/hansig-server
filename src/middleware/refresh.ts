import {Request,Response} from 'express';
const { sign, verify, refreshVerify } = require('../util/jwt-util');
const jwt = require('jsonwebtoken');
const redisClient = require('../util/redis');
const refresh = async (req:Request, res:Response) => {
  // access token과 refresh token의 존재 유무를 체크합니다.

  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh;
    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);

    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(authToken);

    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      res.status(401).send({
        success: false,
        msg: 'No authorized!',
      });
    }
	
    /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = await refreshVerify(refreshToken, decoded.userId);
    // 재발급을 위해서는 access token이 만료되어 있어야합니다.
    if (authResult.success === false && authResult.msg === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
      if (refreshResult.success === false) {
        await redisClient.del(decoded.userId);
        res.status(401).send({
          success: false,
          msg: 'No authorized!',
        });
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign({id:decoded.id,userId:decoded.userId,userNickname:decoded.userNickname});
        res.status(200).send({ // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
          success: true,
          data: {
            access:newAccessToken,
            refresh:refreshToken
          },
        });
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
      res.status(400).send({
        success: false,
        msg: 'Access token is not expired!',
      });
    }
  } else { // access token 또는 refresh token이 헤더에 없는 경우
    res.status(400).send({
      success: false,
      msg: 'Access token and refresh token are need for refresh!',
    });
  }
};

module.exports = refresh;
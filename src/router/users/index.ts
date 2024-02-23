import express,{Express,Request,Response} from 'express';
const ctrl = require('./user.ctrl')
const router = express.Router();
const authJWT = require('../../middleware/authJWT');
const refresh= require('../../middleware/refresh');
router.get('/userinfo', authJWT,ctrl.output.getUser);
router.get('/location',ctrl.output.location);
router.get('/imgUrl',ctrl.output.getImgUrl);

router.post('/',ctrl.process.insertUser);
router.post('/login',ctrl.process.login);

router.patch('/info', authJWT, ctrl.process.updateUserData);
//accesstoken재발급용
router.get('/refresh',refresh);

//테스트 계정 삭제용
router.delete('/deleteTestUser',ctrl.process.deleteTestUser)

module.exports = router
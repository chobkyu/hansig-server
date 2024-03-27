import express from "express";
const ctrl = require('./hansic.ctrl');
const softAuthJWT = require('../../middleware/softAuthJWT');
const authJWT = require('../../middleware/authJWT');

const router = express.Router();
router.get('/place',softAuthJWT,ctrl.output.getByPlace);//좌표를 쿼리로 받아 검색
router.get('/all/:sortOption',ctrl.output.getAll);//sortOption이 있으면 userStar로정렬,
router.get('/loc/:id/:sortOption',ctrl.output.getFromLocation);
router.get('/all',ctrl.output.getAll); //한식 뷔페 전체 조회
router.get('/loc/:id',ctrl.output.getFromLocation); //지역 id로 지역내 식당조회
router.get('/get/geo',ctrl.output.tryGeo); //주소 -> 좌표 변환
router.get('/:id',softAuthJWT,ctrl.output.get);//id로 단일 식당 조회
router.get('/star/user',authJWT,ctrl.output.favorite); //유저 별 즐겨찾는 한뷔 조회

router.post('/star/:id',authJWT,ctrl.process.favorite); //즐겨찾기 추가
router.post('/enroll',authJWT,ctrl.process.enrollHansic); //내가 아는 한식 뷔페 등록하기
// router.post('/:id',ctrl.process.create);
// router.patch('/:id',ctrl.process.update);
// router.delete('/:id',ctrl.process.delete);
// //menu
// router.get('/:id/menu',ctrl.output.menu.getAll);
// router.post('/:id/menu',ctrl.process.menu.create);
// router.patch('/:id/menu/:menuId',ctrl.process.menu.update);
// router.delete('/:id/menu',ctrl.process.menu.delete);
// router.get('/:id/menu/:menuId',ctrl.output.menu.get);
// //reviewcomment
// router.get('/:id/comment',ctrl.output.comment.getAll);
// router.post('/:id/comment',ctrl.process.comment.create);
// router.delete('/:id/comment',ctrl.process.comment.delete);

module.exports = router;

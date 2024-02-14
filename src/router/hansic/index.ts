import express from "express";
const ctrl = require('./hansic.ctrl');
const authJWT = require('../../middleware/authJWT')

/*
ㄴ 리뷰 입력 시
ㄴ 리뷰 수정 시
ㄴ 리뷰 삭제 시
ㄴ 메뉴 입력 시
ㄴ 메뉴 수정 시
ㄴ 메뉴 삭제 시
ㄴ 리뷰 댓글 입력 시
ㄴ 리뷰 댓글 삭제 시
*/
const router = express.Router();
//review
router.get('/all',ctrl.output.getAll);
router.get('/loc/:id',ctrl.output.getFromLocation);
router.get('/get/geo',ctrl.output.tryGeo);
router.get('/place',ctrl.output.getByPlace);
router.get('/:id',ctrl.output.get);

router.post('/star/:id',authJWT,ctrl.process.favorite);
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

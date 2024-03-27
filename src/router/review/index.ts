import express from "express";
const ctrl = require('./review.ctrl')
const router = express.Router();
const authJWT = require('../../middleware/authJWT')
router.get('/:id',ctrl.output.getReview); //리뷰id로 리뷰 얻어오기
router.get('/list/:id',ctrl.output.getReviewList); //식당id로 리뷰리스트 얻어오기
//유저 별 리뷰 리스트 조회
router.get('/user/list',authJWT,ctrl.output.userList);  //유저 별 리스트 조회
router.post('/:id',authJWT,ctrl.process.writeReview); //리뷰 create
router.patch('/update/:id',authJWT,ctrl.process.updateReview); //review update
router.delete('/:id',authJWT,ctrl.process.deleteReview); //review delete
router.post('/comment/:id',authJWT,ctrl.process.reviewCommentWrite); //review comment create
router.delete('/comment/:id',authJWT,ctrl.process.reviewCommentDelete); //review comment delete
router.patch('/comment/:id',authJWT,ctrl.process.reviewCommentUpdate); //review comment update

module.exports = router;
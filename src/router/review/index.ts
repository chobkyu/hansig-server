import express from "express";
const ctrl = require('./review.ctrl')
const router = express.Router();
const authJWT = require('../../middleware/authJWT')
router.get('/:id',ctrl.output.getReview);
router.get('/list/:id',ctrl.output.getReviewList);
//유저 별 리뷰 리스트 조회
router.get('/user/list',authJWT,ctrl.output.userList);
router.post('/:id',authJWT,ctrl.process.writeReview);
router.patch('/update/:id',authJWT,ctrl.process.updateReview);
router.delete('/:id',authJWT,ctrl.process.deleteReview);
module.exports = router;
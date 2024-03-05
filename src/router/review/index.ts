import express from "express";
const ctrl = require('./review.ctrl')
const router = express.Router();
const authJWT = require('../../middleware/authJWT')
router.get('/:id',ctrl.output.getReview);
router.get('/list/:id',ctrl.output.getReviewList);
router.post('/:id',authJWT,ctrl.process.writeReview);
router.patch('/update/:id',authJWT,ctrl.process.updateReview);
router.delete('/:id',authJWT,ctrl.process.deleteReview);
router.post('/comment/:id',authJWT,ctrl.process.reviewCommentWrite);
router.delete('/comment/:id',authJWT,ctrl.process.reviewCommentDelete);
router.patch('/comment/:id',authJWT,ctrl.process.reviewCommentUpdate);

module.exports = router;
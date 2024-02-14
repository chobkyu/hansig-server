import express from "express";
const ctrl = require('./review.ctrl')
const router = express.Router();
router.get('/:id',ctrl.output.getReview);
router.get('/list/:id',ctrl.output.getReviewList);
router.post('/:id',ctrl.process.writeReview);
router.patch('/update/:id',ctrl.process.updateReview);
router.delete('/:id',ctrl.process.deleteReview);
module.exports = router;
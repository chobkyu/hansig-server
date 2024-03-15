import express from "express";
const ctrl = require('./admin.ctrl');
const authJWT = require('../../middleware/authJWT')

const router = express.Router();

//등록 리스트 조회
router.get('/enroll',authJWT,ctrl.output.getEnrollList);
//등록 상세 조회
router.get('/enrollOne/:id',authJWT, ctrl.output.getEnrollOne);

module.exports = router;
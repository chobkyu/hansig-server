import express from "express";

const ctrl = require('./point.ctrl');
const router = express.Router();
const authJWT = require('../../middleware/authJWT');

router.patch('/',authJWT,ctrl.process.getPoint); //포인트 적립
module.exports = router;
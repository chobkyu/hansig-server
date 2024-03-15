import express from "express";
const ctrl = require('./admin.ctrl');
const authJWT = require('../../middleware/authJWT')

const router = express.Router();

router.get('/enroll',authJWT,ctrl.output.getEnrollList);
module.exports = router;
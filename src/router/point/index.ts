import express from "express";

const ctrl = require('./point.ctrl');
const router = express.Router();
const authJWT = require('../../middleware/authJWT');

module.exports = router;
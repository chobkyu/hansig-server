import express from "express";
const ctrl = require('./hansic.ctrl')

const router = express.Router();

router.get('/',ctrl.output.getAll);


module.exports = router;

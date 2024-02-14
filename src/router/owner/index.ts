import express from "express";
const ctrl = require('./owner.ctrl');
const router =express.Router();
const authJWT = require('../../middleware/authJWT')
router.get('/menu/:id',ctrl.output.getMenuList);

router.post('/',ctrl.process.ownerSignUp);
router.post('/login',ctrl.process.ownerSignIn);
router.post('/menu',authJWT,ctrl.process.ownerMenu);

router.delete('/menu',authJWT,ctrl.process.deleteMenu);
router.patch('/menu',authJWT,ctrl.process.updateMenu);

module.exports = router;
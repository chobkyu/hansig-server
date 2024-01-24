import express from "express";
const ctrl = require('./owner.ctrl');

const router =express.Router();

router.get('/menu/:id',ctrl.output.getMenuList);

router.post('/',ctrl.process.ownerSignUp);
router.post('/login',ctrl.process.ownerSignIn);
router.post('/menu',ctrl.process.ownerMenu);

router.delete('/menu',ctrl.process.deleteMenu);
router.patch('/menu',ctrl.process.updateMenu);

module.exports = router;
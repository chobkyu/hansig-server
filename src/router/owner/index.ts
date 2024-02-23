import express from "express";
const ctrl = require("./owner.ctrl");
const router = express.Router();
const authJWT = require("../../middleware/authJWT");
router.get("/menu/:id", ctrl.output.getMenuList);
router.get("/menu/one/:id", authJWT, ctrl.output.getMenu);

router.post("/", ctrl.process.ownerSignUp);
router.post("/login", ctrl.process.ownerSignIn);
router.post("/menu", authJWT, ctrl.process.postMenu);

router.delete("/menu/:id", authJWT, ctrl.process.deleteMenu);
router.patch("/menu/:id", authJWT, ctrl.process.updateMenu);

module.exports = router;

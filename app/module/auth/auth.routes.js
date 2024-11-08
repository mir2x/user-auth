const express = require("express");
const AuthController = require("./auth.controller");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify", AuthController.verify);

module.exports = router;

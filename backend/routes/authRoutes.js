const express = require('express');
const { register, verifyEmail, login, logout,authMiddleware } = require("../controller/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);


module.exports = router;
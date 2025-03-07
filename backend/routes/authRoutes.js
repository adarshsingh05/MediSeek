const express = require('express');
const { register, verifyEmail, login, logout,authMiddleware, doctorRedg } = require("../controller/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);
router.post("/doctorredg", doctorRedg);

module.exports = router;
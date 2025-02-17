const express = require('express');
const { register, verifyEmail, login } = require("../controller/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);

module.exports = router;
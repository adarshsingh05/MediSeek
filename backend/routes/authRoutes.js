const express = require('express');
const { register, verifyEmail, login, logout,authMiddleware, doctorRedg, doctorredgdone } = require("../controller/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);
router.post("/doctorredg", doctorRedg);
router.post('/checkdoctorisreg',doctorredgdone);

module.exports = router;
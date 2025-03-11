const express = require('express');
const { register, verifyEmail, login,shareddoc,getshareddoc,accept, logout,authMiddleware, doctorRedg, doctorredgdone, docconnection, getreq } = require("../controller/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);
router.post("/doctorredg", doctorRedg);
router.post('/checkdoctorisreg',doctorredgdone);
router.post('/uploadshareddoc',shareddoc);
router.post('/docconnection',docconnection);
router.patch('/accept',accept);
router.get('/getshareddoc/:docId',getshareddoc);
router.get('/getreq',getreq);
module.exports = router;
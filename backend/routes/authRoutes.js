const express = require('express');
const { register, verifyEmail, login,shareddoc,getshareddoc,accept, logout,authMiddleware, doctorRedg, doctorredgdone, docconnection, getreq, getdocdetails, allpatients, addHospitals, getHospitals, getAllHospitals } = require("../controller/authController");
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
router.post('/getshareddoc',getshareddoc);
router.get('/getreq',getreq);
router.post('/allpatients',allpatients);
router.post('/getdocdetails',getdocdetails);
router.post('/addhospitals', addHospitals);
router.post('/gethospitals',getHospitals);

module.exports = router;
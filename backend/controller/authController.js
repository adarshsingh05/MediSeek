const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const nodemailer = require("nodemailer");


// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'adarshashokbaghel@gmail.com',
    pass: 'dwvrctqdmapxxgcy ',
  },
});

// Register User
 const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create Email Verification Token
    const token = jwt.sign({ email }, 'adarsh1234', { expiresIn: "1d" });
    const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;
    // Send Verification Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your Email",
      html: `<p>Click <a href="${verificationLink}" target="_blank">${verificationLink}</a> to verify your email.</p>`,
    });
    

    res.status(201).json({ message: "User registered! Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, 'adarsh1234');

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { verified: true },
      { new: true }
    );

    if (!user) return res.status(400).json({ message: "Invalid token" });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login User
 const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.verified) return res.status(400).json({ message: "Please verify your email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true }).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all functions
module.exports = {
    register,
    verifyEmail,
    login,
  };


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const nodemailer = require("nodemailer");
const Doctor = require("../models/doctors.js");
const sharedDocSchema = require("../models/SharedDoc.js");
const connection = require("../models/connection.js");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'adarshashokbaghel@gmail.com',
    pass: 'dwvrctqdmapxxgcy ',
  },
});
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader); // Log the header to check if token is passed
    if (!authHeader) return res.status(401).json({ message: "Access denied. No token provided." });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, 'adarsh1234');
    console.log("Decoded Token:", decoded); // Log the decoded token to ensure it's valid

    req.user = { id: decoded.id }; // Attach user ID
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


// Register User
 const register = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword,role });
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

    res.redirect("http://localhost:5173/Login");

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

    const token = jwt.sign({ id: user._id }, 'adarsh1234', { expiresIn: "1d" });

    res.cookie("token", token, { httpOnly: true }).json({
      message: "Login successful",
      token,
      username: user.name, // Send the username as well
      role: user.role, // Send the username as well
      email: user.email
    });  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const logout = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    // Send a response indicating the user is logged out
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const doctorRedg =  async (req, res) => {
  try {
    const { doctorId, name, specialty, location, bio, profileImage, availableDays, availableTimeStart, availableTimeEnd, appointmentDuration, email } = req.body;

    // Check if the doctor already exists
    
    // Create a new doctor instance
    const newDoctor = new Doctor({
      doctorId,
      name,
      specialty,
      location,
      bio,
      profileImage,
      availableDays,
      availableTimeStart,
      availableTimeEnd,
      appointmentDuration,
        email
    });

    // Save to the database
    await newDoctor.save();

    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const doctorredgdone = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Checking email in DB:", email);

    if (!email) return res.status(400).json({ message: "Email is required" });

    const doctor = await Doctor.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } });
    console.log("Doctor Found:", doctor); // ✅ Log the result

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({ message: "Doctor found", doctor });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: err.message });
  }
};
const shareddoc = async (req, res) => {
  try {
    const { userId, docId, supabaseUrl } = req.body;

    // Ensure input is valid
    if (!docId || !userId|| !supabaseUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store in DB
    await sharedDocSchema.create({ userId, docId, supabaseUrl });
    res.json({ message: 'Document shared successfully' });
} catch (err) {
    res.status(500).json({ error: 'Server error' });
}
}


// doctor to get shared data

const getshareddoc = async (req, res) => {
  try {
      const { docId } = req.params;

      // Ensure input is valid
      if (!docId) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get shared documents
      const sharedDocs = await sharedDocSchema.find({ docId });
      res.json({ sharedDocs });
  } catch (err) {
      res.status(500).json({ error: 'Server error' });
  }
}

const docconnection = async (req,res) => {
  const { docEmail, userEmail, userAccepted } = req.body;

  try {
    const newDoc = new connection({
      docEmail,
      userEmail,
      userAccepted,
      docAccepted: false,
    });

    await newDoc.save();
    res.status(201).json({ message: "Request submitted", data: newDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const accept  = async (req,res) => {
  const { docEmail, userEmail } = req.body;

  try {
    const doc = await connection.findOneAndUpdate(
      { docEmail, userEmail },
      { docAccepted: true },
      { new: true }
    );
    if (!doc) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Request approved", doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }}

// Export all functions
module.exports = {
    register,
    docconnection,
    accept,
    doctorredgdone,
    verifyEmail,
    login,
    logout,
    authMiddleware,
    doctorRedg,
    shareddoc,
    getshareddoc,
  };


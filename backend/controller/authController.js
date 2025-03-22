

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const nodemailer = require("nodemailer");
const Doctor = require("../models/doctors.js");
const sharedDocSchema = require("../models/SharedDoc.js");
const connection = require("../models/connection.js");
const Hospital = require("../models/hospitals.js");

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
    const { name, email, password, role } = req.body;
    
    // Get token from headers and decode it
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, 'adarsh1234'); // Verify token
    const userId = decoded.userId; // Extract user ID from token

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the userId from token
    const user = new User({ _id: userId, name, email, password: hashedPassword, role });

    // Save user to database
    await user.save();

    // Generate a new verification token
    const verificationToken = jwt.sign({ email, userId }, 'adarsh1234', { expiresIn: "1d" });
    const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your Email",
      html: `<p>Click <a href="${verificationLink}" target="_blank">${verificationLink}</a> to verify your email.</p>`,
    });

    res.status(201).json({ 
      message: "User registered! Please verify your email.", 
      userId 
    });
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.verified) return res.status(400).json({ message: "Please verify your email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT with user ID
    const token = jwt.sign({ id: user._id }, "adarsh1234", { expiresIn: "1d" });

    // Send response with token and user details
    res.cookie("token", token, { httpOnly: true }).json({
      message: "Login successful",
      token,
      username: user.name,
      role: user.role,
      email: user.email,
      userId: user._id, // Send user ID directly
    });
  } catch (err) {
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
    console.log("Document shared successfully");
} catch (err) {
    res.status(500).json({ error: 'Server error' });
}
}


// doctor to get shared data
const getshareddoc = async (req, res) => {
  try {
    const { docId, userId } = req.body;
    console.log("Received GET request with:", { docId, userId });

    // Ensure input is valid
    if (!docId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    console.log("Received GET request with:", { docId, userId });

    // Get all shared documents matching docId and userId
    const sharedDocs = await sharedDocSchema.find({ docId, userId });

    if (!sharedDocs || sharedDocs.length === 0) {
      return res.status(404).json({ error: "No documents found" });
    }

    // Extract Supabase URLs from all documents
    const supabaseUrls = sharedDocs.map((doc) => doc.supabaseUrl);

    res.json({ supabaseUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const allpatients = async (req, res) => { 
  try {
    const { docEmail } = req.body;

    if (!docEmail) {
      return res.status(400).json({ error: "Doctor Email is required" });
    }

    // Fetch all patients where the doctor has accepted the connection
    const patients = await connection.find({ docEmail, docAccepted: true });

    if (!patients.length) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.json({ patients });
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Server error" });
  }
}

const docconnection = async (req,res) => {
  const {username, docEmail, userEmail, userAccepted } = req.body;

  try {
    const newDoc = new connection({
      username,
      docEmail,
      userEmail,
      userAccepted,
      docAccepted: false,
    });

    await newDoc.save();
    res.status(201).json({ message: "Request submitted", data: newDoc });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }

}

const accept = async (req, res) => {
  const { docEmail, userEmail } = req.body;

  console.log("Received Data:", { docEmail, userEmail });

  try {
    const doc = await connection.findOne({ docEmail, userEmail });
    console.log("Record Found in DB:", doc);

    if (!doc) {
      return res.status(404).json({ message: "Record not found" });
    }

    // If record is found, update it
    const updatedDoc = await connection.findOneAndUpdate(
      { docEmail, userEmail },
      { docAccepted: true },
      { new: true }
    );

    res.json({ message: "Request approved", updatedDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getHospitals = async(req,res)=>{
  try {
    const { latitude, longitude } = req.body;

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000, // 5km radius
        },
      },
    });

    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const addHospitals = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const newHospital = new Hospital({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    await newHospital.save();
    res.status(201).json({ message: "Hospital added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const getdocdetails = async (req, res) => {
  try {
    const { email: userEmail } = req.body;  // Rename `email` to `userEmail`
    console.log("Received request body:", req.body); // 🔍 Debug

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    // Find all connection records for the given user
    const connections = await connection.find({ userEmail });
   

    if (!connections || connections.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }

    // Extract all doctor emails from the connections
    const doctorEmails = connections.map(conn => conn.docEmail);

    if (!doctorEmails.length) {
      return res.status(404).json({ message: "No doctors associated with this user" });
    }

    // Fetch details of all connected doctors
    const doctors = await Doctor.find({ email: { $in: doctorEmails } });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctor details found" });
    }

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



  const getreq = async(req,res)=>{
    const { docEmail } = req.query;

  try {
    const requests = await connection.find({ docEmail });

    if (requests.length === 0) {
      return res.status(404).json({ message: "No requests found for this doctor" });
    }

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  }


// Export all functions
module.exports = {
    register,
    getreq,
    docconnection,
    accept,
    doctorredgdone,
    verifyEmail,
    getHospitals, 
    login,
    addHospitals,
    logout,
    authMiddleware,
    doctorRedg,
    allpatients,
    shareddoc,
    getshareddoc,
    getdocdetails
  };


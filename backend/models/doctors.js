// MongoDB Schema for Doctor Registration - Based on UI

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Doctor Schema
const doctorSchema = new Schema({
  // Basic Information (Step 1)
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    enum: [
      'Cardiology',
      'Dermatology',
      'Neurology',
      'Pediatrics',
      'Psychiatry',
      'Orthopedics',
      'Family Medicine',
      'Internal Medicine',
      'Gynecology',
      'Ophthalmology'
    ]
  },
  location: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  profileImage: {
    type: String, // URL to stored image
    default: null,
    required: false
  },
  
  // Availability (Step 2)
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  availableTimeStart: {
    type: String, // Stored as "HH:MM" format
    required: true
  },
  availableTimeEnd: {
    type: String, // Stored as "HH:MM" format
    required: true
  },
  appointmentDuration: {
    type: Number, // Minutes
    default: 30,
    enum: [15, 30, 45, 60]
  },
  
  // Auth and registration status (not explicitly in UI but needed)
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false // Not required for registration
  },
  registrationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
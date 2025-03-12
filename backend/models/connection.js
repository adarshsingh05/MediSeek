const mongoose = require('mongoose');

// doctor - patient connection schema
const connection = new mongoose.Schema({
    username: { type: String, required: true },
    docEmail: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAccepted: { type: Boolean, default: false },
    docAccepted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }  // Correct way to set default timestamp
});



module.exports = mongoose.model('Connection', connection);
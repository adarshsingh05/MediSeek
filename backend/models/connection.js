const mongoose = require('mongoose');

// doctor - patient connection schema
const connection = new mongoose.Schema({
    docEmail: String,
    userEmail: String,
    userAccepted: Boolean,
    docAccepted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Connection', connection);
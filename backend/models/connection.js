const mongoose = require('mongoose');

// doctor - patient connection schema
const connection = new mongoose.Schema({
    docEmail:{type: String, required: true},
    userEmail:{ type: String, required: true},
    userAccepted: Boolean,
    docAccepted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Connection', connection);
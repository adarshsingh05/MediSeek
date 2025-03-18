const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    messageText: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;

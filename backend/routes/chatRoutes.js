const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");
const { encryptMessage, decryptMessage } = require("../utils/encrypt");

router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // 🔒 Encrypt the message before storing
    const encryptedMessage = encryptMessage(message);

    // ✅ Save the message with any senderId and receiverId
    const newMessage = new Message({ senderId, receiverId, message: encryptedMessage });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get chat history (No user validation required)
router.get("/history/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Fetch chat messages between two users (regardless of user existence)
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    // 🔓 Decrypt messages before sending
    const decryptedMessages = messages.map((msg) => ({
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: decryptMessage(msg.message),
      createdAt: msg.createdAt,
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
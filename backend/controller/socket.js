const { Server } = require("socket.io");
const Message = require("../models/Message");
const { encryptMessage, decryptMessage } = require("../utils/encrypt");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join chat room
    socket.on("joinRoom", ({ senderId, receiverId }) => {
      const roomId = [senderId, receiverId].sort().join("_");
      socket.join(roomId);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        console.log("Received message:", message); // Debugging step
      
        if (!message || typeof message !== "string") {
          console.error("Error: Message is undefined or not a string!");
          return;
        }
      
        const encryptedMessage = encryptMessage(message);
        
        // Save message in MongoDB
        const newMessage = new Message({ senderId, receiverId, message: encryptedMessage });
        await newMessage.save();
      
        const roomId = [senderId, receiverId].sort().join("_");
      
        // Broadcast message to the room
        io.to(roomId).emit("receiveMessage", {
          senderId,
          receiverId,
          message, // Sending decrypted message
        });
      });
      

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = socketHandler;
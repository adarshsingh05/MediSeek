import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Adjust backend URL if needed

const ChatModal = ({ senderId, receiverId, receiverName, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Fetch chat history from backend
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/history/${senderId}/${receiverId}`);
      const chatHistory = await response.json();

      if (Array.isArray(chatHistory)) {
        setMessages(chatHistory); // ✅ Load old messages
      } else {
        console.error("Error fetching chat history:", chatHistory.error);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // ✅ Fetch messages on receiver change
  useEffect(() => {
    if (receiverId) {
      fetchChatHistory();
    }
  }, [receiverId]);

  // ✅ Real-time socket event handlers
  useEffect(() => {
    if (senderId && receiverId) {
      socket.emit("joinRoom", { senderId, receiverId });

      // Listen for real-time messages
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [senderId, receiverId]);

  // ✅ Send message via API + real-time socket
  const sendMessage = async () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", newMessage); // ✅ Send message to socket server


    const newMessage = {
      senderId:senderId,
      receiverId:receiverId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      const data = await response.json();

      if (data.success) {
        socket.emit("sendMessage", newMessage); // ✅ Send message to socket server

        setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Update UI instantly
        setMessage(""); // ✅ Clear input field
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-96">
        {/* 🔹 Chat Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chat with {receiverName || "Doctor"}</h2>
          <button onClick={onClose} className="text-red-500">X</button>
        </div>

        {/* 🔹 Messages Display */}
        <div className="border p-3 h-64 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-lg ${
                  msg.senderId === senderId ? "bg-blue-500 text-white text-right" : "bg-gray-200 text-left"
                }`}
              >
                <p>{msg.message}</p>
                <small className="text-xs block text-right">{new Date(msg.createdAt).toLocaleTimeString()}</small>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet.</p>
          )}
        </div>

        {/* 🔹 Input Field */}
        <div className="mt-3 flex">
          <input
            type="text"
            className="border p-2 flex-1 rounded-lg"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

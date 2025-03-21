import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { X, Send, MessageSquare, Clock, CheckCheck } from "lucide-react";

const socket = io("http://localhost:5000"); // Adjust backend URL if needed

const ChatModal = ({ senderId, receiverId, receiverName, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

      const handleReceiveMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [senderId, receiverId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on modal open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ✅ Send message via API + real-time socket
  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId: senderId,
      receiverId: receiverId,
      message: message.trim(),
      // createdAt: new Date().toISOString(),
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

        // setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Update UI instantly
        setMessage(""); // ✅ Clear input field
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle key press events
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/95 rounded-xl shadow-2xl w-112 max-w-md overflow-hidden border border-white/20">
        {/* 🔹 Chat Header */}
        <div className="bg-gradient-to-r from-[#112b5e] to-[#1e4d8a] p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {receiverName || "Doctor"}
              </h2>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-blue-100">Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔹 Messages Display */}
        <div className="p-4 h-80 overflow-y-auto bg-gray-50/80">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isSender = msg.senderId === senderId;
              const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
              
              return (
                <div
                  key={index}
                  className={`mb-3 max-w-[80%] ${
                    isSender ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      isSender
                        ? "bg-[#112b5e] text-white rounded-tr-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  
                  <div className={`flex items-center mt-1 text-xs text-gray-500 ${isSender ? "justify-end" : "justify-start"}`}>
                    {time && (
                      <>
                        <Clock size={10} className="mr-1" />
                        <span>{time}</span>
                      </>
                    )}
                    {isSender && <CheckCheck size={12} className="ml-1 text-[#3a5c9e]" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="bg-[#e6eaf2] p-3 rounded-full mb-3">
                <MessageSquare size={24} className="text-[#112b5e]" />
              </div>
              <p className="text-sm">Start your conversation with {receiverName || "Doctor"}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 🔹 Input Field */}
        <div className="p-4 bg-white/90 border-t border-gray-200">
          <div className="flex items-center bg-gray-100/80 rounded-full pr-2 focus-within:ring-2 focus-within:ring-[#112b5e] focus-within:bg-white transition-all duration-200">
            <input
              ref={inputRef}
              type="text"
              className="border-none bg-transparent p-3 flex-1 rounded-l-full focus:outline-none text-gray-700"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-2 rounded-full ${
                message.trim() 
                  ? "bg-gradient-to-r from-[#112b5e] to-[#1e4d8a] text-white hover:shadow-md" 
                  : "bg-gray-300 text-gray-500"
              } transition-all duration-200`}
            >
              <Send size={16} className={message.trim() ? "text-white" : "text-gray-500"} />
            </button>
          </div>
          <div className="mt-2 flex justify-center">
            <span className="text-xs text-gray-500">End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send } from "lucide-react";

const socket = io("http://localhost:5000"); // Update with your backend URL

const ChatComponents = ({ doctorId, patientId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  console.log("Rendering ChatComponent...");
  console.log("Received doctorId:", doctorId);
  console.log("Received patientId:", patientId);

  // 📌 Fetch previous messages when chat opens
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/history/${doctorId}/${patientId}`);
      const chatHistory = await response.json();

      if (Array.isArray(chatHistory)) {
        setMessages((prevMessages) => {
          const newMessages = chatHistory.filter(
            (msg) => !prevMessages.some((prev) => prev._id === msg._id) // Prevent duplicates
          );
          return [...prevMessages, ...newMessages];
        });
      } else {
        console.error("Error fetching chat history:", chatHistory.error);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [doctorId, patientId]);

  // ✅ Real-time socket event handlers (Avoids duplicate listeners)
  useEffect(() => {
    if (!doctorId || !patientId) return;

    socket.emit("joinRoom", { doctorId, patientId });

    const handleReceiveMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Always update state
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
        socket.off("receiveMessage", handleReceiveMessage);
    };
}, [doctorId, patientId]);


  // 📌 Scroll to the latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 📌 Send Message (to DB + Socket)
  const sendMessage = async () => {
    if (!message.trim()) return;
    const msgData = {
      senderId: doctorId,
      receiverId: patientId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msgData),
      });

      const data = await response.json();

      if (data.success) {
        socket.emit("sendMessage", msgData); // ✅ Send message to socket
        setMessages((prevMessages) => [...prevMessages, msgData]); // ✅ Update UI instantly
        setMessage(""); // ✅ Clear input field
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-blue-50 relative overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white p-4 shadow-md flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Chat with Patient</h2>
      </div>

      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.senderId === doctorId
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            <p>{msg.message}</p>
            <small className="block text-xs text-gray-400 text-right">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-3 bg-white flex items-center border-t">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg ml-2 hover:bg-blue-600"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatComponents;

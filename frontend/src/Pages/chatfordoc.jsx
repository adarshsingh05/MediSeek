import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Clock, CheckCheck, User, UserCog } from "lucide-react";

const socket = io("http://localhost:5000"); // Update with your backend URL

const ChatComponents = ({ doctorId, patientId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  console.log("Rendering ChatComponent...");
  console.log("Received doctorId:", doctorId);
  console.log("Received patientId:", patientId);


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
          inputRef.current.focus();
        } else {
          console.error("Failed to send message:", data.error);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

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



  // 📌 Scroll to the latest message
  // useEffect(() => {
  //   if (chatRef.current) {
  //     chatRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);


  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex-1 mt-5 mb-4 flex flex-col bg-gray-50 relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full shadow-md">
            <UserCog size={24} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Patient Consultation</h2>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <span className="text-xs text-teal-50">Online</span>
            </div>
          </div>
        </div>
        <div className="bg-teal-400 bg-opacity-30 px-3 py-1 rounded-full text-white text-sm">
          <span>Secure Chat</span>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="bg-teal-50 p-4 rounded-full mb-3">
              <User size={32} className="text-teal-500" />
            </div>
            <p className="text-sm">Start your conversation with the patient</p>
          </div>
        )}
        
        {messages.map((msg, index) => {
          const isDoctor = msg.senderId === doctorId;
          const showDate = index === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString();
          
          return (
            <div key={index} className="w-full">
              {showDate && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              <div className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-xs lg:max-w-md`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                    isDoctor 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <div className={`flex items-center mt-1 text-xs text-gray-500 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
                    <Clock size={12} className="mr-1" />
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isDoctor && <CheckCheck size={14} className="ml-1 text-teal-500" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatRef}></div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full pr-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white transition-all duration-200">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-full ${message.trim() ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md hover:from-teal-600 hover:to-blue-700 transform hover:scale-105' : 'bg-gray-300 text-gray-500'} transition-all duration-200`}
          >
            <Send size={18} className={message.trim() ? 'text-white' : 'text-gray-500'} />
          </button>
        </div>
        <div className="mt-2 flex justify-center">
          <span className="text-xs text-gray-500">Protected by healthcare encryption standards</span>
        </div>
      </div>
    </div>
  );
};

export default ChatComponents;
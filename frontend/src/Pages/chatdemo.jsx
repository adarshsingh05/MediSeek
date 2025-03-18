import { useState, useEffect } from "react";
import socket from "./socket";
import axios from "axios";

const Chat = ({ userId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/getmessage/${userId}/${receiverId}`);
                console.log("Messages API response:", res.data);  // ✅ Debugging
                setMessages(Array.isArray(res.data) ? res.data : []);  // ✅ Fix: Always set an array
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessages([]);  // ✅ Prevent map error
            }
        };

        fetchMessages();

        socket.emit("joinRoom", { senderId: userId, receiverId });

        socket.on("receiveMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [userId, receiverId]);

    const sendMessage = async () => {
        if (!messageText.trim()) return;

        const messageData = {
            senderId: userId,
            receiverId,
            messageText,
        };

        socket.emit("sendMessage", messageData);
        setMessageText("");

        try {
            await axios.post(`http://localhost:5000/api/aut/getmessage/${userId}/${receiverId}/messages`, messageData);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Chat</h2>
            <div className="h-60 overflow-y-auto border p-3 rounded-md">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.senderId === userId ? "text-right" : "text-left"}`}>
                            <span className={`inline-block px-3 py-1 rounded-md ${msg.senderId === userId ? "bg-blue-500" : "bg-gray-700"}`}>
                                {msg.messageText}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No messages yet</p>  // ✅ Prevents map error
                )}
            </div>
            <div className="mt-3 flex">
                <input
                    type="text"
                    className="flex-1 p-2 rounded-md bg-gray-800 text-white"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
                <button onClick={sendMessage} className="ml-2 bg-blue-500 px-4 py-2 rounded-md">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;

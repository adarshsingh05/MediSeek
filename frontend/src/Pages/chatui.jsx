import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ChatWidget = () => {
  const [question, setQuestion] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hovered, setHovered] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfUrl || !question) {
      alert("Please enter a PDF URL and a question.");
      return;
    }

    setMessages((prev) => [...prev, { text: question, sender: "user" }]);
    setLoading(true);

    try {
      const res = await axios.post("https://chatai-sigma-six.vercel.app/chat", {
        pdfUrl,
        question,
      });

      setMessages((prev) => [
        ...prev,
        { text: res.data.answer || "No response received.", sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "There was an error processing your request.", sender: "ai" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-1/6 bg-[#b6d3fd] border-r m-2 rounded-2xl p-4 flex flex-col">
      
        <h2 className="font-bold text-xl font-mono text-[#4f92ef]">
          Mediseek.ai Ground
        </h2>
        <div className="h-[1px] w-full mt-2 bg-gray-500"></div>
        <p className="text-md mt-2 text-black">Check all of Your Reports</p>
        <button className="mt-auto border border-red-500 text-red-500 p-2 rounded-full">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="w-4/6 p-4 flex flex-col">
      <h2 className="text-black text-center mb-6 font-bold text-3xl font-mono">
            Welcome to Mediseek.ai Playground ...
          </h2>
        {/* Header */}
        <div className="flex justify-between items-center pb-2">
        <img className="h-7 w-6 ml-2" src="/docl.png"></img>

          <h2 className="text-[#00d5be] font-bold text-xl font-mono">
            Explore All AI Agents by Mediseek.ai
          </h2>
          {["Predictive Agent", "Medical Emergency Agent", "Analyzer Agent"].map(
            (agent, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHovered(agent)}
                onMouseLeave={() => setHovered(null)}
              >
                <h2 className="text-black p-2 rounded-xl cursor-pointer bg-[#9ad0f2]">
                  {agent}
                </h2>
                {hovered === agent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 mt-2 w-[250px] bg-white text-black p-3 rounded-xl shadow-lg border border-gray-300"
                  >
                    {agent === "Predictive Agent"
                      ? "This AI Agent will help you analyze your blood report, predict data accordingly, and provide suggestions."
                      : agent === "Medical Emergency Agent"
                      ? "Get immediate medical advice and assistance."
                      : "Analyze reports with AI-driven insights."}
                  </motion.div>
                )}
              </div>
            )
          )}
        </div>

        {/* Chat UI */}
        <div className="flex flex-col items-center mt-4 w-full h-[550px]">
  {/* Chat Box */}
  <div className="w-full flex flex-col flex-grow p-4 overflow-y-auto rounded-3xl border-2 border-black">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
      >
        <p
          className={`${
            msg.sender === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          } p-2 rounded-lg inline-block`}
        >
          {msg.text}
        </p>
      </div>
    ))}
    {loading && <p className="text-gray-500">Processing...</p>}
  </div>

  {/* Input Form (Pinned to Bottom) */}
  <form onSubmit={handleSubmit} className="w-full flex gap-2 p-2 border-t mt-2">
    <input
      type="text"
      placeholder="PDF URL"
      value={pdfUrl}
      onChange={(e) => setPdfUrl(e.target.value)}
      className="border text-black p-2 rounded w-1/4"
    />
    <input
      type="text"
      placeholder="Ask a question"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      className="border p-2 rounded flex-grow text-black"
    />
    <button
      type="submit"
      className="bg-[#87b5f6] cursor-pointer text-white p-2 rounded disabled:bg-gray-400"
      disabled={loading}
    >
      {loading ? "Sending..." : "⮞"}
    </button>
  </form>
</div>

      </div>

    
      <div className="flex flex-row justify-center  m-2 bg-[#b4faf3] rounded-2xl w-[260px]">
        <h2 className="font-bold text-xl text-center mt-2 text-[#020000] ">Doctors’ Features</h2>
      </div>
    </div>
  );
};

export default ChatWidget;
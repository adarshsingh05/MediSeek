import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import SignupModal from "./Signup";


const ChatWidget = () => {
    const [userName, setUserName] = useState(null); // State to store user's name
    const [isSignupOpen, setIsSignupOpen] = useState(false);
  
  const [question, setQuestion] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [scans, setScans] = useState([]);
  const [pres, setPres] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchReports = async (endpoint, setState) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reports/${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error Response (${endpoint}):`, errorText);
          throw new Error(`Failed to fetch ${endpoint}`);
        }

        const data = await response.json();
        console.log(`Fetched ${endpoint}:`, data);
        setState(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports("scanreports", setScans); // Fetch scan reports
    fetchReports("getpres", setPres); // Fetch scan reports
    fetchReports("labreports", setLabReports); // Fetch lab reports
  }, []); // ✅ Keep dependencies stable
  useEffect(() => {
      // Fetch user name from localStorage or any other global state if logged in
      const storedUserName = localStorage.getItem("username");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }, []);
  
  const handleLogout = async () => {
    try {
      // Send a request to the backend to log out
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      // Clear the username from localStorage and state
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      setUserName(null);

      // Redirect to login page or homepage
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  // Helper function to render a report card
  const renderReportCard = (report, type) => {
    return (
      <div key={report._id || `${type}-${Math.random()}`} className="bg-white p-3 rounded-lg shadow mb-2 hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
        <h3 className="font-semibold text-black truncate">{report.diseaseName|| report.reportName|| report.documentName || "Report"}</h3>
        <p className="text-xs text-gray-500 truncate">{report.supabaseUrl || "Url not available"}</p>
        <p className="text-xs text-blue-500">{type}</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-1/6 bg-[#b6d3fd] border-r m-2 rounded-2xl p-4 flex flex-col">
        <h2 className="font-bold text-xl font-mono text-[#4f92ef]">
          Mediseek.ai Ground
        </h2>
        <div className="h-[1px] w-full mt-2 bg-gray-500"></div>
        <p className="text-md mt-2 mb-3 text-black font-semibold">Your All Available Reports</p>
        
        {/* Reports section with vertical scrolling */}
        <div className="flex-grow overflow-y-auto pr-1 mt-2">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {/* Scan Reports */}
          {scans && scans.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm py-2 mt-2 text-center font-bold mb-2 bg-[#2aa5f1] p-1 rounded">Scan Reports</h3>
              {scans.map(report => renderReportCard(report, "Scan"))}
            </div>
          )}
          
          {/* Prescriptions */}
          {pres && pres.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm text-black py-2 mt-2 text-center font-bold mb-2 bg-[#2aa5f1] p-1 rounded">Prescriptions</h3>
              {pres.map(report => renderReportCard(report, "Prescription"))}
            </div>
          )}
          
          {/* Lab Reports */}
          {labReports && labReports.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm py-2 mt-2 text-center font-bold mb-2 bg-[#2aa5f1] p-1 rounded">Lab Reports</h3>
              {labReports.map(report => renderReportCard(report, "Lab"))}
            </div>
          )}
          
          {/* Show when no reports are available */}
          {(!scans || scans.length === 0) && 
           (!pres || pres.length === 0) && 
           (!labReports || labReports.length === 0) && (
            <p className="text-center text-gray-500 italic text-sm">No reports available</p>
          )}
        </div>
        {userName ? (
            <button  onClick={handleLogout} className=" cursor-pointer hover:bg-red-400 hover:text-white mt-4 border border-red-500 text-red-500 p-2 rounded-full">
          Logout
                          {/* Display first letter of the username */}
            </button>
          ) : (
            <button
              onClick={() => setIsSignupOpen(true)}
              className="bg-teal-200 cursor-pointer mt-2 text-black px-4 py-2 rounded-lg hover:bg-teal-300"
            >
              Get In ⮞
            </button>
          )}
                          <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />

     
      </div>

      {/* Main Content */}
      <div className="w-4/6 p-4 flex flex-col">
      <h2 className="text-black text-center mb-6 font-bold text-3xl font-sans">
      <Typewriter
        options={{
          strings: ["Welcome to Mediseek.ai Playground ..."],
          autoStart: true,
          loop: true,
        }}
      />
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
  <div className="w-full flex flex-col flex-grow p-4 overflow-y-auto rounded-3xl border-1 border-black">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
      >
        <p
          className={`${
            msg.sender === "user"
              ? "bg-gray-100 shadow-blue-200 shadow-2xl mb-2 text-black border-2  rounded-4xl border-gray-300"
              : "bg-white text-black shadow-[#b4faf3] shadow-2xl border border-black"
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
        <h2 className="font-bold text-xl text-center mt-2 text-[#020000] ">Doctors' Features</h2>
      </div>
    </div>
  );
};

export default ChatWidget;
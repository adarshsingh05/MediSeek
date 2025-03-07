import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import SignupModal from "./Signup";

const ChatWidget = () => {
  const [userName, setUserName] = useState(null);
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
  const [activeAgent, setActiveAgent] = useState("Predictive Agent");

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

    fetchReports("scanreports", setScans);
    fetchReports("getpres", setPres);
    fetchReports("labreports", setLabReports);
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
      setUserName(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const renderReportCard = (report, type) => {
    return (
      <div 
        key={report._id || `${type}-${Math.random()}`} 
        className="bg-white p-4 rounded-lg mb-3 transform transition-all duration-300 hover:shadow-lg cursor-pointer border-l-4 border-l-blue-500"
      >
        <div className="flex justify-between items-center">
          <div className="w-2/3">
            <h3 className="font-semibold text-gray-800 truncate">
              {report.diseaseName || report.reportName || report.documentName || "Report"}
            </h3>
            <p className="text-xs text-gray-500 truncate mt-1">
              {report.supabaseUrl || "URL not available"}
            </p>
          </div>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {type}
          </span>
        </div>
      </div>
    );
  };

  const agentDescriptions = {
    "Predictive Agent": "This AI Agent will help you analyze your blood report, predict data accordingly, and provide suggestions.",
    "Medical Emergency Agent": "Get immediate medical advice and assistance for urgent healthcare situations.",
    "Analyzer Agent": "Analyze medical reports with AI-driven insights and comprehensive interpretation."
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/5 bg-white shadow-2xl flex flex-col border m-4 rounded-3xl border-blue-500 ml-1">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-xl text-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Mediseek.ai
          </h2>
          <p className="text-xs text-gray-500 mt-1">Your medical AI assistant</p>
        </div>

        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            YOUR REPORTS
          </h3>

          <div className="flex-grow overflow-y-auto pr-1 mt-2 max-h-96">
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
            
            {/* Reports Sections */}
            {scans && scans.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Scan Reports
                </h3>
                {scans.map(report => renderReportCard(report, "Scan"))}
              </div>
            )}
            
            {pres && pres.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Prescriptions
                </h3>
                {pres.map(report => renderReportCard(report, "Prescription"))}
              </div>
            )}
            
            {labReports && labReports.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Lab Reports
                </h3>
                {labReports.map(report => renderReportCard(report, "Lab"))}
              </div>
            )}
            
            {(!scans || scans.length === 0) && 
            (!pres || pres.length === 0) && 
            (!labReports || labReports.length === 0) && (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-center text-gray-500 italic text-sm mt-3">No reports available</p>
                <p className="text-xs text-blue-500 mt-2">Upload your first report</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          {userName ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{userName}</p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="mt-2 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 border border-red-500 font-medium rounded-lg text-sm px-4 py-2 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSignupOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Get Started
            </button>
          )}
        </div>
        <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-4 ">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between rounded-3xl mb-2">
          <div className="w-1/3">
            <h2 className="text-xl font-semibold text-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Mediseek.ai Playground
            </h2>
          </div>
          
          <div className="flex gap-2">
            {["Predictive Agent", "Medical Emergency Agent", "Analyzer Agent"].map(
              (agent) => (
                <div
                  key={agent}
                  className="relative ml-2"
                  onMouseEnter={() => setHovered(agent)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    onClick={() => setActiveAgent(agent)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeAgent === agent 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {agent}
                  </button>
                  
                  {hovered === agent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-1 w-64 bg-white z-10 text-gray-800 p-3 rounded-lg shadow-lg border border-gray-100"
                    >
                      <p className="text-sm">{agentDescriptions[agent]}</p>
                    </motion.div>
                  )}
                </div>
              )
            )}
          </div>
          
          
        </div>

        {/* Welcome Text
        <div className="bg-blue-50 p-4 text-center ">
          <h2 className="text-gray-800 font-semibold text-lg">
            <Typewriter
              options={{
                strings: ["Welcome to Mediseek.ai Playground..."],
                autoStart: true,
                loop: true,
                delay: 50,
              }}
            />
          </h2>
        </div> */}

        {/* Chat Container */}
        <div className="flex-1  rounded-2xl p-[-20px] flex flex-col bg-transparent border border-gray-400 overflow-y-auto">
          <div className="flex-1 bg-white  shadow-sm p-4 flex flex-col overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-2">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-blue-50 rounded-full p-6 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">How can I help you today?</h3>
                  <p className="text-gray-500 max-w-md">
                    Enter a PDF URL and ask questions about your medical documents. I'm here to analyze and explain your reports.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${msg.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
                  >
                    <div
                      className={`max-w-3/4 rounded-2xl px-4 py-3 ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center text-gray-500 mt-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="ml-2 text-sm">Processing...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-4 p-2 bg-gray-50 rounded-xl flex items-center gap-2">
              <input
                type="text"
                placeholder="PDF URL"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <input
                type="text"
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2.5 transition-colors duration-300 disabled:bg-gray-400 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Doctor's Features Panel */}
      <div className="w-1/6 bg-white shadow-lg flex flex-col border m-4 rounded-3xl border-teal-500">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-teal-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Doctors' Features
          </h2>
        </div>
        <div className="p-4 flex-1">
          <div className="bg-teal-50 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-teal-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-teal-800 font-medium text-sm mb-1">Coming Soon</h3>
            <p className="text-teal-600 text-xs">Advanced features for healthcare professionals</p>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
              <div className="bg-teal-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Patient Management</h4>
                <p className="text-xs text-gray-500">Track and manage patient records</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
              <div className="bg-teal-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Appointment Scheduling</h4>
                <p className="text-xs text-gray-500">Organize patient visits efficiently</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
              <div className="bg-teal-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Advanced Analytics</h4>
                <p className="text-xs text-gray-500">In-depth medical data analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function DashboardUI() {
  const [userName, setUserName] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state
  const [loadingt, setLoadingt] = useState(false); // New loading state
  const [copied, setCopied] = useState(false); // State to track if the report ID is copied
  // download EHR
  const [summary, setSummary] = useState("");

  const [reportId, setReportId] = useState("");
  const [reportId2, setReportId2] = useState("");
  const navigate = useNavigate(); // Assuming you're using React Router
  const handleSubmit = async () => {
    if (!reportId2) return alert("Please enter a Report ID!");

    setLoadingt(true);
    setSummary("");

    try {
      // Get the token from local storage (or however you're storing it)
      const authToken = localStorage.getItem("authToken");
      if (!authToken) throw new Error("No authentication token found.");

      // Step 1: Extract the data from the report ID with Authorization header
      const extractResponse = await axios.get(
        `http://localhost:5000/api/reports/extract/${reportId2}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token here
          },
        }
      );

      const extractedData = extractResponse.data.extractedData;

      // Step 2: Generate the summary using the extracted data
      const summaryResponse = await axios.post(
        "http://localhost:5000/api/reports/generate-summary",
        { extractedData },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token here as well
          },
        }
      );

      // Set the summary to display
      setSummary(summaryResponse.data.summary);
    } catch (error) {
      console.error("Error fetching the report summary:", error);
      setSummary("Failed to retrieve report summary. Please try again later.");
    }

    setLoadingt(false);
  };

  const handleDownloadEHR = async () => {
    if (!reportId) {
      alert("Please enter a report ID!");
      return;
    }

    setLoading(true); // Show loader when download starts

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("No authentication token found. Please log in again.");
        return;
      }

      // First request: Extract the report
      const extractResponse = await axios.get(
        `http://localhost:5000/api/reports/extract/${reportId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "json", // Expecting JSON, not a PDF
        }
      );

      if (extractResponse.data && extractResponse.data.extractedData) {
        // Second request: Process the extracted data and generate the EHR PDF
        const processResponse = await axios.post(
          "http://localhost:5000/api/reports/process-report",
          { extractedData: extractResponse.data.extractedData },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            responseType: "blob", // Expecting a PDF as a blob
          }
        );

        // Create a link element to download the PDF
        const url = window.URL.createObjectURL(
          new Blob([processResponse.data])
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "health_report.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("No extracted data found in response.");
        alert("Failed to extract report data.");
      }
    } catch (error) {
      console.error("Error downloading EHR:", error);
      alert("An error occurred while downloading the EHR.");
    } finally {
      setLoading(false); // Hide loader after process completes or fails
    }
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const fetchReports = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/reports/reports",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        console.log(data);
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Send a request to the backend to log out
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      // Clear the username from localStorage and state
      localStorage.removeItem("username");
      setUserName(null);

      // Redirect to login page or homepage
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  useEffect(() => {
    // Fetch user name from localStorage or any other global state if logged in
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Fetch reports from the MongoDB backend
    const fetchReports = async () => {
      try {
        // You may need to add an authorization header depending on your setup
        const { data } = await axios.get(
          "http://localhost:5000/api/reports/reports",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assuming token-based auth
            },
          }
        );
        console.log(data);
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
      }
    };

    fetchReports();
  }, []);
  let isSpeaking = false; // Track speaking state
  let speechUtterance; // Declare the utterance globally

  const handleReadAloud = () => {
    const text = document.getElementById("report-text").innerText;

    // If already speaking, stop and reset
    if (isSpeaking) {
      speechSynthesis.cancel();
      isSpeaking = false;
      return;
    }

    // Create a new utterance only if not already speaking
    speechUtterance = new SpeechSynthesisUtterance(text);

    // Wait for voices to load
    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      const teluguVoice = voices.find((voice) => voice.lang === "te-IN");
      speechUtterance.voice = teluguVoice || voices[0];
      speechSynthesis.speak(speechUtterance);
      isSpeaking = true;
    };

    // If voices are already loaded
    if (speechSynthesis.getVoices().length > 0) {
      const voices = speechSynthesis.getVoices();
      const teluguVoice = voices.find((voice) => voice.lang === "te-IN");
      speechUtterance.voice = teluguVoice || voices[0];
      speechSynthesis.speak(speechUtterance);
      isSpeaking = true;
    }

    // Handle speech end to reset state
    speechUtterance.onend = () => {
      isSpeaking = false;
    };

    // Handle speech cancellation (e.g., button clicked again)
    speechUtterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      isSpeaking = false;
    };
  };
  const handleCopyClick = (reportId) => {
    navigator.clipboard
      .writeText(reportId)
      .then(() => {
        console.log(reportId);
        setCopied(true);
        alert("Report ID copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <div className="p-6 bg-[#0a1a3c] text-white min-h-screen">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 ml-5">Dashboard Overview</h2>

      {/* Welcome Card */}
      <div className="h-[150px] ml-5 w-[840px] bg-gradient-to-r from-blue-500 to-green-400 p-6 rounded-xl flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold">Hello👋🏻 {userName},</h3>
          <p>Have a nice day and don’t forget to take care of your health!</p>
        </div>
        <div className="w-40 h-40 mb-4">
          <img
            className="w-full h-full mb-2"
            src="/med.svg"
            alt="Meditation Illustration"
          />
        </div>
      </div>

      <div className="border-2 border-blue-400 rounded-2xl mb-4 w-[900px] p-4 bg-transparent shadow-md">
        {/* Header Section */}
        <div className="grid grid-cols-6 gap-4 text-gray-200 border-b pb-2 mb-2">
          <div className="font-semibold ml-2">ID</div>
          <div className="font-semibold">Patient Name</div>
          <div className="font-semibold">Test Type</div>
          <div className="font-semibold">Date</div>
          <div className="font-semibold">Conclusion</div>
          <div className="font-semibold">Actions</div>
        </div>

        {/* Scrollable Reports Section */}
        <div className="h-[160px] overflow-y-scroll">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report._id}
                className="grid grid-cols-6 gap-4 items-center mb-2 text-gray-200 hover:text-black bg-black py-2 hover:bg-gray-100 transition-all duration-200 rounded-lg p-2"
              >
                <div className="ml-2 flex items-center">
                  {" "}
                  {/* Added flex for alignment */}
                  <div>{report._id.slice(0, 9)}</div>{" "}
                  {/* Display the full ID */}
                  <button
                    onClick={() => handleCopyClick(report._id)}
                    className="ml-2 text-gray-500 hover:text-blue-500 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-5.172 1.913a2 2 0 00-1.414 1.414v10.342a2 2 0 001.414 1.414l2.121 2.121a2 2 0 002.828 0l2.121-2.121a2 2 0 001.414-1.414V8.328a2 2 0 00-1.414-1.414l-2.121-2.121a2 2 0 00-2.828 0L9.172 6.913z"
                      />
                    </svg>
                  </button>
                  {copied && <span className="ml-2 text-green-500"></span>}{" "}
                  {/* Confirmation message */}
                </div>{" "}
                <div>{report.patientName}</div>
                <div>{report.testType}</div>
                <div>{report.date.slice(0, 10) || "N/A"}</div>
                <div
                  className={
                    report.conclusion === "Approved"
                      ? "text-green-500 font-medium"
                      : "text-yellow-500 font-medium"
                  }
                >
                  {report.conclusion || "Pending"}
                </div>
                <div className="flex flex-row justify-start ml-[-50px] space-x-2 mb-2">
                  <button className="text-blue-500 hover:text-blue-700 transition cursor-pointer">
                    Score
                  </button>
                  <button className="text-teal-500 hover:text-teal-700 transition cursor-pointer">
                    EHR
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition cursor-pointer">
                    Switch
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-2">
              No reports available
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#112b5e] p-4 rounded-lg flex flex-col items-center">
          <h3 className="text-xl font-bold">Download Your EHR Here</h3>
          <input
            type="text"
            placeholder="Enter your Report ID Here"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            className="mt-2 p-2 border rounded"
          />
          <button
            onClick={handleDownloadEHR}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Download
          </button>
        </div>

        {/* Loader */}
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            {/* Background blur for the rest of the content */}
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-md"></div>

            {/* Loader content */}
            <div className="flex flex-col items-center z-10">
              <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full"></div>
              <p className="mt-4 text-white text-lg">Downloading...</p>
            </div>
          </div>
        )}

        <div className="bg-[#112b5e]/50 backdrop-blur-lg p-4 h-[200px] rounded-lg flex flex-col items-center w-[600px] shadow-md shadow-[#00b6c7] overflow-y-auto">
          {" "}
          <div className="flex flex-row justify-between items-center w-full">
  <h3 className="text-xl font-bold">
    Report Review In Layman Terms
  </h3>
  <button 
    onClick={handleReadAloud} 
    className="ml-3 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
    
  >
    <img src="file.png" className="h-5 w-5"></img>
    
  </button>
</div>

          <div className="flex flex-row ">
            <input
              type="text"
              value={reportId2}
              onChange={(e) => setReportId2(e.target.value)}
              placeholder="Enter Report ID"
              className="mt-2 p-2 border rounded ml-[-220px]"
            />

            <button
              onClick={handleSubmit}
              className="mt-2 px-1 ml-6 bg-teal-500 text-white rounded-lg hover:bg-teal-600 cursor-pointer"
              disabled={loadingt}
            >
              {loadingt ? "Loading..." : "Submit"}
            </button>
          </div>
          <p id="report-text" className="mt-2">
            {summary ||
              "Kindly put your Report ID to get the summary of your report in Layman and easy-to-understand terms with the help of AI. You will also be getting a read-aloud feature for a smoother experience. Powered by meediseek.ai"}
          </p>
        </div>
      </div>

      {/* Fitness Activity Chart Placeholder */}
      <div className="bg-[#112b5e] p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold mb-2 text-center">
          AI Powered Recommendation and Diagnosis Suggestions
        </h3>
        <div className="h-40 bg-gray-800 rounded-md flex items-center justify-center">
          <p>Chart Placeholder</p>
        </div>
      </div>

      {/* Reminders and Reports */}
    </div>
  );
}

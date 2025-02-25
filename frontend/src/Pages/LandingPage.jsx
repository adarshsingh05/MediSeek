import React, { useState, useEffect } from "react";
import Achievements from "./Achievments";
import HelpSection from "./HelpSection";
import { PatientJourney } from "./PatientJourney";
import { supabase } from "./supabaseClient";
import SignupModal from "./Signup";
import { Link } from 'react-router-dom';
import axios from "axios";

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [userName, setUserName] = useState(null); // State to store user's name
  const [patientName, setPatientName] = useState(""); // New state for patient name
  const [testReport, setTestReport] = useState(""); // New state for test report

  useEffect(() => {
    // Fetch user name from localStorage or any other global state if logged in
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !patientName || !testReport) {
        alert("Please fill all fields and select a file!");
        return;
    }
    setIsUploading(true); // Start Loader

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`; // Unique filename

    const { data, error } = await supabase.storage
        .from("usersrep")
        .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        console.error("Upload failed:", error.message);
        alert("Upload failed. Try again.");
        setIsUploading(false);
        return;
    }

    console.log("Upload successful:", data);

    // ✅ Correct File URL
    const fileUrl = `https://rlkflisvqgndvaojqoao.supabase.co/storage/v1/object/public/usersrep/${data.path}`;
    console.log("📌 File URL:", fileUrl);

    // 🔥 Send Data to Backend (MongoDB)
    try {
        const token = localStorage.getItem("authToken"); // Get stored token

        if (!token) {
            alert("Authentication error: Please log in again.");
            setIsUploading(false);
            return;
        }

        const response = await fetch("http://localhost:5000/api/reports/upload", {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                patientName: patientName, // Send patient name from the input field
                testType: testReport, // Send test report value
                supabaseUrl: fileUrl, // File URL from Supabase
            }),
        });

        const result = await response.json();
        if (response.ok) {
            console.log("✅ Report Saved in MongoDB:", result);
            alert("File uploaded and saved to database!");
        } else {
            console.error("❌ Failed to save report:", result.message);
            alert("Failed to save report to database.");
        }
    } catch (error) {
        console.error("❌ Error sending data to backend:", error);
        alert("Error saving file data.");
    }

    setIsUploading(false); // Stop Loader
};

  const handleLogout = async () => {
    try {
      // Send a request to the backend to log out
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      // Clear the username from localStorage and state
      localStorage.removeItem("username");
      setUserName(null);

      // Redirect to login page or homepage
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <div className="w-screen min-h-screen">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 shadow-md bg-[#edf8fc] z-50">
          <div className="text-2xl font-semibold text-gray-700">
            mediseek.<span className="text-gray-500">ai</span>
          </div>
          <div className="hidden text-xl font-extrabold cursor-pointer md:flex font-mono space-x-6 text-[#434545]">
  {["Home", "Your Reports", "Dashboard", "About", "Vault"].map((item) => (
    <li
      key={item}
      className="px-4 py-2 hover:border-2 rounded-xl border-gray-800 list-none"
    >
      {item === "Your Reports" ? (
        <Link to="/History" className="text-[#434545]">
          {item}
        </Link>
      ) : item === "Home" ? (
        <Link to="/" className="text-[#434545]">
          {item}
        </Link>
      ) : item === "Dashboard" ? (
        <Link to="/dashboard" className="text-[#434545]">
          {item}
        </Link>
      ) : item === "Vault" ? (
        <Link to="/vault" className="text-[#434545]">
          {item}
        </Link>
      ) : (
        item
      )}
    </li>
  ))}
</div>

          {/* If user is logged in, show first letter of username */}
          {userName ? (
            <button  onClick={handleLogout} className="bg-teal-400 text-black px-4 py-2 rounded-lg">
                          Get Out ⮞
                          {/* Display first letter of the username */}
            </button>
          ) : (
            <button
              onClick={() => setIsSignupOpen(true)}
              className="bg-teal-400 text-black px-4 py-2 rounded-lg hover:bg-teal-500"
            >
              Get In ⮞
            </button>
          )}

          {/* Signup Modal (Controlled by isSignupOpen) */}
          <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-evenly text-center md:text-left py-40 px-6 w-screen bg-gradient-to-b from-[#bce1f1] to-white">
          {/* Left Side - Text */}
          <div className="md:w-1/2 ml-52 mr-[-50px] flex flex-col items-center md:items-start">
            <h1 className="text-5xl font-semibold text-gray-800 w-full">
              Empower your Patients with the Best Technology
            </h1>
            <div className="w-[500px] m-2 ml-10 border-b-2 border-gray-500 my-4"></div>
            <p className="text-gray-700 text-lg w-full max-w-lg">
              Smart Reports processes <span className="font-bold">diagnostic lab test reports</span>, and
              <span className="font-bold"> translates patients’ health and biomarker values </span>
              into easily-understood clinical readings, health tips, and other insights generated by an AI-based medical reasoning engine.
            </p>
            <div >
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-6 h-12 cursor-pointer rounded-lg text-lg bg-indigo-700"
              >
                Scan Your Report ⮞
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="md:w-1/2 flex justify-center items-center">
            <img src="/main.png" alt="Smart Reports Preview" className="w-full max-w-md rounded-lg" />
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 p-6 rounded-lg border-2 border-teal-400 shadow-lg w-[600px] relative">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Your Scanned Blood Report</h2>
              <input 
                type="text" 
                placeholder="Enter Patient Name" 
                className="mb-4 border p-2 w-full text-black rounded-2xl" 
                disabled={isUploading} 
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Enter Test Report" 
                className="mb-4 border p-2 w-full text-black rounded-2xl" 
                disabled={isUploading} 
                value={testReport}
                onChange={(e) => setTestReport(e.target.value)} 
              />
              {/* File Upload Input */}
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="mb-4 border p-2 w-full text-black rounded-2xl" 
                disabled={isUploading} 
              />

              {/* Show loader while uploading */}
              {isUploading && (
                <div className="flex justify-center items-center my-4">
                  <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-700">Uploading...</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between space-x-3 mt-4">
                <button
                  onClick={handleUpload}
                  className={`px-4 py-2 rounded-lg ${
                    isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  } text-black`}
                  disabled={isUploading} // Disable during upload
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-black px-4 py-2 rounded-lg border-2 border-gray-800 hover:bg-gray-600"
                  disabled={isUploading} // Prevent closing during upload
                >
                  Close
                </button>
              </div>

              {/* Guide Section */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg border-l-4 border-teal-500 text-gray-700">
                <h3 className="font-semibold text-lg">Guide to Upload Your Blood Report</h3>
                <ul className="list-disc pl-5 text-sm mt-2">
                  <li>Do not crop out any part of the image.</li>
                  <li>Avoid blurred images.</li>
                  <li>Supported file types: <strong>JPEG, JPG, PNG, PDF</strong></li>
                  <li>Maximum allowed file size: <strong>2MB</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
      <div className="mt-[-70px]">
        <Achievements />
      </div>
      <HelpSection/>
      <PatientJourney/>
    </>
  );
};

export default LandingPage;

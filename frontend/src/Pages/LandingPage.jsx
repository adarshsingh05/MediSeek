import React, { useState } from "react";
import Achievements from "./Achievments";
import HelpSection from "./HelpSection";
import { PatientJourney } from "./PatientJourney";
import { supabase } from "./supabaseClient";


const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }
  
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
      return;
    }
  
    console.log("Upload successful:", data);
  
    // ✅ Correct File URL
    const fileUrl = `https://rlkflisvqgndvaojqoao.supabase.co/storage/v1/object/public/usersrep/${data.path}`;
    console.log("📌 File URL:", fileUrl);
  
    // 🔥 Send Data to Backend (MongoDB)
    try {
      const response = await fetch("http://localhost:5000/api/reports/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: "John Doe", // Replace with actual data
          testType: "Blood Test", // Replace with actual data
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
  };
  

  

  return (
    <>
    <div className="w-screen min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 shadow-md bg-[#edf8fc] z-50">
  <div className="text-2xl font-semibold text-gray-700">
    mediseek.<span className="text-gray-500">ai</span>
  </div>
  <div className="hidden text-xl font-extrabold cursor-pointer md:flex font-mono space-x-6 text-[#00d5be]">
    {["Home", "Your Reports", "Dashboard", "About", "Features"].map((item) => (
      <li 
        key={item}
        href="#"
        className="px-4 py-2 hover:border-2 rounded-xl border-gray-800 list-none"
      >
        {item}
      </li>
    ))}
  </div>
  <button className="bg-teal-400 text-black px-4 py-2 rounded-lg hover:bg-teal-500">
    Get In ⮞
  </button>
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
            className="mt-6 px-6 rounded-lg text-lg bg-indigo-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center   justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg border-2 border-teal-400 shadow-lg w-[400px]">
            
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Your Scanned Blood Report</h2>

            {/* File Upload Input */}
            <input type="file" onChange={handleFileChange} className="mb-4 border p-2 w-full" />

            {/* Buttons */}
            <div className="flex justify-between space-x-3">
              <button
                onClick={handleUpload}
                className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Upload
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-black px-4 py-2 rounded-lg border-2 border-gray-800 hover:bg-gray-600"              >
                Close
              </button>
             
            </div>
            <div>
              <h2>Guide to upload the blood report</h2>
              Don’t crop out any part of the image
Avoid blurred image
Supported files type: jpeg , jpg , png , pdf
Maximum allowed file size: 2MB
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

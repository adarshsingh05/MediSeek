import React, { useState } from "react";
import { Upload,  FileText, Share2, Download } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useEffect } from "react";

import { handleFileUpload } from "./fileuploadhandler";
const VaultPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [DocumentName, setDocumentName] = useState(""); // New state for patient name
  const [testReport, setTestReport] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [reportName, setReportName] = useState("");
  const [scanName, setScanName] = useState("");
  const [amount, setAmount] = useState("");
  const [patientName, setPatientName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [testType, setTestType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Your Documents"); // For changing the heading dynamicall

  const[scans, setScans] = useState([]);
  const [files, setFiles] = useState([
    { id: 1, name: "Blood Test Report.pdf", category: "Lab Reports", date: "2025-02-20" },
    { id: 2, name: "MRI Scan.jpg", category: "Scans", date: "2025-02-18" },
    { id: 3, name: "Prescription for Patient.pdf", category: "Prescriptions", date: "2025-02-15" },
  ]);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCategoryClick = (category,name) => {
    setSelectedCategory(category); // Update the selected category
    setSelectedCategoryName(name); // Update the heading
  };
  const handleBackClick = () => {
    navigate('/');
  };

  // get request for the scans

useEffect(() => {
  const fetchReports = async () => {
      try {
          const response = await fetch("http://localhost:5000/api/reports/scanreports", {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
          });
          if (!response.ok) {
              const errorText = await response.text();
              console.error("Error Response:", errorText);
              throw new Error("Failed to fetch reports");
          }

          const data = await response.json();
          console.log("Fetched Reports:", data);
          setScans(data);
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  fetchReports();
}, []); // ✅ Keep dependencies stable

// ✅ Log `scans` correctly inside another effect
useEffect(() => {
  console.log("Updated Scans:", scans);
}, [scans.length]); // Only trigger when the array size changes

  

  return (
    <div className="min-h-screen bg-[#dbeff8] p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <img src="l1.gif" alt="Logo" />
          <h1 className="text-3xl font-bold text-center text-black">Secure Health Vault</h1>
        </div>
        <p className="text-gray-600 text-center">Store, access, and share your medical records securely.</p>
      </header>

      {/* Upload Section */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex items-center gap-4">
        <Upload className="text-blue-500" />
        <input type="file" className="hidden" id="file-upload" />
        <div className="flex w-full justify-between">
          <button className="cursor-pointer rounded-lg text-md text-blue-700" onClick={() => setIsModalOpen(true)}>
            Upload Documents
          </button>

          <button   onClick={handleBackClick} className="cursor-pointer rounded-lg text-md flex flex-row text-blue-700">
            <img className="h-5 w-5 mr-1 text-black" src="hicon.png" alt="Back Icon" />
            <span className="text-black">Back</span>
          </button>
        </div>
      </div>

      {/* Document Categories */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2  cursor-pointer ${selectedCategory === "all" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-md`}
          onClick={() => handleCategoryClick("all", "Your Documents")}
        >
          All
        </button>
        <button
          className={`px-4 py-2  cursor-pointer ${selectedCategory === "prescriptions" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-md`}
          onClick={() => handleCategoryClick("prescriptions", "Prescriptions")}
        >
          Prescriptions
        </button>
        <button
          className={`px-4 py-2  cursor-pointer ${selectedCategory === "labReports" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-md`}
          onClick={() => handleCategoryClick("labReports", "Lab Reports")}
        >
          Lab Reports
        </button>
        <button
          className={`px-4 py-2  cursor-pointer ${selectedCategory === "scans" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-md`}
          onClick={() => handleCategoryClick("scans", "Scans")}
        >
          Scans
        </button>
      </div>

      {/* Dynamic Heading */}
      <div className="mb-6">
        <h2 className="text-xl text-black font-semibold">{selectedCategoryName}</h2>
      </div>

      {/* Document List with Sliding Animation */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div
          className={`transition-all duration-500 ease-in-out ${
            selectedCategory === "all" ? "block" : "hidden"
          }`}
        >
          {/* Display all documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <FileText className="text-gray-600" />
                  <p className="text-sm text-black font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.date}</p>
                </div>
                <div className="flex gap-2">
                  <Share2 className="text-blue-500 cursor-pointer" />
                  <Download className="text-green-500 cursor-pointer" />
                  <Eye className="text-gray-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            selectedCategory === "prescriptions" ? "block bg-blue-50" : "hidden"
          }`}
        >
          {/* Display only prescriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files
              .filter((file) => file.category === "Prescriptions")
              .map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded-lg flex items-center justify-between"
                >
                  <div>
                    <FileText className="text-gray-600" />
                    <p className="text-sm text-black font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Share2 className="text-blue-500 cursor-pointer" />
                    <Download className="text-green-500 cursor-pointer" />
                    <Eye className="text-gray-500 cursor-pointer" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            selectedCategory === "labReports" ? "block bg-red-50" : "hidden"
          }`}
        >
          {/* Display only lab reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files
              .filter((file) => file.category === "Lab Reports")
              .map((file) => (
                <div
                  key={file.id}
                  className="p-4 border rounded-lg flex items-center justify-between"
                >
                  <div>
                    <FileText className="text-gray-600" />
                    <p className="text-sm text-black font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Share2 className="text-blue-500 cursor-pointer" />
                    <Download className="text-green-500 cursor-pointer" />
                    <Eye className="text-gray-500 cursor-pointer" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            selectedCategory === "scans" ? "block bg-yellow-50" : "hidden"
          }`}
        >
          {/* Display only scans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scans.length > 0 ? (
  scans.map((scan) => (
    <div key={scan._id} className="p-4 border rounded-lg flex items-center justify-between">
      {/* Left Side: File Icon, Scan Name, and Date (Stacked) */}
      <div className="flex flex-col items-start">
        <FileText className="text-gray-600 mb-1" />
        <p className="text-sm text-black font-medium">{scan.scanName || "Unnamed Scan"}</p>
        <p className="text-xs text-gray-500">{new Date(scan.date).toLocaleDateString()}</p>
      </div>

      {/* Center: Document Name */}
      <p className="text-sm text-black font-medium">{scan.documentName || "Unnamed Scan"}</p>

      {/* Right Side: Icons (View, Share, Download) */}
      <div className="flex gap-2">
        <Eye className="text-gray-500 cursor-pointer" />
        <Share2 className="text-blue-500 cursor-pointer" />
        <Download className="text-green-500 cursor-pointer" />
      </div>
    </div>
  ))
) : (
  <p className="text-gray-600 text-center w-full">No scan reports available</p>
)}

          </div>
        </div>
      </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-200 p-6 rounded-lg border-2 border-teal-400 shadow-lg w-[600px] relative">
              <div className="flex flex-row">
                <img className="mt-[-10px] mb-2" src="lock.png" alt="Lock" />
                <h2 className="text-xl text-center font-semibold text-gray-700 mb-4">
                  Upload Documents into Meediseek Secured Vault
                </h2>
              </div>

              <input
                type="text"
                placeholder="Document Name"
                className="mb-4 border p-2 w-full text-black rounded-2xl"
                disabled={isUploading}
                value={DocumentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />

              <select
                className="mb-4 border p-2 w-full text-black rounded-2xl"
                disabled={isUploading}
                value={testReport}
                onChange={(e) => setTestReport(e.target.value)}
              >
                <option value="" disabled>
                  Select Document Type
                </option>
                <option value="prescriptions">Prescriptions</option>
                <option value="labreport">Lab Report</option>
                <option value="scans">Scans</option>
                <option value="medical_bills">Medical Bills</option>
              </select>

              {/* Conditionally Render Fields Based on Document Type */}
              {testReport === "prescriptions" && (
                <>
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Hospital Name"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Disease Name"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={diseaseName}
                    onChange={(e) => setDiseaseName(e.target.value)}
                  />
                </>
              )}

              {testReport === "labreport" && (
                <>
                  <input
                    type="text"
                    placeholder="Hospital Name"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Report Name"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </>
              )}

              {testReport === "scans" && (
                <>
                  <input
                    type="text"
                    placeholder="Scan Name"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={scanName}
                    onChange={(e) => setScanName(e.target.value)}
                  />
                </>
              )}

              {testReport === "medical_bills" && (
                <>
                  <input
                    type="text"
                    placeholder="Hospital Name"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="mb-4 border p-2 w-full text-black rounded-2xl"
                    disabled={isUploading}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </>
              )}

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
              <button
  onClick={async () => {
    if (testReport === "scans" && scanName && DocumentName && files.length > 0) {
      setIsUploading(true);
      // Make sure you have the file selected
      await handleFileUpload(scanName, DocumentName, selectedFile, setIsUploading, (error) => {
        alert(error);
      });
    } else {
      alert("Please select the correct document type and fill out all required fields.");
    }
  }}
  className={`px-4 py-2 rounded-lg ${
    isUploading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
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
                <h3 className="font-semibold text-lg">
                  Guide to Upload Your Document
                </h3>
                <ul className="list-disc pl-5 text-sm mt-2">
                  <li>Do not crop out any part of the image.</li>
                  <li>Avoid blurred images.</li>
                  <li>
                    Supported file types: <strong>JPEG, JPG, PNG, PDF</strong>
                  </li>
                  <li>
                    Maximum allowed file size: <strong>2MB</strong>
                  </li>
                </ul>
              </div>
            </div>
         
        )}
      </div>
    
  );
};

export default VaultPage;

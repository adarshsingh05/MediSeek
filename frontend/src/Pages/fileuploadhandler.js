import axios from "axios";
import { supabase } from "./supabaseClient";

// Function to handle file input change
export const handleFileChange = (e, setFile) => {
  setFile(e.target.files[0]);
};

// Function to handle form submission and upload process
export const handleScanSubmit = async (
  
  file,
  scanName,
  documentName,
  testReport, // Add the testReport (document type) to check if it's a scan
  setMessage,
  setIsUploading
) => {

  // Check if the document type is "scans"
  if (testReport !== "scans") {
    setMessage("Please select 'Scans' as the document type to upload a scan.");
    return;
  }

  if (!file || !scanName || !documentName) {
    setMessage("Please fill all the fields and choose a file.");
    return;
  }

  setIsUploading(true);
  setMessage("");

  // Generate a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`; // Unique filename
  
  try {
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from("usersrep")
      .upload(fileName, file, {
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
    
    // Correct File URL
    const fileUrl = `https://rlkflisvqgndvaojqoao.supabase.co/storage/v1/object/public/scans/${data.path}`;
    console.log("📌 File URL:", fileUrl);

    // Send file URL and other details to the backend
    const token = localStorage.getItem("authToken"); // Get stored token
    if (!token) {
      alert("Authentication error: Please log in again.");
      setIsUploading(false);
      return;
    }

    const response = await fetch("http://localhost:5000/api/reports/uploadscan", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scanName, // Send scan name
        documentName, // Send document name
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
  } finally {
    setIsUploading(false); // Stop Loader
  }
};

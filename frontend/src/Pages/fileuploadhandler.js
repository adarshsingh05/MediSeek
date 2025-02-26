import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // Add uuid package for generating unique IDs
const supabase = createClient('https://rlkflisvqgndvaojqoao.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsa2ZsaXN2cWduZHZhb2pxb2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzM4NTUsImV4cCI6MjA1NTAwOTg1NX0.X-ottuHt6nzv5KpBG582AFgJ7PniCzz_xA_resiXfR8');

export const handleFileUpload = async (scanName, documentName, file, setUploading, setError) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error("Authentication token not found");
    }

    // Generate a unique file name
    const uniqueFileName = `${uuidv4()}_${file.name}`;

    // Upload the file to Supabase
    const { data, error: uploadError } = await supabase.storage
      .from('scans')
      .upload(`${uniqueFileName}`, file);

    console.log('Supabase upload result:', { data, uploadError });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const fileUrl = `https://rlkflisvqgndvaojqoao.supabase.co/storage/v1/object/public/scans//${data.path}`;
    console.log("📌 File URL:", fileUrl);


    // Send file details to the backend
    const response = await axios.post(
      'http://localhost:5000/api/reports/uploadscan',
      { scanName, documentName, supabaseUrl: fileUrl },
      {
        headers: { Authorization: `Bearer ${authToken}` }, // Pass token
      }
    );

    if (response.status === 201) {
      alert('File uploaded successfully!');
    } else {
      throw new Error('Error uploading file to backend');
    }
  } catch (err) {
    setError(`Error: ${err.message}`);
  } finally {
    setUploading(false);
  }
};



export const handleLabUpload = async (hospitalName, DocumentName, file, setIsUploading, setError) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error("Authentication token not found");
    }

    // // Ensure reportName is a string
    // if (typeof reportName !== 'string') {
    //   throw new Error("Report name must be a string");
    // }

    // Generate a unique file name
    const uniqueFileName = `${uuidv4()}_${file.name}`;

    // Upload the file to Supabase
    const { data, error: uploadError } = await supabase.storage
      .from('labreports')
      .upload(`${uniqueFileName}`, file);

    console.log('Supabase upload result:', { data, uploadError });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const fileUrl = `https://rlkflisvqgndvaojqoao.supabase.co/storage/v1/object/public/labreports//${data.path}`;
    console.log("📌 File URL:", fileUrl);
    
    
    // Send file details to the backend
    const response = await axios.post(
      'http://localhost:5000/api/reports/uploadlabreport',
      { hospitalName, reportName: String(DocumentName), supabaseUrl: fileUrl }, // Make sure reportName is a string
      {
        headers: { Authorization: `Bearer ${authToken}` }, // Pass token
      }
    );
    

    if (response.status === 201) {
      alert('File uploaded successfully!');
    } else {
      throw new Error('Error uploading file to backend');
    }
  } catch (err) {
    setError(`Error: ${err.message}`);
    alert(err.message);  // Display the error in an alert
  } finally {
    setIsUploading(false);
  }
};
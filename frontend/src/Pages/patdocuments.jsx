import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Stethoscope, RefreshCw, ChevronDown, ChevronUp, Calendar, Mail, UserCheck } from "lucide-react";

const GetPatients = ({ docEmail }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewingPatient, setViewingPatient] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  
  const [docId, setDocId] = useState(null); // Store docId from localStorage
  const [userId, setUserId] = useState(""); // Store userId entered by the user
  const [supabaseUrls, setSupabaseUrls] = useState([]);
 

  useEffect(() => {
    const storedDocId = localStorage.getItem("email");
    if (storedDocId) {
      setDocId(storedDocId);
    } else {
      setError("Document ID not found. Please log in again.");
    }
  }, []);






  useEffect(() => {
    if (docEmail) {
      console.log("passed email is: ", docEmail);
      fetchPatients();
    }
  }, [docEmail]); // Fetch patients when docEmail changes
  
  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    if (!docEmail) {
      setError("Doctor email is required.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/allpatients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docEmail }), // Send docEmail from props
      });
      console.log("response", response)
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch patients");
      console.log("data", data)
      setPatients(data.patients || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewPatient = async (patientId) => {
    setViewingPatient(patientId);
    // Simulate sending a request
  
   
  };
  
  const toggleRowExpansion = (patientId) => {
    setExpandedRows(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };
  
  return (
    <div className="min-h-screen w-[100%] bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="w-[90%]  ml-[100px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm">
            <div className="bg-teal-600 rounded-lg p-2 shadow-md">
              <Stethoscope className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
          </div>
          <button
            onClick={fetchPatients}
            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            disabled={loading}
          >
            <RefreshCw size={18} className={`transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
            Refresh
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl shadow-sm animate-pulse">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {patients.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="divide-y divide-gray-100">
              {patients.map((patient, index) => {
                const isExpanded = expandedRows[patient._id] || false;
                
                return (
                  <div key={patient._id} className="transition-all duration-300">
                    {/* Main row (always visible) */}
                    <div 
                      className={`px-8 py-5 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                        isExpanded ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => toggleRowExpansion(patient._id)}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                          isExpanded ? "bg-blue-600 text-white" : "bg-[#17b2d0] text-white"
                        }`}>
                          <span className="font-semibold text-xl">
                            {(patient.username ? patient.username.charAt(0) : patient.userEmail.charAt(0)).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-5">
                          <div className="text-lg font-medium text-gray-900">
                            {patient.username || "No username"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail size={14} className="mr-1.5" />
                            {patient.userEmail}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.docAccepted && patient.userAccepted 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        } transition-colors duration-300`}>
                          {patient.docAccepted && patient.userAccepted ? "Active" : "Pending"}
                        </span>
                        <button
      onClick={async (e) => {
        e.stopPropagation();
        setLoading(true);
        setError(null);

        console.log("Patient ID clicked:", patient.userEmail);
        const docId = localStorage.getItem("email");
        const userId = patient.userEmail;

        if (!docId || !userId) {
          console.error("Missing docId or userId");
          setError("Missing required fields");
          setLoading(false);
          return;
        }

        console.log("Retrieved docId:", docId);

        const url = `http://localhost:5000/api/auth/getshareddoc`;

        try {
          const response = await axios.post(url, { docId, userId });

          console.log("Response received:", response);
          setSupabaseUrls(response.data.supabaseUrls || []);
        } catch (err) {
          console.error("Error fetching documents:", err);
          setError(err.response?.data?.error || "Failed to fetch documents");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Loading..." : "View"}
    </button>


                        <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-500 ${isExpanded ? "bg-blue-100" : ""}`}>
                          {isExpanded ? (
                            <ChevronUp size={20} className="text-blue-600 transition-transform duration-300 transform" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500 transition-transform duration-300 transform" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded content (only visible when expanded) */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-8 py-6 bg-blue-50 border-t border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h3 className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                              Patient Details
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-start">
                                <span className="flex-shrink-0 text-gray-500 w-32">Patient ID:</span>
                                <span className="font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">{patient._id}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="flex-shrink-0 text-gray-500 w-32">Username:</span>
                                <span className="text-gray-700">{patient.username || "Aman Singh"}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="flex-shrink-0 text-gray-500 w-32">Email:</span>
                                <span className="text-gray-700">{patient.userEmail}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                              Status Information
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <span className="flex-shrink-0 text-gray-500 w-32">Created On:</span>
                                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded">
                                  <Calendar size={16} className="mr-2 text-blue-500" />
                                  <span className="text-gray-700">
                                    {new Date(patient.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="flex-shrink-0 text-gray-500 w-32">Doctor Email:</span>
                                <span className="text-gray-700">{patient.docEmail}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="flex-shrink-0 text-gray-500 w-32">Acceptance:</span>
                                <div className="flex gap-3">
                                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-300 ${patient.docAccepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    <UserCheck size={14} className={patient.docAccepted ? 'text-green-600' : 'text-yellow-600'} />
                                    Doctor: {patient.docAccepted ? 'Accepted' : 'Pending'}
                                  </span>
                                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-300 ${patient.userAccepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    <UserCheck size={14} className={patient.userAccepted ? 'text-green-600' : 'text-yellow-600'} />
                                    Patient: {patient.userAccepted ? 'Accepted' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white p-16 rounded-2xl shadow-md border border-gray-100 text-center transition-all duration-300 hover:shadow-lg">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <p className="text-gray-600 text-lg">Loading patient data...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="bg-blue-50 p-6 rounded-full mb-6 shadow-inner">
                  <Stethoscope size={48} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-700 mb-3">No patients found</h3>
                <p className="text-gray-500 max-w-md mb-8">
                  You don't have any accepted patients at the moment. When patients accept your invitation, they'll appear here.
                </p>
                <button
                  onClick={fetchPatients}
                  className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                  Refresh List
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-500">
          {patients.length > 0 && (
            <p className="bg-white px-4 py-2 rounded-full shadow-sm inline-block">
              Showing {patients.length} patient{patients.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetPatients;
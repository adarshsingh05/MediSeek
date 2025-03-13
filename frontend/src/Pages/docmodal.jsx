import React, { useState } from "react";
import axios from "axios";

const DoctorDetails = ({ refFunction, onSendDocument }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch and show doctor details
  const showDoctorDetails = async () => {
    setLoading(true);
    setError(null);
    setIsOpen(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/getdocdetails",
        { email: "adarsh.22bce7232@vitapstudent.ac.in" },
        { headers: { "Content-Type": "application/json" } }
      );
      // Now expecting an array of doctors
      setDoctors(Array.isArray(response.data) ? response.data : [response.data]);
      console.log(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle sending document to a specific doctor
  const handleSendDocument = (doctor) => {
    if (onSendDocument) {
      onSendDocument(doctor);
    }
  };

  if (refFunction) refFunction(showDoctorDetails);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur effect */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Modal container */}
          <div className="relative bg-white rounded-xl shadow-2xl z-10 w-80 max-h-80 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Connected Doctors</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto flex-grow">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-blue-600 border-blue-200"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-red-600 text-sm">
                  <p>{error}</p>
                </div>
              ) : doctors.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {doctors.map((doctor, index) => (
                    <div key={index} className="p-3 hover:bg-blue-50 transition duration-150">
                      <div className="flex items-center justify-between">
                        <div className="truncate pr-2">
                          <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                          <p className="text-gray-600 text-sm truncate">{doctor.specialization}</p>
                          <p className="text-gray-500 text-xs truncate">{doctor.email}</p>
                        </div>
                        <button
                          onClick={() => handleSendDocument(doctor)}
                          className="shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-sm"
                          title="Share Document"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No connected doctors available</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDetails;
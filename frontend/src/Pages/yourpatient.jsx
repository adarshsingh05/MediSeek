import React, { useState, useEffect } from "react";
import { useRef } from "react";
import {
  MessageSquare,
  Calendar,
  Users,
  Bell,
  Settings,
  Search,
  Send,
  Video,
  Phone,
  Plus,
  FileText,
  Clock,
} from "lucide-react";
import axios from "axios";
import GetPatients from "./patdocuments";
const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [acceptedRequests, setAcceptedRequests] = useState(new Set());
  const [requests, setRequests] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 1: Get email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email") || "";
    setEmail(storedEmail);
    console.log("Email retrieved:", storedEmail);
  }, []); // Runs only once when the component mounts

  const homeRef = useRef(null);
  const docRef = useRef(null);

  const handleScroll = (section) => {
    if (section === "home")
      homeRef.current?.scrollIntoView({ behavior: "smooth" });
    if (section === "doc")
      docRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // Fetch data from API
  useEffect(() => {
    if (!email) {
      console.log("Email is empty, skipping fetch");
      return; // Prevent API call if email is not set
    }

    const fetchRequests = async () => {
      setLoading(true);
      try {
        console.log("Fetching requests for email:", email);

        const response = await axios.get(
          "http://localhost:5000/api/auth/getreq",
          {
            params: { docEmail: email }, // Send email as a query parameter
          }
        );

        console.log("API response:", response.data); // Debug log

        // Extract the array from the response object
        if (
          response.data &&
          Array.isArray(response.data.requests) &&
          response.data.requests.length > 0
        ) {
          setRequests(response.data.requests);
          setDocEmail(response.data.requests[0].docEmail); // ✅ Take from the first request
          setUserEmail(response.data.requests[0].userEmail);
        } else {
          console.error("Expected an array but got:", response.data);
          setRequests([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (email) {
      fetchRequests();
    }
  }, [email]);

  const handleAccept = async (docEmail, userEmail) => {
    try {
      console.log("Sending Accept Request:", { docEmail, userEmail });

      const response = await fetch("http://localhost:5000/api/auth/accept", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docEmail, userEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Request Accepted ✅");
        setAcceptedRequests((prev) => new Set([...prev, userEmail]));
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Something went wrong!");
    }
  };

  // Step 3: Handle loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-300">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold text-white">MediSeek.ai</h1>
          <p className="text-teal-50 mt-2">
            Connecting healthcare professionals with patients
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex bg-blue-50">
        {/* Fixed Sidebar */}
        <div className="  m-4 rounded-2xl h-[600px]  w-20 bg-gradient-to-b from-teal-500 to-blue-400 flex flex-col items-center ml-4 py-4 fixed  top-0 left-0 rounded-r-2xl shadow-lg">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-12 shadow-lg">
            <span className="text-teal-500 font-bold text-xl">M</span>
          </div>

          <nav className="flex flex-col items-center space-y-8">
            <button
              onClick={() => handleScroll("home")}
              className="h-12 w-12 rounded-xl bg-white text-teal-500 flex items-center justify-center shadow-lg transform transition hover:scale-105"
            >
              <MessageSquare size={20} />
            </button>
            <button
              onClick={() => handleScroll("doc")}
              className="h-12 w-12 rounded-xl bg-teal-400 text-white flex items-center justify-center transition hover:bg-teal-300"
            >
              <Users size={20} />
            </button>
            <button className="h-12 w-12 rounded-xl bg-teal-400 text-white flex items-center justify-center transition hover:bg-teal-300">
              
              <Calendar size={20} />
            </button>
          </nav>
        </div>

        {/* Patient Requests Column */}
        <div className="w-72 bg-white shadow-md overflow-hidden m-4 rounded-2xl ml-32  flex flex-col">
          <div className="p-5 border-b border-blue-100">
            <h2 className="font-bold text-xl text-teal-700">
              Connection Requests
            </h2>
            <div className="flex items-center mt-1">
              <span className="w-3 h-3 bg-teal-400 rounded-full animate-pulse mr-2"></span>
              <p className="text-sm text-blue-500">
                {requests.filter((req) => req.docAccepted) === true.length > 0
                  ? `${
                      requests.filter((req) => req.docAccepted).length
                    } new requests`
                  : "No new requests"}{" "}
              </p>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {requests.map((request) => (
              <div
                key={request._id}
                className="p-5 border-b border-blue-100 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-lg shadow-md flex items-center justify-center bg-teal-400 text-gray-800 text-lg font-bold">
                      {request.username?.charAt(0).toUpperCase() || "R"}
                    </div>

                    <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-teal-400 rounded-md border-2 border-white flex items-center justify-center">
                      <Plus size={12} className="text-white" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {request.username || request.userEmail}
                    </h3>
                    <p className="text-sm text-blue-500">
                      {requests.condition}
                    </p>
                    <div className="flex items-center mt-1">
                      <Clock size={12} className="text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {acceptedRequests.has(request.userEmail) ||
                  request.docAccepted === true ? (
                    <span className="py-2 bg-green-500 text-white text-center w-[250px] rounded-lg font-medium">
                      Accepted
                    </span>
                  ) : (
                    <>
                      <button
                        className="py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-sm"
                        onClick={() =>
                          handleAccept(request.docEmail, request.userEmail)
                        }
                      >
                        Accept
                      </button>

                      <button className="py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content / Chat Area */}
        <div
          ref={homeRef}
          id="home"
          className="flex-1 flex flex-col bg-blue-50 relative overflow-hidden"
        >
          {selectedPatient ? (
            <>
              {/* Chat Header */}

              {/* Message Input */}
            </>
          ) : (
            <div className="flex items-center justify-center h-full p-10">
              <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-blue-100 max-w-lg">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 rounded-2xl text-teal-500 mb-6">
                  <MessageSquare size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  Welcome to MediSeek.ai
                </h2>
                <p className="text-gray-600 mb-8">
                  Your AI-powered telemedicine platform. Select a patient from
                  the list to start a consultation or respond to new connection
                  requests.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <h3 className="text-3xl font-bold text-teal-600">
                      {requests.filter((req) => req.docAccepted).length}
                    </h3>
                    <p className="text-sm text-gray-600">Patients</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <h3 className="text-3xl font-bold text-teal-600">
                      {requests.filter((req) => req.docAccepted).length}
                    </h3>
                    <p className="text-sm text-gray-600">Appointments</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <h3 className="text-3xl font-bold text-teal-600">
                      {requests.filter((req) => req.docAccepted) ===
                      true.length > 0
                        ? `${
                            requests.filter((req) => req.docAccepted).length
                          } new requests`
                        : 0}{" "}
                    </h3>
                    <p className="text-sm text-gray-600">Requests</p>
                  </div>
                </div>
                <button className="bg-teal-500 text-white py-3 px-6 rounded-xl hover:bg-teal-600 transition-colors">
                  Start a new consultation
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Patients List Column */}
        <div className="w-80 bg-white shadow-md overflow-hidden m-4 rounded-2xl flex flex-col border-l border-r border-blue-100">
          <div className="p-5 border-b border-blue-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full text-gray-600 py-3 pl-10 pr-4 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-blue-100"
              />
              <Search
                size={18}
                className="absolute left-4 top-3.5 text-blue-400"
              />
            </div>
          </div>

          <div className="p-5 border-b border-blue-100 flex justify-between items-center">
            <h2 className="font-bold text-xl text-teal-700">My Patients</h2>
            <button className="p-2 rounded-lg bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors">
              <Users size={18} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {requests.map((request) => (
              <div
                key={request._id}
                onClick={() => setSelectedPatient(request)}
                className={`p-5 border-b border-blue-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                  selectedPatient?.id === request._id
                    ? "bg-blue-50 border-l-4 border-l-teal-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                  <div className="w-14 h-14 rounded-lg shadow-md flex items-center justify-center bg-teal-400 text-gray-800 text-lg font-bold">
                      {request.username?.charAt(0).toUpperCase() || "R"}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-md border-2 border-white ${
                        request.online ? "bg-teal-400" : "bg-gray-300"
                      }`}
                    ></span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {request.username || request.userEmail}
                    </h3>
                    <p className="text-sm text-blue-500">{request.condition}</p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          request.online ? "bg-teal-400" : "bg-gray-400"
                        } mr-2`}
                      ></span>
                      <span className="text-xs text-gray-500">
                        {request.online ? "Online now" : "Last seen 2h ago"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full" ref={docRef} id="doc">
        <div>
          <GetPatients docEmail={docEmail} className="w-full" />{" "}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;

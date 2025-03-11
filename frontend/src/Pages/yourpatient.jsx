import React, { useState, useEffect } from "react";
import { MessageSquare, Calendar, Users, Bell, Settings, Search, Send, Video, Phone, Plus, FileText, Clock } from "lucide-react";
import axios from "axios";
const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 1: Get email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email") || "";
    setEmail(storedEmail);
    console.log("Email retrieved:", storedEmail);
  }, []); // Runs only once when the component mounts

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

      const response = await axios.get("http://localhost:5000/api/auth/getreq", {
        params: { docEmail: email }  // Send email as a query parameter
      });


      console.log("Fetched data:", response.data);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, [email]);

  

  // Step 3: Handle loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Simpler sample data
  const connectionRequests = [
    { id: 1, name: 'Emma Thompson', condition: 'Migraine', image: '/api/placeholder/64/64' },
    { id: 2, name: 'James Wilson', condition: 'Back Pain', image: '/api/placeholder/64/64' }
  ];
  
  const patients = [
    { id: 1, name: 'Robert Brown', condition: 'Hypertension', image: '/api/placeholder/64/64', online: true },
    { id: 2, name: 'Linda Davis', condition: 'Diabetes', image: '/api/placeholder/64/64', online: false }
  ];

 
  
  if (isLoading) {

    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-300">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold text-white">MediSeek.ai</h1>
          <p className="text-teal-50 mt-2">Connecting healthcare professionals with patients</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-blue-50">
      {/* Navigation Sidebar */}
      <div className="w-20 bg-gradient-to-b from-teal-500 to-blue-400 flex flex-col items-center py-8 m-4 rounded-2xl">
        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-12 shadow-lg">
          <span className="text-teal-500 font-bold text-xl">M</span>
        </div>
        
        <nav className="flex flex-col items-center space-y-8">
          <button className="h-12 w-12 rounded-xl bg-white text-teal-500 flex items-center justify-center shadow-lg transform transition hover:scale-105">
            <MessageSquare size={20} />
          </button>
          <button className="h-12 w-12 rounded-xl bg-teal-400 text-white flex items-center justify-center transition hover:bg-teal-300">
            <Calendar size={20} />
          </button>
          <button className="h-12 w-12 rounded-xl bg-teal-400 text-white flex items-center justify-center transition hover:bg-teal-300">
            <Users size={20} />
          </button>
          <button className="h-12 w-12 rounded-xl bg-teal-400 text-white flex items-center justify-center transition hover:bg-teal-300">
            <FileText size={20} />
          </button>
          <button className="h-12 w-12 rounded-xl bg-teal-400 text-white flex items-center justify-center transition hover:bg-teal-300">
            <Bell size={20} />
          </button>
        </nav>
        
        <div className="mt-auto mb-6">
          <button className="h-12 w-12 rounded-xl bg-teal-400 text-white flex items-center justify-center transition hover:bg-teal-300">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Patient Requests Column */}
      <div className="w-72 bg-white shadow-md overflow-hidden m-4 rounded-2xl  flex flex-col">
        <div className="p-5 border-b border-blue-100">
          <h2 className="font-bold text-xl text-teal-700">Connection Requests</h2>
          <div className="flex items-center mt-1">
            <span className="w-3 h-3 bg-teal-400 rounded-full animate-pulse mr-2"></span>
            <p className="text-sm text-blue-500">{connectionRequests.length} new requests</p>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {connectionRequests.map(request => (
            <div key={request.id} className="p-5 border-b border-blue-100 hover:bg-blue-50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <img src={request.image} alt={request.name} className="w-14 h-14 rounded-lg object-cover shadow-md" />
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-teal-400 rounded-md border-2 border-white flex items-center justify-center">
                    <Plus size={12} className="text-white" />
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{request.name}</h3>
                  <p className="text-sm text-blue-500">{request.condition}</p>
                  <div className="flex items-center mt-1">
                    <Clock size={12} className="text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-sm">
                  Accept
                </button>
                <button className="py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      

      {/* Main Content / Chat Area */}
      <div className="flex-1 flex flex-col bg-blue-50 relative overflow-hidden">
        {selectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="p-5 bg-white shadow-sm border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={selectedPatient.image} alt={selectedPatient.name} className="w-12 h-12 rounded-lg shadow-sm" />
                <div>
                  <h2 className="font-bold text-xl text-gray-800">{selectedPatient.name}</h2>
                  <p className="text-sm text-blue-500">{selectedPatient.condition}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-3 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">
                  <Video size={18} />
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-6">
                <div className="flex justify-center my-4">
                  <span className="px-4 py-1 bg-blue-100 rounded-full text-sm text-blue-600">Today, 10:30 AM</span>
                </div>
                
                {/* Patient Message */}
                <div className="flex">
                  <img src={selectedPatient.image} alt={selectedPatient.name} className="w-10 h-10 rounded-lg mr-3 self-end" />
                  <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm max-w-md border border-blue-100">
                    <p className="text-gray-800">Hello Doctor, I've been experiencing more frequent headaches recently. They seem to be getting worse and affecting my daily activities.</p>
                    <span className="text-xs text-gray-400 mt-2 inline-block">10:30 AM</span>
                  </div>
                </div>
                
                {/* AI Suggestion */}
                <div className="flex justify-center">
                  <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200 max-w-md shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-md bg-teal-500 text-white flex items-center justify-center mr-2 text-xs font-bold">AI</div>
                      <span className="text-xs font-semibold text-teal-700">AI Assistant Suggestion</span>
                    </div>
                    <p className="text-sm text-gray-700">Consider asking about potential triggers like stress, screen time, or sleep patterns. This could help identify if these are tension headaches or migraines.</p>
                  </div>
                </div>
                
                {/* Doctor Message */}
                <div className="flex justify-end">
                  <div className="bg-teal-500 rounded-2xl rounded-tr-none p-4 text-white shadow-sm max-w-md">
                    <p>I'm sorry to hear that. Have you noticed any patterns with these headaches? For example, time of day, after certain activities, or related to stress?</p>
                    <span className="text-xs text-teal-100 mt-2 inline-block">10:32 AM</span>
                  </div>
                  <img src="/api/placeholder/40/40" alt="Doctor" className="w-10 h-10 rounded-lg ml-3 self-end" />
                </div>
                
                {/* Patient Message with GIF */}
                <div className="flex animate-fadeIn">
                  <img src={selectedPatient.image} alt={selectedPatient.name} className="w-10 h-10 rounded-lg mr-3 self-end" />
                  <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm max-w-md border border-blue-100">
                    <p className="mb-3 text-gray-800">They usually start in the afternoon after long hours on my computer. This is how I feel by the end of the day:</p>
                    <div className="rounded-xl overflow-hidden bg-blue-100 h-40 w-full flex items-center justify-center animate-pulse">
                      <Clock size={40} className="text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400 mt-2 inline-block">10:35 AM</span>
                  </div>
                </div>
                
                {/* Typing Indicator */}
                <div className="flex">
                  <img src={selectedPatient.image} alt={selectedPatient.name} className="w-10 h-10 rounded-lg mr-3 self-end" />
                  <div className="bg-blue-100 rounded-2xl rounded-bl-none p-3 shadow-sm inline-flex">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '200ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '400ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-5 bg-white border-t border-blue-100">
              <div className="flex bg-blue-50 rounded-xl border border-blue-100 p-1">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 py-3 px-4 bg-transparent focus:outline-none text-gray-700"
                />
                <button className="bg-teal-500 text-white rounded-lg px-5 hover:bg-teal-600 transition-colors flex items-center justify-center ml-2">
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center mt-3">
                <div className="flex items-center text-teal-700 bg-teal-50 rounded-full px-3 py-1 text-xs">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                  AI Assistant is active
                </div>
                <span className="text-xs text-gray-500 ml-3">Suggested responses enabled</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full p-10">
            <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-blue-100 max-w-lg">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 rounded-2xl text-teal-500 mb-6">
                <MessageSquare size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to MediSeek.ai</h2>
              <p className="text-gray-600 mb-8">
                Your AI-powered telemedicine platform. Select a patient from the list to start a consultation or respond to new connection requests.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <h3 className="text-3xl font-bold text-teal-600">12</h3>
                  <p className="text-sm text-gray-600">Patients</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <h3 className="text-3xl font-bold text-teal-600">5</h3>
                  <p className="text-sm text-gray-600">Appointments</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <h3 className="text-3xl font-bold text-teal-600">2</h3>
                  <p className="text-sm text-gray-600">Requests</p>
                </div>
              </div>
              <button className="bg-teal-500 text-white py-3 px-6 rounded-xl hover:bg-teal-600 transition-colors">
                Start a new consultation
              </button>
            </div>
          </div>
        )}
        
        
        {/* Animated Notification */}
        <div className="absolute bottom-24 right-6 bg-white rounded-xl shadow-lg p-4 flex items-center animate-slideUp border border-blue-100">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mr-3">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Appointment Reminder</p>
            <p className="text-xs text-blue-500">Video call with James Wilson in 15 minutes</p>
          </div>
        </div>
      </div>
      {/* Patients List Column */}
      <div className="w-80 bg-white shadow-md overflow-hidden m-4 rounded-2xl flex flex-col border-l border-r border-blue-100">
        <div className="p-5 border-b border-blue-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full py-3 pl-10 pr-4 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-blue-100"
            />
            <Search size={18} className="absolute left-4 top-3.5 text-blue-400" />
          </div>
        </div>
        
        <div className="p-5 border-b border-blue-100 flex justify-between items-center">
          <h2 className="font-bold text-xl text-teal-700">My Patients</h2>
          <button className="p-2 rounded-lg bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors">
            <Users size={18} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {patients.map(patient => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-5 border-b border-blue-100 hover:bg-blue-50 cursor-pointer transition-colors ${selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-l-teal-500' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={patient.image} alt={patient.name} className="w-14 h-14 rounded-lg object-cover shadow-sm" />
                  <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-md border-2 border-white ${patient.online ? 'bg-teal-400' : 'bg-gray-300'}`}></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                  <p className="text-sm text-blue-500">{patient.condition}</p>
                  <div className="flex items-center mt-1">
                    <span className={`w-2 h-2 rounded-full ${patient.online ? 'bg-teal-400' : 'bg-gray-400'} mr-2`}></span>
                    <span className="text-xs text-gray-500">{patient.online ? 'Online now' : 'Last seen 2h ago'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
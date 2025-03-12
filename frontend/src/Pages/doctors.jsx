import React from 'react';
import { Search, MapPin, Calendar, Clock, Star, Heart, MessageSquare, Filter, ArrowRight, Check, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorFinder = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState({});
  const [name, setName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [connect, setConnect] = useState(false);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports/doctors");
        if (!response.ok) throw new Error("Failed to fetch doctors");
        
        const data = await response.json();
        setDoctors(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  
  const handleConnect = async (email) => {
    const userEmail = localStorage.getItem("email"); // Get user email directly
    const username = localStorage.getItem("username");
    console.log("userEmail ::",userEmail);
    console.log("username ::",username);
    if (!userEmail) {
      alert("User email not found! Please log in.");
      return;
    }
    if (!username) {
      alert("User name not found! Please log in.");
      console.log("username ::",username);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/docconnection", {
        username: username,  // Change 'name' to 'username'
        docEmail: email,
        userEmail: userEmail,
        userAccepted: true, // or false based on user interaction
      });
  
      console.log("Response:", response.data);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to submit request.");
    }
  };
  

  const toggleFavorite = (doctorId) => {
    setFavorite(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }));
  };
  const handleuser = () => {
    window.location.href = "http://localhost:5173/dashboard";}

    useEffect(() => {
    const name= localStorage.getItem("username");
    setName(name);})

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Finding the best doctors for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <header className="relative bg-white/80 backdrop-blur-lg border-b border-gray-100 px-6 py-6 shadow-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 animate-fade-in">Find Your Doctor</h1>
            <p className="text-gray-600">Connect with top healthcare professionals through our AI-powered platform</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-blue-50 cursor-pointer transition-all">
              <User className="h-4 w-4 mr-2 " />
              <span className="font-medium  "><button onClick={handleuser}>My Profile</button></span>
            </div>
            <div className="relative">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold">{name.slice(0,1).toUpperCase()}</span>
              </div>
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <button 
              onClick={() => window.location.href = '/'} 
              className="flex cursor-pointer items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
             Back
            </button>
          </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6 space-y-6 relative z-10">
          {/* Search and filters */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md animate-slide-up">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-all group-focus-within:text-blue-500">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, specialty, or keywords..."
                className="pl-10 text-gray-800 pr-4 py-3 w-full border border-gray-200 rounded-lg group-focus-within:ring-2 group-focus-within:ring-blue-500 group-focus-within:border-blue-500 transition-all outline-none"
              />
            </div>
            
            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              <select className="border border-gray-200 text-gray-700 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none">
                <option>All Specialties</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
                <option>Dermatology</option>
              </select>
              
              <select className="border border-gray-200 text-gray-700 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none">
                <option>Any Availability</option>
                <option>Available Today</option>
                <option>Available This Week</option>
                <option>Weekends Only</option>
              </select>
              
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-all">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* AI Recommendation */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-5 rounded-xl shadow-sm border border-blue-100 flex items-start transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="bg-blue-500 text-white font-bold px-3 py-1 rounded-lg mr-4 text-sm">AI</div>
          <div>
            <p className="text-gray-700 font-medium">
              Based on your search history and health profile, we recommend consulting with a Cardiologist. 
              <a href="#" className="text-blue-600 hover:text-blue-800 ml-1 font-semibold transition-colors">See personalized recommendations</a>
            </p>
          </div>
        </div>
        
        {/* Filter Pills */}
        <div className="flex overflow-x-auto pb-2 gap-2 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <button 
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('all')}
          >
            All Doctors
          </button>
          <button 
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${activeFilter === 'top' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('top')}
          >
            Top Rated
          </button>
          <button 
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${activeFilter === 'available' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('available')}
          >
            Available Now
          </button>
          <button 
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${activeFilter === 'nearby' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('nearby')}
          >
            Nearby
          </button>
          <button 
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${activeFilter === 'telehealth' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('telehealth')}
          >
            Telehealth
          </button>
        </div>
        
        <div className="flex justify-between items-center animate-slide-up" style={{animationDelay: '0.3s'}}>
          <p className="text-gray-700 font-medium">Showing {doctors.length} doctors</p>
          <div className="flex gap-2">
            <button className="text-sm text-gray-700 px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all">
              Relevance ▼
            </button>
            <button className="text-sm text-gray-700 px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all">
              Distance ▼
            </button>
          </div>
        </div>
        
        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-400/20 to-indigo-400/20 h-40 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-100/20"></div>
                  <div className="z-10 bg-white p-3 rounded-full shadow-md transform transition-transform hover:scale-110">
                    <svg className="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {doctor.availableNow && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm animate-pulse">Available Now</span>
                )}
                <button 
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:shadow transition-all transform hover:scale-110"
                  onClick={() => toggleFavorite(index)}
                >
                  <Heart 
                    className={`h-5 w-5 ${favorite[index] ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                  />
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Dr. {doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-800 ml-1 font-bold">{doctor.rating}</span>
                    <span className="text-gray-500 text-xs ml-1">({doctor.reviewCount})</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600 group">
                    <div className="mr-2 p-1 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      <MapPin className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span>{doctor.hospital || doctor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 group">
                    <div className="mr-2 p-1 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      <Calendar className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span>Available: {doctor.availableDays.join(", ")}</span>                  </div>
                  
                  <div className="flex items-center text-gray-600 group">
                    <div className="mr-2 p-1 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      <Clock className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span>Timings: From {doctor.availableTimeStart} to {doctor.availableTimeEnd}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.badges && doctor.badges.map((badge, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors cursor-default">{badge}</span>
                  ))}
                </div>
                
                <p className="mt-4 text-gray-600 line-clamp-2">
                  Description : <span> </span>
                  {doctor.bio}
                </p>
                
                <div className="mt-5 grid grid-cols-7 gap-3">
                  <button onClick={() => handleConnect(doctor.email)} className="col-span-3 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center justify-center font-medium transition-all hover:scale-105">
                    <Calendar className="h-4 w-4 mr-2" />
                    Connect
                  </button>
                  <button className="col-span-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center font-medium transition-all hover:scale-105 shadow-sm hover:shadow">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </button>
                  <button className="col-span-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 border border-gray-200 rounded-lg transition-all hover:scale-105">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {doctors.length > 0 && (
          <div className="mt-8 flex justify-center animate-fade-in" style={{animationDelay: '0.5s'}}>
            <button className="bg-white border border-gray-200 hover:border-blue-500 text-blue-600 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md group">
              Load More Doctors
              <span className="inline-block ml-2 transition-transform group-hover:translate-y-1">▼</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white/80 backdrop-blur-lg py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Mediseek.ai All rights reserved.</p>
            <p className="mt-1">Finding the right healthcare professional made simple.</p>
          </div>
        </div>
      </footer>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default DoctorFinder;
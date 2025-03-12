import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  EyeIcon, 
  PencilIcon, 
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  UserIcon,
  StarIcon,
  BuildingOfficeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

const DoctorHistoryUI = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [doctor, setDoctor] = useState([]);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const emailpass = localStorage.getItem("email");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.post(
          "http://localhost:5000/api/auth/getdocdetails",
          { userEmail: emailpass }
        );

        console.log("API Response:", response.data);
        setDoctor(response.data);
        setIsLoading(false);
      } catch (err) {
        setDoctor([]);
        setError(err.response?.data?.message || "Something went wrong");
        setIsLoading(false);
      }
    };

    if (emailpass) {
      fetchDoctorDetails();
    }
  }, [emailpass]);

  const doctorInteractions = doctor.map((doctor) => ({
    id: doctor?._id || Math.random().toString(36).substr(2, 9),
    doctorName: doctor?.name || "Dr. John Doe",
    specialty: doctor?.specialty || "Not Given",
    date: doctor?.createdAt
      ? new Date(doctor.createdAt).toLocaleDateString()
      : "Not Given",
    time: doctor?.createdAt
      ? new Date(doctor.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "10:30 AM",
    location: doctor?.location || "Not Given",
    status: "completed",
    notes: doctor?.bio || "Not Given",
    AvailableTimings: [doctor?.availableTimeStart, doctor?.availableTimeEnd],
    followUp: doctor?.availableDays || [],
    doctorEmail: doctor?.email
      ? `${doctor.email.slice(0, 3)}...${doctor.email.slice(-9)}`
      : "Not Given",
    profileImage: doctor?.profileImage || `https://ui-avatars.com/api/?name=${doctor?.name || 'Doctor'}&background=0D8ABC&color=fff`,
    rating: doctor?.rating || Math.floor(Math.random() * 2) + 4,
    phone: doctor?.phone || "+1 (555) 123-4567"
  }));

  // Filter interactions based on status and search query
  const filteredInteractions = doctorInteractions
    .filter(interaction => 
      filterStatus === "all" || interaction.status === filterStatus
    )
    .filter(interaction => 
      interaction.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Sort by date (most recent first)
  const sortedInteractions = [...filteredInteractions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Generate star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon 
          key={i} 
          className={`h-4 w-4 inline ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`} 
        />
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="mt-8 mr-3 w-[950px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-400">Loading doctor records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 mr-3 w-[950px] mx-auto">
        <div className="bg-red-900 text-red-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 mr-3 w-[950px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Doctors' History
        </motion.h2>
        
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              className="px-4 py-2 rounded-full bg-[#1d3b6e] focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="h-5 w-5 absolute right-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <select
            className="px-4 py-2 rounded-full bg-[#1d3b6e] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Records</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {sortedInteractions.length === 0 ? (
        <motion.div 
          className="bg-[#112b5e] rounded-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <svg
            className="h-16 w-16 mx-auto text-blue-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No doctor records found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <div className="relative pl-8 border-l-2 border-blue-500 ml-8">
          {sortedInteractions.map((interaction, index) => (
            <motion.div
              key={interaction.id}
              className="mb-8 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Timeline dot with pulse effect */}
              <div className="absolute left-[-1.55rem] top-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    interaction.status === "completed"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <div
                  className={`absolute w-8 h-8 rounded-full -left-2 -top-2 ${
                    interaction.status === "completed"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  } opacity-30 animate-ping`}
                  style={{ animationDuration: "3s" }}
                ></div>
              </div>

              {/* Appointment card */}
              <div 
                className={`bg-[#112b5e] rounded-xl p-5 hover:shadow-lg transition-all duration-300 ${
                  expandedId === interaction.id ? 'ring-2 ring-blue-400 shadow-xl' : 'hover:bg-[#14316c]'
                }`}
              >
                {/* Top section with doctor info - always visible */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400">
                      <img 
                        src={interaction.profileImage} 
                        alt={interaction.doctorName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                        {interaction.doctorName}
                      </h3>
                      <p className="text-blue-400 mb-1">{interaction.specialty}</p>
                      <div className="flex items-center">
                        {renderStars(interaction.rating)}
                        <span className="ml-2 text-sm text-gray-300">{interaction.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-[#1d3b6e] px-3 py-1 rounded-lg mb-2 inline-block">
                      <CalendarDaysIcon className="h-4 w-4 inline mr-1 text-blue-400" />
                      <span className="text-sm">{interaction.date}</span>
                    </div>
                    <div className="bg-[#1d3b6e] px-3 py-1 rounded-lg mb-2 inline-block ml-2">
                      <ClockIcon className="h-4 w-4 inline mr-1 text-blue-400" />
                      <span className="text-sm">{interaction.time}</span>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          interaction.status === "completed"
                            ? "bg-green-900 text-green-300"
                            : "bg-blue-900 text-blue-300"
                        }`}
                      >
                        {interaction.status === "completed"
                          ? "Completed"
                          : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview cards - shown when not expanded */}
                {expandedId !== interaction.id && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4 mb-3">
                    <div className="bg-[#1d3b6e] p-3 rounded-lg flex items-center group hover:bg-[#2a4d85] transition-colors cursor-pointer">
                      <BuildingOfficeIcon className="h-8 w-8 mr-3 text-blue-400 p-1 bg-blue-900 rounded-lg group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="text-xs text-gray-300">Location</h4>
                        <p className="text-sm font-medium">{interaction.location}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#1d3b6e] p-3 rounded-lg flex items-center group hover:bg-[#2a4d85] transition-colors cursor-pointer">
                      <ClockIcon className="h-8 w-8 mr-3 text-blue-400 p-1 bg-blue-900 rounded-lg group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="text-xs text-gray-300">Available Time</h4>
                        <p className="text-sm font-medium">
                          {interaction.AvailableTimings?.[0] || "N/A"} - {interaction.AvailableTimings?.[1] || "N/A"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-[#1d3b6e] p-3 rounded-lg flex items-center group hover:bg-[#2a4d85] transition-colors cursor-pointer">
                      <PhoneIcon className="h-8 w-8 mr-3 text-blue-400 p-1 bg-blue-900 rounded-lg group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="text-xs text-gray-300">Contact</h4>
                        <p className="text-sm font-medium">{interaction.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes preview (truncated) - shown when not expanded */}
                {expandedId !== interaction.id && interaction.notes && interaction.notes.length > 30 && (
                  <div className="mt-3 bg-[#1a3563] p-3 rounded-lg border-l-4 border-blue-400">
                    <h4 className="text-xs text-gray-300 mb-1 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1 text-blue-400" />
                      Description Preview
                    </h4>
                    <p className="text-sm italic">"{interaction.notes.substring(0, 100)}..."</p>
                  </div>
                )}

                {/* Action buttons - always visible */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-[#1d3b6e] hover:bg-[#2a4d85] rounded-lg text-sm flex items-center transition-colors">
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    {interaction.status === "completed" && (
                      <button className="px-3 py-1.5 bg-[#1d3b6e] hover:bg-[#2a4d85] rounded-lg text-sm flex items-center transition-colors group">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1 group-hover:animate-bounce" />
                        Download
                      </button>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => toggleExpand(interaction.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center transition-colors"
                  >
                    {expandedId === interaction.id ? 'View Less' : 'View Details'}
                    <ChevronDownIcon 
                      className={`w-4 h-4 ml-1 transition-transform ${expandedId === interaction.id ? 'rotate-180' : ''}`} 
                    />
                  </button>
                </div>

                {/* Expanded content */}
                {expandedId === interaction.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-blue-900"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
                      <div className="bg-[#1d3b6e] p-3 rounded-lg hover:bg-[#223d6c] transition-colors flex">
                        <MapPinIcon className="h-5 w-5 mr-2 text-blue-400" />
                        <div>
                          <h4 className="text-sm text-gray-300 mb-1">Location</h4>
                          <p>{interaction.location}</p>
                        </div>
                      </div>

                      <div className="bg-[#1d3b6e] p-3 rounded-lg hover:bg-[#223d6c] transition-colors flex">
                        <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-400" />
                        <div>
                          <h4 className="text-sm text-gray-300 mb-1">Available Days</h4>
                          <p>
                            {interaction.followUp && Array.isArray(interaction.followUp) && interaction.followUp.length > 0
                              ? interaction.followUp.map((day) => day.slice(0, 3)).join(", ")
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-900 p-4 rounded-lg shadow-md col-span-2 grid grid-cols-2 gap-4 hover:bg-[#1a3a7a] transition-colors">
                        <div className="flex items-start">
                          <ClockIcon className="h-5 w-5 mr-2 text-blue-400 mt-1" />
                          <div>
                            <h4 className="text-gray-300 text-sm font-medium mb-1">
                              Available Timings
                            </h4>
                            <p className="text-white text-base">
                              {interaction.AvailableTimings?.[0] || "N/A"} to{" "}
                              {interaction.AvailableTimings?.[1] || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-400 mt-1" />
                          <div>
                            <h4 className="text-gray-300 text-sm font-medium mb-1">
                              Doctor Email
                            </h4>
                            <p className="text-white text-base">
                              {interaction.doctorEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-[#1d3b6e] p-3 rounded-lg hover:bg-[#223d6c] transition-colors">
                      <div className="flex items-start">
                        <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-400 mt-1" />
                        <div>
                          <h4 className="text-sm text-gray-300 mb-1">Full Description</h4>
                          <p className="text-sm">{interaction.notes}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorHistoryUI;
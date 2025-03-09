import React, { useState } from "react";

const DoctorHistoryUI = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Sample doctor interaction data
  const doctorInteractions = [
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "February 15, 2025",
      time: "10:30 AM",
      location: "Heart Care Center",
      status: "completed",
      notes: "Regular checkup. Blood pressure slightly elevated. Recommended reducing sodium intake and increasing physical activity.",
      prescriptions: ["Lisinopril 10mg", "Aspirin 81mg"],
      followUp: "3 months"
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialty: "Neurologist",
      date: "January 23, 2025",
      time: "2:15 PM",
      location: "Neurology Associates",
      status: "completed",
      notes: "Patient reported occasional headaches. MRI results normal. Recommended keeping a headache journal.",
      prescriptions: ["Sumatriptan 50mg (as needed)"],
      followUp: "6 months"
    },
    {
      id: 3,
      doctorName: "Dr. Robert Williams",
      specialty: "Orthopedic Surgeon",
      date: "March 12, 2025",
      time: "9:00 AM",
      location: "Orthopedic Specialists",
      status: "upcoming",
      notes: "Pre-surgical consultation for knee arthroscopy.",
      prescriptions: [],
      followUp: "Post-surgery"
    },
    {
      id: 4,
      doctorName: "Dr. Emily Patel",
      specialty: "Endocrinologist",
      date: "December 10, 2024",
      time: "11:45 AM",
      location: "Endocrine Health Center",
      status: "completed",
      notes: "Annual thyroid checkup. TSH levels normal. Continuing current medication regimen.",
      prescriptions: ["Levothyroxine 75mcg"],
      followUp: "12 months"
    },
    {
      id: 5,
      doctorName: "Dr. James Wilson",
      specialty: "Dermatologist",
      date: "March 22, 2025",
      time: "3:30 PM",
      location: "Dermatology Clinic",
      status: "upcoming",
      notes: "Appointment for annual skin check.",
      prescriptions: [],
      followUp: "TBD"
    }
  ];
  
  // Filter interactions based on status
  const filteredInteractions = filterStatus === "all" 
    ? doctorInteractions 
    : doctorInteractions.filter(interaction => interaction.status === filterStatus);
  
  // Sort by date (most recent first)
  const sortedInteractions = [...filteredInteractions].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Doctors' History</h2>
        <div className="flex gap-4">
          <div className="flex items-center bg-gray-800 rounded-lg p-2">
            <select 
              className="bg-gray-800 text-white outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Appointments</option>
              <option value="completed">Past Appointments</option>
              <option value="upcoming">Upcoming Appointments</option>
            </select>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Appointment
          </button>
        </div>
      </div>
      
      {/* Timeline View */}
      <div className="relative pl-8 border-l-2 border-blue-500 ml-8">
        {sortedInteractions.map((interaction, index) => (
          <div key={interaction.id} className="mb-8 relative">
            {/* Timeline dot */}
            <div className={`absolute w-4 h-4 rounded-full left-[-1.55rem] top-2 ${interaction.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            
            {/* Appointment card */}
            <div className="bg-[#112b5e] rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{interaction.doctorName}</h3>
                  <p className="text-blue-400">{interaction.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg">{interaction.date}</p>
                  <p className="text-sm text-gray-300">{interaction.time}</p>
                  <span className={`inline-block px-3 py-1 mt-2 rounded-full text-xs font-semibold ${
                    interaction.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                  }`}>
                    {interaction.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
                <div className="bg-[#1d3b6e] p-3 rounded-lg">
                  <h4 className="text-sm text-gray-300 mb-1">Location</h4>
                  <p>{interaction.location}</p>
                </div>
                
                <div className="bg-[#1d3b6e] p-3 rounded-lg">
                  <h4 className="text-sm text-gray-300 mb-1">Follow-up</h4>
                  <p>{interaction.followUp}</p>
                </div>
                
                <div className="bg-[#1d3b6e] p-3 rounded-lg col-span-2">
                  <h4 className="text-sm text-gray-300 mb-1">Prescriptions</h4>
                  {interaction.prescriptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {interaction.prescriptions.map((prescription, idx) => (
                        <span key={idx} className="bg-[#0a1a3c] px-2 py-1 rounded-lg text-xs">
                          {prescription}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No prescriptions</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 bg-[#1d3b6e] p-3 rounded-lg">
                <h4 className="text-sm text-gray-300 mb-1">Notes</h4>
                <p className="text-sm">{interaction.notes}</p>
              </div>
              
              <div className="flex justify-end mt-4 gap-3">
                <button className="px-3 py-1 bg-[#1d3b6e] hover:bg-[#2a4d85] rounded-lg text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
                {interaction.status === 'completed' && (
                  <button className="px-3 py-1 bg-[#1d3b6e] hover:bg-[#2a4d85] rounded-lg text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Report
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedInteractions.length === 0 && (
        <div className="bg-[#112b5e] rounded-xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16.5c2.76 0 5-2.24 5-5a4.992 4.992 0 00-.127-1.111A5.002 5.002 0 0017 5.5 5.002 5.002 0 0012 .5a5.002 5.002 0 00-5 5 5.002 5.002 0 00.127 1.111A4.992 4.992 0 007 11.5a4.992 4.992 0 005 5z" />
          </svg>
          <h3 className="text-xl font-medium mb-2">No appointments found</h3>
          <p className="text-gray-400 mb-4">There are no appointments matching your current filter.</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Schedule an Appointment
          </button>
        </div>
      )}
      
      {filteredInteractions.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="text-blue-400 hover:text-blue-300 flex items-center">
            <span>View All Doctor History</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorHistoryUI;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SignupModal from "./Signup";
const ClientsPage = () => {
 
  
 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userName, setUserName] = useState(null);
    const [clients, setClients] = useState([]);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
  
    
  
    useEffect(() => {
      const storedUserName = localStorage.getItem('username');
      if (storedUserName) {
        setUserName(storedUserName);
      }
  
      const fetchReports = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error("No auth token found. Redirecting to login.");
          return;
        }
      
        try {
          const { data } = await axios.get('http://localhost:5000/api/reports/reports', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setClients(data);
        } catch (error) {
          console.error('Error fetching reports:', error.response?.data || error.message);
          if (error.response?.status === 401) {
            alert("Session expired. Please log in again.");
          }
        }
      };
      
  
      fetchReports();
    }, []);
  
 
  const handleLogout = async () => {
    try {
      // Send a request to the backend to log out
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      // Clear the username from localStorage and state
      localStorage.removeItem("username");
      setUserName(null);

      // Redirect to login page or homepage
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  useEffect(() => {
    // Fetch user name from localStorage or any other global state if logged in
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    }

   
  });
  
  useEffect(() => {
    // Simulate a 4-5 second loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    }

  

    
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <img src="/load-2765.gif" alt="Loading..." className="w-[500px] h-[500px]" />
      </div>
    );
  }

  return (
<div className="w-full flex justify-center items-center min-h-screen lg:px-[80px] px-[10px] lg:py-[50px] py-[20px] bg-gray-100">        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 shadow-md bg-[#edf8fc] z-50">
          <div className="text-2xl font-semibold text-gray-700">
            mediseek.<span className="text-gray-500">ai</span>
          </div>
          <div className="hidden text-xl font-extrabold cursor-pointer md:flex font-mono space-x-6 text-[#434545]">
            {["Home", "Your Reports", "Dashboard", "About", "Vault"].map((item) => (
                 <li
                 key={item}
                 className="px-4 py-2 hover:border-2 rounded-xl border-gray-800 list-none"
               >
                 {item === "Your Reports" ? (
                   <Link to="/History" className="text-[#434545]">
                     {item}
                   </Link>
                 ) : item === "Home" ? (
                   <Link to="/" className="text-[#434545]">
                     {item}
                   </Link>
                 ) : (
                   item
                 )}
               </li>
               
            ))}
          </div>
          {/* If user is logged in, show first letter of username */}
          {userName ? (
            <button  onClick={handleLogout} className="bg-teal-400 text-black px-4 py-2 rounded-lg">
                          Get Out ⮞
                          {/* Display first letter of the username */}
            </button>
          ) : (
            <button
              onClick={() => setIsSignupOpen(true)}
              className="bg-teal-400 text-black px-4 py-2 rounded-lg hover:bg-teal-500"
            >
              Get In ⮞
            </button>
          )}

          {/* Signup Modal (Controlled by isSignupOpen) */}
          <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
        </nav>
        <div className="w-[1400px] min-h-[500px] lg:px-[120px] px-[30px] lg:py-[50px] py-[20px] 
      bg-white/20 backdrop-blur-2xl   shadow-2xl 
      rounded-[40px] border-4 border-[#d5eef8] mt-14">       
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="lg:text-2xl text-[18px] font-semibold text-gray-700">Hello 👋🏻 {userName}</h1>
            <p className="text-gray-500 lg:text-[18px] text-[12px]">View All of our Reports Here</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="lg:text-[16px] text-[14px] bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              ￩ Go Home
            </button>
            <button className="lg:text-[16px] text-[14px] bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              + New Report
            </button>
          </div>
        </div>
        <div className='w-full h-[1px] bg-gray-200 mb-8'></div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-white px-4 py-2 border-[1px] border-zinc-300 text-black rounded-[20px] lg:text-[18px] text-[12px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-2.5"></span>
            </div>
          </div>
          <button className="lg:text-[16px] text-[14px] px-4 py-2 bg-emerald-500 text-white rounded-lg">Reset</button>
        </div>

        {/* Clients Table */}
        <div className="rounded-lg mt-[50px]">
          <table className="w-full border-separate border-spacing-y-5">
            <thead className="bg-slate-50 pb-[10px]">
              <tr>
                <th className="px-6 py-3 text-left lg:text-[12px] text-[10px] font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left lg:text-[12px] text-[10px] font-medium text-gray-500 uppercase">Report</th>
                <th className="px-6 py-3 text-left lg:text-[12px] text-[10px] font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left lg:text-[12px] text-[10px] font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left lg:text-[12px] text-[10px] font-medium text-gray-500 uppercase">Lab</th>
                <th className="px-6 py-3 text-left lg:text-[12px] text-[10px] font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left lg:text-[12px] text-[10px] font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.filter(client => client.patientName.toLowerCase().includes(searchQuery.toLowerCase())).map((client) => (
                <tr key={client._id} className="hover:bg-gray-50 bg-white border-[1px] border-black shadow-sm">
                  <td className="px-6 py-4 text-stone-600 lg:text-[14px] text-[12px] font-medium">{client._id}</td>
                  <td className="px-6 py-4 flex items-center gap-3 lg:text-[14px] text-[12px] text-stone-600 font-medium">
                    {client.patientName}
                  </td>
                  <td className="px-6 py-4 text-stone-600 lg:text-[14px] text-[12px] font-medium">{client.testType}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 font-medium rounded-full text-sm">
                      {client.location || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className='text-stone-600 lg:text-[14px] text-[12px] font-medium'>{client.userId}</span>
                  </td>
                  <td className="px-6 py-4 text-stone-600 lg:text-[14px] text-[12px] font-medium">
                    {new Date(client.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#dbeafe] text-[#4e98f9] lg:text-[14px] text-[12px] rounded">Analyze</button>
                      <a href={client.supabaseUrl} target="_blank" className="px-3 py-1 bg-emerald-100 text-emerald-800 lg:text-[14px] text-[12px] rounded">Download</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;

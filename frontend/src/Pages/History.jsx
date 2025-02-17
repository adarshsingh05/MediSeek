import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ClientsPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrokerage, setSelectedBrokerage] = useState('All Brokerages');

  const clients = [
    {
      id: '20439',
      name: 'John Doe',
      broker: 'Century 21 Town & Country',
      location: 'Northville, MI',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      date: '10/09/2016',
      avatar: '/avatars/john-doe.jpg',
    },
    {
      id: '20439',
      name: 'John Doe',
      broker: 'Century 21 Town & Country',
      location: 'Northville, MI',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      date: '10/09/2016',
      avatar: '/avatars/john-doe.jpg',
    },
    {
      id: '20439',
      name: 'John Doe',
      broker: 'Century 21 Town & Country',
      location: 'Northville, MI',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      date: '10/09/2016',
      avatar: '/avatars/john-doe.jpg',
    },
    {
      id: '20439',
      name: 'John Doe',
      broker: 'Century 21 Town & Country',
      location: 'Northville, MI',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      date: '10/09/2016',
      avatar: '/avatars/john-doe.jpg',
    },
    {
      id: '20439',
      name: 'John Doe',
      broker: 'Century 21 Town & Country',
      location: 'Northville, MI',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      date: '10/09/2016',
      avatar: '/avatars/john-doe.jpg',
    },
  ];

  return (
    <div className="w-full min-h-screen lg:px-[120px] px-[30px] lg:py-[50px] py-[20px] bg-slate-50 border-4 border-[#7ae2ef] rounded-4xl">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="lg:text-2xl text-[18px] font-semibold text-gray-700">User Name</h1>
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
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 bg-white border-[1px] border-black shadow-sm">
                <td className="px-6 py-4 text-stone-600 lg:text-[14px] text-[12px] font-medium">{client.id}</td>
                <td className="px-6 py-4 flex items-center gap-3 lg:text-[14px] text-[12px] text-stone-600 font-medium">
                  <div className="lg:w-8 w-6 lg:h-8 h-6 rounded-full overflow-hidden">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {client.name}
                </td>
                <td className="px-6 py-4 text-stone-600 lg:text-[14px] text-[12px] font-medium">{client.broker}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 font-medium rounded-full text-sm">
                    {client.location}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className='text-stone-600 lg:text-[14px] text-[12px] font-medium'>{client.email}</span>
                    <span className="text-stone-600 lg:text-[14px] text-[12px] font-medium">{client.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-600 lg:text-[14px] text-[12px] font-medium">{client.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-emerald-100 text-emerald-800 lg:text-[14px] text-[12px] rounded">Analyze</button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 lg:text-[14px] text-[12px] rounded">Download</button>
                    <button className="text-red-500">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
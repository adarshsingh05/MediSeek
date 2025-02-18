import { useState } from "react";
import DashboardUI from "./dsectionone";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleNavigation = (section) => {
    setActiveSection(section);
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-[#0a1a3c] text-white ">
      {/* Sidebar */}
      <aside className="w-64 p-5 bg-[#112b5e] flex flex-col fixed h-full rounded-2xl m-2 mb-2">
        <div className="flex flex-row p-2">
        <img className="h-7 w-6 ml-2 mr-3" src="/docl.png"></img>
        <h1 className="text-xl font-bold">medicus.ai</h1>
        
        </div>
        <div className="h-[1px] w-[212px] bg-gray-200 rounded-4xl" ></div>
        <nav className="mt-5">
          <ul>
            <li className={`p-2 rounded-lg cursor-pointer flex flex-row  ${activeSection === 'dashboard' ? 'bg-blue-600' : ''}`} onClick={() => handleNavigation('dashboard')}><img className="mr-3 ml-2 w-5 h-5.5" src='/home.svg'></img>Dashboard</li>
            <li className={`p-2 rounded-lg mt-2 cursor-pointer flex flex-row ${activeSection === 'reports' ? 'bg-blue-600' : ''}`} onClick={() => handleNavigation('reports')}> <img className="mr-3 ml-2 w-5 h-5.5" src='/Path.svg'></img>Reports</li>
            <li className={`p-2 rounded-lg mt-2 cursor-pointer flex flex-row ${activeSection === 'goals' ? 'bg-blue-600' : ''}`} onClick={() => handleNavigation('goals')}> <img className="mr-3 ml-2 w-5 h-5.5" src='/he.svg'></img>  Goals</li>
            <li className={`p-2 rounded-lg mt-2 cursor-pointer flex flex-row ${activeSection === 'reminders' ? 'bg-blue-600' : ''}`} onClick={() => handleNavigation('reminders')}><img className="mr-3 ml-2 w-6 h-6" src='/cal.svg'></img>Reminders</li>
            <li className={`p-2 rounded-lg mt-2 cursor-pointer flex flex-row ${activeSection === 'settings' ? 'bg-blue-600' : ''}`} onClick={() => handleNavigation('settings')}> <img className="mr-3 ml-2 w-5 h-5.5" src='/Settings.svg'></img>Settings</li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 ml-64 mr-72 overflow-y-auto">
        <section id="dashboard" className="min-h-screen ">
          <div className="flex justify-between items-center ml-4">
            <h2 className="text-2xl font-bold ml-[-25px]">pages / Dashboard</h2>
            <div className="flex items-center gap-4 ml-4 ">
              <input
                type="text"
                placeholder="Search any keywords"
                className="p-2 rounded-md w-[500px]  bg-gray-800 text-white"
              />
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6 ml-9 mr-10">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3> 0 Reports Uploaded So Far...</h3>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="flex flex-row justify-around"> <p className="text-red-300">Latest Risk : </p> <p>Nothing , All Safe</p></h3>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-blue-500">Get AI's View on your Reports</h3>
            </div>
          </div>
          <DashboardUI/>
        </section>
        
        {/* Reports Section */}
        <section id="reports" className="min-h-screen flex items-center justify-center">
          <div>
            <h2 className="text-xl font-bold">Reports</h2>
            <p className="mt-2">This is the Reports section with dummy data.</p>
          </div>
        </section>
        
        {/* Goals Section */}
        <section id="goals" className="min-h-screen flex items-center justify-center">
          <div>
            <h2 className="text-xl font-bold">Goals</h2>
            <p className="mt-2">This is the Goals section with dummy data.</p>
          </div>
        </section>
        
        {/* Reminders Section */}
        <section id="reminders" className="min-h-screen flex items-center justify-center">
          <div>
            <h2 className="text-xl font-bold">Reminders</h2>
            <p className="mt-2">This is the Reminders section with dummy data.</p>
          </div>
        </section>
        
        {/* Settings Section */}
        <section id="settings" className="min-h-screen flex items-center justify-center">
          <div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="mt-2">This is the Settings section with dummy data.</p>
          </div>
        </section>
      </main>
      
      {/* Right Sidebar */}
      <aside className="w-72 p-5 bg-[#112b5e] fixed right-0 h-full mr-3 mt-2 mb-2 rounded-2xl">
        <div className="text-center">
          <h3>Charles Robbie</h3>
          <p>25 years old | New York, USA</p>
          <p>Blood: O+ | Height: 186cm | Weight: 90kg</p>
        </div>
      </aside>
    </div>
  );
}

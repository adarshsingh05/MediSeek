import React from "react";

export default function DashboardUI() {
  return (
    <div className="p-6 bg-[#0a1a3c] text-white min-h-screen">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 ml-5">Dashboard Overview</h2>

      {/* Welcome Card */}
      <div className="h-[150px] ml-5 w-[840px] bg-gradient-to-r from-blue-500 to-green-400 p-6 rounded-xl flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold">Hello Tassy Omah,</h3>
          <p>Have a nice day and don’t forget to take care of your health!</p>
        </div>
        <div className="w-40 h-40 mb-4">
          <img
            className="w-full h-full mb-2"
            src="/med.svg"
            alt="Meditation Illustration"
          />
        </div>
      </div>

      
        <div class="border-2 border-blue-400 h-auto rounded-2xl mb-4 w-[900px] p-4 bg-transparent shadow-md">
          <div class="grid grid-cols-6 gap-4 text-gray-200 border-b pb-2 mb-2">
            <div class="font-semibold ml-2">ID</div>
            <div class="font-semibold">Patient Name</div>
            <div class="font-semibold">Report Type</div>
            <div class="font-semibold">Date</div>
            <div class="font-semibold">Conclusion</div>
            <div class="font-semibold">Actions</div>
          </div>

          <div class="grid grid-cols-6 gap-4 items-center text-gray-200 hover:text-black bg-black py-2 hover:bg-gray-100 transition-all duration-200 rounded-lg p-2">
            <div class="ml-2">1</div>
            <div>Annual Report</div>
            <div>Finance</div>
            <div>2024-02-18</div>
            <div class="text-green-500 font-medium">Approved</div>
            <div class="flex flex-row justify-start ml-[-50px] space-x-2">
              <button class="text-blue-500 hover:text-blue-700 transition cursor-pointer">
                Score
              </button>
              <button class="text-teal-500 hover:text-teal-700 transition cursor-pointer">
                Summary
              </button>
              <button class="text-red-500 hover:text-red-700 transition cursor-pointer">
                Switch
              </button>
            </div>
          </div>
        </div>
        

       
      

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#112b5e] p-4 rounded-lg flex flex-col items-center">
          <h3 className="text-xl font-bold">202/3000</h3>
          <p>Steps taken</p>
        </div>
        <div className="bg-[#112b5e]/50 backdrop-blur-lg p-4 rounded-lg flex flex-col items-center w-[600px] shadow-md shadow-[#00b6c7]">
          <div className="flex flex-row ">
            <h3 className="text-xl font-bold flex flex-row justify-around ">
              Report Review In Leyman Terms
            </h3>{" "}
            <button className="ml-48 flex flex-row py-[2px] cursor-pointer  rounded-md px-[6px] bg-[#0a1a3c] ">
              <img src="file.png" className="h-6 w-6 mr-[5px] invert"></img>
            </button>
          </div>
          <p className="mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            varius erat id libero fermentum, a cursus odio auctor. Vivamus nec
            felis eget risus tincidunt sollicitudin at id justo. Mauris vehicula
            dolor vel ex vulputate, et auctor libero iaculis. Ut consectetur
            magna vitae velit cursus, eget facilisis libero dapibus. Nunc
            tristique lectus non massa interdum, at lacinia ante gravida. Proin
            iaculis hendrerit urna, sit amet laoreet urna laoreet id.
            Suspendisse bibendum sem at justo gravida, in auctor lectus
            venenatis. Phasellus id nibh vel augue facilisis volutpat. Aenean
            volutpat, odio at lobortis tempor, odio leo sodales nunc.
          </p>
        </div>
      </div>

      {/* Fitness Activity Chart Placeholder */}
      <div className="bg-[#112b5e] p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold">Fitness Activity</h3>
        <div className="h-40 bg-gray-800 rounded-md flex items-center justify-center">
          <p>Chart Placeholder</p>
        </div>
      </div>

      {/* Hours of Sleep Card */}
      <div className="bg-[#112b5e] p-6 rounded-lg mt-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Hours of sleep</h3>
          <p>330 mins yesterday</p>
        </div>
        <div className="text-2xl font-bold text-green-400">12% Increment</div>
      </div>

      {/* Reminders and Reports */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-[#112b5e] p-4 rounded-lg">
          <h3 className="text-xl font-bold">Reminders</h3>
          <p>48 min Stretching</p>
          <p>32 min Mind training</p>
        </div>
        <div className="bg-[#112b5e] p-4 rounded-lg">
          <h3 className="text-xl font-bold">Reports</h3>
          <p>Weight loss - 80% decrease</p>
          <p>General health - 76% increase</p>
        </div>
        <div className="bg-[#112b5e] p-4 rounded-lg flex flex-col items-center">
          <h3 className="text-2xl font-bold">86%</h3>
          <p>You have achieved 86% of your goals this month</p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const dummyData = [
        { name: "Jan", value: 30 },
        { name: "Feb", value: 50 },
        { name: "Mar", value: 40 },
        { name: "Apr", value: 60 },
        { name: "May", value: 80 },
        { name: "Jun", value: 90 },
      ];
      const reportData = [
        { reportId: "R001", name: "John Doe", date: "2024-02-15", parameters: "Blood Sugar, Hemoglobin" },
        { reportId: "R002", name: "Jane Smith", date: "2024-02-16", parameters: "Cholesterol, WBC Count" },
      ];
  return (
    <>
    <div className="bg-teal-900 text-white min-h-screen p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-lightBlue-300 mb-4">Mediseek.ai</h1>
      <p className="text-center text-lg text-lightBlue-200 mb-6">Individual Report Analysis (Main Page)</p>

      {/* Report Table */}
      <div className="bg-teal-400 p-4 rounded-lg shadow-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-lightBlue-300 uppercase text-left">
              <th className="px-4 py-2 text-teal-900">ID</th>
              <th className="px-4 py-2 text-teal-900">Report Name</th>
              <th className="px-4 py-2 text-teal-900">Report Type</th>
              <th className="px-4 py-2 text-teal-900">Date</th>
              <th className="px-4 py-2 text-teal-900">Conclusion</th>
              <th className="px-4 py-2 text-teal-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-teal-700 rounded-lg">
              <td className="px-4 py-2">00192</td>
              <td className="px-4 py-2">Yasaswini Singh</td>
              <td className="px-4 py-2">Blood Report</td>
              <td className="px-4 py-2">2/01/2005</td>
              <td className="px-4 py-2 text-red-400">Severe</td>
              <td className="px-4 py-2 flex space-x-4">
                <button className="text-lightBlue-400 underline">Check Score</button>
                <button className="text-lightBlue-400 underline">Summary</button>
                <button className="text-red-400 underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Report Features & Layman Analysis Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Extracted Report Features */}
        <div className="bg-teal-400 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-teal-900 mb-2">Extracted Report Features</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-lightBlue-300 uppercase text-left">
                <th className="px-4 py-2 text-teal-900">Test Description</th>
                <th className="px-4 py-2 text-teal-900">Result</th>
                <th className="px-4 py-2 text-teal-900">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-teal-700">
                <td className="px-4 py-2">Hemoglobin</td>
                <td className="px-4 py-2">13.5</td>
                <td className="px-4 py-2">12-16 g/dL</td>
              </tr>
              <tr className="bg-teal-700">
                <td className="px-4 py-2">WBC Count</td>
                <td className="px-4 py-2">7.4</td>
                <td className="px-4 py-2">4-11 x10^9/L</td>
              </tr>
            </tbody>
          </table>
          <button className="bg-lightBlue-400 text-teal-900 px-4 py-2 mt-4 rounded">Download EHR</button>
        </div>

        {/* Report Analysis in Layman Terms */}
        <div className="bg-teal-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-lightBlue-300 mb-2">Layman Report Analysis</h2>
          <p className="text-lightBlue-200 text-sm">
            Your blood test report suggests a possible condition related to low hemoglobin levels.
            Please consult a specialist for further diagnosis.
          </p>
          <button className="bg-lightBlue-400 text-white px-4 py-2 mt-4 rounded">Read Aloud</button>
        </div>
      </div>

      {/* AI-Powered Prediction */}
      <div className="bg-teal-800 p-4 rounded-lg shadow-lg mt-6">
        <p className="text-lightBlue-400 text-sm">
          AI-Powered Prediction and Diagnosis Section (To be implemented)
        </p>
      </div>

      {/* Chat with Bot */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-lightBlue-400 text-white px-4 py-2 rounded-full shadow-lg">
          Chat with Report / BOT
        </button>
      </div>
    </div>

    {/* charts Section */}
    <div className="bg-teal-900 text-white min-h-screen p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-lightBlue-300 mb-4">Mediseek.ai</h1>
      <p className="text-center text-lg text-lightBlue-200 mb-6">Individual Report Analysis</p>

      {/* Top Section: Four Line Charts */}
      <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3, 4].map((chart, index) => (
          <div key={index} className="bg-white bg-opacity-10 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-lightBlue-300">Graph {chart}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dummyData}>
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", color: "#000" }} />
                <Line type="monotone" dataKey="value" stroke="#00c6ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
       {/* Bottom Section: Text Boxes */}
      <div className="grid grid-cols-2 gap-6 mt-6 max-w-6xl mx-auto">
        {/* Left Box: EHR According to Labs */}
        <div className="bg-teal-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-lightBlue-300">
            EHR According to Labs (Reviews)
          </h2>
          <p className="text-lightBlue-200 text-sm">
            This section provides an overview of lab test results and reviews from previous records.
          </p>
        </div>

        {/* Right Box: AI Lifestyle Recommendation */}
        <div className="bg-teal-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-lightBlue-300">
            AI Recommendation of Lifestyle According to the Report
          </h2>
          <p className="text-lightBlue-200 text-sm">
            Based on your reports, AI suggests lifestyle improvements such as diet, exercise, and sleep patterns.
          </p>
        </div>
        {/* AI Summary Box with Table */}
        <div className="bg-teal-800 p-4 rounded-lg shadow-lg col-span-2">
          <h2 className="text-lg font-semibold mb-2 text-lightBlue-300">Summary of All Reports</h2>
          <table className="w-full text-sm text-left text-lightBlue-200">
            <thead className="text-xs uppercase bg-teal-700 text-white">
              <tr>
                <th className="px-4 py-2">Report ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((report) => (
                <tr key={report.reportId} className="border-b border-teal-600">
                  <td className="px-4 py-2">{report.reportId}</td>
                  <td className="px-4 py-2">{report.name}</td>
                  <td className="px-4 py-2">{report.date}</td>
                  <td className="px-4 py-2">{report.parameters}</td>
                </tr>
              ))}
            </tbody>
            </table>
        </div>

        {/* Rightmost Box: Trained Modeled Features */}
        <div className="bg-teal-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-lightBlue-300">
            Trained Modeled Features
          </h2>
          <p className="text-lightBlue-200 text-sm">
            The trained model has been fine-tuned on historical medical data to generate precise health insights.
          </p>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-lightBlue-400 text-white px-4 py-2 rounded-full shadow-lg">
          Chat with Report / BOT
        </button>
      </div>
    </div>
    </>
  );
};

export default Dashboard;

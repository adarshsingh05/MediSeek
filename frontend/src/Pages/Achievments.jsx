import React from "react";

const Achievements = () => {
  return (
    <div className="bg-gray-100 py-16">
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-10">
        What we've achieved so far...
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 text-center">
        {/* Card 1 */}
        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold text-teal-400">14</p>
          <p className="text-gray-700 text-lg font-medium">healthcare providers</p>
          <div className="w-10 h-[2px] bg-gray-500 my-2"></div>
          <p className="text-gray-600 max-w-xs">
            mediseek AI empowers numerous healthcare providers
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold text-teal-400">14</p>
          <p className="text-gray-700 text-lg font-medium">markets</p>
          <div className="w-10 h-[2px] bg-gray-500 my-2"></div>
          <p className="text-gray-600 max-w-xs">
          mediseek AI is available in 14 different markets worldwide
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold text-teal-400">35m</p>
          <p className="text-gray-700 text-lg font-medium">patients</p>
          <div className="w-10 h-[2px] bg-gray-500 my-2"></div>
          <p className="text-gray-600 max-w-xs">
          mediseek AI and its partners cover a total of 35 million patients and growing
          </p>
        </div>
      </div>
    </div>
  );
};

export default Achievements;

import React from "react";
import { motion } from "framer-motion";

const Achievements = () => {
  const achievementData = [
    {
      number: "14",
      title: "healthcare providers",
      description: "mediseek AI empowers numerous healthcare providers",
    },
    {
      number: "14",
      title: "markets",
      description: "mediseek AI is available in 14 different markets worldwide",
    },
    {
      number: "35m",
      title: "patients",
      description:
        "mediseek AI and its partners cover a total of 35 million patients and growing",
    },
  ];

  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8faff] to-[#f0f4ff]"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/2 right-1/3 w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            What we've
            <span className="bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
              {" achieved "}
            </span>
            so far...
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {achievementData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="relative p-8 rounded-2xl backdrop-blur-lg bg-white bg-opacity-30 border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-full opacity-20 blur-2xl"></div>

              <div className="relative">
                <motion.p
                  className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 text-transparent bg-clip-text"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: index * 0.2 + 0.3,
                  }}
                >
                  {item.number}
                </motion.p>

                <p className="text-gray-800 text-xl font-semibold mt-2">
                  {item.title}
                </p>

                <div className="w-16 h-1 bg-gradient-to-r from-teal-300 to-indigo-400 my-4 mx-auto rounded-full"></div>

                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom statistics bar with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 p-6 rounded-2xl backdrop-blur-lg bg-white bg-opacity-30 border border-white border-opacity-20 shadow-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Annual Growth</p>
              <p className="text-2xl font-bold text-indigo-600">+124%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">
                Patient Satisfaction
              </p>
              <p className="text-2xl font-bold text-indigo-600">96%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Accuracy Rate</p>
              <p className="text-2xl font-bold text-indigo-600">99.8%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">
                Supported Tests
              </p>
              <p className="text-2xl font-bold text-indigo-600">250+</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Add this to your global CSS or tailwind.config.js
// @keyframes blob {
//   0% { transform: translate(0px, 0px) scale(1); }
//   33% { transform: translate(30px, -50px) scale(1.1); }
//   66% { transform: translate(-20px, 20px) scale(0.9); }
//   100% { transform: translate(0px, 0px) scale(1); }
// }
// .animate-blob {
//   animation: blob 7s infinite;
// }
// .animation-delay-2000 {
//   animation-delay: 2s;
// }
// .animation-delay-4000 {
//   animation-delay: 4s;
// }

export default Achievements;

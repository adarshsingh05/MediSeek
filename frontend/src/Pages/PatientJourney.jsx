import React from "react";
import {
  Globe,
  Smartphone,
  FileText,
  MessageCircle,
  ChevronRight,
  ArrowRight,
  Upload,
  Brain,
  LineChart,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    image: "/gd.webp",
    text: "Upload Your Report",
    description:
      "Submit your medical reports through our secure and intuitive platform in seconds.",
    icon: <Upload className="w-6 h-6" />,
  },
  {
    image: "/gd2.webp",
    text: "AI Analysis",
    description:
      "Our advanced AI analyzes your data with clinical-grade accuracy and medical standards.",
    icon: <Brain className="w-6 h-6" />,
  },
  {
    image: "/gd3.webp",
    text: "Smart Insights",
    description:
      "Receive personalized insights, trends, and easy-to-understand recommendations instantly.",
    icon: <LineChart className="w-6 h-6" />,
  },
  {
    image: "/gd4.webp",
    text: "Secure Access",
    description:
      "Share securely with healthcare providers using QR codes and password protection.",
    icon: <Lock className="w-6 h-6" />,
  },
];

const deliveryMethods = [
  { icon: <Globe size={24} />, label: "Web" },
  { icon: <Smartphone size={24} />, label: "Mobile" },
  { icon: <FileText size={24} />, label: "PDF" },
  { icon: <MessageCircle size={24} />, label: "SMS" },
];

export function PatientJourney() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24 px-4 md:px-5 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-400 rounded-full filter blur-[100px] opacity-5"></div>
        <div className="absolute bottom-1/4 left-1/5 w-72 h-72 bg-indigo-400 rounded-full filter blur-[120px] opacity-5"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-300 rounded-full filter blur-[80px] opacity-5"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-teal-50 to-indigo-50 text-indigo-600 text-sm font-medium tracking-wide"
          >
            SIMPLE FOUR-STEP PROCESS
          </motion.span>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight">
            The{" "}
            <span className="bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
              mediseek.ai
            </span>{" "}
            workflow
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From report upload to personalized insights in minutes - our
            streamlined process puts your health data to work for you.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Redesigned Journey Steps */}
        <div className="flex flex-col  md:mb-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 relative pt-16 ">
            {/* Connection Line with Animation */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-indigo-500 origin-left"
              style={{
                transform: "scaleX(1)",
              }}
            ></motion.div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative flex flex-col items-center "
              >
                {/* Step Number Circle */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.2 + 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="w-20 h-20 flex items-center justify-center relative z-30 mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-indigo-600 rounded-full opacity-20 transform -rotate-45 scale-110 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-indigo-600 rounded-full opacity-30 blur-md"></div>
                  <div className="bg-gradient-to-br from-teal-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
                    {index + 1}
                  </div>
                </motion.div>

                {/* Arrow Between Steps - Only visible on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute left-full top-24 -translate-x-1/2 z-40">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.6, duration: 0.4 }}
                      className="bg-white rounded-full p-2 shadow-lg"
                    >
                      <ArrowRight size={20} className="text-indigo-500" />
                    </motion.div>
                  </div>
                )}

                {/* Step Card with Glassmorphism */}
                <motion.div
                  whileHover={{
                    y: -8,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.3 },
                  }}
                  className="w-full backdrop-blur-sm bg-white bg-opacity-90 rounded-2xl shadow-lg overflow-hidden border border-white border-opacity-40 h-full flex flex-col  "
                  style={{ marginTop: "10px" }}
                >
                  {/* Icon at the Top */}
                  <div className="flex justify-center   relative z-20">
                    <div className="bg-gradient-to-br from-teal-500 to-indigo-600 rounded-full p-3 shadow-lg border-2 border-white text-white">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 pt-4 text-center flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {step.text}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>

                  {/* Bottom Image with Consistent Height */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: "160px", opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
                    className="relative w-full overflow-hidden mt-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-indigo-900/30 to-transparent z-10"></div>
                    <motion.img
                      initial={{ scale: 1.0 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7 }}
                      src={step.image}
                      alt={`${step.text} illustration`}
                      className="w-full h-full object-contain object-center absolute inset-0 z-0"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Delivery Methods with Enhanced Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="backdrop-blur-lg bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            <span className="bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
              Available
            </span>{" "}
            on multiple platforms
          </h3>

          <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
            {deliveryMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="flex flex-col items-center"
              >
                <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-50 group hover:bg-gradient-to-br hover:from-teal-50 hover:to-indigo-50 transition-all duration-300">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-r from-teal-500 to-indigo-500 rounded-xl text-white transform group-hover:rotate-6 transition-transform duration-300">
                    {method.icon}
                  </div>
                </div>
                <p className="mt-3 font-medium text-indigo-600">
                  {method.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action with Enhanced Design */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-10 pt-6 border-t border-gray-200"
          >
            <p className="text-gray-600 text-lg">
              Start your health journey today with mediseek.ai
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-8 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white shadow-lg transition-all font-medium"
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default PatientJourney;

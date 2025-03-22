import React from "react";
import {
  Globe,
  Smartphone,
  FileText,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const HelpSection = () => {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Access Anywhere",
      description:
        "Securely access your health data from anywhere in the world with our cloud-based platform",
      color: "from-teal-400 to-emerald-500",
      image:
        "https://plus.unsplash.com/premium_photo-1699387203637-6eac5a11a201?q=80&w=3178&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Experience",
      description:
        "Fully responsive design optimized for all devices with real-time updates and notifications",
      color: "from-blue-400 to-indigo-500",
      image:
        "https://images.unsplash.com/photo-1605170439002-90845e8c0137?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Smart Reports",
      description:
        "AI-powered insights transform complex medical data into actionable recommendations",
      color: "from-purple-400 to-indigo-500",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Expert Support",
      description:
        "Connect with qualified healthcare professionals when you need personalized guidance",
      color: "from-rose-400 to-red-500",
      image:
        "https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?q=80&w=800&auto=format&fit=crop",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Floating animation for device mockups
  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      y: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="bg-gradient-to-b from-[#2a3b3c] to-[#1e2e2f] py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute top-1/4 left-1/5 w-64 h-64 bg-teal-300 rounded-full filter blur-[100px] opacity-20"
        ></motion.div>
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ repeat: Infinity, duration: 15, delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-400 rounded-full filter blur-[120px] opacity-10"
        ></motion.div>
      </div>

      {/* Top Dotted Pattern */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-[#2E3E3F] via-[#2E3E3F] to-transparent">
        <div className="w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.55)_1px,_transparent_1px)] bg-[size:12px_12px] opacity-20"></div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-sm text-teal-300 text-sm font-medium">
            Powerful Features
          </span>
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold">
            How We Can{" "}
            <span className="text-gradient bg-gradient-to-r from-teal-400 to-indigo-400 text-transparent bg-clip-text">
              Transform
            </span>{" "}
            Your Healthcare
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-teal-400 to-indigo-400 mx-auto mt-6 rounded-full"
          ></motion.div>
          <p className="text-gray-300 max-w-2xl mx-auto mt-6 text-lg">
            MediSeek combines cutting-edge AI with intuitive design to make
            healthcare data accessible, understandable, and actionable for
            everyone.
          </p>
        </motion.div>

        {/* Phone Mockups with Animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-center items-center gap-4 lg:gap-8 mb-24"
        >
          <motion.div
            variants={itemVariants}
            animate={floatingAnimation}
            whileHover={{ y: -15, transition: { duration: 0.3 } }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-3xl blur-md opacity-70"></div>
            <img
              src="/assets/images/device-mockup-1.png"
              alt="Health Dashboard"
              className="w-[260px] md:w-[240px] rounded-2xl relative transform -rotate-6 shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "img2.png";
              }}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            animate={floatingAnimation}
            whileHover={{ y: -15, transition: { duration: 0.3 } }}
            className="relative z-20 mt-6 md:mt-0"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-md opacity-70"></div>
            <img
              src="/img3.png"
              alt="Report Analysis"
              className="w-[280px] md:w-[260px] rounded-2xl relative shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/images/fallback-mockup.png";
              }}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            animate={floatingAnimation}
            whileHover={{ y: -15, transition: { duration: 0.3 } }}
            className="relative mt-6 md:mt-0"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-teal-500 rounded-3xl blur-md opacity-70"></div>
            <img
              src="/image.png"
              alt="Health Insights"
              className="w-[260px] md:w-[240px] rounded-2xl relative transform rotate-6 shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/images/fallback-mockup.png";
              }}
            />
          </motion.div>
        </motion.div>

        {/* Features Grid with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
                transition: { duration: 0.2 },
              }}
              className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 shadow-xl overflow-hidden h-full transition-all"
            >
              {/* Background Image with Overlay */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 z-10"></div>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img.png";
                  }}
                />
              </div>

              <div className="p-6 relative">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 text-white shadow-lg transform -translate-y-12 shadow-black/20`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white text-xl font-semibold mb-2 -mt-8">
                  {feature.title}
                </h3>
                <div
                  className={`w-12 h-0.5 bg-gradient-to-r ${feature.color} mb-3`}
                ></div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <motion.div
                  whileHover={{ x: 4 }}
                  className="mt-4 flex items-center text-teal-300 font-medium text-sm cursor-pointer group"
                >
                  Learn more
                  <ArrowRight
                    size={16}
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="inline-block backdrop-blur-lg bg-white/10 px-8 py-6 rounded-2xl border border-white/20 shadow-xl"
          >
            <h3 className="text-white text-2xl font-medium mb-4">
              Ready to experience the future of healthcare?
            </h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Join thousands of users who are already using MediSeek to better
              understand and manage their health.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white rounded-lg shadow-lg transition-all font-medium tracking-wide text-lg"
            >
              Get Started Now
            </motion.button>

            <p className="text-gray-400 text-sm mt-4">
              No credit card required • Free for 14 days
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Dotted Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#1e2e2f] via-[#1e2e2f] to-transparent">
        <div className="w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.55)_1px,_transparent_1px)] bg-[size:12px_12px] opacity-20"></div>
      </div>
    </section>
  );
};

export default HelpSection;

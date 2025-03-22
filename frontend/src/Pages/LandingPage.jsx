import React, { useState, useEffect, useRef } from "react";
import Achievements from "./Achievments";
import HelpSection from "./HelpSection";
import { PatientJourney } from "./PatientJourney";
import { supabase } from "./supabaseClient";
import SignupModal from "./Signup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import {
  CheckCircle,
  Shield,
  Activity,
  Award,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Heart,
  Zap,
  PieChart,
  MessageCircle,
  Upload,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [testReport, setTestReport] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("Home");

  // New hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Testimonials
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      image: "/assets/images/doctor-1.jpg", // placeholder image path
      text: "MediSeek has revolutionized how I process patient reports. The AI insights save me hours every week and highlight issues I might have missed.",
    },
    {
      name: "Michael Chen",
      role: "Patient",
      image: "/assets/images/patient-1.jpg", // placeholder image path
      text: "Finally I understand my lab reports! MediSeek explains everything in simple language and tells me what actions to take next.",
    },
    {
      name: "Dr. Robert Williams",
      role: "Family Physician",
      image: "/assets/images/doctor-2.jpg", // placeholder image path
      text: "The accuracy of MediSeek's analysis is remarkable. It's become an invaluable second opinion in my practice.",
    },
  ];

  // Carousel images and content
  const slides = [
    {
      image: "/hero6.jpg", // Replace with your image path
      title: "AI-Powered Health Insights",
      subtitle:
        "Transform complex medical reports into actionable health recommendations",
      highlight: "Clear • Accurate • Personalized",
    },
    {
      image: "/hero4.jpg", // Replace with your image path
      title: "Secure Report Management",
      subtitle:
        "Store, share, and access your medical data from anywhere, anytime",
      highlight: "HIPAA Compliant • Encrypted • Private",
    },
    {
      image: "/hero3.jpg", // Replace with your image path
      title: "Connect With Specialists",
      subtitle:
        "Share insights with healthcare professionals for better care coordination",
      highlight: "Seamless • Professional • Collaborative",
    },
  ];

  // Key features showcased in hero section
  const heroFeatures = [
    { icon: <Activity size={18} />, text: "AI Analysis" },
    { icon: <Shield size={18} />, text: "HIPAA Compliant" },
    { icon: <Award size={18} />, text: "99.8% Accuracy" },
  ];

  const nextSlide = () => {
    if (carouselRef.current) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  // Stats displayed in hero section
  const stats = [
    { value: "10M+", label: "Reports Processed" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "24/7", label: "AI Support" },
  ];

  // Handle auto-scrolling carousel
  useEffect(() => {
    autoPlayRef.current = nextSlide;
  }, []);

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    const interval = setInterval(play, 5000);
    return () => clearInterval(interval);
  }, []);

  // Original fetch user details effect
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/user",
          {
            withCredentials: true,
          }
        );

        console.log("Full API Response:", response.data);

        const { userId } = response.data;
        console.log("Extracted User ID:", userId);
        const { username, role, email, ...otherDetails } = response.data;

        setUserData(response.data);

        console.log("User Details:");
        console.log("Username:", username);
        console.log("Role:", role);
        console.log("Email:", email);
        console.log("Other Details:", otherDetails);
      } catch (error) {
        console.error(
          "Error fetching user details:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !patientName || !testReport) {
      alert("Please fill all fields and select a file!");
      return;
    }
    setIsUploading(true);

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("usersrep")
      .upload(fileName, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload failed:", error.message);
      alert("Upload failed. Try again.");
      setIsUploading(false);
      return;
    }

    console.log("Upload successful:", data);
    const fileUrl = `https://rlkflisvqgndvaojqoao.supabase.co/storage/v1/object/public/usersrep/${data.path}`;
    console.log("📌 File URL:", fileUrl);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("Authentication error: Please log in again.");
        setIsUploading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/reports/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: patientName,
          testType: testReport,
          supabaseUrl: fileUrl,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("✅ Report Saved in MongoDB:", result);
        alert("File uploaded and saved to database!");
        setIsModalOpen(false);
        setPatientName("");
        setTestReport("");
        setSelectedFile(null);
      } else {
        console.error("❌ Failed to save report:", result.message);
        alert("Failed to save report to database.");
      }
    } catch (error) {
      console.error("❌ Error sending data to backend:", error);
      alert("Error saving file data.");
    }

    setIsUploading(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      setUserName(null);
      setRole(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems =
    role === "doctor"
      ? [
          { name: "Home", path: "/" },
          { name: "Your Patients", path: "/patients" },
          { name: "Dashboard", path: "/doctorsredg" },
          { name: "AI Support", path: "/ai-support" },
          { name: "Workspace", path: "/workspace" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "Your Reports", path: "/History" },
          { name: "Dashboard", path: "/dashboard" },
          { name: "AI Ground", path: "/chat" },
          { name: "Vault", path: "/vault" },
          { name: "Our Doctors", path: "/doctors" },
        ];

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="w-screen bg-gradient-to-b from-[#f0f9fd] to-white overflow-hidden relative">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 shadow-md bg-white backdrop-filter backdrop-blur-lg bg-opacity-80 z-50"
        >
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-semibold text-gray-700 flex items-center"
            >
              <span className="bg-gradient-to-r from-teal-500 to-indigo-600 text-transparent bg-clip-text">
                mediseek
              </span>
              <span className="text-gray-500">.ai</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex space-x-2">
            {menuItems.map((item) => (
              <motion.li
                key={item.name}
                className={`px-4 py-2 list-none rounded-lg transition-all duration-300 ${
                  activeMenuItem === item.name
                    ? "bg-gradient-to-r from-teal-50 to-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveMenuItem(item.name)}
              >
                <Link to={item.path} className="flex items-center">
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </div>

          {userName ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-gray-700">{userName}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white px-5 py-2 rounded-lg shadow transition-all"
              >
                Sign Out
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white px-5 py-2 rounded-lg shadow transition-all"
            >
              Get Started
            </motion.button>
          )}
        </motion.nav>

        {/* Enhanced Hero Section with Carousel */}
        <div
          ref={heroRef}
          className="min-h-screen pt-20 "
          style={{ color: "#00B6AD" }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                y: [0, -15, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ repeat: Infinity, duration: 8 }}
              className="absolute top-[20%] right-[10%] w-64 h-64 bg-teal-300 rounded-full filter blur-[100px] opacity-10"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ repeat: Infinity, duration: 10, delay: 1 }}
              className="absolute bottom-[30%] left-[5%] w-96 h-96 bg-indigo-300 rounded-full filter blur-[120px] opacity-10"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ repeat: Infinity, duration: 12 }}
              className="absolute top-[60%] left-[50%] w-40 h-40 bg-purple-300 rounded-full filter blur-[80px] opacity-10"
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">
            {/* Hero Content Container */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left Content Side */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 flex flex-col items-center lg:items-start z-10"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-teal-50 to-indigo-50 border border-indigo-100"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
                    <CheckCircle size={12} className="text-white" />
                  </span>
                  <span className="text-xs font-medium text-indigo-700">
                    HIPAA Compliant Healthcare Technology
                  </span>
                </motion.div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center lg:text-left mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <span className="block">Transform</span>
                    <span className="bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
                      {role === "doctor" ? "Patient Care" : "Health Data"}
                    </span>
                    <span className="block"> with AI Technology</span>
                  </motion.div>
                </h1>

                {/* Animated Divider */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "80px" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1.5 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full mb-6"
                />

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-gray-700 text-lg leading-relaxed text-center lg:text-left mb-6"
                >
                  MediSeek.ai processes{" "}
                  <span className="font-medium text-indigo-700">
                    diagnostic lab test reports
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-indigo-700">
                    translates complex health data
                  </span>{" "}
                  into easily-understood insights and actionable
                  recommendations.
                </motion.p>

                {/* Features Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start"
                >
                  {heroFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -3, scale: 1.05 }}
                      className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
                    >
                      <span className="text-indigo-600">{feature.icon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-3.5 rounded-xl text-lg bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-200/40 transition-all flex items-center justify-center"
                  >
                    <Upload size={18} className="mr-2" />
                    Scan Your Report
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToFeatures}
                    className="px-8 py-3.5 rounded-xl text-indigo-700 border-2 border-indigo-100 hover:border-indigo-200 bg-white hover:bg-slate-50 transition-all flex items-center justify-center"
                  >
                    Learn More
                    <ChevronDown size={18} className="ml-2" />
                  </motion.button>
                </div>

                {/* Stats Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex flex-wrap gap-8 mt-16 justify-center lg:justify-start"
                >
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center lg:items-start"
                    >
                      <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
                        {stat.value}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Side - Carousel */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:w-1/2 mt-10 lg:mt-0 z-10"
              >
                <div
                  ref={carouselRef}
                  className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl"
                >
                  {/* Carousel Controls */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevSlide}
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </motion.button>
                  </div>

                  <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextSlide}
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
                      aria-label="Next slide"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </motion.button>
                  </div>

                  {/* Carousel Slides */}
                  <div className="h-full w-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                        <div className="absolute inset-x-0 bottom-0 p-8 z-20 text-white">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            <div className="inline-block px-3 py-1 mb-3 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium">
                              {slides[currentSlide].highlight}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">
                              {slides[currentSlide].title}
                            </h2>
                            <p className="text-white/80">
                              {slides[currentSlide].subtitle}
                            </p>
                          </motion.div>
                        </div>
                        <img
                          src={slides[currentSlide].image}
                          alt={slides[currentSlide].title}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.onerror = null;
                            // Use a fallback image if the image fails to load
                            e.target.src = "/assets/images/fallback.jpg";
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          currentSlide === index
                            ? "bg-white scale-125"
                            : "bg-white/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute left-1/2 bottom-10 -translate-x-1/2 flex flex-col items-center cursor-pointer"
            onClick={scrollToFeatures}
          >
            <span className="text-gray-500 text-sm mb-2">Explore More</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown size={24} className="text-indigo-500" />
            </motion.div>
          </motion.div>
        </div>

        {/* Key Benefits Section */}
        <div id="features-section" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-teal-50 to-indigo-50 text-indigo-600 text-sm font-medium">
                Key Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why choose{" "}
                <span className="bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
                  MediSeek.ai?
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform combines cutting-edge AI technology with a
                user-friendly interface to make your healthcare data accessible
                and actionable.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 p-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
                  <Heart className="text-teal-600 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  AI-Powered Health Insights
                </h3>
                <p className="text-gray-600">
                  Our advanced AI analyzes your health reports and provides
                  personalized insights, highlighting important findings in
                  simple language.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 p-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                  <Shield className="text-indigo-600 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Secure Report Management
                </h3>
                <p className="text-gray-600">
                  Store and access your medical reports securely from anywhere.
                  All data is encrypted and HIPAA compliant for your privacy.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 p-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                  <Zap className="text-purple-600 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Instant Analysis
                </h3>
                <p className="text-gray-600">
                  Get immediate results when you upload your reports. No waiting
                  for appointments or delayed feedback.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 p-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <PieChart className="text-amber-600 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Health Trend Tracking
                </h3>
                <p className="text-gray-600">
                  Track changes in your health metrics over time with insightful
                  visualizations and progress reports.
                </p>
              </motion.div>

              {/* Feature 5 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 p-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 group-hover:bg-rose-100 transition-colors">
                  <MessageCircle className="text-rose-600 w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Expert Support
                </h3>
                <p className="text-gray-600">
                  Connect with healthcare specialists for advice based on your
                  reports for more comprehensive care.
                </p>
              </motion.div>

              {/* Get Started Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-2xl overflow-hidden shadow-xl border border-indigo-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of users who are already experiencing the
                  benefits of AI-powered health insights.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsSignupOpen(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white font-medium"
                >
                  Create Free Account
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-teal-50 to-indigo-50 text-indigo-600 text-sm font-medium">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What our users are saying
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Healthcare professionals and patients alike trust MediSeek.ai to
                deliver accurate, actionable health insights.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 mr-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            testimonial.name
                          )}&background=8B5CF6&color=fff`;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{testimonial.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Upload Medical Report
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter patient's full name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-800"
                    disabled={isUploading}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Type
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Complete Blood Count, Lipid Panel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-800"
                    disabled={isUploading}
                    value={testReport}
                    onChange={(e) => setTestReport(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      {selectedFile ? (
                        <span className="text-indigo-600 font-medium">
                          {selectedFile.name}
                        </span>
                      ) : (
                        <div className="space-y-2">
                          <svg
                            className="w-10 h-10 mx-auto text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <span>Click to select a file</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="my-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-600">
                    Uploading your report...
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between space-x-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex-1"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className={`px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-indigo-500 text-white flex-1 transition-all ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-teal-500 hover:to-indigo-600"
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? "Processing..." : "Upload Report"}
                </button>
              </div>

              {/* Upload Guidelines */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg text-sm text-gray-700">
                <h3 className="font-medium text-indigo-700 mb-2">
                  Tips for better results:
                </h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>Ensure the entire report is visible in the scan</li>
                  <li>Make sure the image is clear and not blurred</li>
                  <li>Accepted formats: PDF, PNG, JPG (max 5MB)</li>
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Rest of the sections with motion animations */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-[-70px]"
      >
        <Achievements />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <HelpSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <PatientJourney />
      </motion.div>

      <Footer />
      <div className="absolute  ">
        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
        />
      </div>
    </>
  );
};

export default LandingPage;

import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
  FileText,
  Shield,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-400 rounded-full filter blur-[120px] opacity-5"></div>
        <div className="absolute bottom-1/4 left-1/5 w-72 h-72 bg-indigo-400 rounded-full filter blur-[150px] opacity-5"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Company Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
              mediseek.ai
            </h2>
            <p className="text-gray-600 mb-6">
              Transforming healthcare data into personalized insights with
              advanced AI technology.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="bg-gradient-to-r from-teal-500 to-indigo-600 p-2 rounded-full text-white"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="bg-gradient-to-r from-teal-500 to-indigo-600 p-2 rounded-full text-white"
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="bg-gradient-to-r from-teal-500 to-indigo-600 p-2 rounded-full text-white"
              >
                <Linkedin size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "About", "Services", "Pricing", "Contact"].map(
                (item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                    >
                      <ArrowUp className="w-3 h-3 mr-2 rotate-45" />
                      {item}
                    </Link>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Features
            </h3>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/ai-analysis"
                  className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  AI Report Analysis
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/secure-sharing"
                  className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Secure Sharing
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/health-insights"
                  className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Health Insights
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Globe className="w-5 h-5 mr-3 text-indigo-600 mt-0.5" />
                <span className="text-gray-600">
                  025 Vijaywada , Andhra Pradesh, India
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-indigo-600" />
                <a
                  href="mailto:info@mediseek.ai"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  adarshashokbaghel@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-indigo-600" />
                <a
                  href="tel:+15551234567"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  +91 955 966 1323
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="backdrop-blur-sm bg-white bg-opacity-90 rounded-2xl shadow-lg overflow-hidden border border-white border-opacity-40 p-6 md:p-8 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Stay Updated with{" "}
                <span className="bg-gradient-to-r from-teal-600 to-indigo-600 text-transparent bg-clip-text">
                  mediseek.ai
                </span>
              </h3>
              <p className="text-gray-600">
                Join our newsletter to receive the latest updates and health
                insights.
              </p>
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow rounded-l-lg p-3 border-2 border-gray-200 focus:outline-none focus:border-indigo-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-6 rounded-r-lg font-medium"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Scroll to top button and copyright */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-600 text-sm"
          >
            © {new Date().getFullYear()} mediseek.ai. All rights reserved.
          </motion.p>

          <div className="flex items-center mt-4 md:mt-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-gray-600 mr-6"
            >
              <Link
                to="/privacy"
                className="hover:text-indigo-600 transition-colors"
              >
                Privacy Policy
              </Link>
              {" · "}
              <Link
                to="/terms"
                className="hover:text-indigo-600 transition-colors"
              >
                Terms of Service
              </Link>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="bg-gradient-to-r from-teal-500 to-indigo-600 p-3 rounded-full text-white shadow-md"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

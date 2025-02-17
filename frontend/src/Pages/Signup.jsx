import React, { useState } from "react";
import Login from "./login";

const SignupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      alert("Signup successful! Please verify your email.");
      setFormData({ name: "", email: "", password: "" });
      onClose(); // Close modal after successful signup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Left Section (Illustration) */}
        <div className="hidden md:flex w-1/2 bg-[#D9F0F1] items-center justify-center relative">
          <div className="absolute top-6 left-6">
            <img src="your-logo-url.png" alt="Logo" className="w-10 h-10" />
          </div>
          <div className="text-gray-800 text-lg font-semibold absolute bottom-10 left-10">
            Create your Account and access all mediseek.ai features for free.
          </div>
          <div className="absolute flex space-x-4">
            <img src="image 8.png" alt="3D" className="w-64 h-52" />
          </div>
        </div>

        {/* Right Section (Signup Form) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✖
          </button>

          <h2 className="text-3xl text-black font-bold mb-6">Create an Account</h2>

          {/* Social Login Buttons */}
          <div className="flex w-full max-w-sm gap-4">
            <button className="flex text-black items-center w-1/2 gap-2 px-4 py-2 border rounded-lg shadow hover:bg-gray-100">
              <img
                src="https://t4.ftcdn.net/jpg/03/47/46/83/360_F_347468387_ngBE1hQcqRlRVh8d3UDi3YrKNnhfT6V7.jpg"
                alt="Google"
                className="w-6 h-6"
              />
              Sign up with Google
            </button>
            <button className="flex text-black items-center w-1/2 gap-2 px-4 py-2 border rounded-lg shadow hover:bg-gray-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook"
                className="w-5 h-5"
              />
              Sign up with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="text-gray-500 my-4">- OR -</div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Signup Form */}
          <form className="w-full text-black max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="absolute right-3 top-3 cursor-pointer text-gray-500">👁️</span>
            </div>

            {/* Signup Button with Loader */}
            <button
  type="submit"
  disabled={loading}
  className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 w-full"
>
  {loading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    "Create Account"
  )}
</button>

          </form>

          {/* Login Redirect */}
          <p className="text-black mt-4">
            Already have an account?{" "}
            <a href="#" className="text-blue-500 hover:underline" onClick={(e) => {
    e.preventDefault(); 
    setIsLoginOpen(true); // Open login modal
  }}>
              Login
            </a>
          </p>
          {/* Show Login Component when isLoginOpen is true */}
      {isLoginOpen && <Login />}
        </div>
      </div>
    </div>
  );
};

export default SignupModal;

import React from "react";

const Login = () => {
  return (
    <div className="whole-bg-container">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Left section background */}
          <div className="hidden md:flex w-1/2 bg-[#D9F0F1] items-center justify-center relative">
            <div className="absolute top-6 left-6">
              <img src="your-logo-url.png" alt="Logo" className="w-10 h-10" />
            </div>
            <div className="text-gray-800 text-lg font-semibold absolute bottom-10 left-10">
              Login to your Account and access all mediseek.ai features for free.
            </div>
            <div className="absolute flex space-x-4">
              <img src="image 8.png" alt="3D" className="w-64 h-52" />
            </div>
          </div>

          {/* Right section form */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 relative">
            {/* Close Button */}
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
              ✖
            </button>

            <h2 className="text-3xl text-black font-bold mb-6">Login</h2>

            {/* Social Login Buttons */}
            <div className="flex w-full max-w-sm gap-4">
              <button className="flex text-black items-center w-1/2 gap-2 px-4 py-2 border rounded-lg shadow hover:bg-gray-100">
                <img
                  src="https://t4.ftcdn.net/jpg/03/47/46/83/360_F_347468387_ngBE1hQcqRlRVh8d3UDi3YrKNnhfT6V7.jpg"
                  alt="Google"
                  className="w-6 h-6"
                />
                Login with Google
              </button>
              <button className="flex text-black items-center w-1/2 gap-2 px-4 py-2 border rounded-lg shadow hover:bg-gray-100">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Login with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="text-gray-500 my-4">- OR -</div>

            {/*Form */}
            <form className="w-full text-black max-w-sm flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full p-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-3 cursor-pointer text-gray-500">👁️</span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 w-full"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import {
  User,
  Stethoscope,
  MapPin,
  Clock,
  FileText,
  Upload,
  CheckCircle,
  ChevronRight,
  Calendar,
  X,
} from "lucide-react";
import { motion } from "react";
import DoctorConfirmationModal from "./redgModal";

const DoctorRegistration = () => {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("email");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [doctorData, setDoctorData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    doctorid: token || "not logged in",
    specialty: "",
    location: "",
    bio: "",
    availableDays: [],
    availableTimeStart: "",
    availableTimeEnd: "",
    profileImage: null,
    email: "", // Add emailid to formData
  });
  useEffect(() => {
    if (!email) {
      console.warn("❌ No email provided for doctor check.");
      return;
    }

    console.log("✅ useEffect triggered. Email:", email);

    let isMounted = true;

    const fetchDoctorData = async () => {
      try {
        console.log(`🚀 Sending API request with email: ${email}`);

        const response = await axios.post(
          "http://localhost:5000/api/auth/checkdoctorisreg",
          { email }
        );

        if (response.data && response.data.message === "Doctor found") {
          console.log("✅ Yes");
          setDoctorData(response.data.doctor);
          setFormData((prev) => ({
            ...prev,
            name: response.data.doctor.name,
            specialty: response.data.doctor.specialty,
            location: response.data.doctor.location,
            bio: response.data.doctor.bio,
            availableDays: response.data.doctor.availableDays,
            availableTimeStart: response.data.doctor.availableTimeStart,
            availableTimeEnd: response.data.doctor.availableTimeEnd,
            email: response.data.doctor.email,
          }));
        } else {
          console.log("❌ No");
        }
      } catch (err) {
        console.error("❌ API Error:", err);
        console.log("❌ No");
      }
    };

    fetchDoctorData();

    return () => {
      isMounted = false;
    };
  }, [email]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Psychiatry",
    "Orthopedics",
    "Family Medicine",
    "Internal Medicine",
    "Gynecology",
    "Ophthalmology",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const updatedDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];

      return {
        ...prev,
        availableDays: updatedDays,
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/doctorredg",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      setIsSubmitted(true);
      console.log("Registration successful:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering with MediSeek.ai. Your profile is now
            under review. We'll notify you once it's approved and patients can
            start booking appointments.
          </p>
          <button
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (doctorData) {
      setShowModal(true); // Automatically show modal when doctorData exists
    }
  }, [doctorData]); // Runs when doctorData changes

  return (
    <div className="min-h-screen bg-gray-50">
        <div>
      {showModal && (
        <DoctorConfirmationModal onClose={() => setShowModal(false)} />
      )}
    </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">MediSeek.ai</h1>
            <p className="text-sm text-gray-600">
              Connect with patients, grow your practice
            </p>
          </div>

          

          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Help
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Progress tracker */}
      <div className="max-w-5xl mx-auto pt-8 px-4">
        <div className="flex justify-between mb-8 relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>

          {/* Steps */}
          <div className="relative flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > 1
                  ? "bg-blue-500 text-white"
                  : currentStep === 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } transition-colors duration-300`}
            >
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : 1}
            </div>
            <span className="mt-2 text-sm text-gray-600">Basic Info</span>
          </div>

          <div className="relative flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > 2
                  ? "bg-blue-500 text-white"
                  : currentStep === 2
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } transition-colors duration-300`}
            >
              {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : 2}
            </div>
            <span className="mt-2 text-sm text-gray-600">Availability</span>
          </div>

          <div className="relative flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 3
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } transition-colors duration-300`}
            >
              3
            </div>
            <span className="mt-2 text-sm text-gray-600">Review</span>
          </div>
        </div>
      </div>

      {/* Form container */}
      <div className="max-w-3xl mx-auto pb-20 px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-blue-500" />
                  Basic Information
                </h2>

                <div className="space-y-6">
                  {/* Profile image upload */}
                  <div className="flex flex-col items-center mb-8">
                    <div
                      className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors mb-3"
                      onClick={() =>
                        document.getElementById("profile-image").click()
                      }
                    >
                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="profile-image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <button
                      type="button"
                      className="text-blue-600 text-sm flex items-center"
                      onClick={() =>
                        document.getElementById("profile-image").click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload profile photo
                    </button>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 text-black rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 text-black rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Specialty*
                    </label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select your specialty</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location*
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 text-black rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="City, State or Full Address"
                        required
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Bio*
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full text-black border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Tell patients about your experience, approach to care, and what makes your practice unique..."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next: Availability
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Availability */}
            {currentStep === 2 && (
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-blue-500" />
                  Availability
                </h2>

                <div className="space-y-6">
                  {/* Available Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Days*
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {days.map((day) => (
                        <div
                          key={day}
                          onClick={() => handleDayToggle(day)}
                          className={`
                            cursor-pointer border rounded-lg p-3 flex items-center transition-all
                            ${
                              formData.availableDays.includes(day)
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-300 hover:border-blue-300 text-black"
                            }
                          `}
                        >
                          <div
                            className={`
                            w-5 h-5 rounded-full border flex items-center justify-center mr-2
                            ${
                              formData.availableDays.includes(day)
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-400"
                            }
                          `}
                          >
                            {formData.availableDays.includes(day) && (
                              <CheckCircle className="w-4 h-4 text-black" />
                            )}
                          </div>
                          <span>{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available From*
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          name="availableTimeStart"
                          value={formData.availableTimeStart}
                          onChange={handleInputChange}
                          className="w-full text-black border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Until*
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          name="availableTimeEnd"
                          value={formData.availableTimeEnd}
                          onChange={handleInputChange}
                          className="w-full text-black border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Appointment Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Typical Appointment Duration
                    </label>
                    <select
                      name="appointmentDuration"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30" selected>
                        30 minutes
                      </option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center font-medium hover:bg-blue-700 transition-colors"
                  >
                    Review Information
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-500" />
                  Review Information
                </h2>

                <div className="space-y-8">
                  {/* Basic Info Review */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Basic Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                          {profileImagePreview ? (
                            <img
                              src={profileImagePreview}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {formData.name || "Not provided"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formData.specialty || "No specialty selected"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-black flex items-start mb-2">
                          <MapPin className="w-4 h-4  text-gray-500 mr-2 mt-0.5" />
                          <span>
                            {formData.location || "No location provided"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-black mb-2">
                        Professional Bio
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.bio || "No bio provided"}
                      </p>
                    </div>
                  </div>

                  {/* Availability Review */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        Availability
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-black mb-2">
                          Available Days
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.availableDays &&
                          formData.availableDays.length > 0 ? (
                            formData.availableDays.map((day) => (
                              <span
                                key={day}
                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                              >
                                {day}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-600">
                              No days selected
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm text-black font-medium mb-2">
                          Hours
                        </h4>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 text-gray-500 mr-2" />
                          {formData.availableTimeStart &&
                          formData.availableTimeEnd ? (
                            <span>
                              {formData.availableTimeStart} to{" "}
                              {formData.availableTimeEnd}
                            </span>
                          ) : (
                            <span>No hours specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and conditions */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 mr-2"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I confirm that all the information provided is accurate
                      and I agree to MediSeek.ai's{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse mr-2">
                          Processing...
                        </span>
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;

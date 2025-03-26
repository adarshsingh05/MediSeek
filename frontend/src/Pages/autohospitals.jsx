"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Search,
  Locate,
  Hospital,
  MapPinned,
  ShipWheelIcon as Wheelchair,
  AlertCircle,
  Navigation,
  ChevronRight,
  Star,
  Clock3,
  Stethoscope,
  Activity,
  Map,
  CheckCircle2,
  X,
} from "lucide-react"

// Custom animations CSS
const customStyles = `
@keyframes wave-slow {
  0% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-45%) translateY(10px); }
  100% { transform: translateX(-50%) translateY(0); }
}

@keyframes wave-fast {
  0% { transform: translateX(-60%) translateY(0); }
  50% { transform: translateX(-55%) translateY(5px); }
  100% { transform: translateX(-60%) translateY(0); }
}

@keyframes float-slow {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

@keyframes float-medium {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

@keyframes ping-slow {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes bounce-x {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.animate-wave-slow {
  animation: wave-slow 8s ease-in-out infinite;
}

.animate-wave-fast {
  animation: wave-fast 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}

.animate-bounce-x {
  animation: bounce-x 1s ease-in-out infinite;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}
`

// Animated wave background component
const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0 opacity-40">
    <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-teal-100 to-transparent"></div>
    <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        fill="#0d9488"
        fillOpacity="0.1"
        d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        className="animate-wave-slow"
      ></path>
      <path
        fill="#0891b2"
        fillOpacity="0.1"
        d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,117.3C672,85,768,75,864,90.7C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        className="animate-wave-fast"
      ></path>
    </svg>
  </div>
)

// Decorative elements component
const DecorativeElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-teal-300/20 to-blue-300/20 animate-float-slow"></div>
    <div className="absolute bottom-40 left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-blue-300/20 to-teal-300/20 animate-float-medium"></div>
    <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full bg-teal-400/30 animate-pulse"></div>
    <div className="absolute top-2/3 right-1/3 w-4 h-4 rounded-full bg-blue-400/30 animate-ping-slow"></div>
    <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-teal-500/30 animate-ping-slow"></div>
  </div>
)

// Animated rating stars component
const RatingStars = ({ rating = 4.5 }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={14} className="text-yellow-400 fill-yellow-400 mr-0.5" />
      ))}
      {hasHalfStar && (
        <div className="relative mr-0.5">
          <Star size={14} className="text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={14} className="text-yellow-400 mr-0.5" />
      ))}
      <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

// Feature badge component
const FeatureBadge = ({ icon: Icon, text, color }) => (
  <span
    className={`${color} text-xs px-3 py-1.5 rounded-full flex items-center shadow-sm transform hover:scale-105 transition-transform duration-300`}
  >
    <Icon size={12} className="mr-1" /> {text}
  </span>
)

// Hospital card component with enhanced animations and design
const HospitalCard = ({ hospital }) => {
  const { tags, lat, lon, id } = hospital
  const [isHovered, setIsHovered] = useState(false)

  // Generate a random rating for demo purposes
  const rating = (Math.random() * 2 + 3).toFixed(1)

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 relative overflow-hidden group"
      style={{
        boxShadow: isHovered ? "0 10px 40px -15px rgba(13, 148, 136, 0.3)" : "0 4px 20px -5px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 p-0.5">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-x"></div>
      </div>

      {/* Card content */}
      <div className="relative p-6 bg-white rounded-xl z-10 h-full flex flex-col">
        {/* Top section with hospital name and icon */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-1">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors duration-300">
                {tags.name || "Unnamed Hospital"}
              </h3>
              {tags.emergency === "yes" && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full animate-pulse">
                  24/7
                </span>
              )}
            </div>
            <RatingStars rating={Number.parseFloat(rating)} />
          </div>

          <div className="relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-500 text-white transform transition-transform duration-500 ${isHovered ? "rotate-12" : ""}`}
            >
              <Hospital size={24} />
            </div>
            <div className="absolute inset-0 rounded-full bg-teal-400 blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Hospital information */}
        <div className="space-y-3 flex-grow">
          {tags["addr:full"] && (
            <div className="flex items-start text-gray-700 group-hover:-translate-y-0.5 transition-transform duration-300">
              <MapPinned className="mr-2 text-teal-500 flex-shrink-0 mt-1" size={16} />
              <span className="text-sm">{tags["addr:full"]}</span>
            </div>
          )}

          <div
            className="flex items-center text-gray-600 group-hover:-translate-y-0.5 transition-transform duration-300"
            style={{ transitionDelay: "50ms" }}
          >
            <Navigation className="mr-2 text-teal-500 flex-shrink-0" size={16} />
            <span className="text-sm">
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </span>
          </div>

          {/* Location details */}
          <div
            className="grid grid-cols-2 gap-3 mt-4 group-hover:-translate-y-0.5 transition-transform duration-300"
            style={{ transitionDelay: "100ms" }}
          >
            {tags["addr:district"] && (
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-3 rounded-lg border border-teal-100/50">
                <p className="text-xs text-gray-500 mb-1 flex items-center">
                  <Map size={12} className="mr-1 text-teal-500" /> District
                </p>
                <p className="font-medium text-sm text-gray-800">{tags["addr:district"]}</p>
              </div>
            )}

            {tags["addr:state"] && (
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-3 rounded-lg border border-blue-100/50">
                <p className="text-xs text-gray-500 mb-1 flex items-center">
                  <Map size={12} className="mr-1 text-blue-500" /> State
                </p>
                <p className="font-medium text-sm text-gray-800">{tags["addr:state"]}</p>
              </div>
            )}
          </div>

          {/* Features section */}
          <div
            className="mt-4 flex flex-wrap gap-2 group-hover:-translate-y-0.5 transition-transform duration-300"
            style={{ transitionDelay: "150ms" }}
          >
            {tags.emergency === "yes" && (
              <FeatureBadge
                icon={AlertCircle}
                text="Emergency Services"
                color="bg-gradient-to-r from-red-100 to-rose-100 text-red-700"
              />
            )}

            {tags.wheelchair === "yes" && (
              <FeatureBadge
                icon={Wheelchair}
                text="Wheelchair Accessible"
                color="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
              />
            )}

            <FeatureBadge
              icon={Stethoscope}
              text="Medical Facility"
              color="bg-gradient-to-r from-teal-100 to-green-100 text-teal-700"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500 flex items-center">
            <Activity size={14} className="mr-1 text-teal-500" />
            <span>Medical Services Available</span>
          </div>

          <button className="flex items-center text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 px-3 py-1.5 rounded-full transform group-hover:translate-x-1 transition-transform duration-300 hover:shadow-md">
            View Details <ChevronRight size={16} className="ml-1 animate-bounce-x" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Animated search input component
const AnimatedInput = ({ label, icon: Icon, value, onChange, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <label
        className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-300 ${isFocused ? "text-teal-600" : "text-gray-700"}`}
      >
        <Icon
          className={`mr-1.5 transition-colors duration-300 ${isFocused ? "text-teal-500" : "text-teal-400"}`}
          size={16}
        />
        {label}
      </label>
      <div
        className={`relative rounded-lg transition-all duration-300 ${isFocused ? "ring-2 ring-teal-500 ring-opacity-50" : "ring-1 ring-gray-200"}`}
      >
        <input
          type="number"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3.5 rounded-lg border-0 focus:outline-none bg-white transition-all duration-300"
          placeholder={placeholder}
        />
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500 rounded-full ${isFocused ? "w-full" : "w-0"}`}
        ></div>
      </div>
    </div>
  )
}

// Main component
const HospitalFinder = () => {
  const [latitude, setLatitude] = useState("28.6139")
  const [longitude, setLongitude] = useState("77.2090")
  const [radius, setRadius] = useState(10000)
  const [hospitals, setHospitals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [activeTab, setActiveTab] = useState("map")
  const [locationAvailable, setLocationAvailable] = useState(false)

  // Add custom styles to document
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = customStyles
    document.head.appendChild(styleElement)

    return () => {
      if (styleElement.parentNode) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  // Check if geolocation is supported and set initial state
  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationAvailable(true)
    }
  }, [])

  // Automatic geolocation function
  const getCurrentLocation = () => {
    setIsLoading(true)
    if (locationAvailable) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(4))
          setLongitude(position.coords.longitude.toFixed(4))
          setIsLoading(false)
        },
        (error) => {
          setError("Unable to retrieve location. Please try entering coordinates manually.")
          setIsLoading(false)
        },
      )
    } else {
      setError("Geolocation not supported by your browser. Please enter coordinates manually.")
      setIsLoading(false)
    }
  }

  // Fetch hospitals from Overpass API
  const fetchHospitals = async () => {
    if (!latitude || !longitude) {
      setError("Please enter or select a location")
      return
    }

    setIsLoading(true)
    setError(null)
    setSearchPerformed(true)

    try {
      const overpassQuery = `
        [out:json];
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        out;
      `

      const encodedQuery = encodeURIComponent(overpassQuery)
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodedQuery}`)
      const data = await response.json()

      setHospitals(data.elements)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to fetch hospitals. Please try again later.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative backgrounds */}
      <WaveBackground />
      <DecorativeElements />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header Section with animated elements */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium mb-6 shadow-md animate-bounce-subtle">
            <MapPin className="mr-2" size={16} />
            Find Healthcare Near You
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 relative inline-block">
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Find Hospitals near You
            </span>
            <div className="absolute -top-6 -right-6 w-12 h-12 text-teal-500 animate-spin-slow opacity-70">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 4V2M12 22v-2M4 12H2M22 12h-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-8 animate-fade-in">
            Quickly locate hospitals around any location to get the care you need, when you need it.
          </p>

          {/* Animated tabs */}
          <div className="inline-flex bg-gray-100 p-1 rounded-full mb-6">
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "map" ? "bg-white text-teal-600 shadow-md" : "text-gray-600 hover:text-teal-600"
              }`}
            >
              <Map size={16} className="mr-1.5" /> Map View
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "list" ? "bg-white text-teal-600 shadow-md" : "text-gray-600 hover:text-teal-600"
              }`}
            >
              <Hospital size={16} className="mr-1.5" /> Hospital List
            </button>
          </div>
        </div>

        {/* Search Card with 3D effect */}
        <div
          className="relative bg-white rounded-2xl p-8 mb-12 transform transition-all duration-500 hover:translate-y-[-5px]"
          style={{
            boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.1), 0 -10px 20px -10px rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* Card decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-100 to-blue-100 rounded-full opacity-70 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-teal-100 rounded-full opacity-70 transform -translate-x-12 translate-y-12"></div>

          {/* Card content */}
          <div className="relative">
            <div className="grid md:grid-cols-3 gap-6 text-gray-600">
              <AnimatedInput
                label="Latitude"
                icon={MapPin}
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Enter latitude"
              />

              <AnimatedInput
                label="Longitude"
                icon={MapPin}
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Enter longitude"
              />

              <AnimatedInput
                label="Search Radius (meters)"
                icon={Search}
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Search radius"
              />
            </div>

            {/* Action Buttons with animations */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                onClick={getCurrentLocation}
                className="group relative flex items-center justify-center px-6 py-3.5 rounded-xl overflow-hidden transition-all duration-300"
                disabled={isLoading || !locationAvailable}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300 group-hover:scale-105"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_70%)]"></div>
                </div>
                <span className="relative flex items-center text-white font-medium">
                  <Locate className="mr-2 animate-pulse-subtle" size={20} />
                  {isLoading
                    ? "Getting Location..."
                    : locationAvailable
                      ? "Use My Location"
                      : "Geolocation Not Available"}
                </span>
              </button>

              <button
                onClick={fetchHospitals}
                className="group relative flex items-center justify-center px-6 py-3.5 rounded-xl overflow-hidden transition-all duration-300"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:scale-105"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_70%)]"></div>
                </div>
                <span className="relative flex items-center text-white font-medium">
                  <Search className="mr-2 group-hover:animate-bounce-subtle" size={20} />
                  {isLoading ? "Searching..." : "Find Hospitals"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message with animation */}
        {error && (
          <div className="bg-white border-l-4 border-red-500 rounded-lg p-4 mb-8 flex items-start shadow-md animate-slide-in-right">
            <div className="mr-3 flex-shrink-0 bg-red-100 rounded-full p-1">
              <X className="text-red-500" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-red-800 mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={() => setError(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Loading State with advanced animation */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Hospital className="text-teal-600 animate-pulse" size={24} />
              </div>
            </div>
            <div className="mt-6 bg-white rounded-lg shadow-md px-6 py-3 flex items-center">
              <div className="mr-3 w-2 h-2 rounded-full bg-teal-500 animate-ping"></div>
              <p className="text-gray-700">Searching for hospitals near you...</p>
            </div>
          </div>
        )}

        {/* No Results State with animation */}
        {!isLoading && searchPerformed && hospitals.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-md animate-fade-in-up">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping-slow opacity-50"></div>
              <div className="relative bg-gradient-to-br from-teal-500 to-blue-500 w-full h-full rounded-full flex items-center justify-center">
                <Hospital className="text-white" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Hospitals Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              We couldn't find any hospitals within the specified radius. Try increasing the search radius or changing
              your location.
            </p>
            <button
              onClick={() => setRadius(radius * 2)}
              className="inline-flex items-center px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 hover:bg-teal-100 transition-colors"
            >
              <Search className="mr-2" size={16} />
              Double Search Radius
            </button>
          </div>
        )}

        {/* Results Section with staggered animation */}
        {!isLoading && hospitals.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Hospital className="mr-2 text-teal-500" size={24} />
                Hospitals Near You
                <div className="relative ml-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm py-1 px-4 rounded-full shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-pulse opacity-50"></div>
                  <span className="relative">{hospitals.length} found</span>
                </div>
              </h2>

              <div className="flex items-center space-x-2">
                <button className="flex items-center text-sm text-gray-600 hover:text-teal-600 transition-colors">
                  <CheckCircle2 size={16} className="mr-1" /> Filter
                </button>
                <button className="flex items-center text-sm text-gray-600 hover:text-teal-600 transition-colors">
                  <Clock3 size={16} className="mr-1" /> Sort
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital, index) => (
                <div key={hospital.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <HospitalCard hospital={hospital} />
                </div>
              ))}
            </div>

            {/* Results pagination */}
            {hospitals.length > 9 && (
              <div className="flex justify-center mt-10">
                <div className="inline-flex items-center bg-white rounded-lg shadow-md">
                  <button className="px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="px-4 py-2 text-white bg-gradient-to-r from-teal-500 to-teal-600 font-medium rounded-md mx-1">
                    1
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors">2</button>
                  <button className="px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors">3</button>
                  <button className="px-4 py-2 text-gray-600 hover:text-teal-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with animated elements */}
      <div className="relative z-10 bg-gradient-to-r from-teal-500 to-blue-500 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Hospital size={24} className="mr-2" />
            <span className="font-bold text-lg">MediSeek.ai</span>
          </div>
          <p className="text-teal-100 text-sm">Find the best healthcare facilities near you, anytime, anywhere.</p>
        </div>
      </div>
    </div>
  )
}

export default HospitalFinder


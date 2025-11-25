import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaUserTie,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import registerImage from "../assets/reg.png";
import L from "leaflet";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ---------------- Map Location Picker ----------------
const LocationMarker = ({ setLatLng }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setLatLng({ latitude: lat, longitude: lng });
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

// ---------------- Registration  ----------------
const Register = ({
  formData,
  handleChange,
  handleSubmit,
  fieldErrors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  termsAccepted,
  setTermsAccepted,
  userType,
  setUserType,
  latLng,
  setLatLng,
  loading
}) => {


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
      <ToastContainer position="top-right" autoClose={4000} />
      <Loader />
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="md:w-1/2 bg-[#0059e7] p-8 text-white flex flex-col justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Streamline Your Workforce</h2>
            <p className="text-blue-100 mb-6">
              Efficient employee booking and management platform
            </p>
          </div>

          <div className="hidden md:block relative h-96 rounded-lg overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-blue-700 to-transparent"></div>
            <img
              src={registerImage}
              alt="Employee booking illustration"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8 space-y-4">
            <Feature
              icon={<FaCalendarAlt />}
              title="Easy Scheduling"
              text="Book employees with just a few clicks"
            />
            <Feature
              icon={<FaUserTie />}
              title="Verified Professionals"
              text="Access qualified and vetted employees"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join our platform to book or manage employees</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputWithIcon
              icon={<FaUser className="text-gray-400" />}
              id="full_name"
              name="full_name"
              placeholder="Full Name"
              onChange={handleChange}
              error={fieldErrors.full_name}
            />

            <InputWithIcon
              icon={<FaEnvelope className="text-gray-400" />}
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              error={fieldErrors.email}
            />

            <InputWithIcon
              icon={<FaPhone className="text-gray-400" />}
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number (e.g. +919876543210)"
              onChange={handleChange}
              error={fieldErrors.phone}
            />

            <InputWithIcon
              icon={<FaMapMarkerAlt className="text-gray-400" />}
              id="location"
              name="location"
              placeholder="Location Name (e.g. Kochi, India)"
              onChange={handleChange}
              error={fieldErrors.location}
            />

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Click on the map to select your exact location:
              </p>
              <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                <MapContainer
                  center={[9.9312, 76.2673]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <LocationMarker setLatLng={setLatLng} />
                </MapContainer>
              </div>
              {latLng && (
                <p className="text-sm text-gray-600 mt-2">
                  Latitude: <b>{latLng.latitude.toFixed(5)}</b> | Longitude:{" "}
                  <b>{latLng.longitude.toFixed(5)}</b>
                </p>
              )}
              {fieldErrors.latitude && (
                <p className="text-red-500 text-sm">{fieldErrors.latitude[0]}</p>
              )}
              {fieldErrors.longitude && (
                <p className="text-red-500 text-sm">{fieldErrors.longitude[0]}</p>
              )}
            </div>

            <PasswordInput
              id="password"
              name="password"
              placeholder="Password (min 8 chars)"
              showPassword={showPassword}
              toggleShow={() => setShowPassword(!showPassword)}
              onChange={handleChange}
              error={fieldErrors.password}
            />

            <PasswordInput
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm Password"
              showPassword={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              onChange={handleChange}
              error={fieldErrors.confirm_password}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Account Type:</label>
              <div className="grid grid-cols-2 gap-4">
                <UserTypeOption
                  label="Client"
                  description="I want to book employees"
                  selected={userType === "client"}
                  onClick={() => setUserType("client")}
                />
                <UserTypeOption
                  label="Professional"
                  description="I want to offer services"
                  selected={userType === "employee"}
                  onClick={() => setUserType("employee")}
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg flex justify-center items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading && <div className="loader mr-2 border-t-white"></div>}
              {loading ? "Registering..." : "Get Started"}
            </button>
          </form>
         <div className="text-center text-sm text-gray-600 mt-4">
  Already have an account?{" "}
  <span
    onClick={() => navigate("/login")}
    className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium"
  >
    Login
  </span>
</div>

        </div>
      </div>

      
    </div>
  );
};

// ---------------- Loader ----------------
const loaderStyle = `
.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;
const Loader = () => <style>{loaderStyle}</style>;

// ---------------- Reusable Components ----------------
const Feature = ({ icon, title, text }) => (
  <div className="flex items-center space-x-4">
    <div className="bg-blue-500 bg-opacity-30 p-3 rounded-full text-white">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-blue-100 text-sm">{text}</p>
    </div>
  </div>
);

const InputWithIcon = ({ icon, id, name, type = "text", placeholder, onChange, error }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      id={id}
      name={name}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ${
        error ? "border-red-500" : "border-gray-200"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error[0]}</p>}
  </div>
);

const PasswordInput = ({
  id,
  name,
  placeholder,
  showPassword,
  toggleShow,
  onChange,
  error,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaLock className="text-gray-400" />
    </div>
    <input
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ${
        error ? "border-red-500" : "border-gray-200"
      }`}
    />
    <button
      type="button"
      onClick={toggleShow}
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
    </button>
    {error && <p className="text-red-500 text-sm mt-1">{error[0]}</p>}
  </div>
);

const UserTypeOption = ({ label, description, selected, onClick }) => (
  <label
    onClick={onClick}
    className={`block p-4 border rounded-lg cursor-pointer transition duration-200 ${
      selected
        ? "border-blue-500 bg-blue-50 text-blue-700"
        : "border-gray-200 hover:border-gray-300 text-gray-700"
    }`}
  >
    <div className="flex items-center">
      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
          selected ? "border-blue-500 bg-blue-500" : "border-gray-400"
        }`}
      >
        {selected && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  </label>
);

export default Register;

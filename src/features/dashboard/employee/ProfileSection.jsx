import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeProfile,
  updateEmployeeProfile,
} from "../profileSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCamera } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map Marker component
const LocationMarker = ({ latLng, setLatLng }) => {
  const [position, setPosition] = useState(
    latLng ? [latLng.latitude, latLng.longitude] : null
  );

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLatLng({ latitude: lat, longitude: lng });
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const ProfileSection = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  const [localProfile, setLocalProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    title: "",
    bio: "",
    experience: "",
    rate: "",
    availability: "available",
    skills: "",
    profile_image: "",
  });
 
 
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [latLng, setLatLng] = useState(null);

  // Fetch profile
  useEffect(() => {
    dispatch(fetchEmployeeProfile());
  }, [dispatch]);

  // Fill local profile when fetched
  useEffect(() => {
    if (profile) {
      const emp = profile.employee_profile || {}; 
      // console.log(emp,'ddd');
      

      let skillsData = "";
      if (emp.skills) {
        if (Array.isArray(emp.skills)) skillsData = emp.skills.join(", ");
        else if (typeof emp.skills === "string") skillsData = emp.skills;
      } else if (profile.skills) {
        if (Array.isArray(profile.skills)) skillsData = profile.skills.join(", ");
        else if (typeof profile.skills === "string") skillsData = profile.skills;
      }

      const imageUrl =
        profile.profile_image?.startsWith("http")
          ? profile.profile_image
          : profile.profile_image
          ? `http://127.0.0.1:8000${profile.profile_image}`
          : "https://via.placeholder.com/120";

      setLocalProfile({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        latitude: emp.latitude || profile.latitude || "",
        longitude: emp.longitude || profile.longitude || "",
        title: emp.title || "",
        bio: emp.bio || "",
        experience: emp.experience?.toString() || "",
        rate: emp.hourly_rate || "",
        availability: emp.available ? "available" : "unavailable",
        skills: skillsData,
        profile_image: imageUrl,
      });

      // Set initial map marker
      if (emp.latitude && emp.longitude) {
        setLatLng({ latitude: parseFloat(emp.latitude), longitude: parseFloat(emp.longitude) });
      }
    }
  }, [profile]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setLocalProfile((prev) => ({
        ...prev,
        profile_image: URL.createObjectURL(file),
      }));
    }
  };

  // Save profile
  const handleSave = () => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
      
      toast.error("Unauthorized! Please log in again.");
      return;
    }

    if (!latLng) {
      toast.error("Please select your location on the map.");
      return;
    }

    const formData = new FormData();
    formData.append("title", localProfile.title);
    formData.append("bio", localProfile.bio);
    formData.append("experience", localProfile.experience);
    formData.append("hourly_rate", localProfile.rate);
    formData.append("available", localProfile.availability === "available");
    formData.append(
      "skills",
      localProfile.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    formData.append("latitude", latLng.latitude);
    formData.append("longitude", latLng.longitude);

    if (selectedImage) {
      formData.append("profile_image", selectedImage);
    }

    dispatch(updateEmployeeProfile(formData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        dispatch(fetchEmployeeProfile());
      })
      .catch((err) => {
        toast.error(err || "Failed to update profile!");
      });
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-full text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-10">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={localProfile.profile_image || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover"
          />
          <label
            htmlFor="profile-image-upload"
            className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 cursor-pointer transition"
          >
            <FiCamera />
          </label>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <h2 className="text-xl font-semibold mt-4 text-gray-800">
          {localProfile.full_name || "Employee Name"}
        </h2>
        <p className="text-sm text-gray-500">
          {localProfile.title || "Your role"}
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Full Name" type="text" value={localProfile.full_name} readOnly />
        <InputField label="Email" type="email" value={localProfile.email} readOnly />
        <InputField label="Phone Number" type="text" name="phone" value={localProfile.phone} onChange={handleChange} />
        <InputField label="Location" type="text" name="location" value={localProfile.location} onChange={handleChange} />
        <InputField label="Title" type="text" name="title" value={localProfile.title} onChange={handleChange} />
        <InputField label="Experience (Years)" type="number" name="experience" value={localProfile.experience} onChange={handleChange} />
        <InputField label="Hourly Rate ($)" type="number" name="rate" value={localProfile.rate} onChange={handleChange} />
        <SelectField
          label="Availability"
          name="availability"
          value={localProfile.availability}
          onChange={handleChange}
          options={[
            { value: "available", label: "Available" },
            { value: "unavailable", label: "Unavailable" },
          ]}
        />
      </div>

      <div className="mt-6">
        <TextAreaField label="Bio" name="bio" value={localProfile.bio} onChange={handleChange} />
      </div>

      <div className="mt-6">
        <InputField
          label="Skills (comma-separated)"
          type="text"
          name="skills"
          value={localProfile.skills}
          onChange={handleChange}
        />
      </div>

      {/* Map for Latitude & Longitude */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Click on the map to update your location:</p>
        <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
          <MapContainer
            center={latLng ? [latLng.latitude, latLng.longitude] : [9.9312, 76.2673]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <LocationMarker latLng={latLng} setLatLng={setLatLng} />
          </MapContainer>
        </div>
        {latLng && (
          <p className="text-sm text-gray-600 mt-2">
            Latitude: <b>{latLng.latitude.toFixed(5)}</b> | Longitude: <b>{latLng.longitude.toFixed(5)}</b>
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </div>
  );
};

// ===== Reusable Components =====
const InputField = ({ label, type, name, value, onChange, readOnly = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      rows="4"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default ProfileSection;

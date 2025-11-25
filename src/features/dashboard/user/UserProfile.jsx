import React, { useEffect, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../userprofileSlice";
import { ToastContainer, toast } from "react-toastify";


// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map click handler
const LocationSelector = ({ setLat, setLng }) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });
  return null;
};

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userprofile , loading , success } = useSelector((state) => state.userprofile);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    profile_image: "",
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  useEffect(() => {
    if (userprofile) {
      setLat(userprofile.latitude);
      setLng(userprofile.longitude);

      setFormData({
        full_name: userprofile.full_name || "",
        phone: userprofile.phone || "",
        location: userprofile.location || "",
        latitude: userprofile.latitude || "",
        longitude: userprofile.longitude || "",
        profile_image: userprofile.profile_image
          ? `http://127.0.0.1:8000${userprofile.profile_image}`
          : "https://via.placeholder.com/120",
      });
    }
  }, [userprofile]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      setFormData({
        ...formData,
        profile_image: URL.createObjectURL(file),
      });
    }
  };

  // SAVE PROFILE
  const handleSave = () => {
    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    data.append("latitude", lat);
    data.append("longitude", lng);

    if (selectedImage) {
      data.append("profile_image", selectedImage);
    }

    dispatch(updateUserProfile(data))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        dispatch(fetchUserProfile());
      })
      .catch(() => {
        toast.error("Failed to update profile!");
      });
  };

  if (!lat || !lng) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-10">
       

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={formData.profile_image}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover"
          />

          <label
            htmlFor="profile-image-upload"
            className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
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
          {formData.full_name}
        </h2>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
        />
        <InputField label="Email" value={userprofile.email} readOnly />
        <InputField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      {/* Map */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Click on the map to update your location:
        </p>

        <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationSelector setLat={setLat} setLng={setLng} />

            <Marker position={[lat, lng]} />
          </MapContainer>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Latitude: <b>{lat}</b> | Longitude: <b>{lng}</b>
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </div>
  );
};

const InputField = ({ label, name, value, onChange, readOnly = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-indigo-500"
      }`}
    />
    
  </div>
);

export default UserProfile;

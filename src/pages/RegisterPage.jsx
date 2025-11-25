import React, { useState, useEffect } from "react";
import Register from "../features/authentication/auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetAuthState } from "../features/authentication/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    location: "",
  });

  const [latLng, setLatLng] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userType, setUserType] = useState("client");
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.phone) {
      toast.error("Please give your Phone number");
      return;
    }
    if (!latLng) {
      toast.error("Please select your location on the map");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Privacy Policy");
      return;
    }

    const roundedLatLng = {
      latitude: parseFloat(latLng.latitude.toFixed(6)),
      longitude: parseFloat(latLng.longitude.toFixed(6)),
    };

    const finalData = { ...formData, ...roundedLatLng, role: userType };

    localStorage.setItem("email", finalData.email);

    dispatch(registerUser(finalData));
  };

  // Success / Error handling
  useEffect(() => {
    if (success) {
      toast.success("Registration successful! Please verify your email.");

      const timer = setTimeout(() => {
        navigate("/otpverify");
        dispatch(resetAuthState());
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (error) {
      setFieldErrors(error.fields || {});
      toast.error(error.message || "Registration failed.");
    }
  }, [success, error]);

  return (
    <Register
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      fieldErrors={fieldErrors}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      termsAccepted={termsAccepted}
      setTermsAccepted={setTermsAccepted}
      userType={userType}
      setUserType={setUserType}
      latLng={latLng}
      setLatLng={setLatLng}
      loading={loading}
    />
  );
};

export default RegisterPage;

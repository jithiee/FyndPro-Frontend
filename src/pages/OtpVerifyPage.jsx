import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp, resetAuthState } from "../features/authentication/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpVerify from "../features/authentication/auth/OtpVerify";

const OtpVerifyPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, otpVerified, error } = useSelector((state) => state.auth);
  const email = localStorage.getItem("email");

  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (error && error.message) toast.error(error.message);
  }, [error]);


  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (!email) {
      toast.error("Email not found. Please register again.");
      return navigate("/register");
    }

    if (otpCode.length !== 6) return toast.error("Enter all 6 digits.");

    const result = await dispatch(verifyOtp({ email, otp: otpCode }));

    if (verifyOtp.fulfilled.match(result)) {
      localStorage.removeItem("email");
      setTimeout(() => {
        navigate("/login");
        dispatch(resetAuthState());
      }, 1000);
    }
  };

  const handleResend = async () => {
    if (!email) return navigate("/register");

    const result = await dispatch(resendOtp(email));
    if (resendOtp.fulfilled.match(result)) {
      toast.info("New OTP sent!");
      setCountdown(60);
    }
  };

  return (
    <OtpVerify
      otp={otp}
      countdown={countdown}
      inputRefs={inputRefs}
      loading={loading}
      otpVerified={otpVerified}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleKeyDown={handleKeyDown}
      handleResend={handleResend}
    />
  );
};

export default OtpVerifyPage;

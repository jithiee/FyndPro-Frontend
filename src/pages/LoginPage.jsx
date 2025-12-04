
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "../features/authentication/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Login from "../features/authentication/auth/Login";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, loading, error, success } = useSelector((state) => state.auth);

 // Success / Error handling
  useEffect(() => {
    if (success) {
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        if (user.role === "client") {
          navigate("/userdashboard");
        } else {
          navigate("/employeedashboard");
        }
        dispatch(resetAuthState());
      }, 2000);
    }

    if (error?.message) {
      toast.error(error.message);
      dispatch(resetAuthState());
    }
  }, [success, error, dispatch, navigate, user]);

 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <Login
      email={email}
      password={password}
      showPassword={showPassword}
      setEmail={setEmail}
      setPassword={setPassword}
      setShowPassword={setShowPassword}
      loading={loading}
      handleSubmit={handleSubmit}
    />
  );
};

export default LoginPage;

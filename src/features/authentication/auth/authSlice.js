
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";

// -------- Register User --------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/register/", userData);
      console.log(response.data , 'ddaaa');
      
      return response.data;
    } catch (error) {
      const backendData = error.response?.data;

      // Extract backend error messages
      if (backendData?.error) {
        const firstKey = Object.keys(backendData.error)[0];
        const firstMessage = backendData.error[firstKey][0];

        return rejectWithValue({
          message: firstMessage || backendData.message || "Registration failed.",
          fields: backendData.error,
        });
      }

      //  Handle network/unexpected errors
      return rejectWithValue({
        message: backendData?.message || "Something went wrong. Please try again.",
      });
    }
  }
);


// -------- Verify OTP --------
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/verify-otp/", { email, otp });
      console.log(response.data, "ottppppp daaaaaaaaaataaaa");
      return response.data;
    } catch (error) {
      console.log(error.response?.data, " OTP Verification Failed");

      // First define backendData
      const backendData = error.response?.data;

      // Extract backend error message
      const invalidOtpMsg =
        backendData?.non_field_errors?.[0] || "Verification failed.";

      console.log("Extracted error:", invalidOtpMsg);

      //Return structured error for Redux
      if (backendData) {
        return rejectWithValue({ message: invalidOtpMsg });
      }

      //  Handle network error
      return rejectWithValue({ message: "Network error. Please try again." });
    }
  }
);


// -------- Resend OTP --------
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/resend-otp/", { email });
      console.log(response.data , 'daa');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: "Network error. Please try again." });
    }
  }
);


// ---------- Login User ----------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login/", credentials);
      // console.log(response.data , 'looginggg dataaa');
      
      return response.data;
    } catch (error) {
      const backendData = error.response?.data;
      const msg =
        backendData?.non_field_errors?.[0] ||
        backendData?.detail ||
        backendData?.message ||
        "Invalid email or password.";
      return rejectWithValue({ message: msg });
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    otpVerified: false,
    otpMessage: null,
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.otpVerified = false;
      state.otpMessage = null;
    },

      logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.otpVerified = false;
      state.otpMessage = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
    },
  },
  extraReducers: (builder) => {
    builder
      // ----- Register -----
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- Verify OTP -----
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.otpMessage =
          action.payload.message || "Your account has been verified successfully.";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- Resend OTP -----
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpMessage =
          action.payload.message || "A new OTP has been sent to your email.";
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ----- Login -----
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;

        // ✅ Save JWT tokens
        localStorage.setItem("accessToken", action.payload.access);
        localStorage.setItem("refreshToken", action.payload.refresh);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetAuthState , logout  } = authSlice.actions;
export default authSlice.reducer;



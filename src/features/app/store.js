import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authentication/auth/authSlice";
import profileReducer from "../dashboard/profileSlice"
import userprofileReducer from '../dashboard/userprofileSlice'
import employeeNearbyReducer from "../booking/bookingSlice";
import postReducer from "../posts/postSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    userprofile : userprofileReducer , 
    employeeNearby: employeeNearbyReducer,
    posts: postReducer,
  },
});

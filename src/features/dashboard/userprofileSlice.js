import axios from "../../api/axios";
import { createSlice ,   createAsyncThunk } from "@reduxjs/toolkit";

// -------- Fetch User Profile --------
export const fetchUserProfile = createAsyncThunk(
    "userprofile/fetchUserProfile",
    async(_, {rejectWithValue})=>{
        try {
            const response = await axios.get("/user/profile/");
            
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Faild to fetch  userprofile"
            );
        }
    }
);

// -------- Update User Profile --------
export const updateUserProfile = createAsyncThunk (
    "userprofile/updateuserprofile",
    async(formData , {rejectWithValue})=>{
        try {
            const response = await axios.put("/user/profile/" , formData , {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile."
            );
        }
    }
);


// -------- Fetch Employee by ID with  Profile Data --------
export const fetchEmployeeByIDProfile = createAsyncThunk(
  "userprofile/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/book/employee/${userId}/`);
    //   console.log(response.data , 'id data user : ,,,,,,,,');
      
      return response.data;
    } catch (error) {
        console.log('nooooooooooooo');
        
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user by ID."
      );
    }
  }
);



const userprofileSlice = createSlice({
    name:"userprofile", 
    initialState:{
        userprofile: null , 
        loading: false,
        error: null,
        success: false,

    }, 
    reducers:{
        resetProfileState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    }, 
    extraReducers:(builder)=>{
       builder
        // Fetch User Profile
        .addCase(fetchUserProfile.pending , (state)=>{
            state.loading = true;
        })
        .addCase(fetchUserProfile.fulfilled , (state , action)=>{
            state.loading = false;
            state.userprofile = action.payload;
        })
        .addCase(fetchUserProfile.rejected , (state , action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        // Update User Profile
        .addCase(updateUserProfile.pending , (state)=>{
            state.loading = true;
            state.success = false;
        })
        .addCase(updateUserProfile.fulfilled , (state , action)=>{
            state.loading = false;
            state.success = true;
            state.userprofile = action.payload;
        })
        .addCase(updateUserProfile.rejected , (state , action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        })
        builder
        // -------- Fetch Employee By ID --------
        .addCase(fetchEmployeeByIDProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchEmployeeByIDProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.userprofile = action.payload;
        })
        .addCase(fetchEmployeeByIDProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });


    }
})

export const {resetProfileState} = userprofileSlice.actions;
export default userprofileSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// -------- Fetch Employee Profile --------
export const fetchEmployeeProfile = createAsyncThunk(
  "profile/fetchEmployeeProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/employee/profile/");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  }
);

// -------- Update Employee Profile --------
export const updateEmployeeProfile = createAsyncThunk(
  "profile/updateEmployeeProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/employee/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  }
);

// -------- Create Employee Post --------
export const createEmployeePost = createAsyncThunk(
  "profile/createEmployeePost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/post/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post."
      );
    }
  }
);

// -------- Fetch Posts by Specific Employee ID --------
export const fetchPostsByEmployeeId = createAsyncThunk(
  "profile/fetchPostsByEmployeeId",
  async (employeeId, { rejectWithValue }) => {
    try {
      // console.log(employeeId , 'idd');
      
      const response = await axios.get(`/post/posts/employee/${employeeId}/`);
       console.log(response.data , 'dddd');
       
      return response.data;
    } catch (error) {
      console.log(error.response.data , 'eddd');
      
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts for this employee."
      );
    }
  }
);


// -------- Fetch Comments for a Post --------
export const fetchCommentsByPostId = createAsyncThunk(
  "profile/fetchCommentsByPostId",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/post/posts/${postId}/comments/`);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load comments."
      );
    }
  }
);

// -------- Add Comment to a Post --------
export const addCommentToPost = createAsyncThunk(
  "profile/addCommentToPost",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/post/posts/${postId}/comments/`, {
        text: text,
      });

      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment."
      );
    }
  }
);



const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    posts: [],
    commentsByPost: {}, 
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchEmployeeProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateEmployeeProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Post
      .addCase(createEmployeePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployeePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.success = true;
      })
      .addCase(createEmployeePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Posts by Employee ID
      .addCase(fetchPostsByEmployeeId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostsByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Comments
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, comments } = action.payload;
        state.commentsByPost[postId] = comments;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Comment
      .addCase(addCommentToPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCommentToPost.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, comment } = action.payload;

        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }

        state.commentsByPost[postId].push(comment);
      })
      .addCase(addCommentToPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        },
      });

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
















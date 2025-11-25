
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// ------------------ Fetch All Posts ------------------
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/post/all-posts/?page=${page}`);
      console.log(res.data , 'ddddaaaa');
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ------------------ Like / Unlike Post ------------------
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/posts/${postId}/like/`);
      return { postId, message: res.data.msg };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ------------------ Fetch Comments of a Post ------------------
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/posts/${postId}/comments/`);
      return { postId, comments: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ------------------ Add Comment ------------------
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/posts/${postId}/comments/`, { text });
      return { postId, newComment: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ------------------ Update Comment ------------------
export const updateComment = createAsyncThunk(
  "posts/updateComment",
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/comments/${commentId}/`, { text });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ------------------ Delete Comment ------------------
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await axios.delete(`/comments/${commentId}/`);
      return commentId;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    comments: {}, 
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // -------- Fetch All Posts --------
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.results;
        state.currentPage = action.payload.current;
        state.totalPages = action.payload.total;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Like Post --------
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          if (action.payload.message === "Post liked") {
            post.is_liked = true;
            post.likes_count += 1;
          } else {
            post.is_liked = false;
            post.likes_count -= 1;
          }
        }
      })

      // -------- Fetch Comments --------
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      })

      // -------- Add Comment --------
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments[action.payload.postId].unshift(action.payload.newComment);
      })

      // -------- Delete Comment --------
      .addCase(deleteComment.fulfilled, (state, action) => {
        Object.keys(state.comments).forEach((postId) => {
          state.comments[postId] = state.comments[postId].filter(
            (c) => c.id !== action.payload
          );
        });
      });
  },
});

export default postSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/comments";

// 👉 Fetch comments for a post
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    const res = await axios.get(`${API_URL}/${postId}`);
    console.log("Comments API response:", res.data); // 👀 Debug
    return res.data;
  }
);

// 👉 Add comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, text }, { getState }) => {
    const token = getState().auth.user?.token;
    const res = await axios.post(
      API_URL,
      { postId, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

// 👉 Update comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ id, text }, { getState }) => {
    const token = getState().auth.user?.token;
    const res = await axios.put(
      `${API_URL}/${id}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

// 👉 Delete comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id, { getState }) => {
    const token = getState().auth.user?.token;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Always force to array
        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload.comments || [];
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // Delete
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default commentSlice.reducer;

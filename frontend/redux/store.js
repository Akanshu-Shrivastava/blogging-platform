import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../src/features/auth/authSlice.js";   
import commentReducer from "../src/features/comments/commentSlice.js";        

const store = configureStore({
  reducer: {
    auth: authReducer,
    comments: commentReducer,
  },
});

export default store;

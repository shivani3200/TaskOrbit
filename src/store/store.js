import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./features/boardsSlice";
import authReducer from "./features/authSlice"; // Assuming your auth slice is named authSlice.js

export const store = configureStore({
  reducer: {
    board: boardReducer,
    auth: authReducer
  }
});

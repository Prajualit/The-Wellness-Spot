import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./Store/navbarSlice.js";
import userReducer from "./Store/userSlice.js";

export const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    user: userReducer,
  },
});
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./navbar/navbarSlice.js";

export const store = configureStore({
  reducer: {
    navbar: navbarReducer,
  },
});
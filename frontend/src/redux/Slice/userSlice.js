// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAdmin: false,
  records: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAdmin = action.payload?.isAdmin || false; // 🟩 Automatically sync isAdmin
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof action.payload.isAdmin !== "undefined") {
          state.isAdmin = action.payload.isAdmin;
        }
      }
    },
    addUserRecord(state, action) {
      state.records.push(action.payload);
    },
    clearUser(state) {
      state.user = null;
      state.isAdmin = false; // 🟩 Clear isAdmin
    },
  },
});

export const { setUser, clearUser, updateUser, addUserRecord } =
  userSlice.actions;
export default userSlice.reducer;

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
      // Ensure we only store serializable data
      const userData = JSON.parse(JSON.stringify(action.payload));
      state.user = userData;
      state.isAdmin = userData?.isAdmin || false;
    },
    updateUser(state, action) {
      if (state.user) {
        // Ensure we only store serializable data
        const updateData = JSON.parse(JSON.stringify(action.payload));
        state.user = { ...state.user, ...updateData };
        if (typeof updateData.isAdmin !== "undefined") {
          state.isAdmin = updateData.isAdmin;
        }
      }
    },
    addUserRecord(state, action) {
      // Ensure we only store serializable data
      const recordData = JSON.parse(JSON.stringify(action.payload));
      state.records.push(recordData);
    },
    clearUser(state) {
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { setUser, clearUser, updateUser, addUserRecord } =
  userSlice.actions;
export default userSlice.reducer;

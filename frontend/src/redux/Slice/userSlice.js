// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    updateUser(state, action) {
      if (!state.user) return;

      if (action.payload.media) {
        if (!Array.isArray(state.user.media)) {
          state.user.media = [];
        }

        state.user.media.push(action.payload.media);
      }

      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;

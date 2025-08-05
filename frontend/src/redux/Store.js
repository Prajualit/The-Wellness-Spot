// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./Slice/navbarSlice.js";
import userReducer from "./Slice/userSlice.js";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Config for persisting the 'user' slice
const userPersistConfig = {
  key: "user",
  storage,
  // Add serialize/deserialize to ensure clean data
  serialize: (state) => {
    try {
      return JSON.stringify(state);
    } catch (error) {
      return JSON.stringify({});
    }
  },
  deserialize: (serializedState) => {
    try {
      return JSON.parse(serializedState);
    } catch (error) {
      return {};
    }
  },
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    navbar: navbarReducer, // not persisted
    user: persistedUserReducer, // persisted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['user.register'],
      },
    }),
});

export const persistor = persistStore(store);

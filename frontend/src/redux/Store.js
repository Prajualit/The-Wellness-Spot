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
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    navbar: navbarReducer, // not persisted
    user: persistedUserReducer, // persisted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to avoid redux-persist warnings
    }),
});

export const persistor = persistStore(store);

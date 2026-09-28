import { configureStore } from "@reduxjs/toolkit";

import {
  persistReducer,
  persistStore,
} from "redux-persist";

import authReducer from "./slices/authSlice";

// Browser localStorage adapter
const storage = {
  getItem: (key: string) => {
    return Promise.resolve(
      window.localStorage.getItem(key)
    );
  },

  setItem: (key: string, value: string) => {
    window.localStorage.setItem(key, value);

    return Promise.resolve();
  },

  removeItem: (key: string) => {
    window.localStorage.removeItem(key);

    return Promise.resolve();
  },
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;
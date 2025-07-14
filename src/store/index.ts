import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import templateReducer from "./slices/templateSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    template: templateReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

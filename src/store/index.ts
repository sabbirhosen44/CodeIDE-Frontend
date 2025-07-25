import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import templateReducer from "./slices/templateSlice";
import adminReducer from "./slices/adminSlice";
import projectReducer from "./slices/projectSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    template: templateReducer,
    admin: adminReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: (localStorage.getItem("ui-theme") as Theme) || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("ui-theme", state.theme);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;

import { RootState } from "@/store";
import { setTheme } from "@/store/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";

export const useTheme = () => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  const changeTheme = (newTheme: "light" | "dark") => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    setTheme: changeTheme,
  };
};

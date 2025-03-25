import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useTheme } from "./hooks/use-theme";
import MainLayout from "./Layout/MainLayout";
import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/templates",
        element: <TemplatesPage />,
      },
    ],
  },
]);

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;

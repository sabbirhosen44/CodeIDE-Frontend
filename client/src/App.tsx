import { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useTheme } from "./hooks/use-theme";
import MainLayout from "./Layout/MainLayout";
import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";
import SnippetsPage from "./pages/snippets/SnippetsPage";
import SnippetDetailPage from "./pages/snippets/SnippetDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Toaster } from "react-hot-toast";
import PricingPage from "./pages/PricingPage";

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
      {
        path: "/snippets",
        element: <SnippetsPage />,
      },
      {
        path: "/snippets/:id",
        element: <SnippetDetailPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
    ],
  },
  { path: "/404", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;

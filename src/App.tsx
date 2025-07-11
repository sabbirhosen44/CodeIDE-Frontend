import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useTheme } from "./hooks/use-theme";
import MainLayout from "./Layout/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PricingPage from "./pages/PricingPage";
import SnippetDetailPage from "./pages/snippets/SnippetDetailPage";
import SnippetsPage from "./pages/snippets/SnippetsPage";
import TemplatesPage from "./pages/TemplatesPage";
import EditorPage from "./pages/editor/EditorPage";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyEmailPage from "./pages/auth/VerifyEmail";
import DashboardPage from "./pages/Dashboard/DashboardPage";

const router = createBrowserRouter([
  {
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
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify-email/:id", element: <VerifyEmailPage /> },
    ],
  },
  {
    path: "/editor",
    element: <EditorPage />,
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

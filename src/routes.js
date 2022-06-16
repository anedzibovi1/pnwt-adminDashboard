import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import User from "./pages/User";
import Login from "./pages/Login";
import NotFound from "./pages/Page404";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [{ path: "app", element: <User /> }],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "/", element: <Navigate to="/login" /> },
        { path: "login", element: <Login /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/user/home";
import ReportPage from "../pages/user/reports";
import AdminDashboardPage from "../pages/admin/dashboard";
import ReportDetailPage from "../pages/user/report_detail";
import ReportSubmissionPage from "../pages/user/report_submission";
import LoginPage from "../pages/user/login";
import RegisterPage from "../pages/user/register";
import UserDashboardPage from "../pages/user/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/reports",
    element: <ReportPage />,
  },
  {
    path: "/reports/:id",
    element: <ReportDetailPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboardPage />,
  },
  {
    path: "/reports/add",
    element: <ReportSubmissionPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <UserDashboardPage />,
  },
]);

export default router;

import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/user/home";
import ReportPage from "../pages/user/reports";
import AdminDashboardPage from "../pages/admin/dashboard";
import AdminDashboardPageCoba from "../pages/admin/dashboard/indexCoba"; //ini dashboard admin tryyyyyyyyyy
import ReportDetailPage from "../pages/user/report_detail";
import ReportSubmissionPage from "../pages/user/report_submission";
import LoginPage from "../pages/user/login";
import RegisterPage from "../pages/user/register";
import UserDashboardPage from "../pages/user/dashboard";
import MapReportPage from "../pages/user/map_report";
import FAQPage from "../pages/user/faq";
import AdminReportsPage from "../pages/admin/reports";
import AdminRedzonePage from "../pages/admin/map_redzone";

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
    path: "/admin/dashboardCoba",
    element: <AdminDashboardPageCoba />,
  },
  {
    path: "/admin/reports",
    element: <AdminReportsPage />,
  },
  {
    path: "/admin/map_redzone",
    element: <AdminRedzonePage />,
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
  {
    path: "/map-report",
    element: <MapReportPage />,
  },
  {
    path: "/FAQ",
    element: <FAQPage />,
  },
]);

export default router;

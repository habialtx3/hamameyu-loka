import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/user/home";
import ReportPage from "../pages/user/reports";
import AdminDashboardPage from "../pages/admin/dashboard";
import ReportDetailPage from "../pages/user/report_detail";

const router = createBrowserRouter([
    {
        path : '/',
        element : <Home/>
    },
    {
        path : '/reports',
        element : <ReportPage/>
    },
    {
        path : '/reports/:id',
        element : <ReportDetailPage/>
    },
    {
        path: '/admin-dashboard',
        element : <AdminDashboardPage/>
    }
])

export default router;
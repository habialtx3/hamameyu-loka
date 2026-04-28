import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/user/home";
import ReportPage from "../pages/user/reports";
import AdminDashboardPage from "../pages/admin/dashboard";

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
        path: '/admin-dashboard',
        element : <AdminDashboardPage/>
    }
])

export default router;
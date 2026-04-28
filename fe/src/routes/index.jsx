import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/home";
import ReportPage from "../pages/reports";

const router = createBrowserRouter([
    {
        path : '/',
        element : <Home/>
    },
    {
        path : '/reports',
        element : <ReportPage/>
    }
])

export default router;
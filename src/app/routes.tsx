import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { StockTable } from "./pages/StockTable";
import { StockDetail } from "./pages/StockDetail";
import { AddStock } from "./pages/AddStock";
import { EditStock } from "./pages/EditStock";
import { StockChart } from "./pages/StockChart";
import { SellingChart } from "./pages/SellingChart";
import { ReportTable } from "./pages/ReportTable";
import { ReportDetail } from "./pages/ReportDetail";
import { UserManagement } from "./pages/UserManagement";
import { GrossProfitTable } from "./pages/GrossProfitTable";
import { useAuth } from '../utils/AuthContext';
import { UserRole } from '../utils/types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { isAuthenticated, role, user } = useAuth();

  // 1. Cek apakah sudah login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Cek Role (jika ada batasan role)
  // if (allowedRoles && role && !allowedRoles.includes(role)) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <Outlet />; // Render anak rute
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    // element: <ProtectedRoute />,
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "stock/table", Component: StockTable },
      { path: "stock/detail", Component: StockDetail },
      { path: "stock/add", Component: AddStock },
      { path: "stock/edit", Component: EditStock },
      { path: "stock/chart", Component: StockChart },
      { path: "selling-chart", Component: SellingChart },
      { path: "ledger/table", Component: GrossProfitTable },
      { path: "report/table", Component: ReportTable },
      { path: "report/detail", Component: ReportDetail },
      { path: "users", Component: UserManagement },
      // Rute khusus Admin
      // {
      //   element: <ProtectedRoute allowedRoles={['admin']} />,
      //   children: [
      //     { path: "users", Component: UserManagement },
      //   ]
      // },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

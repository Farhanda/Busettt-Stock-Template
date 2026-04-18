import { createBrowserRouter, Navigate } from "react-router";
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
      { path: "report/table", Component: ReportTable },
      { path: "report/detail", Component: ReportDetail },
      { path: "users", Component: UserManagement },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

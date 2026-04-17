import { Routes, Route } from "react-router-dom";
import Register from "../pages/Auth/Register/Register";
import Home from "../pages/HomePage/Home";
import Login from "../pages/Auth/Login/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Sections from "../pages/Sections/Sections";
import Suppliers from "../pages/Suppliers/Supplier";
import Items from "../pages/Items/Items";
import EditItem from "../pages/Items/EditItems";
import LowStock from "../pages/LowStock/LowStock";
import StockHistory from "../pages/stockHistory/stockHistory";
import VerifyOTP from "../pages/Auth/verifyOtP/VerifyOtp";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import NotFound from "../pages/NotFound/NotFound";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="sections" element={<Sections />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="items" element={<Items />} />
        <Route path="items/edit/:id" element={<EditItem />} />
        <Route path="low-stock" element={<LowStock />} />
        <Route path="stock-history" element={<StockHistory />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

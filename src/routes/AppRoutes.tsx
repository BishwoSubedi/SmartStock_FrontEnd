import { Routes, Route } from "react-router-dom";
import Register from "../pages/Auth/Register/Register";
import Home from "../pages/HomePage/Home";
import Login from "../pages/Auth/Login/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
  path="/"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
   <Route path="dashboard" element={<Dashboard />} />
</Route>
    </Routes>
  );
}

export default AppRoutes;
import { Routes, Route } from "react-router-dom";
import Register from "../pages/Auth/Register/Register";
import Home from "../pages/HomePage/Home";
import Login from "../pages/Auth/Login/Login";
// import Dashboard from "../pages/Dashboard/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default AppRoutes;
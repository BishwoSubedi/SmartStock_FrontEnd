import { Outlet } from "react-router-dom";
import TopNavbar from "../components/TopNavbar/TopNavbar";

function DashboardLayout() {
  return (
    <div className="dashboard-layout-top">
      <TopNavbar />

      <main className="dashboard-main-top">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
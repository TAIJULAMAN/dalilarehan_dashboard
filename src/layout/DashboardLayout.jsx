import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/LayoutComponents/Header";
import SideBar from "../components/LayoutComponents/SideBar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open for desktop

  return (
    <div className="md:flex min-h-screen overflow-hidden overscroll-none bg-[#FFFEDE]">
      {/* Sidebar - Desktop: always visible, iPad: collapsible overlay */}
      {sidebarOpen && (
        <div className="md:w-80 bg-[#FEFEFE] overflow-auto md:fixed md:top-0 md:left-0 md:bottom-0 hidden md:block no-scrollbar z-40">
          <SideBar />
        </div>
      )}

      {/* Mobile/Tablet sidebar overlay */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden 
        fixed top-0 left-0 bottom-0 w-80 bg-[#FEFEFE] overflow-auto 
        transform transition-transform duration-300 ease-in-out z-[60] no-scrollbar`}
      >
        <SideBar />
      </div>

      {/* Overlay for iPad/mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[55] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-80" : "md:ml-0"
        }`}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="mt-36 bg-[#FFFEDE] min-h-screen w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

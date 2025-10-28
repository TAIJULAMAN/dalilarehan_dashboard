import { Popover } from "antd";
import "./notif-popover.css";
import { useEffect, useMemo, useState } from "react";
import { FaBars } from "react-icons/fa";
import { HiOutlineBell, HiOutlineChatAlt, HiOutlineUser } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useGetAdminNotificationsQuery } from "../../redux/Api/notificationApi";
import { useGetAdminMeQuery } from "../../redux/Api/adminApi";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAdminNotificationsQuery({ page: 1, limit: 20 });
  const items = useMemo(() => {
    const arr = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data?.notifications)
      ? data.data.notifications
      : Array.isArray(data?.notifications)
      ? data.notifications
      : [];
    return arr.map((n) => {
      const user = n?.relatedData?.userId || {};
      const createdAt = n?.createdAt ? new Date(n.createdAt).toLocaleString() : "";
      const avatar = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
        user.fullname || user.email || "User"
      )}`;
      return {
        id: n?._id,
        title: n?.title || "",
        description: n?.message || "",
        date: createdAt.split(", ")[0] || "",
        time: createdAt.split(", ")[1] || "",
        avatar,
      };
    });
  }, [data]);
  const latestNotifications = items.slice(0, 3);
  const [fullname, setFullName] = useState("Admin");
  const { data: me } = useGetAdminMeQuery();
  const [cachedProfileImage, setCachedProfileImage] = useState("");

  const getImgSrc = (p) => {
    if (!p || typeof p !== "string") return "";
    if (/^https?:\/\//i.test(p)) return p;
    const apiBase = (import.meta?.env?.VITE_API_URL) || "https://dalilarehan-backend.onrender.com/api/v1";
    const base = apiBase.replace(/\/$/, "");
    return `${base}${p.startsWith("/") ? p : "/" + p}`;
  };

  useEffect(() => {
    const readName = () => {
      if (typeof localStorage === "undefined") return "Admin";
      return (
        
        localStorage.getItem("fullname") ||
        localStorage.getItem("remember_email") ||
        "Admin"
      );
    };

    setFullName(readName());

    // prime cached profile image from localStorage at mount
    try {
      const cached = typeof localStorage !== "undefined" ? localStorage.getItem("profileImage") : "";
      if (cached) setCachedProfileImage(cached);
    } catch (_) {}

    const onStorage = (e) => {
      if (["fullname", "remember_email"].includes(e.key)) {
        setFullName(readName());
      }
      if (e.key === "profileImage" && typeof e.newValue === "string") {
        setCachedProfileImage(e.newValue || "");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // when me changes, cache the profile image for future sessions
  useEffect(() => {
    if (me?.profileImage) {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("profileImage", me.profileImage);
        }
        setCachedProfileImage(me.profileImage);
      } catch (_) {}
    }
  }, [me?.profileImage]);

  const handleLoadMore = () => {
    navigate("/dashboard/notification/all-notifications");
  };

  const notifContent = (
    <div className="p-6 pt-4 pb-6 rounded-lg bg-white w-[500px] mt-8">
      <h2 className="text-center text-[#6033E4] text-2xl font-bold mb-2">
        Notifications
      </h2>
      <div className="border-b border-[#013666] mb-4"></div>
      <div className="flex flex-col gap-3 mb-6 max-h-[250px] overflow-y-auto">
        {latestNotifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-center gap-3 bg-[#F5F7FA] rounded-md p-3"
          >
            <img
              src={notif.avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="text-[#6033E4] font-semibold text-base">
                {notif.title}
              </div>
              <div className="text-gray-700 text-sm">{notif.description}</div>
              <div className="text-[#7A7A7A] text-xs mt-1">
                {notif.date} • {notif.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full bg-[#6033E4] text-white font-semibold py-2 rounded-lg text-lg"
        onClick={handleLoadMore}
      >
        Load More
      </button>
    </div>
  );

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-5 bg-[#FFFEDE] z-50"></div>
      <div
        className={`fixed top-5 right-0 z-50 h-[84px] flex justify-center items-center px-4 py-4 bg-secondary rounded-lg rounded-t-none shadow-md mx-5 transition-all duration-300
          max-md:left-2 max-md:right-2 max-md:h-[64px] max-md:px-3 max-md:py-3 max-md:mx-0 max-md:z-40
          ${sidebarOpen ? "md:left-[20rem]" : "md:left-0"}`}
      >
        <div className="flex w-full justify-between items-center max-md:ml-0 ml-5">
          {/* Left Section */}
          <div className="flex items-center gap-6 max-md:gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center"
            >
              <FaBars
                className="w-8 h-8 max-md:w-6 max-md:h-6 text-primary"
                strokeWidth={4}
              />
            </button>

            <div className="md:flex flex-col min-w-0">
              <h1 className="text-primary text-xl md:text-xl font-bold leading-tight mt-6">
                Welcome, {fullname}
              </h1>
              <p className="text-primary text-xs md:text-sm font-semibold -mt-1">
                Have a nice day!
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 max-md:gap-2 pr-2 shrink-0">
          

            {/* Notification */}
            <Popover
              content={notifContent}
              trigger="click"
              placement="bottomRight"
              overlayClassName="rounded-lg custom-notif-popover"
              overlayStyle={{
                position: "fixed",
                top: 80,
                right: 120,
                zIndex: 2000,
                minWidth: 340,
                marginTop:20
              }}
            >
              <div className="relative flex w-[52px] h-[52px] max-md:w-10 max-md:h-10 items-center justify-center rounded-full border border-primary bg-secondary p-2 max-md:p-1 hover:bg-gray-100 cursor-pointer">
                <HiOutlineBell
                  className="w-9 h-9 max-md:w-6 max-md:h-6 text-primary"
                  strokeWidth={2}
                />
                <div className="absolute top-2 right-2 max-md:top-1 max-md:right-1 w-4 h-4 max-md:w-3 max-md:h-3 bg-theme-red rounded-full flex items-center justify-center">
                  <span className="text-secondary font-montserrat text-xs font-normal">
                    .
                  </span>
                </div>
              </div>
            </Popover>

            {/* Profile */}
            <Link to="/dashboard/profile/edit-profile">
              <div className="flex w-[52px] h-[52px] max-md:w-10 max-md:h-10 items-center justify-center rounded-full border border-primary bg-secondary p-0 overflow-hidden">
                { (me?.profileImage || cachedProfileImage) ? (
                  <img
                    src={getImgSrc(me?.profileImage || cachedProfileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiOutlineUser
                    className="w-8 h-8 max-md:w-6 max-md:h-6 text-primary"
                    strokeWidth={2}
                  />
                )}
              </div>
            </Link>
           
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

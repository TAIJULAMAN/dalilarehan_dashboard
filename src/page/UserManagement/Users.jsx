import { ConfigProvider, Modal, Table } from "antd";
import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { HiOutlineBarsArrowDown } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";

import { MdBlockFlipped } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import PageHeading from "../../shared/PageHeading";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useGetAdminUsersPagedQuery,
  useLazyExportProvidersQuery,
  useLazyExportUsersQuery,
} from "../../redux/Api/userApi";
import Client from "./Client";
import Provider from "./Provider";

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isClientRoute = location.pathname.includes("/dashboard/users/client");
  const isProviderRoute = location.pathname.includes(
    "/dashboard/users/provider"
  );

  // Ensure default selected tab is Clients when user visits /dashboard/users
  useEffect(() => {
    if (!isClientRoute && !isProviderRoute) {
      // replace so browser history doesn't fill with redirects
      navigate("/dashboard/users/client", { replace: true });
    }
    // We only want to run on mount or when location changes
  }, [isClientRoute, isProviderRoute, navigate]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // store clicked user
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data: usersResp, isLoading } = useGetAdminUsersPagedQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const [triggerExportProviders, { isFetching: isExportingProviders }] =
    useLazyExportProvidersQuery();
  const [triggerExportUsers, { isFetching: isExportingUsers }] =
    useLazyExportUsersQuery();

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const openBlockedUsersModal = () => {
    navigate("/dashboard/blocked-users");
  };

  const apiRows = Array.isArray(usersResp?.users)
    ? usersResp.users.map((u, idx) => ({
        key: u._id || `${idx}`,
        no: (page - 1) * limit + (idx + 1),
        userName:
          u.fullname ||
          `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
          "User",
        phoneNumber: u.mobile || u.contactNumber || "",
        joinedDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-GB")
          : "",
        email: u.email || "",
      }))
    : [];

  const dataSource = apiRows;

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "User Name",
      key: "userName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://avatar.iran.liara.run/public/${record.no}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span>{record.userName}</span>
        </div>
      ),
    },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Joined Date", dataIndex: "joinedDate", key: "joinedDate" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={showModal}
            className="  text-[#082513] rounded-lg p-2  hover:bg-teal-400 transition duration-200"
          >
            <MdBlockFlipped className="w-6 h-6 text-red-400 hover:text-black" />
          </button>
          <button
            onClick={() => showUserDetails(record)} // pass clicked user
            className="  text-blue-500 rounded-lg p-2  hover:bg-blue-400 transition duration-200"
          >
            <FaEye className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="rounded-t-lg mt-5 rounded-b-none bg-[#6033E4] text-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center mx-5 max-md:mx-3 px-5 max-md:px-3 gap-4 ipad:gap-0">
          <PageHeading title="User List" />
          <div className="flex flex-col ipad:flex-row items-center gap-4 ipad:gap-[50px] w-full ipad:w-auto max-md:items-start max-md:gap-3">
            <div className="relative w-full ipad:w-[300px] max-md:w-full">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search User"
                  className="border-2 py-2 pl-10 pr-4 text-black outline-none w-full rounded-md max-md:text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setDebouncedSearch(search.trim());
                    }
                  }}
                />
                <span className="text-gray-400 absolute top-0 left-0 h-full px-3 flex items-center justify-center">
                  <IoSearch className="text-[1.3rem] max-md:text-[1.1rem]" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isProviderRoute && (
              <button
                onClick={async () => {
                  try {
                    const res = await triggerExportProviders({});
                    const payload = res?.data ?? res ?? null;
                    if (!payload) return;
                    // Handle Blob (binary) or string/JSON.
                    if (payload instanceof Blob) {
                      const blob = payload;
                      const mime = blob.type || "";

                      // Try to detect OpenXML (.xlsx) by checking ZIP signature (PK..)
                      let isZip = false;
                      try {
                        const header = await blob.slice(0, 4).arrayBuffer();
                        const bytes = new Uint8Array(header);
                        isZip = bytes[0] === 0x50 && bytes[1] === 0x4b; // 'PK'
                      } catch (e) {
                        /* ignore */
                      }

                      let ext = "xls";
                      if (isZip || /openxml|spreadsheetml\.sheet/i.test(mime)) {
                        ext = "xlsx";
                      } else if (/csv/i.test(mime) || /^text\//i.test(mime)) {
                        ext = "csv";
                      } else if (/ms-excel/i.test(mime)) {
                        ext = "xls";
                      }

                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `providers_export_${new Date()
                        .toISOString()
                        .replace(/[:.]/g, "-")}.${ext}`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } else {
                      const text =
                        typeof payload === "string"
                          ? payload
                          : JSON.stringify(payload);
                      // Treat textual exports as CSV by default
                      const blob = new Blob([text], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `providers_export_${new Date()
                        .toISOString()
                        .replace(/[:.]/g, "-")}.csv`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    }
                  } catch (e) {
                    console.error("Export providers failed", e);
                  }
                }}
                disabled={isExportingProviders}
                className="bg-sky-600 text-white px-3 py-2 rounded hover:opacity-90"
              >
                {isExportingProviders ? "Exporting..." : "Export Providers"}
              </button>
            )}

            {isClientRoute && (
              <button
                onClick={async () => {
                  try {
                    const res = await triggerExportUsers({});
                    const payload = res?.data ?? res ?? null;
                    if (!payload) return;
                    if (payload instanceof Blob) {
                      const blob = payload;
                      const mime = blob.type || "";

                      // Detect OpenXML (.xlsx) by checking ZIP signature
                      let isZip = false;
                      try {
                        const header = await blob.slice(0, 4).arrayBuffer();
                        const bytes = new Uint8Array(header);
                        isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
                      } catch (e) {
                        /* ignore */
                      }

                      let ext = "xls";
                      if (isZip || /openxml|spreadsheetml\.sheet/i.test(mime)) {
                        ext = "xlsx";
                      } else if (/csv/i.test(mime) || /^text\//i.test(mime)) {
                        ext = "csv";
                      } else if (/ms-excel/i.test(mime)) {
                        ext = "xls";
                      }

                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `users_export_${new Date()
                        .toISOString()
                        .replace(/[:.]/g, "-")}.${ext}`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } else {
                      const text =
                        typeof payload === "string"
                          ? payload
                          : JSON.stringify(payload);
                      const blob = new Blob([text], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `users_export_${new Date()
                        .toISOString()
                        .replace(/[:.]/g, "-")}.csv`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    }
                  } catch (e) {
                    console.error("Export users failed", e);
                  }
                }}
                disabled={isExportingUsers}
                className="bg-sky-600 text-white px-3 py-2 rounded hover:opacity-90"
              >
                {isExportingUsers ? "Exporting..." : "Export Users"}
              </button>
            )}
          </div>
        </div>
        <div className="mx-5 max-md:mx-3">
          <div className="bg-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center px-5 max-md:px-3 border border-t-0 border-x-0 border-gray-300 gap-3 ipad:gap-0">
            <div className="flex gap-3 w-full ipad:w-auto">
              <button
                onClick={() => navigate("/dashboard/users/client")}
                className={`border border-blue-600/50 py-2 px-4 ipad:px-6 max-md:px-3 rounded-md focus:outline-none text-sm ipad:text-base ${
                  isClientRoute
                    ? "bg-[#6033E4] text-white"
                    : "bg-white text-black hover:text-white hover:bg-[#6033E4]"
                }`}
              >
                Clients
              </button>
              <button
                onClick={() => navigate("/dashboard/users/provider")}
                className={`border border-blue-600/50 py-2 px-4 ipad:px-6 max-md:px-3 rounded-md focus:outline-none text-sm ipad:text-base ${
                  isProviderRoute
                    ? "bg-[#6033E4] text-white"
                    : "bg-white text-black hover:text-white hover:bg-[#6033E4]"
                }`}
              >
                Providers
              </button>
            </div>
          </div>
        </div>
        {isProviderRoute ? (
          <Provider searchTerm={debouncedSearch} />
        ) : (
          <Client searchTerm={debouncedSearch} />
        )}
      </div>
    </>
  );
};

export default Users;

import { ConfigProvider, Modal, Table } from "antd";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdBlockFlipped } from "react-icons/md";
import { useCurrentUserQuery } from "../../redux/Api/userApi";
import { useGetAdminUsersQuery } from "../../redux/Api/userApi";

const RecentUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: currentUser } = useCurrentUserQuery();
  const { data: adminUsers = [], isLoading } = useGetAdminUsersQuery({ page: 1, limit: 5 });
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getImgSrc = (p) => {
    if (!p || typeof p !== "string") return "";
    if (/^https?:\/\//i.test(p)) return p;
    const apiBase =
      import.meta?.env?.VITE_API_URL ||
      "https://dalilarehan-backend.onrender.com/api/v1";
    let origin = "";
    try {
      origin = new URL(apiBase).origin;
    } catch (_) {
      origin = typeof window !== "undefined" ? window.location.origin : "";
    }
    return `${origin}${p.startsWith("/") ? p : "/" + p}`;
  };

  

  const apiRows = (Array.isArray(adminUsers) ? adminUsers : []).map((u, idx) => ({
    key: u._id || `api-${idx}`,
    sId: (u._id || "").slice(-6) || `U${idx + 1}`,
    fullName: u.fullname || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User",
    email: u.email || "",
    phoneNo: u.mobile || u.contactNumber || "",
    userType: u.role || u.adminLevel || "User",
    joinedDate: u.createdAt || new Date().toISOString(),
    imageUrl: u.avatar ? getImgSrc(u.avatar) : (u.profileImage ? getImgSrc(u.profileImage) : ""),
  }));

  const filteredApiRows = apiRows.filter((row) => {
    if (!currentUser) return true;
    if (currentUser.email && row.email === currentUser.email) return false;
    if (currentUser._id && row.key === currentUser._id) return false;
    return true;
  });

  const dataSource = filteredApiRows;

  const columns = [
    { title: "S.ID", dataIndex: "sId", key: "sId" },
    {
      title: "Full Name",
      key: "fullName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.imageUrl ||
              `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                record.fullName || record.email || "User"
              )}`
            }
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span>{record.fullName}</span>
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone No", dataIndex: "phoneNo", key: "phoneNo" },
    { title: "User Type", dataIndex: "userType", key: "userType" },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: "joinedDate",
      render: (date) => new Date(date).toLocaleDateString("en-US"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {/* <button
            onClick={showModal}
            className="text-[#6033E4] rounded-lg p-2  hover:text-white transition duration-200"
          >
            <MdBlockFlipped className="w-6 h-6 text-red-400 hover:text-black" />
          </button> */}
          <button
            onClick={() => showUserDetails(record)}
            className="text-[#6033E4] rounded-lg p-2   transition duration-200"
          >
            <FaEye className="w-6 h-6 text-[#6033E4] hover:text-teal-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#013666",
            },
            Pagination: {
              itemActiveBg: "#fffe",
              itemActiveColor: "#ffff",
              itemHoverBg: "#013666",
              itemHoverColor: "#ffff",
              colorBorder: "#013666",
              colorTextPlaceholder: "#013666",
              colorTextDisabled: "#013666",
              colorBgTextActive: "#ffff",
              itemActiveBgDisabled: "#013666",
              itemActiveColorDisabled: "#ffff",
              itemBg: "#ffff",
              colorBgTextHover: "#013666",
              colorPrimary: "#013666",
            },
            Table: {
              headerBg: "#6033E4",
              headerColor: "rgb(255,255,255)",
              cellFontSize: 16,
              headerSplitColor: "#001c54",
            },
          },
        }}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ x: "max-content" }}
        />

        <Modal
          open={isModalOpen}
          centered
          onCancel={handleCancel}
          footer={null}
        >
          {selectedUser ? (
            <div className="p-5 text-center">
              <img
                src={
                  selectedUser.imageUrl ||
                  `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
                    selectedUser.fullName || selectedUser.email || "User"
                  )}`
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">
                {selectedUser.fullName}
              </h2>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phoneNo}
              </p>
              <p>
                <strong>User ID:</strong> {selectedUser.key}
              </p>
              <button
                onClick={handleOk}
                className="mt-5 bg-[#6033E4] text-white font-semibold w-full py-2 rounded transition duration-200"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="p-5 text-center">
              <h1 className="text-4xl text-[#0D0D0D]">
                Are you sure you want to block?
              </h1>
              <div className="text-center py-5">
                <button
                  onClick={handleOk}
                  className="bg-[#6033E4] text-white font-semibold w-full py-2 rounded transition duration-200"
                >
                  Yes, Block
                </button>
              </div>
              <div className="text-center pb-5">
                <button
                  onClick={handleOk}
                  className="text-[#6033E4] border-2 border-[#013666] bg-white font-semibold w-full py-2 rounded transition duration-200"
                >
                  No, Don’t Block
                </button>
              </div>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default RecentUsers;

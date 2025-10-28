import { ConfigProvider, Table, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDeleteProviderMutation, useGetProvidersPagedQuery } from "../../redux/Api/userApi";
import { FaEye } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function Provider({ searchTerm = "", startDate, endDate }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProvider, { isLoading: isDeleting }] = useDeleteProviderMutation();

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate]);

  const { data, isLoading } = useGetProvidersPagedQuery({
    page,
    limit,
    ...(searchTerm ? { search: searchTerm.trim() } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  });

  const rows = useMemo(() => {
    const list = Array.isArray(data?.providers) ? data.providers : [];
    return list.map((u, idx) => ({
      key: u._id || `${idx}`,
      _id: u._id,
      no: (page - 1) * limit + (idx + 1),
      fullName: u.fullname || "Provider",
      email: u.email || "",
      phoneNo: u.mobile || "",
      joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : "",
      avatar: u.avatar || "",
      isPremiumMember: !!u.isPremiumMember,
    }));
  }, [data, page, limit]);

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "Provider Name",
      key: "fullName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.avatar
                ? (/^https?:\/\//i.test(record.avatar)
                    ? record.avatar
                    : ((import.meta.env.VITE_API_URL
                        ? new URL(import.meta.env.VITE_API_URL).origin
                        : new URL("https://dalilarehan-backend.onrender.com/api/v1").origin) +
                       (record.avatar.startsWith("/") ? record.avatar : "/" + record.avatar)))
                : `https://avatar.iran.liara.run/username?username=${encodeURIComponent(record.fullName || record.email || "Provider")}`
            }
            className="w-10 h-10 object-cover rounded-full"
            alt="Provider Avatar"
          />
          <span>{record.fullName}</span>
        </div>
      ),
    },
    { title: "Phone Number", dataIndex: "phoneNo", key: "phoneNo" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Premium", dataIndex: "isPremiumMember", key: "isPremiumMember", render: (v) => (v ? "Yes" : "No") },
    { title: "Joined Date", dataIndex: "joinedDate", key: "joinedDate" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRow(record);
              setIsViewOpen(true);
            }}
            className="text-blue-600 hover:bg-blue-100 p-2 rounded"
          >
            <FaEye className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setSelectedRow(record);
              setIsDeleteOpen(true);
            }}
            className="text-red-600 hover:bg-red-100 p-2 rounded"
          >
            <MdDeleteOutline className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-5 max-md:mx-3 rounded-b-lg max-md:overflow-x-auto">
      <ConfigProvider theme={{}}>
        <Table
          dataSource={rows}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.pagination?.totalProviders || rows.length,
            onChange: (p, ps) => {
              setPage(p);
              setLimit(ps);
            },
          }}
          scroll={{ x: "max-content" }}
        />
        <Modal open={isViewOpen} centered footer={null} onCancel={() => setIsViewOpen(false)}>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={
                  selectedRow?.avatar
                    ? (/^https?:\/\//i.test(selectedRow.avatar)
                        ? selectedRow.avatar
                        : ((import.meta.env.VITE_API_URL
                            ? new URL(import.meta.env.VITE_API_URL).origin
                            : new URL("https://dalilarehan-backend.onrender.com/api/v1").origin) +
                           (selectedRow.avatar.startsWith("/") ? selectedRow.avatar : "/" + selectedRow.avatar)))
                    : `https://avatar.iran.liara.run/username?username=${encodeURIComponent(selectedRow?.fullName || selectedRow?.email || "Provider")}`
                }
                className="w-12 h-12 object-cover rounded-full"
                alt="Provider Avatar"
              />
              <div>
                <div className="font-semibold">{selectedRow?.fullName}</div>
                <div className="text-sm text-gray-600">{selectedRow?.email}</div>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div>Phone: {selectedRow?.phoneNo || "-"}</div>
              <div>Joined: {selectedRow?.joinedDate || "-"}</div>
              <div>Premium: {selectedRow?.isPremiumMember ? "Yes" : "No"}</div>
            </div>
          </div>
        </Modal>

        <Modal
          open={isDeleteOpen}
          centered
          onCancel={() => setIsDeleteOpen(false)}
          confirmLoading={isDeleting}
          onOk={async () => {
            if (!selectedRow?._id) return setIsDeleteOpen(false);
            try {
              await deleteProvider({ id: selectedRow._id }).unwrap();
            } catch (e) {
              // handle error later if needed
            } finally {
              setIsDeleteOpen(false);
              setSelectedRow(null);
            }
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
          title="Delete Provider"
        >
          Are you sure you want to delete this provider?
        </Modal>
      </ConfigProvider>
    </div>
  );
}

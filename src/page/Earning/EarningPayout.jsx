import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import Modal from "antd/es/modal/Modal";
import { useGetAdminTransactionsQuery } from "../../redux/Api/transactionsApi";

export default function EarningPayout() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    points: "",
    amount: "",
    date: "",
    email: "",
  });
  const [addedData, setAddedData] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch payouts from backend (completed payouts) with pagination
  // Using the shared transactions hook with filters
  const { data, isLoading } = useGetAdminTransactionsQuery({
    page,
    limit: pageSize,
    types: ["payout"],
    status: "completed",
  });

  const items = Array.isArray(data?.items) ? data.items : [];
  const pagination = data?.pagination || {
    currentPage: page,
    totalPages: 1,
    totalTransactions: items.length,
    limit: pageSize,
  };
  const totalPages = pagination.totalPages || 1;

  // Decline handler
  const handleDecline = (row) => {
    // In completed view, decline isn't applicable; keep no-op
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };
  // Page size locked to 20

  // Show modal handler
  const handleApproveModal = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
    setShowAddForm(false);
  };

  // Add data handler
  const handleAddData = (e) => {
    e.preventDefault();
    setAddedData([...addedData, { ...form }]);
    setForm({ points: "", amount: "", date: "", email: "" });
    setShowAddForm(false);
    setModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-x-auto p-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-xs text-[#6033E4] font-semibold uppercase text-left">
            <th className="py-3 px-2">S.ID</th>
            <th className="py-3 px-2">Full Name</th>
            <th className="py-3 px-2">Method</th>
            <th className="py-3 px-2">Points</th>
            <th className="py-3 px-2">Amount</th>
            <th className="py-3 px-2">Date</th>
            <th className="py-3 px-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            [...Array(8)].map((_, i) => (
              <tr key={`payout-skel-${i}`} className="border-b text-sm animate-pulse">
                <td className="py-2 px-2">
                  <div className="h-4 w-8 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                </td>
                <td className="py-2 px-2">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 flex gap-2 items-center">
                  <div className="h-5 w-12 bg-gray-200 rounded" />
                  <div className="h-5 w-12 bg-gray-200 rounded" />
                  <div className="h-5 w-5 bg-gray-200 rounded-full" />
                </td>
              </tr>
            ))}
          {!isLoading && items.map((t, idx) => {
            const row = {
              id: idx + 1 + (page - 1) * pageSize,
              name: t?.userId?.fullname || t?.userId?.email || "Unknown",
              method: t?.paymentMethod || t?.method || "-",
              points: t?.pointsDetails?.pointsPurchased ? `${t.pointsDetails.pointsPurchased} Points` : "-",
              amount: typeof t?.amount === "number" ? `€${t.amount}` : t?.amount || "€0",
              date: t?.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
              status: t?.status || "",
              avatar: t?.userId?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
            };
            return (
              <tr key={t?._id || row.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-2 px-2">{row.id}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={row.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className="py-2 px-2">{row.method}</td>
                <td className="py-2 px-2">{row.points}</td>
                <td className="py-2 px-2 text-[#00c896] font-semibold">{row.amount}</td>
                <td className="py-2 px-2">{row.date}</td>
                <td className="py-2 px-2 flex gap-2 items-center">
                  {row.status === "Pending" && (
                    <>
                      <button
                        className="bg-[#00c896] text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleApproveModal(row)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-[#ff4d4f] text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleDecline(row)}
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {row.status === "Approved" && (
                    <span className="bg-white border border-[#00c896] text-[#00c896] px-2 py-1 rounded text-xs">
                      Approved
                    </span>
                  )}
                  {row.status === "Declined" && (
                    <span className="bg-white border border-[#ff4d4f] text-[#ff4d4f] px-2 py-1 rounded text-xs">
                      Declined
                    </span>
                  )}
                  <button
                    className="text-[#6033E4] hover:text-blue-700 p-1"
                    title="View"
                    onClick={() => {
                      setSelectedRow(row);
                      setViewModalOpen(true);
                    }}
                  >
                    <FaRegEye size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-[#6033E4] mt-2">
        <span>
          Page {pagination.currentPage} of {pagination.totalPages} | Total {pagination.totalTransactions}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="w-6 h-6 flex items-center justify-center rounded bg-[#f3f3f3] text-[#6033E4]"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {[...Array(Math.min(totalPages, 3)).keys()].map((i) => (
            <button
              key={i + 1}
              className={`w-6 h-6 flex items-center justify-center rounded ${
                page === i + 1
                  ? "bg-[#6033E4] text-white"
                  : "bg-[#f3f3f3] text-[#6033E4]"
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 3 && <span>...</span>}
          {totalPages > 3 && (
            <button
              className={`w-6 h-6 flex items-center justify-center rounded ${
                page === totalPages
                  ? "bg-[#6033E4] text-white"
                  : "bg-[#f3f3f3] text-[#6033E4]"
              }`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}
        </div>
      </div>
      {/* View Details Modal */}
      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ padding: 0, borderRadius: 12 }}
        width={370}
      >
        {selectedRow && (
          <div className="bg-[#F5F6FA] rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-6 text-[#6033E4]">
              Payout Details
            </h2>
            <div className="text-left grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
              <span className="font-medium">Requested by</span>
              <span className="flex items-center gap-2 justify-end">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                {selectedRow.name}
              </span>
              <span className="font-medium">Payment Method</span>
              <span className="text-right">{selectedRow.method}</span>
              <span className="font-medium">Payout amount</span>
              <span className="text-right text-[#00c896] font-semibold">
                {selectedRow.amount}
              </span>
              <span className="font-medium">Date</span>
              <span className="text-right">{selectedRow.date}</span>
              <span className="font-medium">Points</span>
              <span className="text-right">{selectedRow.points}</span>
              <span className="font-medium">Status</span>
              <span className="text-right">{selectedRow.status}</span>
            </div>
            <button
              onClick={() => setViewModalOpen(false)}
              className="bg-[#6033E4] text-white px-8 py-2 rounded-md font-medium hover:bg-[#4b27b8] transition"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
      {/* Payout Request Modal (single, outside table) */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ padding: 0, borderRadius: 12 }}
        width={370}
      >
        {selectedRow && !showAddForm && (
          <div className="bg-[#F5F6FA] rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-6 text-[#6033E4]">
              Payout Request
            </h2>
            <div className="text-left grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
              <span className="font-medium">Requested by</span>
              <span className="flex items-center gap-2 justify-end">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                {selectedRow.name}
              </span>
              <span className="font-medium">Payment Method</span>
              <span className="text-right">{selectedRow.method}</span>
              <span className="font-medium">Payout amount</span>
              <span className="text-right text-[#00c896] font-semibold">
                {selectedRow.amount}
              </span>
              <span className="font-medium">Date</span>
              <span className="text-right">{selectedRow.date}</span>
              <span className="font-medium">Email</span>
              <span className="text-right">john@email.com</span>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setModalOpen(false)}
                className="border border-[#ff4d4f] text-[#ff4d4f] px-8 py-2 rounded-md font-medium hover:bg-[#fff0f0] transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPayouts((prev) =>
                    prev.filter((p) => p.id !== selectedRow.id)
                  );
                  setModalOpen(false);
                }}
                className="bg-[#00c896] text-white px-8 py-2 rounded-md font-medium hover:bg-[#009e74] transition"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

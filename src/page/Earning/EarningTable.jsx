import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import { FaRegEye, FaFileDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import { message } from "antd";
import {
  useGetAdminTransactionsQuery,
} from "../../redux/Api/transactionsApi";

export default function EarningTable() {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch data
  const { data, isLoading } = useGetAdminTransactionsQuery({
    page,
    limit: pageSize,
  });

  const items = data?.items || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
    limit: pageSize,
  };
  const totalPages = pagination.totalPages || 1;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const getAuthToken = () => {
    if (typeof document === "undefined") return null;
    const getCookie = (name) => {
      const match = document.cookie.match(
        new RegExp(
          "(?:^|; )" +
            name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") +
            "=([^;]*)"
        )
      );
      return match ? decodeURIComponent(match[1]) : null;
    };
    const cookieToken = getCookie("accessToken") || getCookie("token");
    const lsToken =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null;
    return cookieToken || lsToken;
  };

  const downloadInvoiceFile = async ({ id, filename }) => {
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL ||
        "https://dalilarehan-backend.onrender.com/api/v1";
      const token = getAuthToken();
      message.loading({ content: "Preparing invoice...", key: "invoice" });
      const res = await fetch(`${baseUrl}/transactions/admin/${id}/invoice`, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `invoice_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      message.success({ content: "Invoice downloaded", key: "invoice", duration: 2 });
    } catch (e) {
      message.error({ content: "Failed to download invoice", key: "invoice" });
    }
  };

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Page size is locked to 20 as per requirements

  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleDownloadPDF = (row) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Earning Details", 10, 10);
    doc.setFontSize(12);
    doc.text(`Name: ${row.name || "-"}`, 10, 25);
    doc.text(`Type: ${row.typeLabel || row.type || "-"}`, 10, 35);
    doc.text(`Amount: ${row.amount || "-"}`, 10, 45);
    doc.text(`Date: ${row.date || "-"}`, 10, 55);
    doc.text(`Transaction ID: ${row.transactionId || "-"}`, 10, 65);
    doc.save(`earning_${row.transactionId || row.id}.pdf`);
  };

  const handleDownloadInvoice = () => {
    if (!selectedRow) return;
    const id = selectedRow.txnDbId || selectedRow._id || selectedRow.id;
    const filename = `invoice_${selectedRow.transactionId || id}.pdf`;
    downloadInvoiceFile({ id, filename });
  };

  return (
    <div>
      {/* Earnings Table */}
      <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-xs text-gray-500 uppercase text-left">
              <th className="py-3 px-2">No</th>
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Type</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 &&
              items.map((t, idx) => {
                const typeLabel =
                  t?.type === "subscription_payment"
                    ? "Subscription"
                    : t?.type === "points_purchase"
                    ? "Points Purchase"
                    : t?.type || "";
                const dt = t?.completedAt || t?.createdAt || null;
                const row = {
                  id: idx + 1 + (page - 1) * pageSize,
                  name: t?.userId?.fullname || t?.userId?.email || "Unknown",
                  typeLabel,
                  amount: `${t?.amount >= 0 ? "+" : ""}€${t?.amount || 0}`,
                  amountColor:
                    t?.amount >= 0 ? "text-green-500" : "text-red-500",
                  date: dt ? new Date(dt).toLocaleString() : "",
                  transactionId: t?.transactionId || "",
                  email: t?.userId?.email || "",
                  txnDbId: t?._id || "",
                };

                return (
                  <tr
                    key={t?._id || row.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="py-2 px-2">
                      {row.id.toString().padStart(2, "0")}
                    </td>
                    <td className="py-2 px-2">
                      <span>{row.name}</span>
                    </td>
                    <td className="py-2 px-2">{row.typeLabel}</td>
                    <td
                      className={`py-2 px-2 font-semibold ${row.amountColor}`}
                    >
                      {row.amount}
                    </td>
                    <td className="py-2 px-2">{row.date}</td>
                    <td className="py-2 px-2 flex gap-2">
                      <button
                        className="text-[#6033E4] hover:text-blue-700 p-1"
                        title="View"
                        onClick={() => handleViewDetails(row)}
                      >
                        <FaRegEye size={20} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Download PDF"
                        onClick={() => {
                          setSelectedRow(row);
                          const id = row.txnDbId || row._id || row.id;
                          const filename = `invoice_${row.transactionId || id}.pdf`;
                          downloadInvoiceFile({ id, filename });
                        }}
                      >
                        <FaFileDownload size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 px-2 text-center text-sm text-gray-500"
                >
                  No transactions to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {items.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages} | Total{" "}
              {pagination.totalTransactions}
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
        )}
      </div>

      {/* Transaction Details Modal */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ padding: 0, borderRadius: 12 }}
        width={440}
      >
        {selectedRow && (
          <div className="bg-[#F5F6FA] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-[#6033E4]">
              Transaction Details
            </h2>
            <div className="text-left grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
              <span className="font-medium">Transaction ID</span>
              <span className="text-right">
                {selectedRow.transactionId || "-"}
              </span>
              <span className="font-medium">Transaction Type</span>
              <span className="text-right">{selectedRow.typeLabel || "-"}</span>
              <span className="font-medium">Date</span>
              <span className="text-right">{selectedRow.date}</span>
              <span className="font-medium">Name</span>
              <span className="text-right">{selectedRow.name}</span>
              <span className="font-medium">Email</span>
              <span className="text-right">{selectedRow.email || "-"}</span>
              <span className="font-medium">Amount</span>
              <span className="text-right">{selectedRow.amount}</span>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setModalOpen(false)}
                className="border border-[#6033E4] text-[#6033E4] px-8 py-2 rounded-md font-medium hover:bg-[#edeaff] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="bg-[#6033E4] text-white px-8 py-2 rounded-md font-medium hover:bg-[#4b28b6] transition"
              >
                Download Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


// Modal for confirming block action
function BlockUserModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-lg font-semibold mb-4 text-[#ff5c5c] flex items-center gap-2">
          <MdOutlineBlock size={28} className="text-[#ff5c5c]" /> Block User
        </div>
        <div className="mb-6 text-gray-700 text-sm">
          Are you sure you want to block this user? This action cannot be
          undone.
        </div>
        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-[#ff5c5c] hover:bg-[#e04a4a] text-white font-semibold py-2 rounded"
            onClick={onConfirm}
          >
            Block
          </button>
          <button
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import PageHeading from "../../shared/PageHeading";
import { FiEye } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineBlock, MdOutlineCheckCircle } from "react-icons/md";
import { useGetReportQuery, useGetReportByIdQuery, useResolveReportMutation } from "../../redux/Api/reportApi";
// Modal for resolving a report
function ResolveReportModal({ open, onClose, reportId }) {
  const [notes, setNotes] = useState("");
  const [resolutionType, setResolutionType] = useState("");
  const [penalty, setPenalty] = useState("");
  const [sendEmailToUser, setSendEmailToUser] = useState(false);
  const [sendEmailToProvider, setSendEmailToProvider] = useState(false);
  const [resolveReport, { isLoading: isResolving }] = useResolveReportMutation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-lg font-semibold mb-4">Resolution Details</div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Resolution Notes
          </label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6033E4]"
            rows={3}
            placeholder="Describe the action taken to resolve this report..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Resolution Type
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6033E4]"
            value={resolutionType}
            onChange={(e) => setResolutionType(e.target.value)}
          >
            <option value="">Select resolution type</option>
            <option value="Warning Issued">Warning Issued</option>
            <option value="Suspension">Suspension</option>
            <option value="Content Removal">Content Removal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Penalty or Action Taken (Optional)
          </label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6033E4]"
            placeholder="e.g., 7-day suspension, content removal"
            value={penalty}
            onChange={(e) => setPenalty(e.target.value)}
          />
        </div>
     
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-[#6033E4]"
              checked={sendEmailToUser}
              onChange={(e) => setSendEmailToUser(e.target.checked)}
            />
            Notify
            Reporter by Email
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-[#6033E4]"
              checked={sendEmailToProvider}
              onChange={(e) => setSendEmailToProvider(e.target.checked)}
            />
            Notify
            Reported User by Email
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-[#6033E4] hover:bg-[#4b27b8] text-white font-semibold py-2 rounded flex items-center justify-center gap-2 text-base"
            onClick={async () => {
              try {
                await resolveReport({
                  id: reportId,
                  body: {
                    notes,
                    resolutionType,
                    penalty,
                    sendEmailToUser,
                    sendEmailToProvider,
                  },
                }).unwrap();
              } catch (e) {
              } finally {
                onClose();
              }
            }}
            disabled={isResolving || !reportId || !resolutionType}
          >
            <span className="text-xl">&#10003;</span> {isResolving ? "Resolving..." : "Resolve & Close Report"}
          </button>
          <button
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal component for viewing report details
function ReportDetailModal({ open, onClose, reportId }) {
  const { data: report, isLoading } = useGetReportByIdQuery(reportId, {
    skip: !open || !reportId,
  });
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center  bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-2 text-xs text-gray-400 font-medium">
              Report ID
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <div className="font-semibold text-[#6033E4] text-lg mb-1">{report?._id || ""}</div>
                <div className="text-xs text-gray-500 mb-4">{report?._id || ""}</div>
              </>
            )}
            <div className="mb-2 text-xs text-gray-400 font-medium">
              Submission Date & Time
            </div>
            {isLoading ? (
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse mb-4" />
            ) : (
              <div className="mb-4 text-sm text-gray-700">{report?.createdAt ? new Date(report.createdAt).toLocaleString() : ""}</div>
            )}
            <div className="mb-2 text-xs text-gray-400 font-medium">
              Category
            </div>
            {isLoading ? (
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
            ) : (
              <button className="bg-red-50 text-[#ff5c5c] text-xs px-3 py-1 rounded font-semibold mb-4">{report?.reason || "Report"}</button>
            )}
          </div>
          <div className="flex-1">
            <div className="mb-2 text-xs text-gray-400 font-medium">
              Reporter
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <FaUserCircle className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-800">{report?.reporter?.fullname || report?.reporter?.email || ""}</div>
                  <div className="text-xs text-gray-500">{report?.reporter?.email || ""}</div>
                </div>
              </div>
            )}
            <div className="mb-2 text-xs text-gray-400 font-medium">
              Reported User
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <FaUserCircle className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="font-semibold text-gray-800">{report?.provider?.fullname || report?.provider?.email || ""}</div>
                  <div className="text-xs text-gray-500">{report?.provider?.email || ""}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <hr className="my-4" />
        <div className="mb-2 font-semibold text-gray-800">
          Report Description
        </div>
        {isLoading ? (
          <div className="bg-gray-50 rounded p-3 mb-4">
            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-3/5 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 mb-4">{report?.reason || ""}</div>
        )}
      
    
      </div>
    </div>
  );
}

const Report = () => {
  const { data: reports = [], isLoading, isError } = useGetReportQuery();
  const defaultAvatar = "https://i.pravatar.cc/100";
  const tableData = (reports || []).map((r, i) => ({
    id: (i + 1).toString().padStart(2, "0"),
    from: { name: r?.reporter?.fullname || r?.reporter?.email || "Unknown", img: defaultAvatar },
    to: { name: r?.provider?.fullname || r?.provider?.email || "Unknown", img: defaultAvatar },
    reason: r?.reason || "",
    date: r?.createdAt ? new Date(r.createdAt).toLocaleString() : "",
    status: r?.status || "",
    raw: r,
  }));

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const total = tableData.length;
  const totalPages = Math.ceil(total / pageSize);

  // Modal state
  const [viewModal, setViewModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [resolveModal, setResolveModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [blockTargetId, setBlockTargetId] = useState(null);

  return (
    <div>
      <div className="rounded-t-lg mt-5 bg-[#6033E4] text-white py-3 flex flex-col md:flex-row justify-between items-start md:items-center mx-5 px-5 gap-4">
        <PageHeading title="Report" />
      </div>
      <div className="bg-white rounded-b-lg shadow-sm border mx-5 px-5 border-[#E2E8F0] overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-xs text-[#6033E4] font-semibold uppercase text-left">
              <th className="py-3 px-2">S.ID</th>
              <th className="py-3 px-2">Report From</th>
              <th className="py-3 px-2">Report Reason</th>
              <th className="py-3 px-2">Report TO</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Date & Time</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              [...Array(pageSize)].map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-b text-sm animate-pulse">
                  <td className="py-2 px-2">
                    <div className="h-4 w-10 bg-gray-200 rounded" />
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
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
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex justify-end gap-2">
                      <div className="h-5 w-5 bg-gray-200 rounded" />
                      <div className="h-5 w-5 bg-gray-200 rounded" />
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!isLoading && tableData
              .slice((page - 1) * pageSize, page * pageSize)
              .map((row, idx) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-2 px-2">{row.id}</td>
                  <td className="py-2 px-2 flex items-center gap-2">
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                    <span className="font-medium text-[#18181B]">
                      {row.from.name}
                    </span>
                  </td>
                  <td className="py-2 px-2">{row.reason}</td>
                  <td className="py-2 px-2 flex items-center gap-2">
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                    <span className="font-medium text-[#18181B]">
                      {row.to.name}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        (row.status || '').toLowerCase() === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : (row.status || '').toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {row.status || '—'}
                    </span>
                  </td>
                  <td className="py-2 px-2">{row.date}</td>
                  <td className="py-2 px-2 flex gap-2 items-center justify-end">
                 
                    <button
                      className="text-[#4ade80] hover:bg-green-50 p-1 rounded"
                      onClick={() => {
                        setSelectedReportId(row?.raw?._id || null);
                        setResolveModal(true);
                      }}
                    >
                      <MdOutlineCheckCircle size={20} />
                    </button>
                    <button
                      className="text-[#6033E4] hover:bg-gray-100 p-1 rounded"
                      onClick={() => {
                        setSelectedReportId(row?.raw?._id || null);
                        setViewModal(true);
                      }}
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                  {/* Report Detail Modal */}
                  <ReportDetailModal
                    open={viewModal}
                    onClose={() => setViewModal(false)}
                    reportId={selectedReportId}
                  />
                  {/* Resolve Report Modal */}
                  <ResolveReportModal
                    open={resolveModal}
                    onClose={() => setResolveModal(false)}
                    reportId={selectedReportId}
                  />
                  {/* Block User Modal */}
                  <BlockUserModal
                    open={blockModal}
                    onClose={() => setBlockModal(false)}
                    onConfirm={() => {
                      setBlockModal(false);
                    }}
                  />
                </tr>
              ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-[#6033E4] mt-2">
          <span>
            SHOWING {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, total)} OF {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="w-6 h-6 flex items-center justify-center rounded bg-[#f3f3f3] text-[#6033E4]"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              {"<"}
            </button>
            {[...Array(Math.min(3, totalPages)).keys()].map((i) => (
              <button
                key={i + 1}
                className={`w-6 h-6 flex items-center justify-center rounded ${
                  page === i + 1
                    ? "bg-[#6033E4] text-white"
                    : "bg-[#f3f3f3] text-[#6033E4]"
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <span>...</span>
            <button
              className={`w-6 h-6 flex items-center justify-center rounded ${
                page === totalPages
                  ? "bg-[#6033E4] text-white"
                  : "bg-[#f3f3f3] text-[#6033E4]"
              }`}
              onClick={() => setPage(totalPages)}
            >
              {totalPages}
            </button>
            {[8, 30, 60, 120].map((size) => (
              <button
                key={size}
                className={`w-10 h-6 flex items-center justify-center rounded ${
                  pageSize === size
                    ? "bg-[#6033E4] text-white"
                    : "bg-[#f3f3f3] text-[#6033E4]"
                }`}
                onClick={() => {
                  setPageSize(size);
                  setPage(1);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;

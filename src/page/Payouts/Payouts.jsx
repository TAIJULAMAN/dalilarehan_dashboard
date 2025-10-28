import Modal from "antd/es/modal/Modal";
import { useMemo, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import {
  useApprovePayoutMutation,
  useGetAdminPayoutDetailsQuery,
  useGetAdminPayoutsQuery,
  useGetAdminPointRateQuery,
  useRejectPayoutMutation,
  useUpdateAdminPointRateMutation,
} from "../../redux/Api/payoutApi";
import PageHeading from "../../shared/PageHeading";
import { handleError, handleSuccess } from "../../Toast";

export default function Payouts() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [payoutToReject, setPayoutToReject] = useState(null);
  const [pointRateModalOpen, setPointRateModalOpen] = useState(false);
  const [pointRateValue, setPointRateValue] = useState("");

  const queryArg = useMemo(() => {
    const q = { page, limit: pageSize };
    if (statusFilter && statusFilter !== "all") q.status = statusFilter;
    return q;
  }, [page, statusFilter]);

  const { data, isLoading, refetch } = useGetAdminPayoutsQuery(queryArg);

  // point rate hooks
  const { data: pointRateData, isLoading: isPointRateLoading } =
    useGetAdminPointRateQuery();
  const [updatePointRate, { isLoading: isUpdatingPointRate }] =
    useUpdateAdminPointRateMutation();

  const [approvePayout, { isLoading: isApproving }] =
    useApprovePayoutMutation();
  const [rejectPayout, { isLoading: isRejecting }] = useRejectPayoutMutation();
  const [search, setSearch] = useState("");

  // items array from query
  const items = data?.items || [];

  const pagination = data?.pagination || {
    currentPage: page,
    totalPages: 1,
    totalRequests: items.length,
    limit: pageSize,
  };
  const totalPages = Number(pagination.totalPages) || 1;

  const detailsQueryArg = useMemo(() => {
    return selectedId ? { payoutId: selectedId } : null;
  }, [selectedId]);

  const { data: details } = useGetAdminPayoutDetailsQuery(detailsQueryArg, {
    skip: !detailsQueryArg,
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleApprove = async (payout) => {
    try {
      await approvePayout({ payoutId: payout._id || payout.id }).unwrap();
      handleSuccess("Payout approved");
      refetch();
    } catch (err) {
      handleError(err?.data?.message || "Failed to approve payout");
    }
  };

  // open reject modal to collect reason
  const openRejectModal = (payout) => {
    setPayoutToReject(payout);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const openPointRateModal = () => {
    // derive initial value from API response
    const settingValue =
      pointRateData?.setting?.settingValue ?? pointRateData?.currentRate ?? "";
    setPointRateValue(settingValue);
    setPointRateModalOpen(true);
  };

  const performUpdatePointRate = async () => {
    const numeric = Number(pointRateValue);
    if (Number.isNaN(numeric)) return handleError("Invalid rate");
    try {
      await updatePointRate({ rate: numeric }).unwrap();
      handleSuccess("Point rate updated");
      setPointRateModalOpen(false);
      refetch();
    } catch (err) {
      handleError(err?.data?.message || "Failed to update point rate");
    }
  };

  const performReject = async () => {
    if (!payoutToReject) return;
    try {
      await rejectPayout({
        payoutId: payoutToReject._id || payoutToReject.id,
        reason: rejectReason,
      }).unwrap();
      handleSuccess("Payout rejected");
      setRejectModalOpen(false);
      setPayoutToReject(null);
      refetch();
    } catch (err) {
      handleError(err?.data?.message || "Failed to reject payout");
    }
  };

  const formatEuro = (n) => {
    if (n == null) return "-";
    const num = typeof n === "number" ? n : Number(n);
    if (Number.isNaN(num)) return "-";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <>
      <div className="rounded-t-lg m-5 rounded-b-none bg-[#6033E4] text-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center mx-5 max-md:mx-3 px-5 max-md:px-3 gap-4 ipad:gap-0">
        <PageHeading title="Payouts" />
        <div className="flex flex-col ipad:flex-row items-center gap-4 ipad:gap-[50px] w-full ipad:w-auto max-md:items-start max-md:gap-3"></div>
        <div>
          <button
            onClick={openPointRateModal}
            className="bg-white text-[#6033E4] py-2 px-4 rounded-md"
          >
            Point Rate Configuration
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-x-auto p-2 mx-5 max-md:mx-3 -mt-6">
        <div className="py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center px-2 border-b border-gray-200 gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStatusFilter("all");
                setPage(1);
              }}
              className={`py-2 px-4 rounded-md text-black bg-white ${
                statusFilter === "all"
                  ? "border-2 border-black"
                  : "border border-blue-600/50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setStatusFilter("pending");
                setPage(1);
              }}
              className={`py-2 px-4 rounded-md text-black bg-white ${
                statusFilter === "pending"
                  ? "border-2 border-black"
                  : "border border-blue-600/50"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => {
                setStatusFilter("completed");
                setPage(1);
              }}
              className={`py-2 px-4 rounded-md text-black bg-white ${
                statusFilter === "completed"
                  ? "border-2 border-black"
                  : "border border-blue-600/50"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => {
                setStatusFilter("rejected");
                setPage(1);
              }}
              className={`py-2 px-4 rounded-md text-black bg-white ${
                statusFilter === "rejected"
                  ? "border-2 border-black"
                  : "border border-blue-600/50"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

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
                <tr
                  key={`payout-skel-${i}`}
                  className="border-b text-sm animate-pulse"
                >
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

            {!isLoading &&
              items.map((p, idx) => {
                const name =
                  p?.providerId?.fullname ||
                  p?.userId?.fullname ||
                  p?.processedBy?.fullname ||
                  "Unknown";
                const method = p?.paymentMethod || p?.method || "-";
                const points = p?.requestedPoints ?? "-";
                const amount = p?.amountInEuros ?? p?.amount ?? 0;
                const date = p?.requestDate || p?.createdAt || "";
                const status = (p?.status || "").toLowerCase();
                return (
                  <tr
                    key={p._id || idx}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="py-2 px-2">
                      {idx + 1 + (page - 1) * pageSize}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {(name || "?")
                            .split(" ")
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <span>{name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2">{method}</td>
                    <td className="py-2 px-2">{points}</td>
                    <td className="py-2 px-2 text-[#00c896] font-semibold">
                      {formatEuro(amount)}
                    </td>
                    <td className="py-2 px-2">
                      {date ? new Date(date).toLocaleString() : ""}
                    </td>
                    <td className="py-2 px-2 flex gap-2 items-center">
                      {status === "pending" && (
                        <>
                          <button
                            className="bg-[#00c896] text-white px-2 py-1 rounded text-xs"
                            onClick={() => handleApprove(p)}
                            disabled={isApproving}
                          >
                            {isApproving ? "Approving..." : "Approve"}
                          </button>
                          <button
                            className="bg-[#ff4d4f] text-white px-2 py-1 rounded text-xs"
                            onClick={() => openRejectModal(p)}
                            disabled={isRejecting}
                          >
                            {isRejecting ? "Rejecting..." : "Reject"}
                          </button>
                        </>
                      )}
                      {(status === "completed" || status === "approved") && (
                        <span className="bg-white border border-[#00c896] text-[#00c896] px-2 py-1 rounded text-xs">
                          Approved
                        </span>
                      )}
                      {status === "rejected" && (
                        <span className="bg-white border border-[#ff4d4f] text-[#ff4d4f] px-2 py-1 rounded text-xs">
                          Rejected
                        </span>
                      )}
                      <button
                        className="text-[#6033E4] hover:text-blue-700 p-1"
                        title="View"
                        onClick={() => {
                          setSelectedId(p._id);
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
            Page {pagination.currentPage} of {pagination.totalPages} | Total{" "}
            {pagination.totalRequests}
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

        <Modal
          open={viewModalOpen}
          onCancel={() => {
            setViewModalOpen(false);
            setSelectedId(null);
          }}
          footer={null}
          centered
          bodyStyle={{ padding: 0, borderRadius: 12 }}
          width={480}
        >
          {details ? (
            <div className="bg-[#F5F6FA] rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold mb-6 text-[#6033E4]">
                Payout Details
              </h2>
              <div className="text-left grid grid-cols-2 gap-y-3 gap-x-2 mb-8">
                <span className="font-medium">Request ID</span>
                <span className="text-right">
                  {details.transactionReference || details._id}
                </span>
                <span className="font-medium">Requested Points</span>
                <span className="text-right">
                  {details.requestedPoints ?? "-"}
                </span>
                <span className="font-medium">Amount</span>
                <span className="text-right text-[#00c896] font-semibold">
                  {formatEuro(details.amountInEuros ?? details.amount)}
                </span>
                <span className="font-medium">Payment Method</span>
                <span className="text-right">{details.paymentMethod}</span>
                <span className="font-medium">Requested At</span>
                <span className="text-right">
                  {details.requestDate
                    ? new Date(details.requestDate).toLocaleString()
                    : "-"}
                </span>
                <span className="font-medium">Status</span>
                <span className="text-right">{details.status}</span>
              </div>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedId(null);
                }}
                className="bg-[#6033E4] text-white px-8 py-2 rounded-md font-medium hover:bg-[#4b27b8] transition"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="p-6">Loading...</div>
          )}
        </Modal>

        {/* Reject reason modal */}
        <Modal
          open={rejectModalOpen}
          onCancel={() => {
            setRejectModalOpen(false);
            setPayoutToReject(null);
            setRejectReason("");
          }}
          footer={null}
          centered
          bodyStyle={{ padding: 0, borderRadius: 12 }}
          width={480}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-[#6033E4]">
              Reject Payout
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Please provide a reason for rejection:
            </p>
            <textarea
              className="w-full border rounded p-2 h-28 resize-none"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-800"
                onClick={() => {
                  setRejectModalOpen(false);
                  setPayoutToReject(null);
                  setRejectReason("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#ff4d4f] text-white"
                onClick={performReject}
                disabled={isRejecting || !rejectReason.trim()}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </Modal>

        {/* Point rate modal */}
        <Modal
          open={pointRateModalOpen}
          onCancel={() => setPointRateModalOpen(false)}
          footer={null}
          centered
          bodyStyle={{ padding: 0, borderRadius: 12 }}
          width={420}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-[#6033E4]">
              Point Rate Configuration
            </h3>
            {isPointRateLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                <div className="mb-3 text-sm text-gray-700">
                  Current value:{" "}
                  <span className="font-semibold">
                    {pointRateData?.setting?.settingValue ??
                      pointRateData?.currentRate ??
                      "-"}
                  </span>
                </div>
                <label className="block text-sm mb-1">New rate</label>
                <input
                  type="number"
                  step={pointRateData?.metadata?.step ?? 0.01}
                  min={pointRateData?.metadata?.minValue}
                  max={pointRateData?.metadata?.maxValue}
                  className="w-full border rounded p-2 mb-3"
                  value={pointRateValue}
                  onChange={(e) => setPointRateValue(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 text-gray-800"
                    onClick={() => setPointRateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-[#6033E4] text-white"
                    onClick={performUpdatePointRate}
                    disabled={isUpdatingPointRate}
                  >
                    {isUpdatingPointRate ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}

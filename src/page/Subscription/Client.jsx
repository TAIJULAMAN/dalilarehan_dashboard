import { useEffect, useMemo, useState } from "react";
import { useGetAdminUsersPagedQuery } from "../../redux/Api/userApi";

export default function Client({ searchTerm = "" }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const { data, isLoading } = useGetAdminUsersPagedQuery({
    page,
    limit: pageSize,
    ...(searchTerm ? { search: searchTerm } : {}),
    // show only premium users on this page
    isPremiumMember: true,
  });

  const rows = useMemo(() => {
    const list = Array.isArray(data?.users) ? data.users : [];
    return list.map((u, idx) => ({
      id: u._id?.slice(-4) || String(idx + 1).padStart(2, "0"),
      name:
        u.fullname ||
        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
        "User",
      email: u.email || "",
      img:
        u.avatar ||
        `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
          u.fullname || u.email || "User"
        )}`,
      status: u.isPremiumMember ? "Paid" : "Inactive",
      plan: u.isPremiumMember ? "Premium" : "Free",
      date: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("en-GB")
        : "",
    }));
  }, [data]);

  const total = data?.pagination?.totalUsers ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div>
      <div className="mx-5 max-md:mx-3">
        <div className="bg-white rounded-b-lg shadow-sm border border-[#E2E8F0] overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-xs text-[#5b34d1] font-semibold uppercase text-left">
                <th className="py-3 px-2">S.ID</th>
                <th className="py-3 px-2">User</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Plan</th>
                <th className="py-3 px-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 text-sm">
                  <td className="py-2 px-2">{row.id}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={row.img}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">{row.email}</td>
                  <td className="py-2 px-2">
                    {row.status === "Paid" ? (
                      <span className="text-[#00c896] font-medium">Paid</span>
                    ) : (
                      <span className="text-[#ff7a00] font-medium">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2">{row.plan}</td>
                  <td className="py-2 px-2">{row.date}</td>
                </tr>
              ))}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-gray-500 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              )}
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
              {[10, 20].map((size) => (
                <button
                  key={size}
                  className={`w-10 h-6 flex items-center justify-center rounded ${
                    pageSize === size
                      ? "bg-[#6033E4] text-white"
                      : "bg-[#f3f3f3] text-[#6033E4]"
                  }`}
                  onClick={() => handlePageSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

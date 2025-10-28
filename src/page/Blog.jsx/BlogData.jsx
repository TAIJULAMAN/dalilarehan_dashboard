import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { useAllBlogsQuery, useDeleteBlogMutation, useUpdateBlogMutation } from "../../redux/Api/blogApi";

const BlogData = () => {
  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleEditClick = (row, idx) => {
    setEditIdx(idx);
    setEditTitle(row.title);
    setEditImg(row.img);
    setEditCategory(row.category || "");
    setEditContent(row.body || "");
    setEditModalOpen(true);
  };

  const handleEditImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setEditImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();
  const handleEditSave = async () => {
    const item = tableData[editIdx];
    try {
      if (item?.id) {
        let body;
        const excerpt = (editContent || "").trim().slice(0, 140);
        if (editFile) {
          const fd = new FormData();
          fd.append("title", editTitle);
          fd.append("body", editContent || "");
          // Use excerpt as category value
          fd.append("category", excerpt);
          if (excerpt) fd.append("excerpt", excerpt);
          fd.append("image", editFile);
          body = fd;
        } else {
          body = {
            title: editTitle,
            body: editContent || "",
            // Use excerpt as category value
            category: excerpt,
            excerpt,
          };
        }
        const res = await updateBlog({ id: item.id, body }).unwrap();
        const cacheBust = `?v=${Date.now()}`;
        setTableData((prev) =>
          prev.map((it, i) => (
            i === editIdx
              ? {
                  ...it,
                  title: editTitle,
                  // Reflect new category from excerpt
                  category: excerpt,
                  body: editContent,
                  excerpt: (res?.excerpt && typeof res.excerpt === "string" && res.excerpt.length > 0)
                    ? res.excerpt
                    : excerpt,
                  img: res?.image
                    ? `${getImgSrc(res.image)}${cacheBust}`
                    : (editImg || it.img),
                }
              : it
          ))
        );
      }
    } catch (_) {
    } finally {
      setEditModalOpen(false);
      setEditIdx(null);
      setEditFile(null);
    }
  };
  // Fetch all blogs from API, paginate client-side
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const { data, isLoading } = useAllBlogsQuery();

  // Normalize items from possible shapes
  const apiItems = useMemo(() => {
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // Local editable list copy
  const [tableData, setTableData] = useState([]);
  const getImgSrc = (p) => {
    if (!p || typeof p !== "string") return "";
    if (/^https?:\/\//i.test(p)) return p;
    const apiBase = (import.meta?.env?.VITE_API_URL) || "https://dalilarehan-backend.onrender.com/api/v1";
    const base = apiBase.replace(/\/$/, "");
    return `${base}${p.startsWith("/") ? p : "/" + p}`;
  };
  useEffect(() => {
    const mapped = apiItems.map((b, i) => ({
      id: b?._id || String(i + 1),
      title: b?.title || "Untitled",
      img: b?.image && typeof b.image === "string" && b.image.length > 0
        ? `${getImgSrc(b.image)}${b?.updatedAt ? `?v=${new Date(b.updatedAt).getTime()}` : ""}`
        : "https://via.placeholder.com/80x80?text=Blog",
      category: b?.category || "",
      body: b?.body || b?.content || "",
      excerpt:
        (typeof b?.excerpt === "string" && b.excerpt.length > 0)
          ? b.excerpt
          : String(b?.body || b?.content || "").replace(/<[^>]+>/g, " ").slice(0, 140),
      date: b?.createdAt ? new Date(b.createdAt).toLocaleDateString() : "",
    }));
    setTableData(mapped);
  }, [apiItems]);

  // Pagination (client-side if backend lacks pagination)
  const total = tableData.length;
  const totalPages = Math.ceil(total / pageSize);

  // Delete Modal (dummy, not shown in screenshot)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation();
  const handleDeleteClick = (idx) => {
    setDeleteIdx(idx);
    setDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    const item = tableData[deleteIdx];
    try {
      if (item?.id) {
        await deleteBlog(item.id).unwrap();
      }
      setTableData((prev) => prev.filter((_, i) => i !== deleteIdx));
    } catch (_) {
    } finally {
      setDeleteModalOpen(false);
      setDeleteIdx(null);
    }
  };
  return (
    <div>
      <div className="mx-5 bg-white rounded-b-lg shadow-sm border p-4 border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-xs text-[#6033E4] font-semibold uppercase text-left">
              <th className="py-3 px-2">S.ID</th>
              <th className="py-3 px-2">Blog</th>
              <th className="py-3 px-2">Excerpt</th>
              <th className="py-3 px-2">Upload Date</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={`sk-${i}`} className="border-b text-sm animate-pulse">
                    <td className="py-2 px-2">
                      <div className="h-4 w-8 bg-gray-200 rounded" />
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="h-4 w-64 bg-gray-200 rounded" />
                    </td>
                    <td className="py-2 px-2">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="py-2 px-2 text-right">
                      <div className="h-6 w-20 bg-gray-200 rounded ml-auto" />
                    </td>
                  </tr>
                ))}
              </>
            )}
            {!isLoading && tableData
              .slice((page - 1) * pageSize, page * pageSize)
              .map((row, idx) => {
                const realIdx = (page - 1) * pageSize + idx;
                return (
                  <tr
                    key={row.id || realIdx}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="py-2 px-2">{realIdx + 1}</td>
                    <td className="py-2 px-2 flex items-center gap-2">
                      <img
                        src={row.img}
                        alt="blog"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-[#18181B]">
                        {row.title}
                      </span>
                    </td>
                    <td className="py-2 px-2 max-w-[420px] truncate">
                      <span className="text-gray-600">
                        {row.excerpt || ""}
                      </span>
                    </td>
                    <td className="py-2 px-2">{row.date}</td>
                    <td className="py-2 px-2 flex gap-2 items-center justify-end">
                      <button
                        className="text-[#ff5c5c] hover:bg-red-50 p-1 rounded"
                        onClick={() => handleDeleteClick(realIdx)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                      {/* Delete Confirmation Modal */}
                      {deleteModalOpen && deleteIdx === realIdx && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="bg-white rounded-lg shadow-lg p-8 w-[430px] flex flex-col items-center">
                            <div className="text-xl font-bold text-center mb-8 text-[#18181B]">
                              Do you want to Remove this Category?
                            </div>
                            <div className="flex gap-4 w-full justify-center">
                              <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 border-2 border-[#6033E4] text-[#6033E4] py-2 rounded font-medium hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 bg-[#ff5c5c] text-white py-2 rounded font-medium hover:bg-[#e53e3e]"
                              >
                                Yes, Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        className="text-[#6033E4] hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleEditClick(row, realIdx)}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      {/* Edit Modal */}
                      {editModalOpen && editIdx === realIdx && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="bg-white rounded-lg shadow-lg p-8 w-[600px] flex flex-col items-center">
                            <div className="w-full mb-4">
                              <label className="block font-semibold mb-2">
                                Blog Title
                              </label>
                              <input
                                type="text"
                                className="w-full border-2 border-[#ede7f6] rounded px-3 py-2 focus:outline-none focus:border-[#6033E4]"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Blog title"
                              />
                            </div>
                            <div className="w-full mb-4">
                              <label className="block font-semibold mb-2">
                                Category
                              </label>
                              <input
                                type="text"
                                className="w-full border-2 border-[#ede7f6] rounded px-3 py-2 focus:outline-none focus:border-[#6033E4]"
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                placeholder="e.g. Health"
                              />
                            </div>
                            <div className="w-full mb-4">
                              <label className="block font-semibold mb-2">
                                Content
                              </label>
                              <textarea
                                className="w-full border-2 border-[#ede7f6] rounded px-3 py-2 min-h-[120px] focus:outline-none focus:border-[#6033E4]"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Write content"
                              />
                            </div>
                            <div className="w-full mb-4">
                              <label className="block font-semibold mb-2">
                                Blog Image
                              </label>
                              <div
                                className="w-full h-32 border-2 border-[#ede7f6] rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50"
                                onClick={() =>
                                  document
                                    .getElementById("edit-blog-img")
                                    .click()
                                }
                                aria-label="Upload image"
                                role="button"
                              >
                                {editImg ? (
                                  <img
                                    src={editImg}
                                    alt="Selected"
                                    className="w-16 h-16 object-cover rounded mb-2"
                                  />
                                ) : (
                                  <span className="text-gray-400 flex flex-col items-center">
                                    <FiUploadCloud className="w-8 h-8 text-[#6033E4] mb-1" />
                                    <span className="text-sm">Upload Image</span>
                                    <span className="text-xs text-gray-500">Click to choose a file</span>
                                  </span>
                                )}
                                <input
                                  id="edit-blog-img"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setEditFile(file);
                                      const reader = new FileReader();
                                      reader.onload = (ev) => setEditImg(ev.target.result);
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-3 mt-6 w-full">
                              <button
                                onClick={() => setEditModalOpen(false)}
                                className="flex-1 border-2 border-[#6033E4] text-[#6033E4] py-2 rounded font-medium hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                className="flex-1 bg-[#2d0563] text-white py-2 rounded font-medium hover:bg-[#6033E4]"
                                onClick={handleEditSave}
                                disabled={updating}
                              >
                                {updating ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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

export default BlogData;

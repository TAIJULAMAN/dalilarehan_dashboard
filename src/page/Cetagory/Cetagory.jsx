import React, { useEffect, useState } from "react";
import PageHeading from "../../shared/PageHeading";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Modal from "antd/es/modal/Modal";
import { useCreateServiceCategoryMutation, useGetServiceCategoriesQuery, useUpdateServiceCategoryMutation, useDeleteServiceCategoryMutation } from "../../redux/Api/categoryApi";

export default function Category() {
  const [tableData, setTableData] = useState([]);
  const { data: categories = [], isLoading, error } = useGetServiceCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateServiceCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateServiceCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteServiceCategoryMutation();

  useEffect(() => {
    if (Array.isArray(categories)) {
      const mapped = categories
        .slice()
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((c, idx) => ({
          id: String(c.sortOrder ?? idx + 1).padStart(2, "0"),
          name: c.name || "",
          img: c.icon || "",
          _id: c._id,
          sortOrder: c.sortOrder ?? null,
        }));
      setTableData(mapped);
    }
  }, [categories]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const total = tableData.length;
  const totalPages = Math.ceil(total / pageSize);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);

  const handleDeleteClick = (idx) => {
    setDeleteIdx(idx);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const item = typeof deleteIdx === "number" ? tableData[deleteIdx] : null;
    const id = item?._id;
    try {
      if (id) {
        await deleteCategory(id).unwrap();
      }
    } catch (e) {
    } finally {
      setDeleteModalOpen(false);
      setDeleteIdx(null);
    }
  };

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editImgFile, setEditImgFile] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editSortOrder, setEditSortOrder] = useState("");

  const handleEditClick = (cat, idx) => {
    setEditIdx(idx);
    setEditName(cat.name);
    setEditImg(cat.img);
    setEditImgFile(null);
    setEditId(cat._id || null);
    setEditSortOrder(cat.sortOrder != null ? String(cat.sortOrder) : "");
    setEditModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!editId) {
      setEditModalOpen(false);
      setEditIdx(null);
      return;
    }
    try {
      let payload;
      if (editImgFile) {
        const form = new FormData();
        form.append("name", editName);
        form.append("icon", editImgFile);
        if (editSortOrder) form.append("sortOrder", String(Number(editSortOrder)));
        payload = form;
      } else {
        payload = { name: editName };
        if (editSortOrder) payload.sortOrder = Number(editSortOrder);
      }
      await updateCategory({ id: editId, data: payload }).unwrap();
      setEditModalOpen(false);
      setEditIdx(null);
      setEditId(null);
      setEditImgFile(null);
      setEditSortOrder("");
    } catch (e) {
      // optionally show error UI
    }
  };

  // Add Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addImg, setAddImg] = useState("");
  const [addImgFile, setAddImgFile] = useState(null);
  const [addSortOrder, setAddSortOrder] = useState("");

  const handleAddImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImgFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAddImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (!addName) return;
    try {
      let payload;
      if (addImgFile) {
        const form = new FormData();
        form.append("name", addName);
        if (addSortOrder) form.append("sortOrder", String(Number(addSortOrder)));
        form.append("icon", addImgFile);
        payload = form;
      } else {
        payload = {
          name: addName,
          sortOrder: addSortOrder ? Number(addSortOrder) : undefined,
          // icon omitted if no file selected; backend may set default or reject
        };
      }
      await createCategory(payload).unwrap();
      // After successful create, query invalidation will refresh the list
      setAddName("");
      setAddImg("");
      setAddImgFile(null);
      setAddSortOrder("");
      setAddModalOpen(false);
    } catch (e) {
      // optionally show error UI
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="rounded-t-lg mt-5 bg-[#6033E4] text-white py-3 flex flex-col md:flex-row justify-between items-start md:items-center mx-5 px-5 gap-4">
        <PageHeading title="Category" />
        <button
          className="bg-white text-[#6033E4] py-2 px-6 rounded-md hover:bg-gray-100"
          onClick={() => setAddModalOpen(true)}
        >
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="mx-5 bg-white rounded-b-lg shadow-sm border p-4 border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-xs text-[#6033E4] font-semibold uppercase text-left">
              <th className="py-3 px-2">S.ID</th>
              <th className="py-3 px-2">Category Name</th>
              <th className="py-3 px-2">Category Image/Icon</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData
              .slice((page - 1) * pageSize, page * pageSize)
              .map((row, idx) => {
                const realIdx = (page - 1) * pageSize + idx;
                return (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="py-2 px-2">{row.id}</td>
                    <td className="py-2 px-2">{row.name}</td>
                    <td className="py-2 px-2">
                      <img
                        src={row.img}
                        alt="icon"
                        className="w-10 h-8 object-contain"
                      />
                    </td>
                    <td className="py-2 px-2 flex gap-2 items-center justify-end">
                      <button
                        className="text-[#ff5c5c] hover:bg-red-50 p-1 rounded"
                        onClick={() => handleDeleteClick(realIdx)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                      <button
                        className="text-[#6033E4] hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleEditClick(row, realIdx)}
                      >
                        <FiEdit2 size={18} />
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
            {[...Array(totalPages).keys()].map((i) => (
              <button
                key={i}
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
            <button
              className="w-6 h-6 flex items-center justify-center rounded bg-[#f3f3f3] text-[#6033E4]"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              {">"}
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

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ borderRadius: 12, padding: 0 }}
        width={430}
      >
        <div className="p-8 flex flex-col items-center">
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
      </Modal>

      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ borderRadius: 12 }}
        width={370}
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Service Type</label>
            <input
              type="text"
              className="w-full border-2 border-[#ede7f6] rounded px-3 py-2 focus:outline-none focus:border-[#6033E4]"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="Category name"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Category Image/Icon
            </label>
            <div
              className="w-full h-32 border-2 border-[#ede7f6] rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50"
              onClick={() => document.getElementById("add-cat-img").click()}
            >
              {addImg ? (
                <img
                  src={addImg}
                  alt="icon"
                  className="w-16 h-16 object-contain mb-2"
                />
              ) : (
                <span className="text-gray-400">Upload Image</span>
              )}
              <input
                id="add-cat-img"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAddImgChange}
              />
            </div>
            <div className="mb-4">  
              <label className="block font-semibold mb-2">Sort Order</label>
              <input
                type="number"
                className="w-full border-2 border-[#ede7f6] rounded px-3 py-2 focus:outline-none focus:border-[#6033E4]"
                value={addSortOrder}
                onChange={(e) => setAddSortOrder(e.target.value)}
                placeholder="Sort order"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setAddModalOpen(false)}
              className="flex-1 border-2 border-[#6033E4] text-[#6033E4] py-2 rounded font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-[#2d0563] text-white py-2 rounded font-medium hover:bg-[#6033E4] disabled:opacity-60"
              onClick={handleAddCategory}
              disabled={isCreating}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ borderRadius: 12 }}
        width={370}
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Service Type</label>
            <input
              type="text"
              className="w-full border-2 border-[#ede7f6] rounded px-3 py-2 focus:outline-none focus:border-[#6033E4]"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Category name"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Category Image/Icon
            </label>
            <div
              className="w-full h-32 border-2 border-[#ede7f6] rounded flex flex-col items-center justify-center cursor-pointer bg-gray-50"
              onClick={() => document.getElementById("edit-cat-img").click()}
            >
              {editImg ? (
                <img
                  src={editImg}
                  alt="icon"
                  className="w-16 h-16 object-contain mb-2"
                />
              ) : (
                <span className="text-gray-400">Upload Image</span>
              )}
              <input
                id="edit-cat-img"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditImgFile(file);
                    const reader = new FileReader();
                    reader.onload = (ev) => setEditImg(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Sort Order</label>
            <input
              type="number"
              className="w-full border-2 border-[#ede7f6] rounded px-3 py-2 focus:outline-none focus:border-[#6033E4]"
              value={editSortOrder}
              onChange={(e) => setEditSortOrder(e.target.value)}
              placeholder="Sort order"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setEditModalOpen(false)}
              className="flex-1 border-2 border-[#6033E4] text-[#6033E4] py-2 rounded font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-[#2d0563] text-white py-2 rounded font-medium hover:bg-[#6033E4] disabled:opacity-60"
              onClick={handleEditConfirm}
              disabled={isUpdating}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

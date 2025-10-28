import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Modal } from "antd";
import { useGetAllAdminsQuery, useUpdateAdminMutation, useDeleteAdminMutation } from "../../redux/Api/adminApi";
import { handleSuccess, handleError } from "../../Toast";
import { useMeQuery } from "../../redux/Api/authApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Admins() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "admin" });
  const { data: adminsData = [], isLoading, isError, refetch } = useGetAllAdminsQuery();
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();
  const currentUser = me?.data?.admin || me?.data || me;

  const openEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({ name: admin.name, email: admin.email, role: (admin.role || admin.adminLevel || "admin").toLowerCase() });
    setIsEditOpen(true);
  };

  const openDelete = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const id = selectedAdmin?.id;
      const body = {
        fullname: editForm.name,
        adminLevel: editForm.role,
      };
      await updateAdmin({ id, body }).unwrap();
      await refetch();
      handleSuccess("Admin updated successfully.");
      setIsEditOpen(false);
    } catch (e) {
      handleError("Failed to update admin.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = selectedAdmin?.id;
      await deleteAdmin(id).unwrap();
      await refetch();
      handleSuccess("Admin deleted successfully.");
    } catch (e) {
      handleError("Failed to delete admin.");
    } finally {
      setIsDeleteOpen(false);
    }
  };
  const admins = (adminsData || []).map((a) => {
    const name = a.fullname || a.name || "Unknown";
    const email = a.email || "";
    const role = (a.adminLevel || a.role || "admin").replace(/\b\w/g, (c) => c.toUpperCase());
    const avatar = a.image || a.avatar || a.photo || null;
    return { id: a._id || a.id, name, email, role, avatar };
  });
  const filteredAdmins = admins.filter((a) => {
    const ls = typeof localStorage !== "undefined" ? localStorage : null;
    const fallbackEmail = ls?.getItem("remember_email") || ls?.getItem("email") || null;
    const meId = currentUser?._id;
    const meEmail = (currentUser?.email || fallbackEmail || "").toLowerCase();
    if (meId && a.id && String(a.id) === String(meId)) return false;
    if (meEmail && a.email && a.email.toLowerCase() === meEmail) return false;
    return true;
  });

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full-5 min-h-[40vh] overflow-hidden border border-gray-200 mx-5 mt-5">
      <ToastContainer />
      <div className="flex items-center justify-between bg-[#6033E4] px-6 py-4">
        <h2 className="text-white text-3xl mt-4 font-bold">All Admins</h2>
        <Link
          to="/dashboard/createAdmin"
          className="bg-white text-[#6033E4] font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100"
        >
          Create Admin
        </Link>
      </div>

      <div className="px-6 py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                [...Array(6)].map((_, i) => (
                  <tr key={`admin-skel-${i}`} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-24 bg-gray-200 rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 justify-start">
                        <div className="w-5 h-5 bg-gray-200 rounded" />
                        <div className="w-5 h-5 bg-gray-200 rounded" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-red-500">Failed to load admins.</td>
                </tr>
              )}
              {!isLoading && !isError && filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No admins to display.</td>
                </tr>
              )}
              {!isLoading && !isError && filteredAdmins.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    {a.avatar ? (
                      <img
                        src={a.avatar}
                        alt={a.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[#0D2357] text-sm font-semibold">
                        {a.name?.charAt(0) || ""}
                      </div>
                    )}
                    <span className="text-[#0D2357] font-semibold">{a.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{a.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                      {a.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="p-2 rounded hover:bg-gray-100 text-[#0D2357]"
                        aria-label="Edit admin"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDelete(a)}
                        className="p-2 rounded hover:bg-gray-100 text-red-600"
                        aria-label="Delete admin"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Modal */}
      <Modal
        open={isEditOpen}
        centered
        onCancel={() => setIsEditOpen(false)}
        footer={null}
        title={
          <span className="text-[#0D2357] font-semibold">Edit Admin</span>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#0D2357] mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#6033E4]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#0D2357] mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded-md outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="block text-sm text-[#0D2357] mb-1">Role</label>
            <select
              name="role"
              value={editForm.role}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#6033E4]"
            >
             
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              className="px-4 py-2 rounded bg-[#6033E4] text-white disabled:opacity-60"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={isDeleteOpen}
        centered
        onCancel={() => setIsDeleteOpen(false)}
        footer={null}
      >
        <div className="p-1 text-center">
          <h3 className="text-lg font-semibold text-[#0D2357] mb-2">Confirm Delete</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete {selectedAdmin?.name}?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-60"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Admins;

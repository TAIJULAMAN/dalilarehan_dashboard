import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleSuccess, handleError } from "../Toast";
import { useCreateAdminMutation } from "../redux/Api/adminApi";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function AdminSignIn() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminLevel: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.adminLevel) {
      alert("Please fill all required fields.");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      const body = {
        fullname: formData.name,
        email: formData.email,
        password: formData.password,
        adminLevel: formData.adminLevel,
      };
      await createAdmin(body).unwrap();
      handleSuccess("Admin created successfully.");
      setFormData({ name: "", email: "", password: "",  adminLevel: "" });
      setTimeout(() => navigate("/dashboard/admins"), 1200);
    } catch (err) {
      const message = err?.data?.message || err?.error || "Failed to create admin.";
      console.error("Create admin error:", err);
      handleError(message);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full-5 min-h-[40vh] overflow-hidden border border-gray-200 mx-5 mt-5">
      <ToastContainer />
      {/* Header */}
      <div className="bg-[#6033E4] px-6 py-4">
        <h2 className="text-white text-3xl mt-4 font-bold">Create Admin</h2>
      </div>

      {/* Form */}
      <form className="px-6 py-8 space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-[#0D2357] font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="jhon-doe"
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0D2357] placeholder:text-gray-400"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[#0D2357] font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="abc@gmail.com.."
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0D2357] placeholder:text-gray-400"
            required
          />
        </div>

        {/* Passwords side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#0D2357] font-medium mb-2">
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0D2357] placeholder:text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? (
                  <IoEyeOffOutline className="w-5 h-5" />
                ) : (
                  <IoEyeOutline className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[#0D2357] font-medium mb-2">
              Admin Level
            </label>
            <div className="relative">
              <select
                name="adminLevel"
                value={formData.adminLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0D2357] text-[#0D2357]"
                required
              >
                <option value="" disabled>
                  Select level
                </option>

                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#6033E4] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#001f47] transition text-lg mt-2 disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}

export default AdminSignIn;

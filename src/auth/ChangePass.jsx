import "antd/dist/reset.css";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useChangeAdminPasswordMutation } from "../redux/Api/userApi";
import { useNavigate } from "react-router-dom";

const ChangePass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changePassword, { isLoading }] = useChangeAdminPasswordMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword) return;
    if (formData.newPassword !== formData.confirmPassword) return;
    try {
      await changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      navigate("/");
    } catch (err) {
      // optional: show error UI
    }
  };
  return (
    <div>
      <div className="rounded-t-lg mt-5 rounded-b-none bg-[#6033E4] text-white py-3 flex flex-row justify-between items-center mx-5 max-md:mx-3 px-5 max-md:px-3">
        <h2 className="text-white text-3xl mt-4 font-bold">Change Password</h2>
      </div>
      <div className="mx-5 max-md:mx-3 px-5 max-md:px-3 bg-white rounded-b-lg">
        <div className="bg-white relative px-5 max-md:px-3 py-10 max-md:py-6 w-full max-w-2xl mx-auto">
          <form className="space-y-5 max-md:space-y-4" onSubmit={handleSubmit}>
            <div className="w-full">
              <label className="text-xl text-gray-800 mb-2 flex justify-start text-start">
                Current Password
              </label>
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full px-5 py-3 bg-white text-gray-600 border-2 border-[#001C54] rounded-md outline-none mt-5 placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-[#001C54]"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="w-5 h-5 text-[#FF914C]" />
                  ) : (
                    <IoEyeOutline className="w-5 h-5 text-[#001C54]" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full">
              <label className="text-xl text-gray-800 mb-2 flex justify-start text-start">
                New Password
              </label>
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full px-5 py-3 bg-white text-gray-600 border-2 border-[#001C54] rounded-md outline-none mt-5 placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-[#001C54]"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="w-5 h-5 text-[#FF914C]" />
                  ) : (
                    <IoEyeOutline className="w-5 h-5 text-[#001C54]" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full">
              <label className="text-xl text-gray-800 mb-2 flex justify-start text-start">
                Confirm Password
              </label>
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full px-5 py-3 bg-white text-gray-600 border-2 border-[#001C54] rounded-md outline-none mt-5 placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 transform -translate-y-1/2 flex items-center text-[#001C54]"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="w-5 h-5 text-[#001C54]" />
                  ) : (
                    <IoEyeOutline className="w-5 h-5 text-[#001C54]" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center text-white">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6033E4] disabled:opacity-60 font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer mt-5"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;

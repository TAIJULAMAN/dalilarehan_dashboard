import "antd/dist/reset.css";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import LoginLogo from "../assets/header/logo.png";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3 md:p-5">
      <div className="bg-white relative rounded-2xl px-4 md:px-5 py-8 md:py-12 w-full max-w-lg md:max-w-2xl text-center">
        <div className="flex justify-center gap-5 items-center">
          <img src={LoginLogo} alt="Logo" />
          <h2 className="text-2xl md:text-4xl ipad-landscape:text-[48px] font-semibold text-[#001C54] mt-4">
            Flexytâche
          </h2>
        </div>
        <div className="max-w-sm md:max-w-xl items-center mx-auto mt-5">
          <form className="space-y-5">
            <h1 className="text-3xl text-start font-medium text-[#001C54]">
              Set new password
            </h1>

            <div className="w-full">
              <label className="text-xl text-gray-800 mb-2 flex justify-start text-start">
                New Password
              </label>
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full px-5 py-3 bg-white text-gray-600 border-2 border-[#001C54] rounded-md outline-none mt-5 placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center text-[#001C54]"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full px-5 py-3 bg-white text-gray-600 border-2 border-[#001C54] rounded-md outline-none mt-5 placeholder:text-gray-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center text-[#001C54]"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="w-5 h-5 text-[#001C54]" />
                  ) : (
                    <IoEyeOutline className="w-5 h-5 text-[#001C54]" />
                  )}
                </button>
              </div>
            </div>

            <Link to="/login">
              <div className="flex justify-center items-center text-white">
                <button
                  type="submit"
                  className="w-full bg-[#6033E4] font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer mt-5"
                >
                  Save Password
                </button>
              </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

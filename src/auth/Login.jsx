import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { message } from "antd";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import LoginLogo from "../assets/header/logo.png";
import { useLoginMutation } from "../redux/Api/authApi";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    const rememberedEmail =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("remember_email")
        : null;
    const rememberedPassword =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("remember_password")
        : null;
    if (rememberedEmail || rememberedPassword) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail || "",
        password: rememberedPassword || "",
      }));
      setIsChecked(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      console.log(res, "login response");
      // Store both access and refresh tokens (cookie + localStorage)
      const accessToken = res?.data?.accessToken || res?.accessToken || null;
      const refreshToken = res?.data?.refreshToken || res?.refreshToken || null;
      const cookieAge = isChecked ? 60 * 60 * 24 * 30 : undefined; // 30 days if remember me
      try {
        if (accessToken) {
          const enc = encodeURIComponent(accessToken);
          document.cookie = `accessToken=${enc}; ${
            cookieAge ? `Max-Age=${cookieAge}; ` : ""
          }Path=/; SameSite=Lax`;
          localStorage.setItem("accessToken", accessToken);
        }
        if (refreshToken) {
          const encR = encodeURIComponent(refreshToken);
          document.cookie = `refreshToken=${encR}; ${
            cookieAge ? `Max-Age=${cookieAge}; ` : ""
          }Path=/; SameSite=Lax`;
          localStorage.setItem("refreshToken", refreshToken);
        }
      } catch {}

      const fullNameFromRes =
        res?.data?.admin?.fullname ||
        res?.data?.admin?.fullName ||
        res?.data?.fullname ||
        res?.data?.fullName ||
        null;
      if (fullNameFromRes) {
        localStorage.setItem("fullname", fullNameFromRes);
      }

      if (isChecked) {
        localStorage.setItem("remember_email", formData.email);
        localStorage.setItem("remember_password", formData.password);
      } else {
        localStorage.removeItem("remember_email");
        localStorage.removeItem("remember_password");
      }

      message.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      const status = err?.status ?? err?.originalStatus;
      const data = err?.data;
      const msg =
        status === 401
          ? "Invalid email or password"
          : typeof data === "string" && data.trim()
          ? data
          : data?.message || data?.error || err?.error || "Login failed";
      message.error(msg);
    }
  };

  // Build a robust error message for various RTKQ error shapes
  const errorMsg = (() => {
    if (!error) return "";
    const status = error?.status ?? error?.originalStatus;
    if (status === 401) return "Invalid email or password";
    const data = error?.data;
    if (typeof data === "string" && data.trim()) return data;
    return data?.message || data?.error || error?.error || "Login failed";
  })();

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-3 md:p-5">
      <div className="bg-white relative rounded-2xl px-4 md:px-5 py-12 md:py-20 w-full max-w-lg md:max-w-2xl text-center">
        <div className="flex justify-center gap-5 items-center">
          <img src={LoginLogo} alt="Logo" />
          <h2 className="text-2xl md:text-4xl ipad-landscape:text-[48px] font-semibold text-[#001C54] mt-4">
            Flexytâche
          </h2>
        </div>
        <div className="max-w-sm md:max-w-xl items-center mx-auto mt-5">
          {error && <div className="mb-3 text-red-600 text-sm">{errorMsg}</div>}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="w-full">
              <label className="text-base md:text-lg ipad-landscape:text-xl text-gray-800 mb-2 flex justify-start text-start">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 md:px-5 py-3 md:py-4 bg-white text-gray-600 border-2 rounded-lg outline-none mt-3 md:mt-5 placeholder:text-gray-600 text-sm md:text-base"
                required
              />
            </div>
            <div className="w-full">
              <label className="text-base md:text-lg ipad-landscape:text-xl text-gray-800 mb-2 flex justify-start text-start">
                Password
              </label>
              <div className="w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="**********"
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-white text-gray-600 border-2 rounded-lg outline-none mt-3 md:mt-5 placeholder:text-gray-600 text-sm md:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-12 transform -translate-y-1/2 flex items-center text-gray-400 p-2"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="w-5 h-5" />
                  ) : (
                    <IoEyeOutline className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm md:text-base my-5 gap-3 md:gap-0">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                {isChecked ? (
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Group 335">
                      <rect
                        id="Rectangle 331"
                        x="-0.00012207"
                        y="6.10352e-05"
                        width="21"
                        height="21"
                        rx="4"
                        className="fill-[#001C54]"
                        stroke="#001C54"
                      ></rect>
                      <path
                        id="Vector"
                        d="M8.19594 15.4948C8.0646 15.4949 7.93453 15.4681 7.81319 15.4157C7.69186 15.3633 7.58167 15.2865 7.48894 15.1896L4.28874 11.8566C4.10298 11.6609 3.99914 11.3965 3.99988 11.1213C4.00063 10.8461 4.10591 10.5824 4.29272 10.3878C4.47953 10.1932 4.73269 10.0835 4.99689 10.0827C5.26109 10.0819 5.51485 10.1901 5.70274 10.3836L8.19591 12.9801L14.2887 6.6335C14.4767 6.4402 14.7304 6.3322 14.9945 6.33307C15.2586 6.33395 15.5116 6.44362 15.6983 6.63815C15.8851 6.83268 15.9903 7.09627 15.9912 7.37137C15.992 7.64647 15.8883 7.91073 15.7027 8.10648L8.90294 15.1896C8.8102 15.2865 8.7 15.3633 8.57867 15.4157C8.45734 15.4681 8.32727 15.4949 8.19594 15.4948Z"
                        fill="white"
                      ></path>
                    </g>
                  </svg>
                ) : (
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Group 335">
                      <rect
                        id="Rectangle 331"
                        x="-0.00012207"
                        y="6.10352e-05"
                        width="21"
                        height="21"
                        rx="4"
                        className="fill-transparent"
                        stroke="#001C54"
                      ></rect>
                    </g>
                  </svg>
                )}

                <span className="text-base md:text-lg ipad-landscape:text-xl text-gray-600">
                  Remember Password
                </span>
              </label>
              <Link
                to="/forget-password"
                className="text-[#001C54] text-base md:text-lg ipad-landscape:text-xl hover:text-[#FF914C]/80 transition-colors p-2 rounded-md"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex justify-center items-center text-white mt-6">
              <button
                type="submit"
                className="w-full bg-[#6033E4] font-semibold py-3 md:py-4 px-6 rounded-lg shadow-lg cursor-pointer transition-colors hover:bg-[#002a6b] active:bg-[#001a44] text-sm md:text-base ipad-landscape:text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

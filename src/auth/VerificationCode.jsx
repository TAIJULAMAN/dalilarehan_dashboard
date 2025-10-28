import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLogo from "../assets/header/logo.png";

function VerificationCode() {
  const [code, setCode] = useState(new Array(5).fill(""));
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  // const handleVerifyCode = async () => {
  //   navigate("/dashboard/Setting/reset-password");
  // };

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
            <div className="text-start">
              <h2 className="font-bold text-2xl text-[#001C54]">Verify OTP</h2>
              <p className="text-gray-600 mt-2 text-sm">
                Please check your email. We have sent a code to contact
                @gmail.com
              </p>
            </div>
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="shadow-xs w-12 h-12 text-2xl text-center border border-[#001C54] text-[#001C54] rounded-lg focus:outline-none"
                />
              ))}
            </div>

            <div className="flex flex-col gap-5 justify-center items-center text-white">
              <button
                // onClick={handleVerifyCode}
                onClick={() => navigate("/resetPassword")}
                type="button"
                className="whitespace-nowrap w-full bg-[#6033E4] text-white font-semibold py-3 rounded-lg shadow-lg cursor-pointer my-5"
              >
                Continue
              </button>
              <div className="flex w-full justify-between items-center ">
                <p className="text-gray-600 text-center mt-2">
                  You have not received the email?{" "}
                </p>
                <span className="text-[#001C54] text-end underline">
                  Resend..
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerificationCode;

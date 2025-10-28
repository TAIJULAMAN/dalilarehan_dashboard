import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import PageHeading from "../../shared/PageHeading";
import { Link, useNavigate } from "react-router-dom";

export default function Setting() {
  return (
    <div className="bg-white shadow-lg rounded-2xl w-full-5 min-h-[82vh] overflow-hidden border border-gray-200 mx-5 max-md:mx-3 mt-5">
      {/* Header */}
      <div className="bg-[#6033E4] px-6 max-md:px-4 py-4 max-md:py-3">
        <h2 className="text-white text-3xl max-md:text-xl mt-4 max-md:mt-2 font-bold">
          Settings
        </h2>
      </div>
      <Link to="/dashboard/Setting/ChangePassword">
        <div className="mx-5 max-md:mx-3 mt-5 max-md:mt-4 px-5 max-md:px-3 max-md:py-2 max-md:hover:bg-gray-50 max-md:active:bg-gray-100 max-md:transition-colors max-md:rounded-md">
          <div className="flex justify-between items-center px-5 max-md:px-2 max-md:py-2">
            <h1 className="text-[24px] max-md:text-lg font-medium text-[#6033E4]">
              Change Password
            </h1>
            <IoIosArrowForward size={15} className="text-[#6033E4]" />
          </div>
          <hr className="w-full h-[1px] bg-gray-400 mt-3" />
        </div>
      </Link>
      <Link to="/dashboard/Setting/privacyPolicy">
        <div className="mx-5 max-md:mx-3 mt-5 max-md:mt-4 px-5 max-md:px-3 max-md:py-2 max-md:hover:bg-gray-50 max-md:active:bg-gray-100 max-md:transition-colors max-md:rounded-md">
          <div className="flex justify-between items-center px-5 max-md:px-2 max-md:py-2">
            <h1 className="text-[24px] max-md:text-lg font-medium text-[#6033E4]">
              Privacy Policy
            </h1>
            <IoIosArrowForward size={15} className="text-[#6033E4]" />
          </div>
          <hr className="w-full h-[1px] bg-gray-400 mt-3" />
        </div>
      </Link>
      <Link to="/dashboard/Setting/tramsAndCondition">
        <div className="mx-5 max-md:mx-3 mt-5 max-md:mt-4 px-5 max-md:px-3 max-md:py-2 max-md:hover:bg-gray-50 max-md:active:bg-gray-100 max-md:transition-colors max-md:rounded-md">
          <div className="flex justify-between items-center px-5 max-md:px-2 max-md:py-2">
            <h1 className="text-[24px] max-md:text-lg font-medium text-[#6033E4]">
              Terms & Conditions
            </h1>
            <IoIosArrowForward size={15} className="text-[#6033E4]" />
          </div>
          <hr className="w-full h-[1px] bg-gray-400 mt-3" />
        </div>
      </Link>
      <Link to="/dashboard/Setting/aboutUs">
        <div className="mx-5 max-md:mx-3 mt-5 max-md:mt-4 px-5 max-md:px-3 max-md:py-2 max-md:hover:bg-gray-50 max-md:active:bg-gray-100 max-md:transition-colors max-md:rounded-md">
          <div className="flex justify-between items-center px-5 max-md:px-2 max-md:py-2">
            <h1 className="text-[24px] max-md:text-lg font-medium text-[#6033E4]">
              About Us
            </h1>
            <IoIosArrowForward size={15} className="text-[#6033E4]" />
          </div>
          <hr className="w-full h-[1px] bg-gray-400 mt-3" />
        </div>
      </Link>
    </div>
  );
}

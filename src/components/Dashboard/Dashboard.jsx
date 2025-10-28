import { Modal } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import RecentUsers from "./RecentUsers";
import UserRatio from "./UserRatio";
import { useGetAdminUsersCountsQuery } from "../../redux/Api/userApi";

function DashboardPage() {
  const currentYear = dayjs().year();
  const startYear = 2000;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: counts } = useGetAdminUsersCountsQuery();
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col mt-10 max-md:mt-5 px-3 ipad:px-5">
      {/* upper 2 blocks */}
      <div
        className="w-full flex bg-white rounded-lg shadow-sm items-center justify-center border border-[#E2E8F0] max-md:py-4"
        style={{ minHeight: "110px" }}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[#0D2357] text-2xl ipad:text-3xl lg:text-4xl max-md:text-xl font-bold mb-2 max-md:mb-1">
            {counts?.totalUsers ?? 0}
          </p>
          <span className="text-[#0D2357] text-sm ipad:text-base lg:text-lg max-md:text-xs font-medium text-center max-md:px-2">
            Total Users
          </span>
        </div>
        <div className="w-px h-16 max-md:h-12 bg-[#F4B057] mx-4 ipad:mx-8 max-md:mx-3" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[#0D2357] text-2xl ipad:text-3xl lg:text-4xl max-md:text-xl font-bold mb-2 max-md:mb-1">
            {counts?.totalProviders ?? 0}
          </p>
          <span className="text-[#0D2357] text-sm ipad:text-base lg:text-lg max-md:text-xs font-medium text-center max-md:px-2">
            Total Providers
          </span>
        </div>
      </div>
      {/* User Ratio Section */}
      <div className="w-full gap-5 mt-5">
        <div className="w-full p-5 max-md:p-4 bg-[#FFFFFF] rounded-lg shadow-md">
          <div className="flex flex-col ipad:flex-row ipad:justify-between lg:justify-between items-center gap-5 my-5 max-md:my-3 max-md:items-start">
            <div>
              <h1 className="text-lg ipad:text-xl max-md:text-base font-semibold">
                User Ratio
              </h1>
            </div>
            <div className="relative w-full ipad:w-32 max-md:w-full">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md flex justify-between items-center bg-white transition"
              >
                <span className="text-[#095038]">{selectedYear}</span>
                <FaChevronDown className="text-[#0B704E] w-5 h-5 ml-5" />
              </button>

              {/* Dropdown List */}
              {isOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg text-lg">
                  {years.map((year) => (
                    <div
                      key={year}
                      onClick={() => handleSelect(year)}
                      className={`p-2 cursor-pointer hover:bg-gray-100 transition ${
                        year === selectedYear ? "bg-gray-200" : ""
                      }`}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <UserRatio year={selectedYear} />
        </div>
      </div>

      <div className="mt-5">
        <h1 className="text-2xl max-md:text-xl font-bold mb-5 max-md:mb-4 max-md:px-1">
          Recent Users
        </h1>
        <RecentUsers showModal={showModal} />
      </div>
      <Modal open={isModalOpen} centered onCancel={handleCancel} footer={null}>
        <div className="p-5">
          <h1 className="text-4xl text-center text-[#0D0D0D]">
            Are you sure you want to block ?
          </h1>

          <div className="text-center py-5">
            <button
              onClick={handleOk}
              className="bg-[#14803c] text-white font-semibold w-full py-2 rounded transition duration-200"
            >
              Yes,Block
            </button>
          </div>
          <div className="text-center pb-5">
            <button
              onClick={handleOk}
              className="text-[#14803c] border-2 border-green-600 bg-white font-semibold w-full py-2 rounded transition duration-200"
            >
              No,Don’t Block
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardPage;

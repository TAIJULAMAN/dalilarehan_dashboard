import { useState } from "react";
import { HiOutlineBarsArrowDown } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import ManagePlansModal from "../../components/ManagePlansModal";
import { useGetAdminDashboardQuery } from "../../redux/Api/transactionsApi";
import PageHeading from "../../shared/PageHeading";
import EarningChart from "./EarningChart";
import EarningPayout from "./EarningPayout";
import EarningTable from "./EarningTable";

export default function Earning() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetAdminDashboardQuery();
  const summary = dashboardData?.summary || {};
  const euroRaw = (n) => {
    if (typeof n !== "number") return "-";

    const formatted = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

    return formatted;
  };
  return (
    <div className="w-full px-4 py-4">
      {/* Top Stats */}
      <div
        className="w-full flex bg-white rounded-lg shadow-sm items-center justify-center border border-[#E2E8F0] max-md:py-4"
        style={{ minHeight: "110px" }}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[#0D2357] text-2xl ipad:text-3xl lg:text-4xl max-md:text-xl font-bold mb-2">
            {isDashboardLoading ? "--" : euroRaw(summary.avgTransactionAmount)}
          </p>
          <span className="text-[#0D2357] text-sm lg:text-lg font-medium text-center">
            Average Transaction
          </span>
        </div>
        <div className="w-px h-16 bg-[#F4B057] mx-4" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[#0D2357] text-2xl ipad:text-3xl lg:text-4xl max-md:text-xl font-bold mb-2">
            {isDashboardLoading ? "--" : euroRaw(summary.currentMonthRevenue)}
          </p>
          <span className="text-[#0D2357] text-sm lg:text-lg font-medium text-center">
            Current Month Revenue
          </span>
        </div>
        <div className="w-px h-16 bg-[#F4B057] mx-4" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[#0D2357] text-2xl ipad:text-3xl lg:text-4xl max-md:text-xl font-bold mb-2">
            {isDashboardLoading ? "--" : euroRaw(summary.totalRevenue)}
          </p>
          <span className="text-[#0D2357] text-sm lg:text-lg font-medium text-center">
            Total Revenue
          </span>
        </div>
      </div>

      <div className="mt-5">
        <EarningChart year={year} />
      </div>

      {/* Heading + Search */}
      <div className="rounded-t-lg mt-5 bg-[#6033E4] text-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center  px-5 gap-4">
        <PageHeading title="Earnings" />
        <div className="flex flex-col ipad:flex-row items-center gap-4 w-full ipad:w-auto">
          <button
            className="bg-white text-[#6033E4] py-2 px-4 ipad:px-6 rounded-md hover:bg-gray-100 focus:outline-none whitespace-nowrap text-sm ipad:text-base max-md:font-medium"
            onClick={() => setPlansModalOpen(true)}
          >
            Configure Points Prices
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="">
        <div className="bg-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center px-5 border border-t-0 border-x-0 border-gray-300 gap-3">
          <div className="flex gap-3">
            <button
              className={`border border-blue-600/50 py-2 px-4 rounded-md ${
                activeTab === "transactions"
                  ? "text-white bg-[#6033E4]"
                  : "text-black bg-white hover:bg-[#6033E4] hover:text-white"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
            <button
              className={`border border-blue-600/50 py-2 px-4 rounded-md ${
                activeTab === "payouts"
                  ? "text-white bg-[#6033E4]"
                  : "text-black bg-white hover:bg-[#6033E4] hover:text-white"
              }`}
              onClick={() => setActiveTab("payouts")}
            >
              Payouts
            </button>
          </div>
          <div className="flex items-center gap-5 border p-2 border-gray-500 rounded-md">
            <div className="flex items-center gap-2">
              <HiOutlineBarsArrowDown size={21} />
              <h2 className="capitalize">Date</h2>
            </div>
            <IoIosArrowDown size={21} />
            <select
              className="border border-gray-300 rounded px-2 py-1 text-black"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {[
                currentYear - 2,
                currentYear - 1,
                currentYear,
                currentYear + 1,
              ].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Earnings Table or Payout Table */}
        {activeTab === "transactions" ? <EarningTable /> : <EarningPayout />}
      </div>

      {/* Manage Plans Modal */}
      <ManagePlansModal
        open={plansModalOpen}
        onClose={() => setPlansModalOpen(false)}
      />
      {/* Transaction Details Modal */}
    </div>
  );
}

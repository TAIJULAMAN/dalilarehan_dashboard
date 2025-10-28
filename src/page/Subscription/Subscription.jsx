import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import PageHeading from "../../shared/PageHeading";
import Client from "./Client";
import Coupons from "./Coupons";
import Provider from "./Provider";

export default function Subscription() {
  const [activeTab, setActiveTab] = useState("client");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [blockedModalOpen, setBlockedModalOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [otherModalOpen, setOtherModalOpen] = useState(false);
  const [couponPlanModalOpen, setCouponPlanModalOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);
  // State for Free and Premium plans
  const [freePlan, setFreePlan] = useState({
    discount: "5",
    loyalty: "No loyalty rewards",
    bonus: "Welcome badge",
    window: "48 hours before booking",
    enabled: true,
  });

  const [premiumPlan, setPremiumPlan] = useState({
    price: "€9.99",
    discount: "15",
    loyalty: "After 5 bookings, get 20% off",
    bonus: "€5 credit",
    window: "Unlimited booking access",
    enabled: true,
  });
  // ...existing code...
  return (
    <div>
      <div className="rounded-t-lg mt-5 rounded-b-none bg-[#6033E4] text-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center mx-5 max-md:mx-3 px-5 max-md:px-3 gap-4 ipad:gap-0">
        <PageHeading title="Subscriptions" />
        <div className="flex flex-col ipad:flex-row items-center gap-4 ipad:gap-[50px] w-full ipad:w-auto max-md:items-start max-md:gap-3">
          <div className="relative w-full ipad:w-[300px] max-md:w-full">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search Subscribers"
                className="border-2 py-2 pl-10 pr-4 text-black outline-none w-full rounded-md max-md:text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setDebouncedSearch(search.trim());
                }}
              />
              <span className="text-gray-400 absolute top-0 left-0 h-full px-3 flex items-center justify-center">
                <IoSearch className="text-[1.3rem] max-md:text-[1.1rem]" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 max-md:mx-3">
        <div className="bg-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center px-5 max-md:px-3 border border-t-0 border-x-0 border-gray-300 gap-3 ipad:gap-0">
          <div className="flex gap-3 w-full ipad:w-auto">
            <button
              className={`border border-blue-600/50 py-2 px-4 ipad:px-6 max-md:px-3 rounded-md focus:outline-none text-sm ipad:text-base ${
                activeTab === "client"
                  ? "bg-[#6033E4] text-white"
                  : "bg-white text-black hover:text-white hover:bg-[#6033E4]"
              }`}
              onClick={() => setActiveTab("client")}
            >
              Clients
            </button>
            <button
              className={`border border-blue-600/50 py-2 px-4 ipad:px-6 max-md:px-3 rounded-md focus:outline-none text-sm ipad:text-base ${
                activeTab === "provider"
                  ? "bg-[#6033E4] text-white"
                  : "bg-white text-black hover:text-white hover:bg-[#6033E4]"
              }`}
              onClick={() => setActiveTab("provider")}
            >
              Providers
            </button>
            <button
              className={`border border-blue-600/50 py-2 px-4 ipad:px-6 max-md:px-3 rounded-md focus:outline-none text-sm ipad:text-base ${
                activeTab === "coupons"
                  ? "bg-[#6033E4] text-white"
                  : "bg-white text-black hover:text-white hover:bg-[#6033E4]"
              }`}
              onClick={() => setActiveTab("coupons")}
            >
              Manage Configurations
            </button>
          </div>
        </div>
      </div>

      {activeTab === "client" && <Client searchTerm={debouncedSearch} />}
      {activeTab === "provider" && <Provider searchTerm={debouncedSearch} />}
      {activeTab === "coupons" && <Coupons searchTerm={debouncedSearch} />}

      {/* Blocked Users Modal */}
      {/* <Modal
        open={blockedModalOpen}
        onCancel={() => setBlockedModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ borderRadius: 12 }}
        width={400}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-[#6033E4]">
            Blocked Users
          </h2>
          <div className="text-gray-700">No blocked users found.</div>
          <button
            onClick={() => setBlockedModalOpen(false)}
            className="mt-6 bg-[#6033E4] text-white px-6 py-2 rounded-md font-medium hover:bg-[#4b27b8] transition"
          >
            Close
          </button>
        </div>
      </Modal> */}
    </div>
  );
}

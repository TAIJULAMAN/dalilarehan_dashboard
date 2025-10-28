import { useEffect, useState } from "react";
import {
  useGetLoyaltyConfigQuery,
  useGetSubscriptionConfigsQuery,
  useUpdateLoyaltyConfigMutation,
  useUpdateSubscriptionPricingMutation,
} from "../../redux/Api/manageConfigApi";
import { handleError, handleSuccess } from "../../Toast";

export default function Coupons() {
  // config hooks
  const { data: subConfigData, isLoading: isSubConfigLoading } =
    useGetSubscriptionConfigsQuery();
  const [updateSubscriptionPricing, { isLoading: isUpdatingSub }] =
    useUpdateSubscriptionPricingMutation();

  const { data: loyaltyData, isLoading: isLoyaltyLoading } =
    useGetLoyaltyConfigQuery();
  const [updateLoyaltyConfig, { isLoading: isUpdatingLoyalty }] =
    useUpdateLoyaltyConfigMutation();

  // local form state for simple inline UI
  const [userMonthlyPrice, setUserMonthlyPrice] = useState("");
  const [userDurationDays, setUserDurationDays] = useState("");
  const [provMonthlyPrice, setProvMonthlyPrice] = useState("");
  const [provDurationDays, setProvDurationDays] = useState("");

  const [premiumReq, setPremiumReq] = useState("");
  const [nonPremiumReq, setNonPremiumReq] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  useEffect(() => {
    if (subConfigData && Array.isArray(subConfigData)) {
      const provider =
        subConfigData.find((x) => x.userType === "provider") || {};
      const user = subConfigData.find((x) => x.userType === "user") || {};
      setUserMonthlyPrice(user.monthlyPrice ?? "");
      setUserDurationDays(user.durationDays ?? "");
      setProvMonthlyPrice(provider.monthlyPrice ?? "");
      setProvDurationDays(provider.durationDays ?? "");
    }
  }, [subConfigData]);

  // derive objects for display
  const providerConfig = Array.isArray(subConfigData)
    ? subConfigData.find((s) => s.userType === "provider")
    : null;
  const userConfig = Array.isArray(subConfigData)
    ? subConfigData.find((s) => s.userType === "user")
    : null;

  useEffect(() => {
    if (loyaltyData) {
      const br = loyaltyData.bookingRequirements || {};
      const cs = loyaltyData.couponSettings || {};
      setPremiumReq(br.premiumMembers ?? "");
      setNonPremiumReq(br.nonPremiumMembers ?? "");
      setDiscountPercent(cs.discountPercentage ?? "");
    }
  }, [loyaltyData]);

  return (
    <div>
      <div className="mx-5 max-md:mx-3">
        {/* Simple inline config UI - subscription and loyalty side-by-side */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 mb-4">
          <h3 className="text-md font-semibold mb-3">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subscription */}
            <div className="p-3 border rounded">
              <h4 className="font-semibold mb-2">Subscription Pricing</h4>

              <div className="mb-3 text-sm">
                <div>
                  User:{" "}
                  <strong>
                    {userConfig?.formattedPrice ??
                      userConfig?.monthlyPrice ??
                      "-"}
                  </strong>{" "}
                  ({userConfig?.currency ?? "-"})
                </div>
                <div>
                  User duration (days):{" "}
                  <strong>{userConfig?.durationDays ?? "-"}</strong>
                </div>
                <div className="mt-2">
                  Provider:{" "}
                  <strong>
                    {providerConfig?.formattedPrice ??
                      providerConfig?.monthlyPrice ??
                      "-"}
                  </strong>{" "}
                  ({providerConfig?.currency ?? "-"})
                </div>
                <div>
                  Provider duration (days):{" "}
                  <strong>{providerConfig?.durationDays ?? "-"}</strong>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  User features: {userConfig?.features?.length ?? 0} • Provider
                  features: {providerConfig?.features?.length ?? 0}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 mb-3">
                <label className="text-xs text-gray-600">
                  User monthly price ({userConfig?.currency ?? ""})
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="border p-2 rounded"
                  placeholder="User monthlyPrice"
                  value={userMonthlyPrice}
                  onChange={(e) => setUserMonthlyPrice(e.target.value)}
                />
                <label className="text-xs text-gray-600">
                  User duration (days)
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="User durationDays"
                  value={userDurationDays}
                  onChange={(e) => setUserDurationDays(e.target.value)}
                />
                <label className="text-xs text-gray-600">
                  Provider monthly price ({providerConfig?.currency ?? ""})
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="border p-2 rounded"
                  placeholder="Provider monthlyPrice"
                  value={provMonthlyPrice}
                  onChange={(e) => setProvMonthlyPrice(e.target.value)}
                />
                <label className="text-xs text-gray-600">
                  Provider duration (days)
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Provider durationDays"
                  value={provDurationDays}
                  onChange={(e) => setProvDurationDays(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-[#6033E4] text-white rounded"
                  onClick={async () => {
                    try {
                      const body = {
                        userPricing: {
                          monthlyPrice: Number(userMonthlyPrice),
                          durationDays: Number(userDurationDays),
                        },
                        providerPricing: {
                          monthlyPrice: Number(provMonthlyPrice),
                          durationDays: Number(provDurationDays),
                        },
                      };
                      await updateSubscriptionPricing(body).unwrap();
                      handleSuccess("Subscription pricing updated");
                    } catch (err) {
                      handleError(err?.data?.message || "Update failed");
                    }
                  }}
                  disabled={isUpdatingSub}
                >
                  {isUpdatingSub ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* Loyalty */}
            <div className="p-3 border rounded">
              <h4 className="font-semibold mb-2">Loyalty Settings</h4>
             
              <div className="mb-3 text-sm">
                <div>
                  Premium booking req:{" "}
                  <strong>
                    {loyaltyData?.bookingRequirements?.premiumMembers ?? "-"}
                  </strong>
                </div>
                <div>
                  Non-premium booking req:{" "}
                  <strong>
                    {loyaltyData?.bookingRequirements?.nonPremiumMembers ?? "-"}
                  </strong>
                </div>
                <div>
                  Coupon discount %:{" "}
                  <strong>
                    {loyaltyData?.couponSettings?.discountPercentage ?? "-"}
                  </strong>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 mb-3">
                <label className="text-xs text-gray-600">
                  Premium members (booking requirement)
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Premium members"
                  value={premiumReq}
                  onChange={(e) => setPremiumReq(e.target.value)}
                />
                <label className="text-xs text-gray-600">
                  Non-premium members (booking requirement)
                </label>
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Non-premium members"
                  value={nonPremiumReq}
                  onChange={(e) => setNonPremiumReq(e.target.value)}
                />
                <label className="text-xs text-gray-600">
                  Coupon discount %
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="border p-2 rounded"
                  placeholder="Discount %"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-[#6033E4] text-white rounded"
                  onClick={async () => {
                    try {
                      const body = {
                        bookingRequirements: {
                          premiumMembers: Number(premiumReq),
                          nonPremiumMembers: Number(nonPremiumReq),
                        },
                        couponSettings: {
                          discountPercentage: Number(discountPercent),
                        },
                      };
                      await updateLoyaltyConfig(body).unwrap();
                      handleSuccess("Loyalty config updated");
                    } catch (err) {
                      handleError(err?.data?.message || "Update failed");
                    }
                  }}
                  disabled={isUpdatingLoyalty}
                >
                  {isUpdatingLoyalty ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

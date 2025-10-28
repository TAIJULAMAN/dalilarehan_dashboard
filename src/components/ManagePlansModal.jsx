import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import {
  useGetPointsAdminConfigQuery,
  useUpdatePointsAdminConfigMutation,
} from "../redux/Api/transactionsApi";

export default function ManagePlansModal({ open, onClose }) {
  // Example state for packs (replace with real logic as needed)
  const [packs, setPacks] = useState([
    { points: 5, price: 5, bonusPoints: 0 },
    { points: 100, price: 95, bonusPoints: 15 },
    { points: 500, price: 450, bonusPoints: 10 },
  ]);
  const [convRate, setConvRate] = useState(1);
  const [currency, setCurrency] = useState("EUR");
  const { data: pointsConfig } = useGetPointsAdminConfigQuery();
  const [updateConfig, { isLoading: saving }] =
    useUpdatePointsAdminConfigMutation();

  const currencySymbol = useMemo(() => {
    switch ((currency || "").toUpperCase()) {
      case "EUR":
        return "€";
      case "USD":
        return "$";
      case "GBP":
        return "£";
      default:
        return currency || "€";
    }
  }, [currency]);

  useEffect(() => {
    if (!pointsConfig) return;
    setCurrency(pointsConfig.currency || "EUR");
    setConvRate(
      typeof pointsConfig.pointToEuroRate === "number"
        ? pointsConfig.pointToEuroRate
        : 1
    );

    const apiPacks = Array.isArray(pointsConfig.packages)
      ? pointsConfig.packages
      : [];
    if (apiPacks.length) {
      setPacks(
        apiPacks.map((p) => ({
          points: p.points ?? 0,
          price: p.cost ?? 0,
          bonusPoints: typeof p.bonusPoints === "number" ? p.bonusPoints : 0,
        }))
      );
    }
  }, [pointsConfig]);

  const handleSave = async () => {
    const packages = packs.map((p) => ({
      points: Number(p.points) || 0,
      cost: Number(p.price) || 0,
      bonusPoints: Number(p.bonusPoints) || 0,
    }));
    const body = {
      pointToEuroRate: Number(convRate) || 0,
      packages,
    };
    try {
      await updateConfig(body).unwrap();
      onClose?.();
    } catch (e) {
      // no-op UI messaging per current style
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      bodyStyle={{ background: "#F5F6FA", borderRadius: 12 }}
    >
      <div className="p-4 w-full">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded p-4">
            <div className="font-semibold mb-2">Conversion Rate</div>
            <div className="flex items-center gap-2">
              <span>1 Point =</span>
              <input
                type="number"
                className="border rounded px-2 py-1 w-16"
                value={convRate}
                onChange={(e) => setConvRate(Number(e.target.value) || 0)}
              />
              <span>{currencySymbol}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded p-4 mb-4">
          <div className="font-semibold mb-4">Point Pack Editor</div>
          <table className="w-full text-sm mb-2">
            <thead>
              <tr className="text-left">
                <th>Points</th>
                <th>Price ({currencySymbol})</th>
                <th>Bonus Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packs.map((pack, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-16"
                      value={pack.points}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPacks((packs) =>
                          packs.map((p, i) =>
                            i === idx ? { ...p, points: val } : p
                          )
                        );
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-16"
                      value={pack.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPacks((packs) =>
                          packs.map((p, i) =>
                            i === idx ? { ...p, price: val } : p
                          )
                        );
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      className="border rounded px-2 py-1 w-20"
                      value={pack.bonusPoints}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPacks((packs) =>
                          packs.map((p, i) =>
                            i === idx
                              ? { ...p, bonusPoints: Number(val) || 0 }
                              : p
                          )
                        );
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className="text-red-500"
                      onClick={() =>
                        setPacks((packs) => packs.filter((_, i) => i !== idx))
                      }
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-[#F5F6FA] border border-dashed border-[#6033E4] text-[#6033E4] px-4 py-1 rounded mb-2"
            onClick={() =>
              setPacks((packs) => [
                ...packs,
                { points: "", price: "", bonusPoints: 0 },
              ])
            }
          >
            + Add Pack
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`bg-[#00c896] text-white px-4 py-2 rounded float-right ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save Pack Settings"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

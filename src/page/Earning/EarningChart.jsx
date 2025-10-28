import React from "react";
import { useGetMonthlyAdminAnalyticsQuery } from "../../redux/Api/transactionsApi";

export default function EarningChart({ year }) {
  const { data, isLoading } = useGetMonthlyAdminAnalyticsQuery({ year });

  const monthly = Array.isArray(data?.monthlyData) ? data.monthlyData : [];
  const currency = data?.currency || "EUR";
  const currencySymbol =
    currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;
  const maxRevenue = Math.max(
    1,
    ...monthly.map((m) => Number(m?.totalRevenue || 0))
  );
  const maxTx = Math.max(
    1,
    ...monthly.map((m) => Number(m?.totalTransactions || 0))
  );

  const formatCompact = (n) =>
    new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n || 0);

  // SVG chart dimensions - Enhanced
  const W = 1200;
  const H = 420;
  const M = { top: 50, right: 90, bottom: 80, left: 90 };
  const PW = W - M.left - M.right;
  const PH = H - M.top - M.bottom;
  const col = monthly.length || 12;
  const band = PW / col;
  const barWidth = Math.max(22, Math.min(44, band * 0.65));

  // Scales
  const yRev = (v) => M.top + PH - (PH * v) / (maxRevenue || 1);
  const yTx = (v) => M.top + PH - (PH * v) / (maxTx || 1);
  const x = (i) => M.left + i * band + band / 2;

  const yTicks = Array.from({ length: 6 }, (_, i) =>
    Math.round((i * maxRevenue) / 5)
  );

  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-[#E2E8F0] p-4">
      <h3 className="text-[#0D2357] text-lg font-semibold mb-3">
        Yearly Revenue ({year})
      </h3>
      {isLoading ? (
        <div className="w-full h-80 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl" />
      ) : (
        <div className="w-full">
          <div className="w-full bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
            <svg
              width="100%"
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              className="overflow-visible"
            >
              <defs>
                {/* Enhanced Gradients */}
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="barShine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                </linearGradient>

                <filter id="dropShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                  <feOffset dx="0" dy="2" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background Grid */}
              {yTicks.map((t, i) => (
                <g key={`grid-${i}`} opacity="0.4">
                  <line
                    x1={M.left}
                    x2={W - M.right}
                    y1={yRev(t)}
                    y2={yRev(t)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  {/* Left Y-axis labels (Revenue) */}
                  <text
                    x={M.left - 12}
                    y={yRev(t)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill="#6b7280"
                  >
                    {currencySymbol}
                    {formatCompact(t)}
                  </text>
                  {/* Right Y-axis labels (Transactions) */}
                  <text
                    x={W - M.right + 12}
                    y={yTx((t / (maxRevenue || 1)) * maxTx)}
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill="#6b7280"
                  >
                    {formatCompact((t / (maxRevenue || 1)) * maxTx)}
                  </text>
                </g>
              ))}

              {/* Main X-axis */}
              <line
                x1={M.left}
                x2={W - M.right}
                y1={M.top + PH}
                y2={M.top + PH}
                stroke="#9ca3af"
                strokeWidth="2"
              />

              {/* Revenue Bars */}
              {monthly.map((m, i) => {
                const rev = Number(m?.totalRevenue || 0);
                const cx = x(i);
                const barH = Math.max(2, M.top + PH - yRev(rev));
                return (
                  <g key={`bar-${i}`}>
                    {/* Bar with gradient and shadow */}
                    <rect
                      x={cx - barWidth / 2}
                      y={yRev(rev)}
                      width={barWidth}
                      height={barH}
                      fill="url(#revGrad)"
                      rx="4"
                      ry="4"
                      filter="url(#dropShadow)"
                    />
                    {/* Shine overlay */}
                    <rect
                      x={cx - barWidth / 2}
                      y={yRev(rev)}
                      width={barWidth}
                      height={barH}
                      fill="url(#barShine)"
                      rx="4"
                      ry="4"
                      opacity="0.5"
                    />
                    {/* Value label above bar */}
                    <text
                      x={cx}
                      y={yRev(rev) - 10}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="#4f46e5"
                    >
                      {currencySymbol}
                      {formatCompact(rev)}
                    </text>
                  </g>
                );
              })}

              {/* Transaction Line with Glow */}
              {(() => {
                const pts = monthly.map((m, i) => [
                  x(i),
                  yTx(Number(m?.totalTransactions || 0)),
                ]);
                const path = pts
                  .map((p, idx) =>
                    idx === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`
                  )
                  .join(" ");
                return (
                  <g>
                    {/* Line shadow */}
                    <path
                      d={path}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="5"
                      opacity="0.2"
                      filter="url(#glow)"
                    />
                    {/* Main line */}
                    <path
                      d={path}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Data points */}
                    {pts.map(([px, py], i) => (
                      <g key={`pt-${i}`}>
                        <circle
                          cx={px}
                          cy={py}
                          r="6"
                          fill="#ffffff"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                        <circle cx={px} cy={py} r="3" fill="#10b981" />
                      </g>
                    ))}
                  </g>
                );
              })()}

              {/* X-axis Month Labels */}
              {monthly.map((m, i) => (
                <text
                  key={`xl-${i}`}
                  x={x(i)}
                  y={M.top + PH + 28}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="#374151"
                >
                  {m?.monthName || ""}
                </text>
              ))}

              {/* Y-axis Labels */}
              <text
                x={M.left - 45}
                y={M.top - 15}
                fontSize="13"
                fontWeight="700"
                fill="#6b7280"
                textAnchor="middle"
              >
                Revenue
              </text>
              <text
                x={W - M.right + 45}
                y={M.top - 15}
                fontSize="13"
                fontWeight="700"
                fill="#6b7280"
                textAnchor="middle"
              >
                Transactions
              </text>

              {/* Legend */}
              <g transform={`translate(${W / 2 - 120}, ${H - 25})`}>
                <rect
                  x="0"
                  y="0"
                  width="240"
                  height="40"
                  fill="#f9fafb"
                  rx="8"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <rect
                  x="15"
                  y="15"
                  width="18"
                  height="10"
                  fill="url(#revGrad)"
                  rx="2"
                />
                <text x="40" y="23" fontSize="13" fontWeight="600" fill="#374151">
                  Revenue
                </text>
                <circle cx="145" cy="20" r="5" fill="#10b981" />
                <text x="157" y="23" fontSize="13" fontWeight="600" fill="#374151">
                  Transactions
                </text>
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

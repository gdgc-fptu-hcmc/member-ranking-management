import React, { useEffect, useMemo, useState } from "react";
import gemsIcon from "../assets/Star 1 1.png";
import { api } from "../api/axios.js"; // sửa path đúng file api của bạn

export default function ManualGemsModal({ open, onClose, user, onAdjusted }) {
  const [type, setType] = useState("add"); // add | sub
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const sign = useMemo(() => (type === "add" ? "+" : "-"), [type]);

  useEffect(() => {
    if (!open) return;
    // reset form mỗi lần mở
    setType("add");
    setAmount(0);
    setReason("");
    setErr("");
    setLoading(false);
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setErr("");
    const amt = Number(amount);

    if (!user?.id) return setErr("Missing user id");
    if (!amt || amt <= 0) return setErr("Amount must be > 0");
    if (!reason.trim()) return setErr("Reason can not be empty");

    try {
      setLoading(true);

      // POST /v1/gem-logs/users/:id/adjust-gem
      const res = await api.post(`/v1/gem-logs/users/${user.id}/adjust-gem`, {
        sign,
        amount: amt,
        reason: reason.trim(),
        // activityId: null,
        // evidenceUrls: [],
        // idempotencyKey: crypto.randomUUID() // nếu bạn muốn tự set
      });

      // báo về cho page để update UI
      onAdjusted?.({
        userId: user.id,
        newTotalGems: res.data?.newTotalGems,
        delta: res.data?.delta,
      });

      onClose();
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Adjust gems failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 transition-all duration-200">
      <div className="w-full max-w-[760px] bg-white rounded-[28px] shadow-xl relative overflow-hidden">
        {/* top brand line */}
        <div className="h-2 w-full bg-gradient-to-r from-[#EA4435] via-[#4285F4] via-[#F7AB1A] to-[#36A852]" />

        <button
          onClick={onClose}
          className="absolute right-6 top-5 text-2xl text-[#1A2A56] hover:opacity-70"
          aria-label="close"
        >
          ✕
        </button>

        <div className="p-8">
          <h2 className="text-4xl font-semibold text-[#1A2A56]">
            Manual Gems Adjustment
          </h2>

          <div className="mt-2 flex gap-2">
            <span className="w-16 h-1 bg-[#EA4435] rounded" />
            <span className="w-14 h-1 bg-[#4285F4] rounded" />
            <span className="w-14 h-1 bg-[#F7AB1A] rounded" />
            <span className="w-16 h-1 bg-[#36A852] rounded" />
          </div>

          {/* Optional: show selected user */}
          <div className="mt-6 text-gray-600">
            Adjusting for:{" "}
            <span className="font-semibold text-gray-800">
              {user?.name || user?.username || "—"}
            </span>
          </div>

          {/* Adjustment Type */}
          <div className="mt-6">
            <div className="text-2xl font-semibold text-gray-700">
              Adjustment Type
            </div>

            <div className="mt-3 flex gap-5">
              <button
                onClick={() => setType("add")}
                className={[
                  "flex-1 h-[76px] rounded-2xl border flex items-center justify-center gap-4 text-xl font-semibold transition",
                  type === "add"
                    ? "border-[#4285F4] shadow-sm"
                    : "border-gray-300 text-gray-500",
                ].join(" ")}
              >
                <span className="w-12 h-12 rounded-full bg-[#36A852] text-white flex items-center justify-center text-3xl">
                  +
                </span>
                Add Gems
              </button>

              <button
                onClick={() => setType("sub")}
                className={[
                  "flex-1 h-[76px] rounded-2xl border flex items-center justify-center gap-4 text-xl font-semibold transition",
                  type === "sub"
                    ? "border-[#4285F4] shadow-sm"
                    : "border-gray-300 text-gray-500",
                ].join(" ")}
              >
                <span className="w-12 h-12 rounded-full bg-[#EA4435] text-white flex items-center justify-center text-3xl">
                  −
                </span>
                Subtract Gems
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mt-6">
            <div className="text-2xl font-semibold text-gray-700">Amount</div>

            <div className="mt-2 relative">
              <img
                src={gemsIcon}
                alt="gems"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9"
              />
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-[64px] border rounded-2xl pl-16 pr-4 text-2xl outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="mt-6">
            <div className="text-2xl font-semibold text-gray-700">
              Reason for Adjustment
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why these gems are being adjusted..."
              className="mt-2 w-full h-[140px] border rounded-2xl p-4 text-lg outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            />
          </div>

          {err && <div className="mt-3 text-red-600 font-medium">{err}</div>}

          {/* Confirm */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={submit}
              disabled={loading}
              className="bg-[#4285F4] hover:opacity-90 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              Confirm Adjustment
              <span className="material-symbols-rounded text-[20px]">
                check_circle
              </span>
            </button>
          </div>
        </div>

        {/* bottom brand line */}
        <div className="h-2 w-full bg-gradient-to-r from-[#EA4435] via-[#4285F4] via-[#F7AB1A] to-[#36A852]" />
      </div>
    </div>
  );
}
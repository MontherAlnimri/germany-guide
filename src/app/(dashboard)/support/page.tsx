"use client";

import { useState } from "react";
import { useDict } from "@/lib/i18n/context";

const TIP_AMOUNTS = [
  { label: "\u20AC2", value: 200 },
  { label: "\u20AC5", value: 500 },
  { label: "\u20AC10", value: 1000 },
  { label: "\u20AC25", value: 2500 },
];

export default function SupportPage() {
  const dict = useDict();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTip = async () => {
    setLoading(true);
    const amount = isCustom ? Math.round(parseFloat(customAmount) * 100) : selectedAmount;

    if (!amount || amount < 100) {
      alert("Minimum tip is \u20AC1.00");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/stripe/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to process tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">{"\u2615"}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {dict.support.title}
        </h1>
        <p className="text-gray-600">
          {dict.support.subtitle}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <p className="text-sm font-medium text-gray-700 mb-4">
          {dict.support.tipAmount}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {TIP_AMOUNTS.map((tip) => (
            <button
              key={tip.value}
              onClick={() => {
                setSelectedAmount(tip.value);
                setIsCustom(false);
              }}
              className={`py-3 rounded-lg font-medium transition ${
                !isCustom && selectedAmount === tip.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tip.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCustom(true)}
          className={`w-full py-2 mb-3 rounded-lg text-sm font-medium transition ${
            isCustom
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          {dict.support.customAmount}
        </button>

        {isCustom && (
          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{"\u20AC"}</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="5.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleTip}
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? dict.common.loading : dict.support.sendTip}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          One-time payment. No recurring charges.
        </p>
      </div>
    </div>
  );
}
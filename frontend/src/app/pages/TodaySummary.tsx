import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, IndianRupee, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { api, getApiErrorMessage } from "../lib/api";
import { getStoredUser } from "../lib/session";

interface TodaySummaryResponse {
  date: string;
  onlineAmount: number;
  dineInAmount: number;
  combinedAmount: number;
  ordersCount: number;
}

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function TodaySummary() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<TodaySummaryResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }

    api
      .get<TodaySummaryResponse>("/api/orders/today-summary")
      .then((response) => setSummary(response.data))
      .catch((err) => setError(getApiErrorMessage(err, "Unable to load today's summary.")));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-zinc-300 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-4xl font-semibold mb-2">Today's Table</h1>
        <p className="text-zinc-400 mb-8">Online + Dine-In earnings for today</p>

        {error && <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-200 mb-6">{error}</div>}

        {summary && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl border border-indigo-500/30 bg-indigo-500/10">
              <div className="flex items-center gap-2 mb-2 text-indigo-200">
                <ShoppingBag className="w-5 h-5" />
                Online
              </div>
              <p className="text-2xl font-semibold">{rupee.format(summary.onlineAmount)}</p>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10">
              <div className="flex items-center gap-2 mb-2 text-emerald-200">
                <UtensilsCrossed className="w-5 h-5" />
                Dine-In
              </div>
              <p className="text-2xl font-semibold">{rupee.format(summary.dineInAmount)}</p>
            </div>

            <div className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/10">
              <div className="flex items-center gap-2 mb-2 text-amber-200">
                <IndianRupee className="w-5 h-5" />
                Combined
              </div>
              <p className="text-2xl font-semibold">{rupee.format(summary.combinedAmount)}</p>
              <p className="text-sm text-zinc-300 mt-2">Orders today: {summary.ordersCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

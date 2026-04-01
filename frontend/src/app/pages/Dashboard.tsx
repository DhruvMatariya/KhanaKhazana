import { useNavigate } from "react-router";
import { UtensilsCrossed, ShoppingBag, LogOut, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import { clearStoredUser, getStoredUser } from "../lib/session";
import type { AuthUser } from "../lib/api";
import CustomerChatbot from "../components/CustomerChatbot";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      navigate("/");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  const logout = () => {
    clearStoredUser();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A]">
      {/* Atmospheric glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div 
          className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 70%)',
            filter: 'blur(120px)',
          }}
        />
        <div 
          className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(147, 130, 224, 0.3) 0%, rgba(147, 130, 224, 0) 70%)',
            filter: 'blur(90px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Glass Navigation Bar */}
      <nav 
        className="relative border-b border-white/10"
        style={{
          background: 'rgba(23, 23, 23, 0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FF8C42 0%, #D45D2B 100%)',
              }}
            >
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">KhanaKhazana</h2>
              <p className="text-xs text-zinc-400">
                {user
                  ? `${user.username} • ${user.role}${user.restaurantId ? " • Restaurant Admin" : ""}`
                  : "Multi-Restaurant Operations Suite"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold text-white mb-4">
            Select Experience
          </h1>
          <p className="text-xl text-zinc-400">
            {user?.role === "ADMIN"
              ? "Manage your restaurant storefront, menu, orders, tables, and guest feedback"
              : "Discover restaurants, place orders, and share food reviews"}
          </p>
        </div>

        {/* Service Cards */}
        <div className={`grid ${user?.role === "ADMIN" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-8 max-w-6xl mx-auto`}>
          {/* Dine-In Management Card */}
          <button
            onClick={() => navigate("/dine-in")}
            className="group relative p-8 rounded-[32px] border border-white/10 text-left transition-all hover:scale-[1.02] hover:border-emerald-500/30 active:scale-[0.98]"
            style={{
              background: 'rgba(23, 23, 23, 0.6)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            {/* Emerald glow on hover */}
            <div 
              className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
              }}
            />

            <div className="relative">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                }}
              >
                <UtensilsCrossed className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                Dine-In Management
              </h3>
              <p className="text-zinc-400 mb-6">
                Manage table reservations, track occupancy status, and coordinate floor service in real-time.
              </p>

              <div className="inline-flex items-center gap-2 text-emerald-400 font-medium">
                Open Table Map
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Online Orders Card */}
          <button
            onClick={() => navigate("/online-orders")}
            className="group relative p-8 rounded-[32px] border border-white/10 text-left transition-all hover:scale-[1.02] hover:border-indigo-500/30 active:scale-[0.98]"
            style={{
              background: 'rgba(23, 23, 23, 0.6)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            {/* Indigo glow on hover */}
            <div 
              className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
              }}
            />

            <div className="relative">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                }}
              >
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                Online Orders
              </h3>
              <p className="text-zinc-400 mb-6">
                Process delivery and takeout orders, manage menu items, and handle payments through integrated POS.
              </p>

              <div className="inline-flex items-center gap-2 text-indigo-400 font-medium">
                Open Order System
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/today-summary")}
              className="group relative p-8 rounded-[32px] border border-white/10 text-left transition-all hover:scale-[1.02] hover:border-amber-500/30 active:scale-[0.98]"
              style={{
                background: "rgba(23, 23, 23, 0.6)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
              }}
            >
              <div
                className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle at center, rgba(245, 158, 11, 0.12) 0%, transparent 70%)",
                }}
              />

              <div className="relative">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                  style={{
                    background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
                    boxShadow: "0 8px 24px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <IndianRupee className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-3">Today's Table</h3>
                <p className="text-zinc-400 mb-6">See today's online, dine-in, and combined restaurant earnings.</p>

                <div className="inline-flex items-center gap-2 text-amber-400 font-medium">
                  Open Earnings Snapshot
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
      <CustomerChatbot />
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, RefreshCw, Users, Clock4, Building2 } from "lucide-react";
import { api, getApiErrorMessage, type AuthUser, type Restaurant, type RestaurantTable, type WaitlistEntry } from "../lib/api";
import { getStoredUser } from "../lib/session";
import CustomerChatbot from "../components/CustomerChatbot";

interface BookingResponse {
  allocated: boolean;
  message: string;
  table?: RestaurantTable;
  estimatedWaitMinutes?: number;
}

export default function DineInManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [joinQueueSuggested, setJoinQueueSuggested] = useState(false);
  const [freeingTableId, setFreeingTableId] = useState<string | null>(null);

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => r.id === selectedRestaurantId) ?? null,
    [restaurants, selectedRestaurantId],
  );

  const fetchData = useCallback(async (restaurantId: string) => {
    if (!restaurantId) {
      return;
    }

    const [tablesResponse, waitlistResponse] = await Promise.all([
      api.get<RestaurantTable[]>("/api/tables", { params: { restaurantId } }),
      api.get<WaitlistEntry[]>("/api/waitlist", { params: { restaurantId } }),
    ]);

    setTables(tablesResponse.data);
    setWaitlist(waitlistResponse.data);
  }, []);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser?.token) {
      navigate("/");
      return;
    }

    setUser(currentUser);
    setCustomerName(currentUser.username);

    const boot = async () => {
      const restaurantResponse = await api.get<Restaurant[]>("/api/restaurants", {
        params: { activeOnly: true },
      });
      setRestaurants(restaurantResponse.data);

      const initialRestaurantId = currentUser.restaurantId || restaurantResponse.data[0]?.id || "";
      setSelectedRestaurantId(initialRestaurantId);

      if (initialRestaurantId) {
        await fetchData(initialRestaurantId);
      }
    };

    boot()
      .catch(() => setBookingMessage("Unable to load live table data."))
      .finally(() => setLoading(false));
  }, [fetchData, navigate]);

  const availableCount = useMemo(() => tables.filter((t) => !t.occupied).length, [tables]);
  const occupiedCount = useMemo(() => tables.filter((t) => t.occupied).length, [tables]);

  const handleRefresh = async () => {
    if (!selectedRestaurantId) {
      return;
    }

    setRefreshing(true);
    setBookingMessage("");
    try {
      await fetchData(selectedRestaurantId);
    } catch {
      setBookingMessage("Refresh failed. Please retry.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleBookTable = async () => {
    if (!selectedRestaurantId) {
      setBookingMessage("Select a restaurant first.");
      return;
    }

    setBookingMessage("");
    setJoinQueueSuggested(false);

    try {
      const response = await api.post<BookingResponse>("/api/tables/book", {
        guests,
        customerName,
        restaurantId: selectedRestaurantId,
      });

      const data = response.data;
      setBookingMessage(data.allocated && data.table ? `Table ${data.table.tableNumber} allocated successfully.` : data.message || "No table available.");
      await fetchData(selectedRestaurantId);
    } catch (err: any) {
      const status = err?.response?.status;
      setBookingMessage(getApiErrorMessage(err, "Unable to allocate table."));
      if (status === 409) {
        setJoinQueueSuggested(true);
      }
    }
  };

  const handleJoinQueue = async () => {
    if (!selectedRestaurantId) {
      return;
    }

    try {
      await api.post("/api/waitlist/join", {
        customerName,
        guests,
        restaurantId: selectedRestaurantId,
      });
      setBookingMessage("Added to waitlist successfully.");
      setJoinQueueSuggested(false);
      await fetchData(selectedRestaurantId);
    } catch (err: any) {
      setBookingMessage(getApiErrorMessage(err, "Could not join queue."));
    }
  };

  const handleFreeTable = async (tableId: string) => {
    if (!user) {
      return;
    }

    const amountText = window.prompt("Enter total bill amount for this table:");
    if (amountText === null) {
      return;
    }

    const totalAmount = Number(amountText);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      setBookingMessage("Please enter a valid bill amount greater than 0.");
      return;
    }

    setFreeingTableId(tableId);
    try {
      const response = await api.post(`/api/tables/free/${tableId}`, { totalAmount });

      setBookingMessage(response.data?.message || "Table released.");
      await fetchData(selectedRestaurantId);
    } catch (err: any) {
      setBookingMessage(getApiErrorMessage(err, "Unable to release table."));
    } finally {
      setFreeingTableId(null);
    }
  };

  const handleCancelWaitlist = async (id: string) => {
    try {
      await api.put(`/api/waitlist/${id}/cancel`);
      await fetchData(selectedRestaurantId);
    } catch {
      setBookingMessage("Could not cancel waitlist entry.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Loading live table data...</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0) 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <nav
        className="relative border-b border-white/10"
        style={{
          background: "rgba(23, 23, 23, 0.6)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Hub
          </button>

          <h2 className="text-lg font-semibold text-white">Dine-In Management</h2>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-4">Live Table Map</h1>

          <div className="mb-6 p-4 rounded-2xl border border-white/10 bg-white/5">
            <label className="text-sm text-zinc-400 mb-2 block">Select Restaurant</label>
            <div className="flex gap-3 items-center">
              <Building2 className="w-5 h-5 text-zinc-300" />
              <select
                value={selectedRestaurantId}
                disabled={user?.role === "ADMIN"}
                onChange={(e) => {
                  setSelectedRestaurantId(e.target.value);
                  fetchData(e.target.value).catch(() => setBookingMessage("Could not switch restaurant."));
                }}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedRestaurant && (
              <p className="text-zinc-400 mt-2 text-sm">
                {selectedRestaurant.cuisine || "Cuisine"} • {selectedRestaurant.address || "Address unavailable"}
              </p>
            )}
          </div>

          <div className="flex gap-6 mb-8">
            <div className="flex items-center gap-4 px-6 py-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/10">
              <Users className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-sm text-zinc-400">Available</p>
                <p className="text-2xl font-semibold text-emerald-400">{availableCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 rounded-3xl border border-rose-500/20 bg-rose-500/10">
              <Users className="w-6 h-6 text-rose-400" />
              <div>
                <p className="text-sm text-zinc-400">Occupied</p>
                <p className="text-2xl font-semibold text-rose-400">{occupiedCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 rounded-3xl border border-amber-500/20 bg-amber-500/10">
              <Clock4 className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-sm text-zinc-400">Queue</p>
                <p className="text-2xl font-semibold text-amber-400">{waitlist.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`p-5 rounded-3xl border ${table.occupied ? "border-rose-500/30 bg-rose-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}
              >
                <div className="text-center">
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center ${table.occupied ? "bg-rose-500/20" : "bg-emerald-500/20"}`}>
                    <Users className={`w-7 h-7 ${table.occupied ? "text-rose-400" : "text-emerald-400"}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">T-{String(table.tableNumber).padStart(2, "0")}</h3>
                  <p className="text-sm text-zinc-400 mb-2">{table.capacity} Seats</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${table.occupied ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    {table.occupied ? "Occupied" : "Available"}
                  </span>

                  {user?.role === "ADMIN" && table.occupied && (
                    <button
                      onClick={() => handleFreeTable(table.id)}
                      disabled={freeingTableId === table.id}
                      className="mt-3 w-full px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-60"
                    >
                      {freeingTableId === table.id ? "Releasing..." : "Release Table"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {user?.role !== "ADMIN" && (
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
              <h3 className="text-xl text-white font-semibold mb-4">Book a Table</h3>
              <div className="space-y-3">
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  placeholder="Customer name"
                />
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  placeholder="Guests"
                />

                <button onClick={handleBookTable} className="w-full py-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30">
                  Allocate Best-Fit Table
                </button>

                {joinQueueSuggested && (
                  <button onClick={handleJoinQueue} className="w-full py-3 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30">
                    Join Queue
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
            <h3 className="text-xl text-white font-semibold mb-4">Active Queue</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {waitlist.length === 0 && <p className="text-zinc-400">No one in queue.</p>}
              {waitlist.map((entry) => (
                <div key={entry.id} className="p-3 rounded-2xl bg-black/30 border border-white/10">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-medium">{entry.customerName}</p>
                      <p className="text-zinc-400 text-sm">{entry.guestCount} guests • ETA {entry.estimatedWaitTimeMinutes} min</p>
                    </div>
                    {user?.role === "ADMIN" && (
                      <button
                        onClick={() => handleCancelWaitlist(entry.id)}
                        className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs hover:bg-rose-500/30"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {bookingMessage && <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-sm">{bookingMessage}</div>}
        </div>
      </div>

      <CustomerChatbot restaurantId={selectedRestaurantId} />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Minus, ShoppingCart, CreditCard, Smartphone, Trash2, Star, Building2, LocateFixed } from "lucide-react";
import { api, getApiErrorMessage, type AuthUser, type CustomerNeed, type MenuItem, type Order, type OrderTrackingResponse, type Restaurant, type Review } from "../lib/api";
import { getStoredUser } from "../lib/session";
import CustomerChatbot from "../components/CustomerChatbot";

interface CartItem extends MenuItem {
  quantity: number;
}

interface PendingReviewItem {
  menuItemId: string;
  itemName: string;
}

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const foodImageByKeyword: Array<{ keywords: string[]; imageUrl: string }> = [
  {
    keywords: ["butter chicken"],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["paneer tikka", "paneer"],
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["garlic naan", "naan"],
    imageUrl: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["prawn", "shrimp"],
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["dosa", "neer dosa"],
    imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["payasam", "dessert", "kheer"],
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  },
  {
    keywords: ["biryani", "rice"],
    imageUrl: "https://images.unsplash.com/photo-1701579231378-37293047cc30?auto=format&fit=crop&w=900&q=80",
  },
];

const genericFoodFallback = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";

export default function OnlineOrders() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const [restaurantQuery, setRestaurantQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "cuisine" | "newest">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "UPI">("CARD");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNetwork, setCardNetwork] = useState<"VISA" | "MASTERCARD">("VISA");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [upiId, setUpiId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [message, setMessage] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [activeReviewItemId, setActiveReviewItemId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [myReviewedMenuItemIds, setMyReviewedMenuItemIds] = useState<string[]>([]);
  const [reviewPromptOpen, setReviewPromptOpen] = useState(false);
  const [reviewPromptShownByRestaurant, setReviewPromptShownByRestaurant] = useState<Record<string, boolean>>({});

  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<OrderTrackingResponse | null>(null);
  const [customerNeeds, setCustomerNeeds] = useState<CustomerNeed[]>([]);

  const [adminNewItem, setAdminNewItem] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
  });

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => r.id === selectedRestaurantId) ?? null,
    [restaurants, selectedRestaurantId],
  );

  const restaurantNameById = useMemo(() => {
    return restaurants.reduce<Record<string, string>>((acc, restaurant) => {
      if (restaurant.id) {
        acc[restaurant.id] = restaurant.name;
      }
      return acc;
    }, {});
  }, [restaurants]);

  const fetchRestaurants = async () => {
    const response = await api.get<Restaurant[]>("/api/restaurants", {
      params: {
        activeOnly: true,
        query: restaurantQuery || undefined,
        cuisine: cuisineFilter || undefined,
        sortBy,
        sortDir,
      },
    });
    setRestaurants(response.data);
  };

  const fetchOrders = async (restaurantId: string) => {
    const isAdmin = user?.role === "ADMIN";
    if (isAdmin && !restaurantId) {
      setOrders([]);
      return;
    }

    const response = await api.get<Order[]>("/api/orders/my", {
      params: isAdmin ? { restaurantId } : undefined,
    });
    setOrders(response.data);
  };

  const fetchMenu = async (restaurantId: string, isAdmin: boolean) => {
    if (!restaurantId) {
      setMenuItems([]);
      return;
    }

    const response = await api.get<MenuItem[]>("/api/menu", {
      params: { restaurantId, onlyAvailable: !isAdmin },
    });
    setMenuItems(response.data);
  };

  const fetchTracking = async (orderId: string) => {
    const response = await api.get<OrderTrackingResponse>(`/api/orders/${orderId}/tracking`);
    setTrackingData(response.data);
  };

  const fetchMyReviews = async (restaurantId: string) => {
    if (!restaurantId || user?.role !== "CUSTOMER") {
      setMyReviewedMenuItemIds([]);
      return;
    }

    const response = await api.get<Review[]>("/api/reviews/my", {
      params: { restaurantId },
    });
    const menuItemIds = response.data
      .map((review) => review.menuItemId)
      .filter((id): id is string => Boolean(id));
    setMyReviewedMenuItemIds(Array.from(new Set(menuItemIds)));
  };

  const fetchCustomerNeeds = async () => {
    if (user?.role !== "ADMIN") {
      setCustomerNeeds([]);
      return;
    }

    const response = await api.get<CustomerNeed[]>("/api/customer-needs/my-restaurant");
    setCustomerNeeds(response.data);
  };

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser?.token) {
      navigate("/");
      return;
    }

    setUser(currentUser);
    fetchRestaurants().catch(() => setMessage("Could not load restaurants."));
  }, [navigate]);

  useEffect(() => {
    fetchRestaurants().catch(() => setMessage("Could not refresh restaurant list."));
  }, [restaurantQuery, cuisineFilter, sortBy, sortDir]);

  useEffect(() => {
    if (!user || restaurants.length === 0) {
      return;
    }

    const defaultRestaurantId = user.restaurantId || restaurants[0]?.id || "";
    if (!selectedRestaurantId && defaultRestaurantId) {
      setSelectedRestaurantId(defaultRestaurantId);
      setDeliveryAddress(user.role === "CUSTOMER" ? "" : deliveryAddress);
    }
  }, [restaurants, selectedRestaurantId, user]);

  useEffect(() => {
    if (!user || !selectedRestaurantId) {
      return;
    }

    let cancelled = false;

    const loadData = async () => {
      const menuPromise = fetchMenu(selectedRestaurantId, user.role === "ADMIN");
      const ordersPromise = fetchOrders(selectedRestaurantId);
      const optionalPromise = user.role === "CUSTOMER" ? [fetchMyReviews(selectedRestaurantId)] : [];
      const adminNeedsPromise = user.role === "ADMIN" ? [fetchCustomerNeeds()] : [];

      const results = await Promise.allSettled([menuPromise, ordersPromise, ...optionalPromise, ...adminNeedsPromise]);
      const menuResult = results[0];
      const ordersResult = results[1];
      if (cancelled) {
        return;
      }

      const errors: string[] = [];
      if (menuResult.status === "rejected") {
        errors.push(getApiErrorMessage(menuResult.reason, "Could not load menu."));
      }
      if (ordersResult.status === "rejected") {
        errors.push(getApiErrorMessage(ordersResult.reason, "Could not load orders."));
      }

      setMessage(errors.join(" "));
    };

    loadData().catch((err) => {
      if (!cancelled) {
        setMessage(getApiErrorMessage(err, "Failed to load online order data."));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedRestaurantId, user]);

  const groupedMenu = useMemo(() => {
    return menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      const category = item.category || "Others";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const pendingReviewItems = useMemo<PendingReviewItem[]>(() => {
    if (user?.role !== "CUSTOMER") {
      return [];
    }

    const deliveredStatuses = new Set(["DELIVERED", "COMPLETED"]);
    const reviewed = new Set(myReviewedMenuItemIds);
    const pending = new Map<string, PendingReviewItem>();

    orders.forEach((order) => {
      const status = (order.deliveryStatus || order.status || "").toUpperCase();
      if (!deliveredStatuses.has(status)) {
        return;
      }

      order.items.forEach((item) => {
        if (!item.menuItemId || reviewed.has(item.menuItemId) || pending.has(item.menuItemId)) {
          return;
        }

        pending.set(item.menuItemId, {
          menuItemId: item.menuItemId,
          itemName: item.itemName || "Ordered item",
        });
      });
    });

    return Array.from(pending.values());
  }, [orders, myReviewedMenuItemIds, user?.role]);

  const pendingReviewItemIdSet = useMemo(() => new Set(pendingReviewItems.map((item) => item.menuItemId)), [pendingReviewItems]);

  useEffect(() => {
    if (user?.role !== "CUSTOMER" || !selectedRestaurantId) {
      return;
    }

    if (pendingReviewItems.length === 0) {
      setReviewPromptOpen(false);
      return;
    }

    const hasShownPrompt = Boolean(reviewPromptShownByRestaurant[selectedRestaurantId]);
    if (!hasShownPrompt) {
      setReviewPromptOpen(true);
      setReviewPromptShownByRestaurant((prev) => ({
        ...prev,
        [selectedRestaurantId]: true,
      }));
    }

    const isActiveStillPending = activeReviewItemId
      ? pendingReviewItems.some((item) => item.menuItemId === activeReviewItemId)
      : false;

    if (!isActiveStillPending) {
      setActiveReviewItemId(pendingReviewItems[0].menuItemId);
      fetchReviews(pendingReviewItems[0].menuItemId).catch(() => setReviews([]));
    }
  }, [pendingReviewItems, activeReviewItemId, user?.role, selectedRestaurantId, reviewPromptShownByRestaurant]);

  const openReviewForItem = (menuItemId: string) => {
    setActiveReviewItemId(menuItemId);
    setReviewPromptOpen(false);
    fetchReviews(menuItemId).catch(() => setReviews([]));
  };

  const dismissReviewPrompt = () => {
    setReviewPromptOpen(false);
  };

  const addToCart = (item: MenuItem) => {
    const existing = cart.find((cartItem) => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)));
      return;
    }
    setCart([...cart, { ...item, quantity: 1 }]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const resetPaymentFields = () => {
    setCardHolderName("");
    setCardNetwork("VISA");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setUpiId("");
    setPaymentError("");
    setPaymentMethod("CARD");
  };

  const placeOrder = async () => {
    if (!user || !selectedRestaurantId) {
      return;
    }

    if (cart.length === 0) {
      setMessage("Please add items to cart before placing order.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setPaymentError("Delivery address is required for online orders.");
      return;
    }

    setPlacingOrder(true);
    setPaymentError("");

    try {
      const payload: any = {
        restaurantId: selectedRestaurantId,
        items: cart.map((item) => ({
          menuItemId: item.id,
          itemName: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: cartTotal,
        orderType: "ONLINE",
        paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
      };

      if (paymentMethod === "CARD") {
        payload.cardHolderName = cardHolderName;
        payload.cardNetwork = cardNetwork;
        payload.cardNumber = cardNumber;
        payload.expiryDate = expiryDate;
        payload.cvv = cvv;
      } else {
        payload.upiId = upiId;
      }

      await api.post<Order>("/api/orders", payload);

      setCart([]);
      setShowPaymentModal(false);
      resetPaymentFields();
      setMessage("Order placed successfully.");
      await fetchOrders(selectedRestaurantId);
    } catch (err: any) {
      const serverMessage = err?.response?.data;
      setPaymentError(typeof serverMessage === "string" ? serverMessage : getApiErrorMessage(err, "Failed to process payment/order."));
    } finally {
      setPlacingOrder(false);
    }
  };

  const fetchReviews = async (menuItemId: string) => {
    const response = await api.get<Review[]>(`/api/reviews/menu/${menuItemId}`);
    setReviews(response.data);
    setActiveReviewItemId(menuItemId);
  };

  const submitReview = async () => {
    if (!activeReviewItemId || user?.role !== "CUSTOMER") {
      return;
    }

    const reviewedItemId = activeReviewItemId;

    try {
      await api.post("/api/reviews", {
        menuItemId: reviewedItemId,
        rating: String(reviewRating),
        comment: reviewComment,
      });

      // Optimistically mark as reviewed so UI/prompt updates even if refresh calls fail.
      setMyReviewedMenuItemIds((prev) => (prev.includes(reviewedItemId) ? prev : [...prev, reviewedItemId]));

      await Promise.allSettled([
        fetchMenu(selectedRestaurantId, false),
        fetchMyReviews(selectedRestaurantId),
        fetchOrders(selectedRestaurantId),
      ]);

      setActiveReviewItemId(null);
      setReviews([]);
      setReviewComment("");
      setReviewRating(5);
      setMessage("Review submitted.");
    } catch (err: any) {
      setMessage(getApiErrorMessage(err, "Could not submit review."));
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status });
      await fetchOrders(selectedRestaurantId);
      if (trackingOrderId === orderId) {
        await fetchTracking(orderId);
      }
    } catch (err: any) {
      setMessage(getApiErrorMessage(err, "Unable to update order."));
    }
  };

  const addMenuItemAsAdmin = async () => {
    if (user?.role !== "ADMIN") {
      return;
    }

    try {
      await api.post("/api/menu", {
        name: adminNewItem.name,
        description: adminNewItem.description,
        category: adminNewItem.category,
        price: Number(adminNewItem.price),
        imageUrl: adminNewItem.imageUrl,
        available: true,
      });

      setAdminNewItem({ name: "", description: "", category: "", price: "", imageUrl: "" });
      await fetchMenu(selectedRestaurantId, true);
      setMessage("Menu item added.");
    } catch (err: any) {
      setMessage(getApiErrorMessage(err, "Failed to add menu item."));
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    if (user?.role !== "ADMIN") {
      return;
    }

    try {
      await api.patch(`/api/menu/${item.id}/availability`, { available: !item.available });
      await fetchMenu(selectedRestaurantId, true);
    } catch {
      setMessage("Could not update item availability.");
    }
  };

  const updateCustomerNeedStatus = async (id: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED") => {
    try {
      await api.patch(`/api/customer-needs/${id}/status`, { status });
      await fetchCustomerNeeds();
    } catch (err: any) {
      setMessage(getApiErrorMessage(err, "Could not update customer need status."));
    }
  };

  const resolveMenuItemImage = (item: MenuItem) => {
    const name = (item.name || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const combined = `${name} ${category}`;

    const matched = foodImageByKeyword.find((entry) => entry.keywords.some((keyword) => combined.includes(keyword)));
    if (matched) {
      return matched.imageUrl;
    }

    if (item.imageUrl && item.imageUrl.trim().length > 0) {
      return item.imageUrl;
    }

    return genericFoodFallback;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-zinc-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" /> Back to Hub
          </button>
          <h2 className="text-lg font-semibold">Online Orders, Search & Tracking</h2>
          <div className="text-sm text-zinc-400">{user?.username}</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 mb-6 space-y-3">
            <label className="text-sm text-zinc-400 block">Find Restaurants</label>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                value={restaurantQuery}
                onChange={(e) => setRestaurantQuery(e.target.value)}
                placeholder="Search by name, cuisine, location"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10"
              />
              <input
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                placeholder="Filter cuisine"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "cuisine" | "newest")} className="px-4 py-3 rounded-xl bg-black/30 border border-white/10">
                <option value="name">Sort by Name</option>
                <option value="cuisine">Sort by Cuisine</option>
                <option value="newest">Sort by Newest</option>
              </select>
              <select value={sortDir} onChange={(e) => setSortDir(e.target.value as "asc" | "desc")} className="px-4 py-3 rounded-xl bg-black/30 border border-white/10">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-zinc-300" />
              <select
                value={selectedRestaurantId}
                disabled={user?.role === "ADMIN"}
                onChange={(e) => {
                  setSelectedRestaurantId(e.target.value);
                  setCart([]);
                }}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10"
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
              <p className="text-zinc-400 text-sm">
                {selectedRestaurant.cuisine || "Cuisine"} • {selectedRestaurant.address || "Address unavailable"}
              </p>
            )}
          </div>

          {user?.role === "CUSTOMER" && reviewPromptOpen && pendingReviewItems.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
              <p className="text-emerald-100 font-medium">Your recent order was delivered. Please rate your food item.</p>
              <p className="text-sm text-emerald-200/80 mt-1">Pending: {pendingReviewItems[0].itemName}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => openReviewForItem(pendingReviewItems[0].menuItemId)}
                  className="px-3 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-100"
                >
                  Review now
                </button>
                <button onClick={dismissReviewPrompt} className="px-3 py-2 rounded-xl border border-white/20 bg-white/5 text-zinc-200">
                  Later
                </button>
              </div>
            </div>
          )}

          {Object.entries(groupedMenu).map(([category, items]) => (
            <section key={category} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">{category}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <img src={resolveMenuItemImage(item)} alt={item.name} className="w-full h-44 object-cover" />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold">{item.name}</h4>
                          <p className="text-sm text-zinc-400 mt-1">{item.description || "Chef special"}</p>
                        </div>
                        <span className="text-emerald-300 font-medium">{rupee.format(item.price)}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm text-amber-300">
                        <Star className="w-4 h-4 fill-amber-300" />
                        <span>{item.averageRating?.toFixed(1) || "0.0"}</span>
                        <span className="text-zinc-400">({item.reviewCount} reviews)</span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {user?.role !== "ADMIN" && item.available && (
                          <button onClick={() => addToCart(item)} className="px-3 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200">
                            Add to cart
                          </button>
                        )}

                        <button onClick={() => fetchReviews(item.id)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-zinc-200">
                          View reviews
                        </button>

                        {user?.role === "CUSTOMER" && pendingReviewItemIdSet.has(item.id) && (
                          <button
                            onClick={() => openReviewForItem(item.id)}
                            className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200"
                          >
                            Review now
                          </button>
                        )}

                        {user?.role === "ADMIN" && (
                          <button onClick={() => toggleAvailability(item)} className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200">
                            Mark as {item.available ? "Unavailable" : "Available"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {activeReviewItemId && (
            <div className="p-5 rounded-3xl border border-white/10 bg-white/5 mt-8">
              <h3 className="text-xl font-semibold mb-4">Food Reviews</h3>
              {user?.role === "CUSTOMER" && (
                <div className="mb-5 p-4 rounded-2xl border border-white/10 bg-black/20">
                  <h4 className="font-medium mb-3">Write your review</h4>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button key={score} onClick={() => setReviewRating(score)}>
                        <Star className={`w-5 h-5 ${reviewRating >= score ? "text-amber-300 fill-amber-300" : "text-zinc-500"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
                    rows={3}
                    placeholder="How was the taste, packaging, and value?"
                  />
                  <button onClick={submitReview} className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200">
                    Submit review
                  </button>
                </div>
              )}

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {reviews.length === 0 && <p className="text-zinc-400">No reviews yet.</p>}
                {reviews.map((review) => (
                  <div key={review.id} className="p-3 rounded-xl border border-white/10 bg-black/20">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.username}</p>
                      <p className="text-amber-300">{"★".repeat(review.rating)}</p>
                    </div>
                    {review.comment && <p className="text-zinc-300 mt-1 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {user?.role === "ADMIN" && (
            <div className="p-5 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 mt-8">
              <h3 className="text-xl font-semibold mb-4">Add Menu Item</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <input placeholder="Item name" value={adminNewItem.name} onChange={(e) => setAdminNewItem({ ...adminNewItem, name: e.target.value })} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10" />
                <input placeholder="Category" value={adminNewItem.category} onChange={(e) => setAdminNewItem({ ...adminNewItem, category: e.target.value })} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10" />
                <input placeholder="Price" type="number" value={adminNewItem.price} onChange={(e) => setAdminNewItem({ ...adminNewItem, price: e.target.value })} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10" />
                <input placeholder="Image URL" value={adminNewItem.imageUrl} onChange={(e) => setAdminNewItem({ ...adminNewItem, imageUrl: e.target.value })} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10" />
              </div>
              <textarea placeholder="Description" value={adminNewItem.description} onChange={(e) => setAdminNewItem({ ...adminNewItem, description: e.target.value })} className="w-full mt-3 px-3 py-2 rounded-xl bg-black/30 border border-white/10" rows={2} />
              <button onClick={addMenuItemAsAdmin} className="mt-3 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200">
                Add item
              </button>
            </div>
          )}

          {user?.role === "ADMIN" && (
            <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-500/10 mt-8">
              <h3 className="text-xl font-semibold mb-4">Attention to Customer Needs</h3>
              <div className="space-y-3 max-h-[26rem] overflow-y-auto">
                {customerNeeds.length === 0 && <p className="text-zinc-300">No complaints or suggestions yet.</p>}
                {customerNeeds.map((need) => (
                  <div key={need.id} className="p-4 rounded-2xl border border-white/10 bg-black/20">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-sm text-zinc-300">
                        #{need.shortOrderId} • {need.type} • {need.status.replace("_", " ")}
                      </p>
                      <p className="text-xs text-zinc-500">{new Date(need.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-zinc-400 mt-1">Customer: {need.username}</p>
                    {need.dishName && <p className="text-sm text-amber-200 mt-1">Dish: {need.dishName}</p>}
                    <p className="text-sm text-white mt-2">{need.message}</p>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <button onClick={() => updateCustomerNeedStatus(need.id, "OPEN")} className="px-2 py-1 rounded bg-zinc-700/50 text-zinc-200 text-xs">Open</button>
                      <button onClick={() => updateCustomerNeedStatus(need.id, "IN_PROGRESS")} className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-200 text-xs">In Progress</button>
                      <button onClick={() => updateCustomerNeedStatus(need.id, "RESOLVED")} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-200 text-xs">Resolved</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {user?.role !== "ADMIN" && (
            <div className="p-5 rounded-3xl border border-white/10 bg-white/5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Cart</h3>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.length === 0 && <p className="text-zinc-400">No items in cart.</p>}
                {cart.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl border border-white/10 bg-black/20">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-400">{rupee.format(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-lg bg-white/10"><Minus className="w-4 h-4" /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-lg bg-white/10"><Plus className="w-4 h-4" /></button>
                      <button onClick={() => updateQuantity(item.id, -item.quantity)} className="ml-auto p-1 rounded-lg bg-rose-500/20 text-rose-300"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-lg">
                <span>Total</span>
                <span className="font-semibold text-emerald-300">{rupee.format(cartTotal)}</span>
              </div>

              <div className="mt-4">
                <label className="text-sm text-zinc-400 block mb-2">Delivery address</label>
                <div className="flex items-center gap-2 mb-2">
                  <LocateFixed className="w-4 h-4 text-zinc-400" />
                  <input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10"
                    placeholder="Flat, street, landmark, city"
                  />
                </div>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={() => {
                  setShowPaymentModal(true);
                  setMessage("");
                }}
                className="mt-3 w-full py-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 disabled:opacity-40"
              >
                Proceed to Pay
              </button>
            </div>
          )}

          <div className="p-5 rounded-3xl border border-white/10 bg-white/5">
            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-3 max-h-105 overflow-y-auto">
              {orders.length === 0 && <p className="text-zinc-400">No orders yet.</p>}
              {orders.map((order) => (
                <div key={order.id} className="p-3 rounded-xl border border-white/10 bg-black/20">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm text-zinc-300">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-200">{order.deliveryStatus || order.status}</p>
                  </div>
                  {user?.role === "CUSTOMER" && order.restaurantId && (
                    <p className="mt-1 text-zinc-500 text-xs">{restaurantNameById[order.restaurantId] || "Restaurant"}</p>
                  )}
                  <p className="mt-1 text-zinc-400 text-sm">{order.items.length} items • {rupee.format(order.totalAmount)}</p>
                  <button onClick={() => setTrackingOrderId(order.id)} className="mt-2 px-2 py-1 rounded bg-white/10 text-zinc-200 text-xs">
                    Live tracking
                  </button>
                  {user?.role === "ADMIN" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button onClick={() => updateOrderStatus(order.id, "ACCEPTED")} className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-200 text-xs">Accepted</button>
                      <button onClick={() => updateOrderStatus(order.id, "PREPARING")} className="px-2 py-1 rounded bg-amber-500/20 text-amber-200 text-xs">Preparing</button>
                      <button onClick={() => updateOrderStatus(order.id, "OUT_FOR_DELIVERY")} className="px-2 py-1 rounded bg-violet-500/20 text-violet-200 text-xs">Out for delivery</button>
                      <button onClick={() => updateOrderStatus(order.id, "DELIVERED")} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-200 text-xs">Delivered</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {trackingData && (
            <div className="p-5 rounded-3xl border border-violet-500/30 bg-violet-500/10">
              <h3 className="text-lg font-semibold mb-2">Live Tracking</h3>
              <p className="text-sm text-violet-100 mb-3">Current: {trackingData.deliveryStatus || trackingData.status}</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {trackingData.trackingEvents.map((event, index) => (
                  <div key={`${event.timestamp}-${index}`} className="p-2 rounded-lg border border-white/10 bg-black/20">
                    <p className="text-sm font-medium">{event.status}</p>
                    <p className="text-xs text-zinc-400">{event.note}</p>
                    <p className="text-xs text-zinc-500">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message && <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 text-sm">{message}</div>}
        </aside>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h3 className="text-2xl font-semibold mb-4">Complete Payment</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setPaymentMethod("CARD")} className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${paymentMethod === "CARD" ? "border-indigo-400 bg-indigo-500/20" : "border-white/10 bg-white/5"}`}>
                <CreditCard className="w-4 h-4" /> Card
              </button>
              <button onClick={() => setPaymentMethod("UPI")} className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${paymentMethod === "UPI" ? "border-emerald-400 bg-emerald-500/20" : "border-white/10 bg-white/5"}`}>
                <Smartphone className="w-4 h-4" /> UPI
              </button>
            </div>

            {paymentMethod === "CARD" ? (
              <div className="space-y-3">
                <input value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} placeholder="Cardholder name" className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10" />
                <select value={cardNetwork} onChange={(e) => setCardNetwork(e.target.value as "VISA" | "MASTERCARD")} className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10">
                  <option value="VISA">VISA</option>
                  <option value="MASTERCARD">MASTERCARD</option>
                </select>
                <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number" className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10" />
                  <input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="CVV" className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10" />
              </div>
            )}

            {paymentError && <p className="mt-3 text-sm text-rose-300">{paymentError}</p>}

            <div className="mt-6 flex gap-3">
              <button onClick={() => { setShowPaymentModal(false); resetPaymentFields(); }} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5">Cancel</button>
              <button onClick={placeOrder} disabled={placingOrder} className="flex-1 py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-200 disabled:opacity-60">
                {placingOrder ? "Processing..." : `Pay ${rupee.format(cartTotal)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomerChatbot restaurantId={selectedRestaurantId} />
    </div>
  );
}

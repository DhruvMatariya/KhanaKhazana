import axios from "axios";
import { clearStoredUser, getStoredUser } from "./session";

const runtimeApiBaseUrl =
  typeof window !== "undefined"
    ? ((window as any).__RUNTIME_CONFIG__?.VITE_API_BASE_URL as string | undefined)
    : undefined;

const configuredApiBaseUrl = (runtimeApiBaseUrl || ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined))
  ?.trim()
  .replace(/\/+$/, "");
const isLocalBrowser =
  typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE_URL = configuredApiBaseUrl || (isLocalBrowser ? "http://localhost:8080" : "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      const user = getStoredUser();
      const hasToken = Boolean(user?.token);
      if (status === 401 || !hasToken) {
        clearStoredUser();
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: any, fallback = "Something went wrong."): string {
  if (!configuredApiBaseUrl && !isLocalBrowser) {
    return "VITE_API_BASE_URL is missing. Set it to your backend service URL.";
  }

  if (!error?.response) {
    return "Cannot reach backend service. Check VITE_API_BASE_URL and backend CORS settings.";
  }

  if (error?.response?.status === 404) {
    return "API endpoint not found (404). Verify VITE_API_BASE_URL points to backend (not frontend) and includes https://.";
  }

  const data = error?.response?.data;

  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }
    if (typeof data.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }
    if (typeof data.status === "number") {
      return `Request failed (${data.status}).`;
    }
  }

  return fallback;
}

export type UserRole = "CUSTOMER" | "ADMIN";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  token?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine?: string;
  address?: string;
  logoImageUrl?: string;
  coverImageUrl?: string;
  active: boolean;
}

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  tableNumber: number;
  capacity: number;
  occupied: boolean;
}

export interface WaitlistEntry {
  id: string;
  restaurantId: string;
  customerName: string;
  guestCount: number;
  estimatedWaitTimeMinutes: number;
  status: "WAITING" | "SEATED" | "CANCELLED";
  joinedAt: string;
}

export interface OrderItem {
  menuItemId?: string;
  itemName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  userId: string;
  tableId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  orderType: string;
  deliveryAddress?: string;
  deliveryStatus?: string;
  estimatedDeliveryMinutes?: number;
  trackingEvents?: OrderTrackingEvent[];
  paymentMethod: "CARD" | "UPI";
  paymentStatus: string;
  paymentReference?: string;
  cardHolderName?: string;
  cardNetwork?: "VISA" | "MASTERCARD";
  expiryDate?: string;
  cardLast4?: string;
  upiId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderTrackingEvent {
  status: string;
  note: string;
  timestamp: string;
}

export interface OrderTrackingResponse {
  orderId: string;
  status: string;
  deliveryStatus: string;
  updatedAt?: string;
  estimatedDeliveryMinutes?: number;
  trackingEvents: OrderTrackingEvent[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  restaurantId: string;
  menuItemId: string;
  userId: string;
  username: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CustomerNeed {
  id: string;
  restaurantId: string;
  orderId: string;
  shortOrderId: string;
  userId: string;
  username: string;
  dishName?: string;
  message: string;
  type: "COMPLAINT" | "SUGGESTION";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

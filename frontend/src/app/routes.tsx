import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DineInManagement from "./pages/DineInManagement";
import OnlineOrders from "./pages/OnlineOrders";
import TodaySummary from "./pages/TodaySummary";
import { getStoredUser } from "./lib/session";

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: () => (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/dine-in",
    Component: () => (
      <RequireAuth>
        <DineInManagement />
      </RequireAuth>
    ),
  },
  {
    path: "/online-orders",
    Component: () => (
      <RequireAuth>
        <OnlineOrders />
      </RequireAuth>
    ),
  },
  {
    path: "/today-summary",
    Component: () => (
      <RequireAuth>
        <TodaySummary />
      </RequireAuth>
    ),
  },
]);

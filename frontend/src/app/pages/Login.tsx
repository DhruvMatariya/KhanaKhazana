import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChefHat, Store, UserRound } from "lucide-react";
import { api, getApiErrorMessage, type AuthUser } from "../lib/api";
import { setStoredUser } from "../lib/session";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [restaurantName, setRestaurantName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [address, setAddress] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post<AuthUser>("/api/auth/login", {
          username,
          password,
        });

        setStoredUser(response.data);
        navigate("/dashboard");
      } else if (isAdminSignup) {
        const response = await api.post<AuthUser>("/api/auth/register-admin", {
          username,
          password,
          email,
          restaurantName,
          cuisine,
          address,
          logoImageUrl,
          coverImageUrl,
        });

        setStoredUser(response.data);
        navigate("/dashboard");
      } else {
        await api.post("/api/auth/register", {
          username,
          password,
          email,
        });

        setIsLogin(true);
        setPassword("");
        setError("Registration successful. Please sign in.");
      }
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Unable to authenticate."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(251, 113, 133, 0.4) 0%, rgba(251, 113, 133, 0) 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div
        className="relative w-full max-w-2xl p-10 rounded-[32px] border border-white/10"
        style={{
          background: "rgba(23, 23, 23, 0.7)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
      >
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FB7185 0%, #FB923C 100%)",
              boxShadow: "0 8px 24px rgba(251, 113, 133, 0.3)",
            }}
          >
            <ChefHat className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-white text-center mb-2">KhanaKhazana</h1>
        <p className="text-zinc-400 text-center mb-8">Multi-restaurant ordering and operations platform</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={isLogin ? "space-y-4" : "grid md:grid-cols-2 gap-4"}>
            <div>
              <label className="text-zinc-300 text-sm mb-1 block">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                placeholder="Enter username"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-zinc-300 text-sm mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  placeholder="name@example.com"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-zinc-300 text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
              placeholder="Enter password"
              required
            />
          </div>

          {!isLogin && (
            <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
              <p className="text-zinc-200 text-sm mb-3">Register as</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdminSignup(false)}
                  className={`flex-1 px-3 py-2 rounded-xl border text-sm ${
                    !isAdminSignup
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                      : "bg-black/20 border-white/10 text-zinc-300"
                  }`}
                >
                  <UserRound className="w-4 h-4 inline mr-1" /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminSignup(true)}
                  className={`flex-1 px-3 py-2 rounded-xl border text-sm ${
                    isAdminSignup
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                      : "bg-black/20 border-white/10 text-zinc-300"
                  }`}
                >
                  <Store className="w-4 h-4 inline mr-1" /> Restaurant Admin
                </button>
              </div>
            </div>
          )}

          {!isLogin && isAdminSignup && (
            <div className="space-y-4 rounded-2xl border border-indigo-500/20 p-4 bg-indigo-500/5">
              <h3 className="text-white font-medium">Restaurant Profile</h3>
              <input
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                placeholder="Restaurant name"
                required
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  placeholder="Cuisine"
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  placeholder="Address"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={logoImageUrl}
                  onChange={(e) => setLogoImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  placeholder="Logo image URL"
                />
                <input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white"
                  placeholder="Cover image URL"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : isAdminSignup ? "Create Restaurant Admin" : "Create Customer Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className="mt-5 w-full text-center text-zinc-300 hover:text-white"
        >
          {isLogin ? "Need an account? Register now" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

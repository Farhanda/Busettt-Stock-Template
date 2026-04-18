import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Package, Lock, Mail, ArrowRight } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #1e40af 50%, #2563eb 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: "#3B82F6", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "#60A5FA", transform: "translate(30%, 30%)" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-5" style={{ background: "white", transform: "translate(-50%, -50%)" }} />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
            <Package size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">StockManager Pro</h1>
          <p className="text-blue-200 text-lg max-w-sm mx-auto">
            Platform manajemen stok dan laporan penjualan yang modern dan efisien
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: "Total Produk", value: "2,450+" },
              { label: "Transaksi", value: "18K+" },
              { label: "Pengguna", value: "320+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
                <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#1E3A8A" }}>
                <Package size={18} className="text-white" />
              </div>
              <span className="text-gray-900 font-bold text-lg">StockManager Pro</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Selamat Datang!</h2>
              <p className="text-gray-500 mt-1 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ "--tw-ring-color": "#3B82F6" } as React.CSSProperties}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button type="button" className="text-sm hover:underline" style={{ color: "#3B82F6" }}>
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                <label htmlFor="remember" className="text-sm text-gray-600 font-normal">
                  Ingat saya selama 30 hari
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:opacity-90 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #1E3A8A, #3B82F6)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Belum punya akun?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-medium hover:underline"
                  style={{ color: "#3B82F6" }}
                >
                  Daftar Sekarang
                </button>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-center text-blue-600">
                Demo: <strong>admin@stock.id</strong> / <strong>password123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

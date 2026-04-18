import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Package, Lock, Mail, User, Phone, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "staff",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #1e40af 50%, #2563eb 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: "#3B82F6", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "#60A5FA", transform: "translate(30%, 30%)" }} />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Package size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Bergabung Bersama Kami</h1>
          <p className="text-blue-200 text-lg max-w-sm mx-auto">
            Buat akun baru dan mulai kelola stok & laporan penjualan Anda
          </p>

          <div className="mt-12 space-y-4">
            {[
              "✓ Kelola stok produk secara real-time",
              "✓ Laporan penjualan otomatis & akurat",
              "✓ Dashboard analitik yang powerful",
              "✓ Multi-user dengan role management",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-blue-200 text-sm">
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
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

            {/* Step Indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "text-white" : "border-2 border-gray-200 text-gray-400"}`}
                  style={step >= 1 ? { background: "#1E3A8A" } : {}}>
                  {step > 1 ? <CheckCircle2 size={16} /> : "1"}
                </div>
                <span className="text-sm font-medium hidden sm:block">Data Diri</span>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "text-white" : "border-2 border-gray-200 text-gray-400"}`}
                  style={step >= 2 ? { background: "#1E3A8A" } : {}}>
                  2
                </div>
                <span className="text-sm font-medium hidden sm:block">Keamanan</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 1 ? "Buat Akun Baru" : "Buat Password"}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                {step === 1 ? "Lengkapi data diri Anda" : "Buat password yang kuat untuk keamanan akun"}
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {step === 1 ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Budi Santoso"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                        required
                      />
                    </div>
                  </div>

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
                        placeholder="budi@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+62 812-3456-7890"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role / Jabatan</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all bg-white text-gray-700"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff Gudang</option>
                      <option value="manager">Manager</option>
                      <option value="sales">Sales</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min. 8 karakter"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                        required
                        minLength={8}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="mt-2 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${form.password.length > i * 3 ? (form.password.length >= 12 ? "bg-green-500" : "bg-yellow-400") : "bg-gray-200"}`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="Ulangi password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {form.confirmPassword && (
                      <p className={`text-xs mt-1.5 ${form.password === form.confirmPassword ? "text-green-600" : "text-red-500"}`}>
                        {form.password === form.confirmPassword ? "✓ Password cocok" : "✗ Password tidak cocok"}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agree"
                      checked={form.agree}
                      onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-blue-600"
                      required
                    />
                    <label htmlFor="agree" className="text-sm text-gray-600 font-normal">
                      Saya menyetujui{" "}
                      <span className="text-blue-600 hover:underline cursor-pointer">Syarat & Ketentuan</span>
                      {" "}dan{" "}
                      <span className="text-blue-600 hover:underline cursor-pointer">Kebijakan Privasi</span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    <ArrowLeft size={15} />
                    <span>Kembali</span>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:opacity-90 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #1E3A8A, #3B82F6)" }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{step === 1 ? "Lanjutkan" : "Buat Akun"}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{" "}
                <button onClick={() => navigate("/login")} className="font-medium hover:underline" style={{ color: "#3B82F6" }}>
                  Masuk Sekarang
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

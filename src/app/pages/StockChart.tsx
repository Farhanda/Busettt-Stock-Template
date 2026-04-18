import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { BarChart2, TrendingDown, TrendingUp, Package, Filter } from "lucide-react";

const monthlyStock = [
  { month: "Jan", masuk: 580, keluar: 320, saldo: 2100 },
  { month: "Feb", masuk: 420, keluar: 380, saldo: 2140 },
  { month: "Mar", masuk: 750, keluar: 410, saldo: 2480 },
  { month: "Apr", masuk: 380, keluar: 290, saldo: 2570 },
  { month: "Mei", masuk: 620, keluar: 450, saldo: 2740 },
  { month: "Jun", masuk: 490, keluar: 520, saldo: 2710 },
  { month: "Jul", masuk: 830, keluar: 480, saldo: 3060 },
  { month: "Agu", masuk: 560, keluar: 390, saldo: 3230 },
  { month: "Sep", masuk: 470, keluar: 440, saldo: 3260 },
  { month: "Okt", masuk: 710, keluar: 510, saldo: 3460 },
  { month: "Nov", masuk: 650, keluar: 580, saldo: 3530 },
  { month: "Des", masuk: 890, keluar: 620, saldo: 3800 },
];

const categoryStock = [
  { name: "Ayam Potong", value: 450, color: "#1E3A8A" },
  { name: "Ayam Hidup", value: 680, color: "#3B82F6" },
  { name: "Telur", value: 320, color: "#60A5FA" },
  { name: "Hasil Olahan", value: 150, color: "#93C5FD" },
  { name: "Ayam Bibit", value: 280, color: "#BFDBFE" },
];

const topMoving = [
  { name: "Ayam Broiler Siap Potong", keluar: 180, category: "Ayam Potong" },
  { name: "Ayam Kampung Premium", keluar: 165, category: "Ayam Hidup" },
  { name: "Telur Ayam Segar", keluar: 142, category: "Telur" },
  { name: "Daging Ayam Fillet", keluar: 128, category: "Hasil Olahan" },
  { name: "Ayam Jawa Super", keluar: 115, category: "Ayam Hidup" },
  { name: "Ayam Goreng Siap Jual", keluar: 98, category: "Hasil Olahan" },
];

const weeklyTrend = [
  { day: "Sen", masuk: 45, keluar: 38 },
  { day: "Sel", masuk: 62, keluar: 55 },
  { day: "Rab", masuk: 38, keluar: 71 },
  { day: "Kam", masuk: 85, keluar: 62 },
  { day: "Jum", masuk: 55, keluar: 48 },
  { day: "Sab", masuk: 72, keluar: 85 },
  { day: "Min", masuk: 28, keluar: 32 },
];

export function StockChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2026");

  const summaryStats = [
    { label: "Total Masuk (YTD)", value: "7,350", unit: "unit", icon: <TrendingUp size={18} className="text-green-600" />, bg: "bg-green-50", change: "+15.3%" },
    { label: "Total Keluar (YTD)", value: "5,390", unit: "unit", icon: <TrendingDown size={18} className="text-red-500" />, bg: "bg-red-50", change: "+12.8%" },
    { label: "Saldo Stok Akhir", value: "3,800", unit: "unit", icon: <Package size={18} className="text-blue-600" />, bg: "bg-blue-50", change: "+26.7%" },
    { label: "Perputaran Stok", value: "2.4x", unit: "per tahun", icon: <BarChart2 size={18} className="text-violet-600" />, bg: "bg-violet-50", change: "+0.3x" },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Stock Chart</h1>
          <p className="text-sm text-gray-500 mt-0.5">Analisis visual pergerakan dan tren stok produk</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white text-gray-700"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {["monthly", "weekly"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedPeriod === p ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                style={selectedPeriod === p ? { background: "#1E3A8A" } : {}}
              >
                {p === "monthly" ? "Bulanan" : "Mingguan"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-green-600 mt-1 font-medium">{s.change} vs tahun lalu</p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Stock In vs Out */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-gray-900">Stok Masuk vs Keluar</h3>
              <p className="text-sm text-gray-500 mt-0.5">{selectedPeriod === "monthly" ? "Perbandingan bulanan" : "Perbandingan mingguan"}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={selectedPeriod === "monthly" ? monthlyStock : weeklyTrend} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={selectedPeriod === "monthly" ? "month" : "day"} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Bar dataKey="masuk" name="Stok Masuk" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="keluar" name="Stok Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-5">
            <h3 className="text-gray-900">Distribusi per Kategori</h3>
            <p className="text-sm text-gray-500 mt-0.5">Komposisi stok saat ini</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryStock} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {categoryStock.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} unit`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {categoryStock.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-800">{cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Stock Balance Trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-5">
            <h3 className="text-gray-900">Tren Saldo Stok</h3>
            <p className="text-sm text-gray-500 mt-0.5">Perkembangan total stok sepanjang tahun</p>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={monthlyStock}>
              <defs>
                <linearGradient id="saldoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="saldo" name="Saldo Stok" stroke="#1E3A8A" strokeWidth={2.5} fill="url(#saldoGrad)" dot={{ r: 4, fill: "#1E3A8A" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Moving Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-5">
            <h3 className="text-gray-900">Produk Paling Aktif</h3>
            <p className="text-sm text-gray-500 mt-0.5">Berdasarkan jumlah keluar bulan ini</p>
          </div>
          <div className="space-y-3">
            {topMoving.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-bold text-gray-400">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                    <span className="text-sm font-bold text-gray-800 ml-2">{p.keluar}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(p.keluar / topMoving[0].keluar) * 100}%`,
                        background: i === 0 ? "#1E3A8A" : "#3B82F6",
                        opacity: 1 - i * 0.12
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 w-16 text-right">{p.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from "recharts";
import { TrendingUp, ShoppingCart, DollarSign, Users, ArrowUpRight } from "lucide-react";

const salesMonthly = [
  { month: "Jan", penjualan: 42000000, biaya: 28000000, profit: 14000000, transaksi: 145 },
  { month: "Feb", penjualan: 38500000, biaya: 24000000, profit: 14500000, transaksi: 128 },
  { month: "Mar", penjualan: 55000000, biaya: 33000000, profit: 22000000, transaksi: 198 },
  { month: "Apr", penjualan: 47000000, biaya: 29000000, profit: 18000000, transaksi: 165 },
  { month: "Mei", penjualan: 62000000, biaya: 37000000, profit: 25000000, transaksi: 220 },
  { month: "Jun", penjualan: 58000000, biaya: 35000000, profit: 23000000, transaksi: 205 },
  { month: "Jul", penjualan: 72000000, biaya: 42000000, profit: 30000000, transaksi: 258 },
  { month: "Agu", penjualan: 68000000, biaya: 40000000, profit: 28000000, transaksi: 242 },
  { month: "Sep", penjualan: 75000000, biaya: 44000000, profit: 31000000, transaksi: 267 },
  { month: "Okt", penjualan: 80000000, biaya: 47000000, profit: 33000000, transaksi: 285 },
  { month: "Nov", penjualan: 88000000, biaya: 51000000, profit: 37000000, transaksi: 312 },
  { month: "Des", penjualan: 95000000, biaya: 55000000, profit: 40000000, transaksi: 340 },
];

const salesByChannel = [
  { name: "Toko Fisik", value: 35, color: "#1E3A8A" },
  { name: "Marketplace", value: 42, color: "#3B82F6" },
  { name: "Website", value: 15, color: "#60A5FA" },
  { name: "WhatsApp/DM", value: 8, color: "#93C5FD" },
];

const topProducts = [
  { name: "iPhone 15 Pro", revenue: 74995000, units: 5, category: "Elektronik" },
  { name: "Laptop ASUS ROG", revenue: 68000000, units: 2, category: "Elektronik" },
  { name: "Samsung S24 Ultra", revenue: 53997000, units: 3, category: "Elektronik" },
  { name: "Sofa L-Shape", revenue: 25500000, units: 3, category: "Furniture" },
  { name: "AirPods Pro", revenue: 16800000, units: 4, category: "Elektronik" },
];

const performanceData = [
  { subject: "Volume Penjualan", A: 88 },
  { subject: "Margin Keuntungan", A: 76 },
  { subject: "Kepuasan Pelanggan", A: 92 },
  { subject: "Kecepatan Pengiriman", A: 84 },
  { subject: "Konversi", A: 68 },
  { subject: "Repeat Order", A: 79 },
];

const dailyThisWeek = [
  { day: "Senin", penjualan: 8500000, target: 9000000 },
  { day: "Selasa", penjualan: 12200000, target: 9000000 },
  { day: "Rabu", penjualan: 7800000, target: 9000000 },
  { day: "Kamis", penjualan: 15600000, target: 9000000 },
  { day: "Jumat", penjualan: 18900000, target: 9000000 },
  { day: "Sabtu", penjualan: 22400000, target: 9000000 },
  { day: "Minggu", penjualan: 9800000, target: 9000000 },
];

const formatM = (v: number) => `Rp ${(v / 1000000).toFixed(1)}M`;

export function SellingChart() {
  const [period, setPeriod] = useState("yearly");

  const summaryCards = [
    { label: "Total Revenue (YTD)", value: "Rp 780M", icon: <DollarSign size={20} className="text-blue-600" />, bg: "bg-blue-50", change: "+18.2%", sub: "vs tahun lalu" },
    { label: "Total Transaksi", value: "2,765", icon: <ShoppingCart size={20} className="text-violet-600" />, bg: "bg-violet-50", change: "+12.4%", sub: "vs tahun lalu" },
    { label: "Profit Bersih", value: "Rp 316M", icon: <TrendingUp size={20} className="text-green-600" />, bg: "bg-green-50", change: "+22.1%", sub: "margin 40.5%" },
    { label: "Pelanggan Aktif", value: "1,842", icon: <Users size={20} className="text-orange-500" />, bg: "bg-orange-50", change: "+8.7%", sub: "pelanggan unik" },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Selling Chart</h1>
          <p className="text-sm text-gray-500 mt-0.5">Analisis mendalam performa penjualan bisnis Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {[
              { key: "weekly", label: "Mingguan" },
              { key: "monthly", label: "Bulanan" },
              { key: "yearly", label: "Tahunan" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${period === p.key ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                style={period === p.key ? { background: "#1E3A8A" } : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                {s.icon}
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={11} />
                {s.change}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue & Profit Area */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-gray-900">Revenue & Profit 2026</h3>
              <p className="text-sm text-gray-500 mt-0.5">Tren penjualan dan keuntungan bersih</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesMonthly}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatM(v), ""]} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Area type="monotone" dataKey="penjualan" name="Revenue" stroke="#3B82F6" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" strokeWidth={2} fill="url(#profGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Channel */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-5">
            <h3 className="text-gray-900">Saluran Penjualan</h3>
            <p className="text-sm text-gray-500 mt-0.5">Distribusi berdasarkan channel</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={salesByChannel} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value">
                {salesByChannel.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {salesByChannel.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: ch.color }} />
                  <span className="text-gray-600">{ch.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Daily This Week */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-gray-900">Penjualan Harian Minggu Ini</h3>
              <p className="text-sm text-gray-500 mt-0.5">Aktual vs Target harian</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={dailyThisWeek} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatM(v), ""]} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Bar dataKey="penjualan" name="Penjualan" fill="#1E3A8A" radius={[5, 5, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#BFDBFE" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Radar */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-5">
            <h3 className="text-gray-900">Skor Performa</h3>
            <p className="text-sm text-gray-500 mt-0.5">Analisis 6 dimensi kunci</p>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#6b7280" }} />
              <Radar name="Skor" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900">Produk Terlaris</h3>
            <p className="text-sm text-gray-500 mt-0.5">Berdasarkan revenue bulan ini</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">#</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Produk</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Kategori</th>
                <th className="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Unit Terjual</th>
                <th className="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Revenue</th>
                <th className="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">% Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, i) => {
                const totalRev = topProducts.reduce((s, p) => s + p.revenue, 0);
                const pct = ((p.revenue / totalRev) * 100).toFixed(1);
                return (
                  <tr key={p.name} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                    <td className="py-3 text-sm font-medium text-gray-800">{p.name}</td>
                    <td className="py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{p.category}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-600 text-right">{p.units} unit</td>
                    <td className="py-3 text-sm font-semibold text-gray-800 text-right">{formatM(p.revenue)}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#3B82F6" }} />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

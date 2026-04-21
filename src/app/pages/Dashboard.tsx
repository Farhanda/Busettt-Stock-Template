import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Package, TrendingUp, ShoppingCart, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Users, ChevronRight, RefreshCcw
} from "lucide-react";
import { CardDetailModal } from "../components/CardDetailModal";

import { calculateStockAnalytics, calculateCategoryStock, calculateCategoryStockAnalytics, calculateCategoryStockStatus } from "../assets/utils/stock_analytics";
import initialInventoryData from "../assets/data/stock_data.json";
import initialMovement from "../assets/data/stock_movement.json";

const salesData = [
  { month: "Jan", penjualan: 42000000, target: 40000000 },
  { month: "Feb", penjualan: 38500000, target: 42000000 },
  { month: "Mar", penjualan: 55000000, target: 45000000 },
  { month: "Apr", penjualan: 47000000, target: 48000000 },
  { month: "Mei", penjualan: 62000000, target: 50000000 },
  { month: "Jun", penjualan: 58000000, target: 52000000 },
  { month: "Jul", penjualan: 72000000, target: 55000000 },
  { month: "Agu", penjualan: 68000000, target: 58000000 },
  { month: "Sep", penjualan: 75000000, target: 60000000 },
  { month: "Okt", penjualan: 80000000, target: 65000000 },
  { month: "Nov", penjualan: 88000000, target: 70000000 },
  { month: "Des", penjualan: 95000000, target: 75000000 },
];

const stockData = [
  { name: "Ayam Potong", stok: 450, keluar: 120 },
  { name: "Ayam Hidup", stok: 680, keluar: 230 },
  { name: "Telur", stok: 320, keluar: 180 },
  { name: "Hasil Olahan", stok: 150, keluar: 45 },
  { name: "Ayam Bibit", stok: 280, keluar: 95 },
];

const recentTransactions = [
  { id: "TRX-001", product: "Ayam Broiler Siap Potong", category: "Ayam Potong", qty: 50, amount: 1750000, status: "completed", date: "18 Apr 2026" },
  { id: "TRX-002", product: "Ayam Kampung Premium", category: "Ayam Hidup", qty: 25, amount: 1625000, status: "processing", date: "18 Apr 2026" },
  { id: "TRX-003", product: "Daging Ayam Fillet", category: "Hasil Olahan", qty: 10, amount: 750000, status: "completed", date: "17 Apr 2026" },
  { id: "TRX-004", product: "Telur Ayam Segar", category: "Telur", qty: 5, amount: 225000, status: "pending", date: "17 Apr 2026" },
  { id: "TRX-005", product: "Ayam Goreng Siap Jual", category: "Hasil Olahan", qty: 30, amount: 1350000, status: "completed", date: "16 Apr 2026" },
];

const lowStockItems = [
  { name: "Telur Ayam Segar (per karton)", stock: 3, min: 10, category: "Telur" },
  { name: "Ayam Broiler Bibit", stock: 2, min: 5, category: "Ayam Bibit" },
  { name: "Telur Omega 3 (per karton)", stock: 8, min: 20, category: "Telur" },
];

const formatCurrency = (v: number) => {
  if (v >= 1000000) return `Rp ${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `Rp ${(v / 1000).toFixed(0)}K`;
  return `Rp ${v}`;
};

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  completed: "Selesai",
  processing: "Diproses",
  pending: "Menunggu",
};

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // Setiap klik, nilai berubah
  };

  // Ambil data dari LocalStorage atau gunakan JSON sebagai fallback awal
  useEffect(() => {
    const savedMovements = localStorage.getItem("movements_db");
    const savedProducts = localStorage.getItem("stock_db");
    if (!savedMovements) {
      localStorage.setItem("movements_db", JSON.stringify(initialMovement));
    }
    if (!savedProducts) {
      localStorage.setItem("stock_db", JSON.stringify(initialInventoryData));
    }
  }, []);

  const stocks = useMemo(() => {
    const saved = localStorage.getItem("stock_db");
    return saved ? JSON.parse(saved) : initialInventoryData;
  }, [refreshKey]);

  const movements = useMemo(() => {
    const saved = localStorage.getItem("movements_db");
    return saved ? JSON.parse(saved) : initialMovement;
  }, [refreshKey]);

  // Jalankan kalkulasi analytics secara menyeluruh
  const analytics = useMemo(() => {
    return calculateStockAnalytics(movements, stocks);
  }, [movements, stocks, refreshKey]);

  const categoryData = useMemo(() => calculateCategoryStock(stocks, movements), [stocks, movements]);
    // Di dalam komponen Dashboard
  const categoryStockData = useMemo(() => {
    // Kita hanya ingin menampilkan kategori yang stoknya mendekati atau di bawah minimum
    return calculateCategoryStockStatus(stocks).filter(cat => cat.stock <= cat.min); 
  }, [stocks, refreshKey]);

  // Debugging output untuk memastikan data kategori sudah benar
  // useEffect(() => {
  //   console.log("Analytics Data:", categoryStockData);// Debugging output untuk memastikan data kategori sudah benar
  // }, [categoryStockData]);
  
  // Data Statistik Ringkas
  const stats = [
    {
      title: "Total Stok",
      value: stocks.reduce((acc: number, curr: any) => acc + curr.stock, 0).toLocaleString(),
      change: "+12%",
      isPositive: true,
      icon: <Package className="text-blue-600" />,
      bg: "bg-blue-50"
    },
    // {
    //   title: "Barang Keluar",
    //   value: analytics.monthlyHistory.reduce((acc, curr) => acc + curr.keluar, 0).toLocaleString(),
    //   change: "+18%",
    //   isPositive: true,
    //   icon: <ShoppingCart className="text-indigo-600" />,
    //   bg: "bg-indigo-50"
    // },
    {
      title: "Total Penjualan",
      value: "Rp 780M",
      unit: "tahun ini",
      change: "+18.2%",
      positive: true,
      icon: <TrendingUp size={22} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      title: "Transaksi Bulan Ini",
      value: "1,284",
      unit: "transaksi",
      change: "+8.7%",
      positive: true,
      icon: <ShoppingCart size={22} className="text-violet-600" />,
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      title: "Stok Menipis",
      value: stocks.filter((p: any) => p.status === 'low').length,
      change: "Perlu Re-stock",
      isPositive: false,
      icon: <AlertTriangle className="text-amber-600" />,
      bg: "bg-amber-50"
    }
  ];

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(today);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{formattedDate} — Selamat datang, Admin!</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCcw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((card) => (
          <div
            key={card.title}
            onClick={() => setSelectedCard(card.title)}
            className={`bg-white rounded-xl border ${card.border} p-5 hover:shadow-md transition-shadow cursor-pointer hover:border-gray-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${card.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-sm text-gray-500">{card.title}</p>
              <span className="text-xs text-gray-400">• {card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Sales Chart - 2/3 width */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-gray-900">Grafik Penjualan 2026</h3>
              <p className="text-sm text-gray-500 mt-0.5">Penjualan vs Target Bulanan</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`Rp ${(v / 1000000).toFixed(1)}M`, ""]} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
              <Area type="monotone" dataKey="penjualan" name="Penjualan" stroke="#3B82F6" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#1E3A8A" strokeWidth={2} strokeDasharray="5 3" fill="url(#targetGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stock by Category */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-gray-900">Stok per Kategori</h3>
              <p className="text-sm text-gray-500 mt-0.5">Masuk vs Keluar</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={65} />
              <Tooltip />
              <Bar dataKey="stok" name="Stok" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
              <Bar dataKey="keluar" name="Keluar" fill="#93C5FD" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Transactions */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900">Transaksi Terbaru</h3>
              <p className="text-sm text-gray-500 mt-0.5">5 transaksi terakhir</p>
            </div>
            <button
              onClick={() => navigate("/report/table")}
              className="flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: "#3B82F6" }}
            >
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>
          <div className="custom-scrollbar overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Produk</th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide hidden sm:table-cell">Qty</th>
                  <th className="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Total</th>
                  <th className="text-center text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-xs font-mono text-gray-500">{tx.id}</td>
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-800">{tx.product}</p>
                      <p className="text-xs text-gray-400">{tx.category}</p>
                    </td>
                    <td className="py-3 text-sm text-gray-600 hidden sm:table-cell">{tx.qty} unit</td>
                    <td className="py-3 text-right text-sm font-semibold text-gray-800">{formatCurrency(tx.amount)}</td>
                    <td className="py-3 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[tx.status]}`}>
                        {statusLabels[tx.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert + Quick Stats */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="bg-white rounded-xl border border-orange-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertTriangle size={16} className="text-orange-500" />
              </div>
              <div>
                <h4 className="text-gray-900 text-sm font-semibold">Stok Menipis</h4>
                <p className="text-xs text-gray-400">Perlu segera restok</p>
              </div>
            </div>
            <div className="space-y-3">
              {categoryStockData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-400"
                          style={{ width: `${(item.stock / item.min) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-orange-600 font-medium flex-shrink-0">{item.stock}/{item.min}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/stock/table")}
              className="mt-4 w-full text-center text-sm font-medium py-2 rounded-lg transition-colors hover:bg-orange-50"
              style={{ color: "#3B82F6" }}
            >
              Kelola Stok →
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Statistik Cepat</h4>
            <div className="space-y-3">
              {[
                { 
                  label: "Total Pengguna", 
                  value: "24 orang", // Tetap statis jika belum ada sistem user
                  icon: <Users size={14} className="text-blue-500" /> 
                },
                { 
                  label: "Produk Aktif", 
                  // MENGGUNAKAN DATA DINAMIS:
                  value: `${stocks.length} item`, 
                  icon: <Package size={14} className="text-violet-500" /> 
                },
                { 
                  label: "Revenue Hari Ini", 
                  value: "Rp 12.4M", // Bisa diganti logic total (qty * harga) jika perlu
                  icon: <TrendingUp size={14} className="text-green-500" /> 
                },
                { 
                  label: "Transaksi Hari Ini", 
                  value: `${movements.filter((m: any) => 
                    new Date(m.date).toDateString() === new Date().toDateString()
                  ).length} kali`, 
                  icon: <RefreshCcw size={14} className="text-blue-500" /> 
                }
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    {s.icon}
                    <span className="text-sm text-gray-600">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        isOpen={selectedCard !== null}
        title={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}

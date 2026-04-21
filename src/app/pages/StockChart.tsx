import { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { BarChart2, TrendingDown, TrendingUp, Package, Filter } from "lucide-react";
import initialInventoryData from "../assets/data/stock_data.json";
import initialMovement from "../assets/data/stock_movement.json";
import { calculateStockAnalytics } from "../assets/utils/stock_analytics"; // Adjust path accordingly
import { useIsMobile } from "../components/ui/use-mobile";

export function StockChart() {
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2026");
  
  // Flow State: Managing live data from LocalStorage
  const [stocks, setStocks] = useState(initialInventoryData);
  const [movements, setMovements] = useState([]);
  // const [analytics, setAnalytics] = useState(initialAnalyticsData);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    // FLOW STEP 1: Sync with LocalStorage to get latest "Add/Edit" changes
    // 1. Sync Stocks
    const savedStocks = localStorage.getItem("stock_db");
    const currentStocks = savedStocks ? JSON.parse(savedStocks) : initialInventoryData;
    setStocks(currentStocks);

    // 2. Sync Movements (Transaction History)
    const savedMovements = localStorage.getItem("movements_db");
    const currentMovements = savedMovements ? JSON.parse(savedMovements) : initialMovement;
    setMovements(currentMovements);

    // FLOW STEP 2: Calculate Pie Chart distribution dynamically from current stocks
    const counts: Record<string, number> = {};
    currentStocks.forEach((item: any) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    const colors = ["#1E3A8A", "#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6"];
    const distribution = Object.keys(counts).map((cat, index) => ({
      name: cat,
      value: counts[cat],
      color: colors[index % colors.length]
    }));
    setCategoryData(distribution);

    // Note: In a real app, you'd also fetch analytics from an API here
  }, []);
  useEffect(() => {
    const savedMovements = localStorage.getItem("movements_db");
    if (!savedMovements) {
      localStorage.setItem("movements_db", JSON.stringify(initialMovement));
    }
  }, []);

  // FLOW STEP 3: Replace JSON with Dynamic Calculation
  const analytics = useMemo(() => {
    return calculateStockAnalytics(movements, stocks);
  }, [movements, stocks]);

  // FLOW STEP 3: Calculate Summary Stats dynamically
  // These derive values from analytics history and current inventory stock levels
  const totalMasuk = analytics.monthlyHistory.reduce((acc, curr) => acc + curr.masuk, 0);
  const totalKeluar = analytics.monthlyHistory.reduce((acc, curr) => acc + curr.keluar, 0);
  
  // "Saldo Stok Akhir" is the sum of current quantity in your inventory list
  const currentSaldo = stocks.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  
  // Inventory Turnover Calculation: Total Keluar / Average Saldo
  const avgSaldo = analytics.monthlyHistory.reduce((acc, curr) => acc + curr.saldo, 0) / analytics.monthlyHistory.length;
  const turnover = (totalKeluar / avgSaldo).toFixed(1);

  const summaryStats = [
    { 
      label: "Total Masuk (YTD)", 
      value: totalMasuk.toLocaleString(), 
      unit: "unit", 
      icon: <TrendingUp size={18} className="text-green-600" />, 
      bg: "bg-green-50", 
      change: "+15.3%" 
    },
    { 
      label: "Total Keluar (YTD)", 
      value: totalKeluar.toLocaleString(), 
      unit: "unit", 
      icon: <TrendingDown size={18} className="text-red-500" />, 
      bg: "bg-red-50", 
      change: "+12.8%" 
    },
    { 
      label: "Saldo Stok Akhir", 
      value: currentSaldo.toLocaleString(), 
      unit: "unit", 
      icon: <Package size={18} className="text-blue-600" />, 
      bg: "bg-blue-50", 
      change: "+26.7%" 
    },
    { 
      label: "Perputaran Stok", 
      value: `${turnover}x`, 
      unit: "per tahun", 
      icon: <BarChart2 size={18} className="text-violet-600" />, 
      bg: "bg-violet-50", 
      change: "+0.3x" 
    },
  ];

  const monthlyStock = analytics.monthlyHistory;
  const weeklyTrend = analytics.weeklyHistory ?? analytics.monthlyHistory;
  const topMoving = analytics.topMoving;
  
  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} justify-between`}>
        <div>
          <h1 className="text-gray-900">Stock Chart</h1>
          <p className={`text-sm text-gray-500 mt-0.5 ${isMobile ? 'mb-2' : 'mb-1'}`}>Analisis visual pergerakan dan tren stok produk</p>
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
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} unit`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {categoryData.map((cat) => (
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

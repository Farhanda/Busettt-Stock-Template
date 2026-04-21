import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft, Package, TrendingUp, TrendingDown, Edit2, AlertTriangle,
  BarChart2, History, Tag, Box, Calendar, User, CheckCircle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

// Import your JSON data as fallbacks
import initialMovement from "../assets/data/stock_movement.json";
import initialInventoryData from "../assets/data/stock_data.json";
import analyticsData from "../assets/data/stock_analytics.json";
import { calculateProductSummary, calculateSingleProductAnalytics, calculateStockAnalytics } from "../assets/utils/stock_analytics";

export function StockDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id"); // Get ID from URL e.g. ?id=STK-001

  // Flow State: Managing dynamic data
  const [product, setProduct] = useState<any>(null);
  const [history] = useState(analyticsData.monthlyHistory); // Using global history for the demo
  
  // 1. Get movements from LocalStorage (or props/state management)
  const movements = JSON.parse(localStorage.getItem("movements_db") || JSON.stringify(initialMovement));
  
  // 2. Calculate analytics specifically for THIS product
  const productAnalytics = useMemo(() => {
    return calculateSingleProductAnalytics(movements, productId || "");
  }, [movements, productId]);

  useEffect(() => {
    // const savedMovements = localStorage.getItem("movements_db");
    if (!savedMovements) {
      localStorage.setItem("movements_db", JSON.stringify(initialMovement));
    }
  }, []);

  // 2. Ambil data pergerakan asli dari LocalStorage
  const savedMovements = JSON.parse(localStorage.getItem("movements_db") || movements);
  const savedProducts = JSON.parse(localStorage.getItem("stock_db") || "[]");

  // 3. Hitung analytics secara dinamis
  const analytics = useMemo(() => {
    // Filter movements khusus untuk produk ini saja sebelum dihitung
    const specificMovements = savedMovements.filter((m: any) => m.productId === productId);
    return calculateStockAnalytics(specificMovements, savedProducts);
  }, [productId, savedMovements]);

  // 4. Gunakan hasil kalkulasi untuk Chart
  const chartData = analytics.monthlyHistory;

  // Filter riwayat khusus untuk produk ini & urutkan dari yang terbaru (descending)
  const productHistory = useMemo(() => {
    return movements
      .filter((m: any) => m.productId === productId)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [movements, productId]);

  useEffect(() => {
    // FLOW STEP 1: Fetch the specific product from LocalStorage or JSON
    const savedStocks = localStorage.getItem("stock_db");
    const currentStocks = savedStocks ? JSON.parse(savedStocks) : initialInventoryData;
    
    const foundProduct = currentStocks.find((p: any) => p.id === productId);
    
    if (foundProduct) {
      // Add missing fields for detail view if they don't exist in the simple JSON
      setProduct({
        ...foundProduct,
        brand: foundProduct.brand || "Generik",
        buyPrice: foundProduct.buyPrice || foundProduct.price * 0.8,
        location: foundProduct.location || "Gudang Utama",
        supplier: foundProduct.supplier || "Supplier Lokal",
        lastRestock: foundProduct.updated,
        description: foundProduct.description || "Tidak ada deskripsi tersedia.",
      });
    }
    console.log("Produk yang ditemukan:", foundProduct); // Debugging output
  }, [productId]);

  // Di dalam komponen StockDetail
  const summary = useMemo(() => {
    return calculateProductSummary(movements, productId || "", product?.stock || 0);
  }, [productId, product?.stock, movements]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[100%] text-center">
        <p className="text-gray-500">Memuat data produk...</p>
      </div>
    );
  }

  // FLOW STEP 2: Logic for dynamic UI elements
  const statusConfig: any = {
    available: { label: "Tersedia", color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={14} /> },
    low: { label: "Menipis", color: "text-amber-600", bg: "bg-amber-50", icon: <AlertTriangle size={14} /> },
    empty: { label: "Habis", color: "text-red-600", bg: "bg-red-50", icon: <Package size={14} /> },
  };

  const currentStatus = statusConfig[product.status] || statusConfig.available;

  const statsCards = [
    { 
      label: "Stok Saat Ini", 
      value: `${product.stock} unit`, 
      icon: <Box size={18} className="text-blue-600" />, 
      bg: "bg-blue-50" 
    },
    { 
      label: "Rata-rata Keluar/Hari", 
      value: `~${summary.avgPerDay} unit`, 
      icon: <TrendingDown size={18} className="text-red-500" />, 
      bg: "bg-red-50" 
    },
    { 
      label: "Estimasi Habis", 
      value: summary.estimation > 0 ? `~${summary.estimation} hari` : "N/A", 
      icon: <Calendar size={18} className="text-orange-500" />, 
      bg: "bg-orange-50" 
    },
    { 
      label: "Total Keluar (Bulan Ini)", 
      value: `${summary.currentMonthOut} unit`, 
      icon: <TrendingUp size={18} className="text-green-600" />, 
      bg: "bg-green-50" 
    },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/stock/table")}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${currentStatus.bg} ${currentStatus.color}`}>
                {currentStatus.icon}
                {currentStatus.label}
              </span>
            </div>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <span className="font-medium text-gray-700">{product.sku}</span>
              <span>•</span>
              <span>{product.category}</span>
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate(`/stock/edit?id=${product.id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-blue-200/50"
          style={{ background: "#1E3A8A" }}
        >
          <Edit2 size={14} />
          Edit Produk
        </button>
      </div>

      {/* Product Header Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FF" }}>
            <Package size={40} style={{ color: "#1E3A8A" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h2 className="text-gray-900">{product.name}</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">Tersedia</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">SKU: <strong className="text-gray-700">{product.sku}</strong> • {product.category} • {product.brand}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <Tag size={12} /> Rp {product.price.toLocaleString("id-ID")}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <Box size={12} /> {product.location}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <User size={12} /> {product.supplier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Warning */}
      {product.stock < product.minStock * 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">Stok Perlu Diperhatikan</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Stok saat ini ({product.stock} unit) mendekati batas minimum ({product.minStock} unit). Segera lakukan restok untuk menghindari kehabisan.
            </p>
          </div>
          <button className="ml-auto flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors">
            Restok Sekarang
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: "overview", label: "Overview", icon: <BarChart2 size={14} /> },
            { key: "history", label: "Riwayat Stok", icon: <History size={14} /> },
            { key: "info", label: "Info Produk", icon: <Package size={14} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "overview" && (
            <div>
              <h3 className="text-gray-800 mb-4">Pergerakan Stok (18 Hari Terakhir)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <ReferenceLine y={product.minStock} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: "Min. Stok", fontSize: 11, fill: "#f59e0b" }} />
                  <Line type="monotone" dataKey="saldo" name="Saldo Stok" stroke="#1E3A8A" strokeWidth={2.5} dot={{ r: 4, fill: "#1E3A8A" }} />
                  <Line type="monotone" dataKey="masuk" name="Masuk" stroke="#22c55e" strokeWidth={2} dot={false} strokeDasharray="4 3" />
                  <Line type="monotone" dataKey="keluar" name="Keluar" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h3 className="text-gray-800 mb-4">Log Aktivitas Stok</h3>
              <div className="space-y-3">
                {productHistory.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${log.type === "in" ? "bg-green-100" : "bg-red-100"}`}>
                      {log.type === "in" ? <TrendingUp size={14} className="text-green-600" /> : <TrendingDown size={14} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800">
                          {log.type === "in" ? "Stok Masuk" : "Stok Keluar"} —{" "}
                          <span className={`font-bold ${log.type === "in" ? "text-green-600" : "text-red-600"}`}>
                            {log.type === "in" ? "+" : "-"}{log.qty} unit
                          </span>
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">{log.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{log.note}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Oleh: {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div>
              <h3 className="text-gray-800 mb-4">Informasi Detail Produk</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "Nama Produk", value: product.name },
                  { label: "SKU", value: product.sku },
                  { label: "Kategori", value: product.category },
                  { label: "Brand", value: product.brand },
                  { label: "Harga Jual", value: `Rp ${product.price.toLocaleString("id-ID")}` },
                  { label: "Harga Beli", value: `Rp ${product.buyPrice.toLocaleString("id-ID")}` },
                  { label: "Margin", value: `Rp ${(product.price - product.buyPrice).toLocaleString("id-ID")} (${(((product.price - product.buyPrice) / product.buyPrice) * 100).toFixed(1)}%)` },
                  { label: "Lokasi Penyimpanan", value: product.location },
                  { label: "Stok Minimum", value: `${product.minStock} unit` },
                  { label: "Supplier", value: product.supplier },
                  { label: "Terakhir Restok", value: product.lastRestock },
                  { label: "Berat", value: product.weight },
                  { label: "Dimensi", value: product.dimension },
                ].map((info) => (
                  <div key={info.label} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{info.label}</span>
                    <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

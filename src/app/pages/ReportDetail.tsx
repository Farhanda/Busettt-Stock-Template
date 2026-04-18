import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Download, FileText, TrendingUp, ShoppingCart,
  Package, Calendar, User, Printer, Share2, CheckCircle,
  BarChart2, DollarSign
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const weeklyBreakdown = [
  { week: "Minggu 1", penjualan: 20500000, transaksi: 72 },
  { week: "Minggu 2", penjualan: 24800000, transaksi: 88 },
  { week: "Minggu 3", penjualan: 28200000, transaksi: 102 },
  { week: "Minggu 4", penjualan: 21500000, transaksi: 78 },
];

const categoryBreakdown = [
  { name: "Elektronik", value: 58000000, color: "#1E3A8A" },
  { name: "Pakaian", value: 15000000, color: "#3B82F6" },
  { name: "Furniture", value: 12000000, color: "#60A5FA" },
  { name: "Kosmetik", value: 10000000, color: "#93C5FD" },
];

const topItems = [
  { rank: 1, name: "iPhone 15 Pro 256GB", qty: 28, revenue: 41997200, category: "Elektronik" },
  { rank: 2, name: "Samsung Galaxy S24 Ultra", qty: 22, revenue: 39597800, category: "Elektronik" },
  { rank: 3, name: "MacBook Air M3", qty: 8, revenue: 18000000, category: "Elektronik" },
  { rank: 4, name: "Sofa L-Shape Minimalis", qty: 15, revenue: 12750000, category: "Furniture" },
  { rank: 5, name: "AirPods Pro 2nd Gen", qty: 32, revenue: 13440000, category: "Elektronik" },
  { rank: 6, name: "Kemeja Oxford Premium", qty: 85, revenue: 10200000, category: "Pakaian" },
];

export function ReportDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  const report = {
    id: "RPT-2026-001",
    title: "Laporan Penjualan April 2026",
    type: "Penjualan",
    period: "01 April 2026 — 18 April 2026",
    created: "18 April 2026, 23:59",
    author: "Admin Sistem",
    status: "completed",
    totalRevenue: 95000000,
    totalCost: 57000000,
    profit: 38000000,
    margin: 40.0,
    totalTransactions: 340,
    totalItems: 1284,
    avgOrderValue: 279412,
    newCustomers: 42,
    returningCustomers: 298,
  };

  const formatRp = (v: number) => `Rp ${(v / 1000000).toFixed(1)}M`;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/report/table")} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-gray-900">Detail Report</h1>
            <p className="text-sm text-gray-500 mt-0.5">Analisis lengkap laporan bisnis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer size={14} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Share2 size={14} />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-colors" style={{ background: "#1E3A8A" }}>
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FF" }}>
            <FileText size={28} style={{ color: "#1E3A8A" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-gray-900">{report.title}</h2>
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                <CheckCircle size={11} /> Selesai
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><FileText size={13} /> ID: {report.id}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} /> {report.period}</span>
              <span className="flex items-center gap-1.5"><User size={13} /> {report.author}</span>
              <span className="flex items-center gap-1.5"><BarChart2 size={13} /> Tipe: {report.type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatRp(report.totalRevenue), icon: <DollarSign size={18} className="text-blue-600" />, bg: "bg-blue-50", sub: "Bruto" },
          { label: "Profit Bersih", value: formatRp(report.profit), icon: <TrendingUp size={18} className="text-green-600" />, bg: "bg-green-50", sub: `Margin ${report.margin}%` },
          { label: "Total Transaksi", value: report.totalTransactions.toLocaleString(), icon: <ShoppingCart size={18} className="text-violet-600" />, bg: "bg-violet-50", sub: "Semua channel" },
          { label: "Item Terjual", value: report.totalItems.toLocaleString(), icon: <Package size={18} className="text-orange-500" />, bg: "bg-orange-50", sub: "Unit produk" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 ${kpi.bg} rounded-lg flex items-center justify-center mb-3`}>
              {kpi.icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[
            { key: "summary", label: "Ringkasan" },
            { key: "weekly", label: "Mingguan" },
            { key: "products", label: "Per Produk" },
            { key: "financial", label: "Keuangan" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "summary" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-900 mb-4">Penjualan per Kategori</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                      {categoryBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [formatRp(v), ""]} />
                    <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-gray-900 mb-4">Ringkasan Keuangan</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Revenue", value: formatRp(report.totalRevenue), color: "text-blue-700", bg: "bg-blue-50" },
                    { label: "HPP (Cost of Goods)", value: `-${formatRp(report.totalCost)}`, color: "text-red-600", bg: "bg-red-50" },
                    { label: "Gross Profit", value: formatRp(report.profit), color: "text-green-700", bg: "bg-green-50" },
                    { label: "Gross Margin", value: `${report.margin}%`, color: "text-violet-700", bg: "bg-violet-50" },
                    { label: "Avg. Order Value", value: `Rp ${report.avgOrderValue.toLocaleString()}`, color: "text-gray-700", bg: "bg-gray-50" },
                    { label: "Pelanggan Baru", value: `${report.newCustomers} orang`, color: "text-orange-700", bg: "bg-orange-50" },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${item.bg}`}>
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "weekly" && (
            <div>
              <h3 className="text-gray-900 mb-4">Breakdown Mingguan</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weeklyBreakdown} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                  <Bar yAxisId="left" dataKey="penjualan" name="Revenue" fill="#1E3A8A" radius={[5, 5, 0, 0]} />
                  <Bar yAxisId="right" dataKey="transaksi" name="Transaksi" fill="#93C5FD" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {weeklyBreakdown.map((w) => (
                  <div key={w.week} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">{w.week}</p>
                    <p className="text-base font-bold text-gray-900 mt-1">{formatRp(w.penjualan)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{w.transaksi} transaksi</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <h3 className="text-gray-900 mb-4">Top Produk Terjual</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">#</th>
                      <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Produk</th>
                      <th className="text-left text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide hidden sm:table-cell">Kategori</th>
                      <th className="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Qty</th>
                      <th className="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">Revenue</th>
                      <th className="text-right text-xs font-semibold text-gray-500 pb-3 uppercase tracking-wide">% Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topItems.map((item) => {
                      const pct = ((item.revenue / report.totalRevenue) * 100).toFixed(1);
                      return (
                        <tr key={item.rank} className="hover:bg-gray-50">
                          <td className="py-3 text-sm font-bold text-gray-400">#{item.rank}</td>
                          <td className="py-3 text-sm font-medium text-gray-800">{item.name}</td>
                          <td className="py-3 hidden sm:table-cell">
                            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{item.category}</span>
                          </td>
                          <td className="py-3 text-sm text-gray-600 text-right">{item.qty} unit</td>
                          <td className="py-3 text-sm font-semibold text-gray-800 text-right">{formatRp(item.revenue)}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#1E3A8A" }} />
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
          )}

          {activeTab === "financial" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-900 mb-4">Laporan Laba Rugi</h3>
                <div className="space-y-2">
                  {[
                    { label: "Pendapatan Kotor", value: report.totalRevenue, type: "income", indent: 0 },
                    { label: "Diskon & Retur", value: -2500000, type: "deduction", indent: 1 },
                    { label: "Pendapatan Bersih", value: 92500000, type: "subtotal", indent: 0 },
                    { label: "HPP", value: -report.totalCost, type: "deduction", indent: 0 },
                    { label: "Gross Profit", value: report.profit, type: "subtotal", indent: 0 },
                    { label: "Biaya Operasional", value: -8000000, type: "deduction", indent: 1 },
                    { label: "Biaya Marketing", value: -3500000, type: "deduction", indent: 1 },
                    { label: "Net Profit", value: 26500000, type: "total", indent: 0 },
                  ].map((row) => (
                    <div key={row.label} className={`flex items-center justify-between py-2.5 px-4 rounded-lg ${row.type === "total" ? "font-bold" : row.type === "subtotal" ? "font-semibold" : "font-normal"} ${row.type === "total" ? "bg-blue-50" : row.type === "subtotal" ? "bg-gray-50" : ""}`}
                      style={{ paddingLeft: `${16 + row.indent * 16}px` }}>
                      <span className={`text-sm ${row.type === "total" ? "text-blue-800" : "text-gray-600"}`}>{row.label}</span>
                      <span className={`text-sm ${row.value < 0 ? "text-red-600" : row.type === "total" ? "text-blue-800" : "text-gray-800"}`}>
                        {row.value < 0 ? "-" : ""}Rp {Math.abs(row.value / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 mb-4">Komposisi Biaya</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={[
                    { name: "Revenue", value: report.totalRevenue },
                    { name: "HPP", value: report.totalCost },
                    { name: "Ops & Mktg", value: 11500000 },
                    { name: "Net Profit", value: 26500000 },
                  ]} layout="vertical" barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip formatter={(v: number) => [`Rp ${(v / 1000000).toFixed(1)}M`, ""]} />
                    <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                      {[{ fill: "#1E3A8A" }, { fill: "#ef4444" }, { fill: "#f59e0b" }, { fill: "#22c55e" }].map((c, i) => (
                        <Cell key={i} fill={c.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

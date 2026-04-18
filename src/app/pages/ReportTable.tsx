import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  Eye, FileText, RefreshCcw, Calendar, ArrowUpDown, CheckCircle, Clock, XCircle
} from "lucide-react";

const reportData = [
  { id: "RPT-2026-001", title: "Laporan Penjualan April 2026", type: "Penjualan", period: "Apr 2026", created: "18 Apr 2026", author: "Admin Sistem", status: "completed", total: 95000000, items: 340 },
  { id: "RPT-2026-002", title: "Laporan Stok Q1 2026", type: "Stok", period: "Jan-Mar 2026", created: "01 Apr 2026", author: "Budi Santoso", status: "completed", total: null, items: 1240 },
  { id: "RPT-2026-003", title: "Laporan Penjualan Maret 2026", type: "Penjualan", period: "Mar 2026", created: "01 Apr 2026", author: "Admin Sistem", status: "completed", total: 88000000, items: 312 },
  { id: "RPT-2026-004", title: "Laporan Audit Stok April", type: "Audit", period: "Apr 2026", created: "15 Apr 2026", author: "Dewi Rahayu", status: "processing", total: null, items: 520 },
  { id: "RPT-2026-005", title: "Laporan Profit & Loss Q1", type: "Keuangan", period: "Jan-Mar 2026", created: "05 Apr 2026", author: "Manager Keuangan", status: "completed", total: 156000000, items: null },
  { id: "RPT-2026-006", title: "Laporan Penjualan Februari 2026", type: "Penjualan", period: "Feb 2026", created: "01 Mar 2026", author: "Admin Sistem", status: "completed", total: 72000000, items: 258 },
  { id: "RPT-2026-007", title: "Laporan Retur & Pengembalian", type: "Retur", period: "Q1 2026", created: "02 Apr 2026", author: "Staff Gudang", status: "pending", total: null, items: 28 },
  { id: "RPT-2026-008", title: "Laporan Supplier Performance", type: "Supplier", period: "Q1 2026", created: "03 Apr 2026", author: "Purchasing Team", status: "completed", total: null, items: 15 },
  { id: "RPT-2026-009", title: "Laporan Penjualan Januari 2026", type: "Penjualan", period: "Jan 2026", created: "01 Feb 2026", author: "Admin Sistem", status: "completed", total: 62000000, items: 220 },
  { id: "RPT-2026-010", title: "Laporan Stok Opname Maret", type: "Audit", period: "Mar 2026", created: "31 Mar 2026", author: "Tim Gudang", status: "completed", total: null, items: 1180 },
];

const reportTypes = ["Semua", "Penjualan", "Stok", "Audit", "Keuangan", "Retur", "Supplier"];
const statusOptions = ["Semua", "completed", "processing", "pending"];

const statusConfig: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  completed: { label: "Selesai", class: "bg-green-100 text-green-700", icon: <CheckCircle size={12} /> },
  processing: { label: "Diproses", class: "bg-blue-100 text-blue-700", icon: <Clock size={12} /> },
  pending: { label: "Menunggu", class: "bg-yellow-100 text-yellow-700", icon: <Clock size={12} /> },
};

const typeColors: Record<string, string> = {
  Penjualan: "bg-blue-50 text-blue-700",
  Stok: "bg-violet-50 text-violet-700",
  Audit: "bg-orange-50 text-orange-700",
  Keuangan: "bg-green-50 text-green-700",
  Retur: "bg-red-50 text-red-700",
  Supplier: "bg-teal-50 text-teal-700",
};

export function ReportTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const perPage = 7;

  const filtered = reportData.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "Semua" || r.type === type;
    const matchStatus = status === "Semua" || r.status === status;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Table Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola dan akses semua laporan bisnis</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={14} />
            <span className="hidden sm:inline">Export Semua</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-colors" style={{ background: "#1E3A8A" }}>
            <FileText size={14} />
            <span className="hidden sm:inline">Buat Laporan</span>
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Laporan", value: reportData.length, color: "#1E3A8A", bg: "#EFF6FF" },
          { label: "Selesai", value: reportData.filter((r) => r.status === "completed").length, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Dalam Proses", value: reportData.filter((r) => r.status !== "completed").length, color: "#d97706", bg: "#fffbeb" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              {s.value}
            </div>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari laporan, ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none">
              {reportTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none">
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === "Semua" ? "Semua Status" : statusConfig[s]?.label || s}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <Calendar size={14} className="text-gray-400" />
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border-none outline-none text-sm text-gray-600 bg-transparent w-28" />
              <span className="text-gray-400">—</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border-none outline-none text-sm text-gray-600 bg-transparent w-28" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <p className="text-sm text-gray-500">Ditemukan <strong>{filtered.length}</strong> laporan</p>
          <button onClick={() => { setSearch(""); setType("Semua"); setStatus("Semua"); setDateFrom(""); setDateTo(""); }} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <RefreshCcw size={12} /> Reset Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#F8FAFF" }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID Laporan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Judul</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Tipe</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Periode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Dibuat Oleh</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Tanggal</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Tidak ada laporan ditemukan</p>
                  </td>
                </tr>
              ) : (
                paginated.map((rpt) => (
                  <tr key={rpt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500 whitespace-nowrap">{rpt.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{rpt.title}</p>
                      {rpt.total && (
                        <p className="text-xs text-gray-400 mt-0.5">Total: Rp {(rpt.total / 1000000).toFixed(0)}M • {rpt.items} item</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${typeColors[rpt.type] || "bg-gray-100 text-gray-600"}`}>{rpt.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell whitespace-nowrap">{rpt.period}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{rpt.author}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell whitespace-nowrap">{rpt.created}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[rpt.status]?.class}`}>
                        {statusConfig[rpt.status]?.icon}
                        {statusConfig[rpt.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate("/report/detail")}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Download">
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Halaman <strong>{page}</strong> dari <strong>{totalPages || 1}</strong>
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? "text-white" : "text-gray-500 hover:bg-gray-50 border border-gray-200"}`}
                style={p === page ? { background: "#1E3A8A" } : {}}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

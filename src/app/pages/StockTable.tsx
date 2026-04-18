import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight,
  ArrowUpDown, Eye, Pencil, Trash2, Download, RefreshCcw, Package
} from "lucide-react";

const stockData = [
  { id: "STK-001", name: "iPhone 15 Pro 256GB", sku: "APL-IPH15P-256", category: "Elektronik", stock: 45, min: 10, price: 14999000, status: "available", updated: "18 Apr 2026" },
  { id: "STK-002", name: "Samsung Galaxy S24 Ultra", sku: "SMS-GS24U-512", category: "Elektronik", stock: 28, min: 10, price: 17999000, status: "available", updated: "18 Apr 2026" },
  { id: "STK-003", name: "MacBook Air M3 13\"", sku: "APL-MBA-M3-13", category: "Elektronik", stock: 3, min: 10, price: 22500000, status: "low", updated: "17 Apr 2026" },
  { id: "STK-004", name: "Kemeja Oxford Premium", sku: "CLT-KMJ-OXF-M", category: "Pakaian", stock: 120, min: 30, price: 120000, status: "available", updated: "17 Apr 2026" },
  { id: "STK-005", name: "Sofa L-Shape Minimalis", sku: "FRN-SFA-L-GRY", category: "Furniture", stock: 2, min: 5, price: 8500000, status: "low", updated: "16 Apr 2026" },
  { id: "STK-006", name: "Serum Vitamin C 30ml", sku: "CSM-SRM-VTC-30", category: "Kosmetik", stock: 85, min: 20, price: 150000, status: "available", updated: "16 Apr 2026" },
  { id: "STK-007", name: "Laptop ASUS ROG G16", sku: "ASUS-ROG-G16-I9", category: "Elektronik", stock: 0, min: 5, price: 38000000, status: "empty", updated: "15 Apr 2026" },
  { id: "STK-008", name: "Celana Jeans Slim Fit", sku: "CLT-JNS-SLM-32", category: "Pakaian", stock: 67, min: 20, price: 250000, status: "available", updated: "15 Apr 2026" },
  { id: "STK-009", name: "Kulkas Samsung 2 Pintu", sku: "SMS-KLK-2P-350", category: "Elektronik", stock: 12, min: 5, price: 7500000, status: "available", updated: "14 Apr 2026" },
  { id: "STK-010", name: "Parfum Chanel No. 5", sku: "CSM-PRF-CNL-50", category: "Kosmetik", stock: 8, min: 20, price: 1800000, status: "low", updated: "14 Apr 2026" },
  { id: "STK-011", name: "Meja Kerja Kayu Jati", sku: "FRN-MJA-KYJ-120", category: "Furniture", stock: 15, min: 5, price: 3200000, status: "available", updated: "13 Apr 2026" },
  { id: "STK-012", name: "AirPods Pro 2nd Gen", sku: "APL-APP-2G-WHT", category: "Elektronik", stock: 32, min: 15, price: 4200000, status: "available", updated: "13 Apr 2026" },
];

const categories = ["Semua", "Elektronik", "Pakaian", "Furniture", "Kosmetik"];
const statusOptions = ["Semua", "available", "low", "empty"];

const statusConfig: Record<string, { label: string; class: string }> = {
  available: { label: "Tersedia", class: "bg-green-100 text-green-700" },
  low: { label: "Menipis", class: "bg-yellow-100 text-yellow-700" },
  empty: { label: "Habis", class: "bg-red-100 text-red-700" },
};

export function StockTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const perPage = 8;

  const filtered = stockData
    .filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Semua" || item.category === category;
      const matchStatus = status === "Semua" || item.status === status;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];
      if (typeof aVal === "number" && typeof bVal === "number") return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Table Stock</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola dan pantau semua data stok produk</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-colors hover:opacity-90" style={{ background: "#1E3A8A" }}>
            <Plus size={14} />
            <span className="hidden sm:inline">Tambah Stok</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk, SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400 flex-shrink-0" />
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white text-gray-700"
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white text-gray-700"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s === "Semua" ? "Semua Status" : statusConfig[s]?.label || s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <p className="text-sm text-gray-500">Menampilkan <strong>{filtered.length}</strong> dari <strong>{stockData.length}</strong> produk</p>
          <button onClick={() => { setSearch(""); setCategory("Semua"); setStatus("Semua"); }} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <RefreshCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#F8FAFF" }}>
              <tr>
                {[
                  { key: "id", label: "ID" },
                  { key: "name", label: "Nama Produk" },
                  { key: "category", label: "Kategori" },
                  { key: "stock", label: "Stok" },
                  { key: "price", label: "Harga" },
                  { key: "status", label: "Status" },
                  { key: "updated", label: "Update" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <ArrowUpDown size={11} className="text-gray-300" />
                    </div>
                  </th>
                ))}
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Package size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Tidak ada data ditemukan</p>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{item.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sku}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${item.stock === 0 ? "text-red-600" : item.stock < item.min ? "text-yellow-600" : "text-gray-800"}`}>
                          {item.stock}
                        </span>
                        <span className="text-xs text-gray-400">/ min {item.min}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[item.status]?.class}`}>
                        {statusConfig[item.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{item.updated}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate("/stock/detail")}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Hapus">
                          <Trash2 size={14} />
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
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? "text-white" : "text-gray-500 hover:bg-gray-50 border border-gray-200"}`}
                style={p === page ? { background: "#1E3A8A" } : {}}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

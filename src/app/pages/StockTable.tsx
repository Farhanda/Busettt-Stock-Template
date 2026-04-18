import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight,
  ArrowUpDown, Eye, Pencil, Trash2, Download, RefreshCcw, Package
} from "lucide-react";

const stockData = [
  { id: "STK-001", name: "Ayam Broiler Siap Potong (per ekor)", sku: "AYM-BRL-SP-1", category: "Ayam Potong", stock: 150, min: 50, price: 35000, status: "available", updated: "18 Apr 2026" },
  { id: "STK-002", name: "Ayam Kampung Premium (per ekor)", sku: "AYM-KPG-PM-1", category: "Ayam Hidup", stock: 85, min: 20, price: 65000, status: "available", updated: "18 Apr 2026" },
  { id: "STK-003", name: "Telur Ayam Segar (per karton 30pc)", sku: "TLR-AYM-SF-30", category: "Telur", stock: 12, min: 10, price: 45000, status: "low", updated: "17 Apr 2026" },
  { id: "STK-004", name: "Ayam Jawa Super (per ekor)", sku: "AYM-JWS-SP-1", category: "Ayam Hidup", stock: 220, min: 50, price: 55000, status: "available", updated: "17 Apr 2026" },
  { id: "STK-005", name: "Daging Ayam Fillet (per kg)", sku: "DGG-AYM-FLT-1", category: "Hasil Olahan", stock: 25, min: 10, price: 75000, status: "available", updated: "16 Apr 2026" },
  { id: "STK-006", name: "Telur Asin (per karton 20pc)", sku: "TLR-ASN-20", category: "Hasil Olahan", stock: 45, min: 15, price: 55000, status: "available", updated: "16 Apr 2026" },
  { id: "STK-007", name: "Ayam Broiler Bibit (per ekor)", sku: "AYM-BRL-BT-1", category: "Ayam Bibit", stock: 0, min: 30, price: 25000, status: "empty", updated: "15 Apr 2026" },
  { id: "STK-008", name: "Daging Ayam Boneless 500g", sku: "DGG-AYM-BLS-500", category: "Hasil Olahan", stock: 120, min: 30, price: 42000, status: "available", updated: "15 Apr 2026" },
  { id: "STK-009", name: "Ayam Goreng Siap Jual (per ekor)", sku: "AYM-GRG-SJ-1", category: "Hasil Olahan", stock: 30, min: 15, price: 45000, status: "available", updated: "14 Apr 2026" },
  { id: "STK-010", name: "Telur Omega 3 (per karton 30pc)", sku: "TLR-OMG3-30", category: "Telur", stock: 8, min: 20, price: 65000, status: "low", updated: "14 Apr 2026" },
  { id: "STK-011", name: "Kulit Ayam Goreng (per kg)", sku: "KLT-AYM-GRG-1", category: "Hasil Olahan", stock: 50, min: 10, price: 28000, status: "available", updated: "13 Apr 2026" },
  { id: "STK-012", name: "Ayam Petelur Afkir (per ekor)", sku: "AYM-PTL-AFR-1", category: "Ayam Hidup", stock: 75, min: 20, price: 22000, status: "available", updated: "13 Apr 2026" },
];

const categories = ["Semua", "Ayam Potong", "Ayam Hidup", "Telur", "Hasil Olahan", "Ayam Bibit"];
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
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: "", itemName: "" });
  const [deleting, setDeleting] = useState(false);
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

  const handleOpenDeleteModal = (itemId: string, itemName: string) => {
    setDeleteModal({ isOpen: true, itemId, itemName });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, itemId: "", itemName: "" });
  };

  const handleConfirmDelete = () => {
    setDeleting(true);
    // Simulate API call
    setTimeout(() => {
      setDeleting(false);
      handleCloseDeleteModal();
      // In real app, update the list here
    }, 1000);
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
          <button 
            onClick={() => navigate("/stock/add")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition-colors hover:opacity-90" 
            style={{ background: "#1E3A8A" }}>
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
                        <button 
                          onClick={() => navigate(`/stock/edit?id=${item.id}`)}
                          className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors" 
                          title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(item.id, item.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" 
                          title="Hapus">
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

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
              <Trash2 size={24} className="text-red-600" />
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Hapus Produk?</h2>
              <p className="text-sm text-gray-600">
                Anda yakin ingin menghapus <strong>{deleteModal.itemName}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "#DC2626" }}
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

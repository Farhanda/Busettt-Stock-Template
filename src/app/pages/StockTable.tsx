import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight,
  ArrowUpDown, Eye, Pencil, Trash2, Download, RefreshCcw, Package
} from "lucide-react";
import stockData from "../assets/data/stock_data.json";
import stockMovement from "../assets/data/stock_movement.json";
import * as XLSX from 'xlsx';
import { Modal } from "../components/ui/modal";
import { useIsMobile } from "../components/ui/use-mobile";

const categories = ["Semua", "Ayam Potong", "Ayam Hidup", "Telur", "Hasil Olahan", "Ayam Bibit"];
const statusOptions = ["Semua", "available", "low", "empty"];

const statusConfig: Record<string, { label: string; class: string }> = {
  available: { label: "Tersedia", class: "bg-green-100 text-green-700" },
  low: { label: "Menipis", class: "bg-yellow-100 text-yellow-700" },
  empty: { label: "Habis", class: "bg-red-100 text-red-700" },
};

export function StockTable() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: "", itemName: "" });
  const [deleting, setDeleting] = useState(false);
  const perPage = 8;
  // 1. Initialize state with an empty array or the imported JSON
  const [stocks, setStocks] = useState(stockData); 

  // 2. Optional: Load from LocalStorage to see "Add" or "Edit" changes
  useEffect(() => {
    const savedData = localStorage.getItem("stock_db");
    const savedMovements = localStorage.getItem("movements_db");
    if (savedData) {
      setStocks(JSON.parse(savedData));
    } else {
      // If no local data exists, save the initial JSON to LocalStorage for future use
      localStorage.setItem("stock_db", JSON.stringify(stockData));
    }
    if (!savedMovements) {
      localStorage.setItem("movements_db", JSON.stringify(stockMovement));
    }
  }, []);

  const filtered = stocks
    .filter((item) => {
      // const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
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
    const updated = stocks.filter(s => s.id !== deleteModal.itemId);
    localStorage.setItem("stock_db", JSON.stringify(updated));
    
    setTimeout(() => {
      setStocks(updated);
      setDeleting(false);
      handleCloseDeleteModal();
    }, 1000);
  };

  const handleExport = () => {
    // 1. Prepare data for export (using the 'filtered' list ensures exports match what users see)
    const exportData = filtered.map(item => ({
      'ID': item.id,
      'Nama Produk': item.name,
      'SKU': item.sku,
      'Kategori': item.category,
      'Stok Saat Ini': item.stock,
      'Stok Minimum': item.minStock,
      'Harga (Rp)': item.price,
      'Status': statusConfig[item.status]?.label || item.status,
      'Update Terakhir': item.updated
    }));

    // 2. Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    // 3. Set column widths for better readability
    const wscols = [
      { wch: 12 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, 
      { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 15 }
    ];
    worksheet['!cols'] = wscols;

    // 4. Trigger download
    XLSX.writeFile(workbook, `Stock_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} justify-between`}>
        <div className={`flex flex-col text-gray-900`}>
          <h1 className="text-gray-900">Table Stock</h1>
          <p className={`text-sm text-gray-500 mt-0.5 ${isMobile ? 'mb-2' : 'mb-1'}`}>Kelola dan pantau semua data stok produk</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
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
        <div className="custom-scrollbar overflow-x-auto">
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
                        <span className={`text-sm font-semibold ${item.stock === 0 ? "text-red-600" : item.stock < item.minStock ? "text-yellow-600" : "text-gray-800"}`}>
                          {item.stock}
                        </span>
                        <span className="text-xs text-gray-400">/ min {item.minStock}</span>
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
                          onClick={() => navigate(`/stock/detail?id=${item.id}`)}
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
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={handleCloseDeleteModal}
          title="Konfirmasi Hapus"
          size="sm"
          footer={
            <>
              <button 
                onClick={handleCloseDeleteModal} 
                className="px-4 py-2 text-gray-600 font-medium"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
              >
                Ya, Hapus
              </button>
            </>
          }
        >
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus <strong>{deleteModal.itemName}</strong>?
          </p>
        </Modal>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, Package, AlertCircle, CheckCircle,
  Save, X
} from "lucide-react";

const categories = ["Ayam Potong", "Ayam Hidup", "Ayam Bibit", "Telur", "Hasil Olahan"];

// Sample stock data - dalam aplikasi sesungguhnya, ini akan dari API/database
const stockData = [
  { id: "STK-001", name: "Ayam Broiler Siap Potong (per ekor)", sku: "AYM-BRL-SP-1", category: "Ayam Potong", brand: "Ayam Lokal", stock: 150, min: 50, price: 35000, buyPrice: 28000, status: "available", location: "Kandang A-01", supplier: "PT. Peternakan Maju", weight: "1.8kg", dimension: "30x25x20 cm", description: "Ayam broiler berkualitas tinggi, siap untuk dijual potong. Berusia 5 minggu, berat ideal 1.8-2kg per ekor." },
  { id: "STK-002", name: "Ayam Kampung Premium (per ekor)", sku: "AYM-KPG-PM-1", category: "Ayam Hidup", brand: "Kampung Grade A", stock: 85, min: 20, price: 65000, buyPrice: 50000, status: "available", location: "Kandang B-02", supplier: "Peternak Kampung Jaya", weight: "1.5kg", dimension: "28x22x18 cm", description: "Ayam kampung asli dengan daging yang lebih padat dan berasa. Sangat cocok untuk pemasakan tradisional." },
  { id: "STK-003", name: "Telur Ayam Segar (per karton 30pc)", sku: "TLR-AYM-SF-30", category: "Telur", brand: "Telur Organik", stock: 12, min: 10, price: 45000, buyPrice: 36000, status: "low", location: "Chiller B-01", supplier: "Farm Fresh Indonesia", weight: "1.5kg/karton", dimension: "35x25x10 cm", description: "Telur ayam segar 100% organik, tanpa tambahan bahan kimia. Langsung dari kandang ke meja Anda." },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  available: { label: "Tersedia", class: "bg-green-100 text-green-700" },
  low: { label: "Menipis", class: "bg-yellow-100 text-yellow-700" },
  empty: { label: "Habis", class: "bg-red-100 text-red-700" },
};

export function EditStock() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stockId = searchParams.get("id");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    quantity: "",
    minStock: "",
    price: "",
    buyPrice: "",
    location: "",
    supplier: "",
    description: "",
    weight: "",
    dimension: "",
  });

  // Inside EditStock component
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    // Load the full list from localStorage
    const savedData = localStorage.getItem("stock_db");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setStocks(parsedData);
      
      // Find the specific item to populate the form
      const item = parsedData.find((s: any) => s.id === stockId);
      if (item) {
        setForm({
          name: item.name,
          sku: item.sku,
          category: item.category,
          brand: item.brand || "",
          quantity: item.stock.toString(),
          minStock: item.minStock.toString(),
          price: item.price.toString(),
          buyPrice: item.buyPrice.toString(),
          location: item.location || "",
          supplier: item.supplier || "",
          description: item.description || "",
          weight: item.weight || "",
          dimension: item.dimension || "",
        });
      }
    }
  }, [stockId]);
  
  // Find the stock data
  const stockItem = stocks.find(item => item.id === stockId);

  // Determine status based on stock quantity
  const getStatus = (qty: number, min: number) => {
    if (qty === 0) return "empty";
    if (qty < min) return "low";
    return "available";
  };

  const currentStatus = getStatus(parseInt(form.quantity), parseInt(form.minStock));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Nama produk tidak boleh kosong";
    if (!form.sku.trim()) newErrors.sku = "SKU tidak boleh kosong";
    if (!form.category) newErrors.category = "Kategori harus dipilih";
    if (!form.quantity) newErrors.quantity = "Jumlah stok tidak boleh kosong";
    if (parseInt(form.quantity) < 0) newErrors.quantity = "Jumlah stok tidak boleh negatif";
    if (!form.minStock) newErrors.minStock = "Stok minimum harus diisi";
    if (parseInt(form.minStock) < 0) newErrors.minStock = "Stok minimum tidak boleh negatif";
    if (!form.price) newErrors.price = "Harga jual tidak boleh kosong";
    if (parseInt(form.price) < 0) newErrors.price = "Harga jual tidak boleh negatif";
    if (!form.buyPrice) newErrors.buyPrice = "Harga beli tidak boleh kosong";
    if (parseInt(form.buyPrice) < 0) newErrors.buyPrice = "Harga beli tidak boleh negatif";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // 1. Get current DB
    const existingData = JSON.parse(localStorage.getItem("stock_db") || "[]");

    // 2. Map and Update the specific ID
    const updatedData = existingData.map((item: any) => {
      if (item.id === stockId) {
        return {
          ...item,
          ...form,
          stock: parseInt(form.quantity),
          updated: new Date().toLocaleDateString('id-ID'),
          status: parseInt(form.quantity) === 0 ? "empty" : 
                  parseInt(form.quantity) < parseInt(form.minStock) ? "low" : "available"
        };
      }
      return item;
    });

    // 3. Save back to "JSON"
    localStorage.setItem("stock_db", JSON.stringify(updatedData));

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/stock/table"), 1500);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Perubahan Berhasil Disimpan!</h2>
          <p className="text-gray-500">Data produk telah diperbarui. Anda akan dikembalikan ke daftar stok...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/stock/table")}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-gray-900">Edit Stok Produk</h1>
            <p className="text-sm text-gray-500 mt-0.5">Perbarui informasi produk yang ada</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusConfig[currentStatus].class}`}>
            {statusConfig[currentStatus].label}
          </span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Informasi Dasar */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-blue-600" />
              Informasi Dasar Produk
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nama Produk */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Ayam Broiler Siap Potong (per ekor)"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Contoh: AYM-BRL-SP-1"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.sku
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200"
                  }`}
                />
                {errors.sku && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.sku}
                  </p>
                )}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.category
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200"
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.category}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Contoh: PT. Peternakan Maju"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Produk</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi lengkap produk..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Section 2: Informasi Stok & Harga */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Stok & Harga</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Jumlah Stok */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Stok (Unit) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.quantity
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200"
                  }`}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.quantity}
                  </p>
                )}
              </div>

              {/* Stok Minimum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Minimum (Unit) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={form.minStock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.minStock
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200"
                  }`}
                />
                {errors.minStock && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.minStock}
                  </p>
                )}
              </div>

              {/* Harga Jual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Jual (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.price
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.price}
                  </p>
                )}
              </div>

              {/* Harga Beli */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Beli (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="buyPrice"
                  value={form.buyPrice}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.buyPrice
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-blue-200"
                  }`}
                />
                {errors.buyPrice && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.buyPrice}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Section 3: Informasi Tambahan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Rak/Gudang</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Contoh: Kandang A-03"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  placeholder="Contoh: PT. Apple Indonesia"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Berat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat</label>
                <input
                  type="text"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="Contoh: 1.8kg"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              {/* Dimensi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensi</label>
                <input
                  type="text"
                  name="dimension"
                  value={form.dimension}
                  onChange={handleChange}
                  placeholder="Contoh: 30 x 25 x 20 cm"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/stock/table")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <X size={16} />
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all shadow-lg hover:opacity-90 disabled:opacity-70"
              style={{ background: "#1E3A8A" }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

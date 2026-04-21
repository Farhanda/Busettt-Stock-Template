import { useState } from "react";
import {
  Search, Plus, Edit2, Trash2, Shield, ShieldCheck, User,
  Mail, Phone, Calendar, ChevronLeft, ChevronRight,
  MoreVertical, Lock, UserCheck, UserX, Eye, Download,
  RefreshCcw
} from "lucide-react";

const usersData = [
  { id: "USR-001", name: "Ahmad Fauzi", email: "ahmad.fauzi@stock.id", phone: "+62 811-2345-6789", role: "admin", status: "active", lastLogin: "18 Apr 2026, 08:30", created: "01 Jan 2026", avatar: "AF", division: "IT" },
  { id: "USR-002", name: "Budi Santoso", email: "budi.santoso@stock.id", phone: "+62 812-3456-7890", role: "manager", status: "active", lastLogin: "18 Apr 2026, 09:15", created: "15 Jan 2026", avatar: "BS", division: "Operasional" },
  { id: "USR-003", name: "Dewi Rahayu", email: "dewi.rahayu@stock.id", phone: "+62 813-4567-8901", role: "staff", status: "active", lastLogin: "17 Apr 2026, 14:20", created: "20 Jan 2026", avatar: "DR", division: "Gudang" },
  { id: "USR-004", name: "Eko Prasetyo", email: "eko.prasetyo@stock.id", phone: "+62 814-5678-9012", role: "sales", status: "active", lastLogin: "18 Apr 2026, 11:00", created: "01 Feb 2026", avatar: "EP", division: "Sales" },
  { id: "USR-005", name: "Fitria Sari", email: "fitria.sari@stock.id", phone: "+62 815-6789-0123", role: "staff", status: "inactive", lastLogin: "10 Apr 2026, 16:45", created: "05 Feb 2026", avatar: "FS", division: "Gudang" },
  { id: "USR-006", name: "Gilang Ramadhan", email: "gilang@stock.id", phone: "+62 816-7890-1234", role: "manager", status: "active", lastLogin: "18 Apr 2026, 07:55", created: "10 Feb 2026", avatar: "GR", division: "Keuangan" },
  { id: "USR-007", name: "Hani Putri", email: "hani.putri@stock.id", phone: "+62 817-8901-2345", role: "sales", status: "active", lastLogin: "17 Apr 2026, 20:10", created: "15 Feb 2026", avatar: "HP", division: "Sales" },
  { id: "USR-008", name: "Irwan Kusuma", email: "irwan@stock.id", phone: "+62 818-9012-3456", role: "staff", status: "suspended", lastLogin: "01 Mar 2026, 10:30", created: "01 Mar 2026", avatar: "IK", division: "Gudang" },
];

const roles = [
  { value: "admin", label: "Admin", color: "bg-red-100 text-red-700", icon: <ShieldCheck size={12} /> },
  { value: "manager", label: "Manager", color: "bg-blue-100 text-blue-700", icon: <Shield size={12} /> },
  { value: "staff", label: "Staff", color: "bg-gray-100 text-gray-700", icon: <User size={12} /> },
  { value: "sales", label: "Sales", color: "bg-green-100 text-green-700", icon: <User size={12} /> },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Aktif", class: "bg-green-100 text-green-700" },
  inactive: { label: "Tidak Aktif", class: "bg-gray-100 text-gray-500" },
  suspended: { label: "Ditangguhkan", class: "bg-red-100 text-red-600" },
};

const avatarColors = ["#1E3A8A", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2", "#EA580C", "#6D28D9"];

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const perPage = 6;

  const filtered = usersData.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Semua" || u.role === roleFilter;
    const matchStatus = statusFilter === "Semua" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const getRoleConfig = (role: string) => roles.find((r) => r.value === role);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola akun dan hak akses pengguna sistem</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-colors"
            style={{ background: "#1E3A8A" }}
          >
            <Plus size={14} />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {roles.map((role) => {
          const count = usersData.filter((u) => u.role === role.value).length;
          return (
            <div key={role.value} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className={`w-9 h-9 ${role.color} rounded-lg flex items-center justify-center mb-3`}>
                {role.icon}
              </div>
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500 mt-0.5">{role.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email pengguna..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none">
              <option value="Semua">Semua Role</option>
              {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none">
              <option value="Semua">Semua Status</option>
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <p className="text-sm text-gray-500">Menampilkan <strong>{filtered.length}</strong> pengguna</p>
          <button onClick={() => { setSearch(""); setRoleFilter("Semua"); setStatusFilter("Semua"); }} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <RefreshCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "#F8FAFF" }}>
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pengguna</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Kontak</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Divisi</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Login Terakhir</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <User size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Tidak ada pengguna ditemukan</p>
                  </td>
                </tr>
              ) : (
                paginated.map((user, idx) => {
                  const roleConf = getRoleConfig(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: avatarColors[idx % avatarColors.length] }}>
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{user.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${roleConf?.color}`}>
                          {roleConf?.icon}
                          {roleConf?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{user.division}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[user.status]?.class}`}>
                          {statusConfig[user.status]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell whitespace-nowrap">{user.lastLogin}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Lihat Detail">
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors" title="Reset Password">
                            <Lock size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Hapus">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Halaman <strong>{page}</strong> dari <strong>{totalPages || 1}</strong></p>
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

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Tambah Pengguna Baru</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                ✕
              </button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Nama pengguna" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" placeholder="email@stock.id" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" placeholder="+62 812-xxxx-xxxx" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none">
                    {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Divisi</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none">
                    {["IT", "Operasional", "Gudang", "Sales", "Keuangan"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Sementara</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" placeholder="Min. 8 karakter" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" required minLength={8} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-colors" style={{ background: "#1E3A8A" }}>
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

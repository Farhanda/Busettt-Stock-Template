import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ChevronDown,
  ChevronRight,
  BarChart2,
  TrendingUp,
  FileText,
  Users,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronLeft,
  Table2,
  Eye,
  LineChart,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; icon: React.ReactNode; path: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    path: "/dashboard",
  },
  {
    label: "Stock",
    icon: <Package size={18} />,
    children: [
      { label: "Table Stock", icon: <Table2 size={16} />, path: "/stock/table" },
      { label: "Detail Stock", icon: <Eye size={16} />, path: "/stock/detail" },
      { label: "Stock Chart", icon: <BarChart2 size={16} />, path: "/stock/chart" },
    ],
  },
  {
    label: "Selling Chart",
    icon: <TrendingUp size={18} />,
    path: "/selling-chart",
  },
  {
    label: "Report",
    icon: <FileText size={18} />,
    children: [
      { label: "Table Report", icon: <Table2 size={16} />, path: "/report/table" },
      { label: "Detail Report", icon: <Eye size={16} />, path: "/report/detail" },
    ],
  },
  {
    label: "User Management",
    icon: <Users size={18} />,
    path: "/users",
  },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Stock: true,
    Report: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || (path === "/dashboard" && location.pathname === "/");
  };

  const isParentActive = (children?: { path: string }[]) => {
    return children?.some((c) => location.pathname === c.path) ?? false;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#3B82F6" }}>
          <Package size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-white text-sm font-semibold leading-none">StockManager</p>
            <p className="text-blue-300 text-xs mt-0.5">v2.0 Pro</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => (
          <div key={item.label} className="mb-1">
            {item.path ? (
              <button
                onClick={() => navigate(item.path!)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  isActive(item.path)
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            ) : (
              <>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                    isParentActive(item.children)
                      ? "bg-white/10 text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <span className="text-blue-300">
                        {openMenus[item.label] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    </>
                  )}
                </button>
                {sidebarOpen && openMenus[item.label] && (
                  <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-1">
                    {item.children?.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => navigate(child.path)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-sm ${
                          isActive(child.path)
                            ? "bg-blue-500 text-white"
                            : "text-blue-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {child.icon}
                        <span className="truncate">{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10">
        {sidebarOpen && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-900" style={{ background: "#93C5FD" }}>
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Admin User</p>
              <p className="text-blue-300 text-xs truncate">admin@stock.id</p>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-all text-sm"
        >
          <LogOut size={16} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}
        style={{ background: "#1E3A8A" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col z-10" style={{ background: "#1E3A8A" }}>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                setMobileSidebarOpen(!mobileSidebarOpen);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none text-sm text-gray-600 w-full placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#3B82F6" }} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings size={18} className="text-gray-500" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1E3A8A" }}>
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700 leading-none">Admin</p>
                <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

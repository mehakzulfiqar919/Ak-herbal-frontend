import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-parchment">
      <aside className="w-56 bg-bark text-parchment flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-parchment/10">
          <h1 className="font-display text-xl">AK Herbal</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-parchment/40 mt-1">
            Admin
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-body transition-colors ${
                  isActive
                    ? "bg-turmeric/20 text-turmeric"
                    : "text-parchment/70 hover:bg-parchment/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-parchment/10">
          <p className="font-body text-xs text-parchment/40 mb-2 truncate">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="text-sm font-body text-parchment/70 hover:text-turmeric"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

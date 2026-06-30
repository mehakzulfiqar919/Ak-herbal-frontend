import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, pendingRes] = await Promise.all([
          api.get("/products/admin/all"),
          api.get("/orders", { params: { limit: 5 } }),
          api.get("/orders", { params: { status: "pending", limit: 1 } }),
        ]);

        const allOrders = ordersRes.data.orders;
        const revenue = allOrders.reduce((sum, o) => sum + o.grandTotal, 0);

        setStats({
          totalProducts: productsRes.data.length,
          totalOrders: ordersRes.data.total,
          pendingOrders: pendingRes.data.total,
          revenue,
        });
        setRecentOrders(allOrders);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Recent Revenue", value: `Rs ${stats.revenue}` },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-bark mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="border border-bark/10 rounded-2xl p-5 bg-white/50">
            <span className="font-mono text-xs uppercase tracking-wide text-bark/40">
              {card.label}
            </span>
            <p className="font-display text-2xl text-bark mt-2">
              {loading ? "—" : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-bark">Recent Orders</h2>
        <Link to="/admin/orders" className="text-sm text-leaf hover:underline font-body">
          View all →
        </Link>
      </div>

      <div className="border border-bark/10 rounded-2xl overflow-x-auto bg-white/50">
        <table className="w-full text-sm">
          <thead className="bg-bark/5 text-bark/50 font-body text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3">Order #</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-bark/40 font-body">
                  Loading...
                </td>
              </tr>
            ) : recentOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-bark/40 font-body">
                  No orders yet
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order._id} className="border-t border-bark/5">
                  <td className="px-5 py-3 font-mono">
                    <Link to={`/admin/orders/${order._id}`} className="text-leaf hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-body">{order.customer?.name}</td>
                  <td className="px-5 py-3 font-body capitalize">{order.orderStatus}</td>
                  <td className="px-5 py-3 font-mono text-right">Rs {order.grandTotal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

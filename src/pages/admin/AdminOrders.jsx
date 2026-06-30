import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/orders", {
          params: statusFilter ? { status: statusFilter } : {},
        });
        setOrders(data.orders);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-bark">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-bark/20 rounded-full px-4 py-2 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-bark/10 rounded-2xl overflow-x-auto bg-white/50">
        <table className="w-full text-sm">
          <thead className="bg-bark/5 text-bark/50 font-body text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3">Order #</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Phone</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-bark/40 font-body">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-bark/40 font-body">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t border-bark/5">
                  <td className="px-5 py-3 font-mono">
                    <Link to={`/admin/orders/${order._id}`} className="text-leaf hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-body text-bark">{order.customer?.name}</td>
                  <td className="px-5 py-3 font-mono text-bark/60">{order.customer?.phone}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-body px-2.5 py-1 rounded-full bg-leaf/10 text-leaf-600 capitalize">
                      {order.orderStatus}
                    </span>
                  </td>
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

export default AdminOrders;

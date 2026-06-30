import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { orderStatus: newStatus });
      setOrder(data);
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const buildWhatsAppLink = () => {
    if (!order) return "#";
    const phone = order.customer.phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hi ${order.customer.name}, this is AK Herbal Products regarding your order #${order.orderNumber}.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  if (loading) {
    return <div className="p-8 font-body text-bark/40">Loading...</div>;
  }

  if (!order) {
    return <div className="p-8 font-body text-bark/40">Order not found.</div>;
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/admin/orders" className="text-sm text-leaf hover:underline font-body">
        ← Back to Orders
      </Link>

      <div className="flex items-center justify-between mt-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-bark">{order.orderNumber}</h1>
          <p className="font-body text-sm text-bark/50">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-leaf text-parchment px-5 py-2.5 rounded-full text-sm font-body hover:bg-leaf-600 transition-colors"
        >
          Message on WhatsApp
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="border border-bark/10 rounded-2xl p-5 bg-white/50">
          <h2 className="font-display text-base text-bark mb-3">Customer</h2>
          <p className="font-body text-sm text-bark/70">{order.customer.name}</p>
          <p className="font-mono text-sm text-bark/70">{order.customer.phone}</p>
          {order.customer.email && (
            <p className="font-body text-sm text-bark/70">{order.customer.email}</p>
          )}
        </div>
        <div className="border border-bark/10 rounded-2xl p-5 bg-white/50">
          <h2 className="font-display text-base text-bark mb-3">Shipping Address</h2>
          <p className="font-body text-sm text-bark/70">
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
          </p>
          <p className="font-body text-sm text-bark/70">
            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
            {order.shippingAddress.pincode}
          </p>
        </div>
      </div>

      <div className="border border-bark/10 rounded-2xl p-5 bg-white/50 mb-6">
        <h2 className="font-display text-base text-bark mb-3">Order Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={updating}
              className={`text-xs font-body px-3 py-1.5 rounded-full capitalize transition-colors ${
                order.orderStatus === status
                  ? "bg-leaf text-parchment"
                  : "border border-bark/20 text-bark/60 hover:border-leaf"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-bark/10 rounded-2xl p-5 bg-white/50">
        <h2 className="font-display text-base text-bark mb-3">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm font-body">
              <span className="text-bark/70">
                {item.name} × {item.quantity}
              </span>
              <span className="font-mono">Rs {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-bark/10 mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-sm font-body text-bark/60">
            <span>Subtotal</span>
            <span className="font-mono">Rs {order.itemsTotal}</span>
          </div>
          <div className="flex justify-between text-sm font-body text-bark/60">
            <span>Shipping</span>
            <span className="font-mono">{order.shippingFee === 0 ? "Free" : `Rs ${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between font-display text-lg text-bark pt-2">
            <span>Total</span>
            <span className="font-mono">Rs {order.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;

import { useState } from "react";
import api from "../services/api";

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const STATUS_LABELS = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${orderNumber.trim()}`);
      setOrder(data);
    } catch (err) {
      setError("We couldn't find an order with that number. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-bark mb-2">Track Your Order</h1>
      <p className="font-body text-bark/60 mb-8">
        Enter the order number you received at checkout.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. AKH12345678"
          className="flex-1 border border-bark/20 rounded-full px-5 py-3 text-sm font-mono bg-white/60 focus:outline-none focus:border-leaf"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-leaf text-parchment px-7 py-3 rounded-full font-body text-sm hover:bg-leaf-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && <p className="font-body text-sm text-clay mt-4">{error}</p>}

      {order && (
        <div className="mt-10 border border-bark/10 rounded-2xl p-6 bg-white/50">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wide text-bark/40">
                Order
              </span>
              <p className="font-mono text-base text-bark">{order.orderNumber}</p>
            </div>
            <span className="font-body text-xs px-3 py-1 rounded-full bg-leaf/10 text-leaf-600">
              {STATUS_LABELS[order.orderStatus]}
            </span>
          </div>

          {order.orderStatus !== "cancelled" && (
            <div className="flex items-center mb-8">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      i <= currentStepIndex ? "bg-leaf" : "bg-bark/15"
                    }`}
                  />
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-px flex-1 ${
                        i < currentStepIndex ? "bg-leaf" : "bg-bark/15"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 border-t border-bark/10 pt-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm font-body">
                <span className="text-bark/70">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono">Rs {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-display text-lg text-bark border-t border-bark/10 pt-4 mt-4">
            <span>Total</span>
            <span className="font-mono">Rs {order.grandTotal}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;

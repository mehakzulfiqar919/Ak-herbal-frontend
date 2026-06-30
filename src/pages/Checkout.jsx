import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-bark">Your cart is empty</h1>
        <Link to="/shop" className="inline-block mt-6 text-leaf hover:underline font-body text-sm">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.addressLine1 || !form.city || !form.state) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer: { name: form.name, phone: form.phone, email: form.email },
        shippingAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        items: items.map((i) => ({
          product: i.productId,
          name: i.name,
          quantity: i.quantity,
        })),
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };

      const { data } = await api.post("/orders", payload);
      clearCart();

      // If JazzCash is configured on the backend and this order used it,
      // the backend returns a signed payload we POST to JazzCash's hosted
      // payment page. Until a Merchant Account is connected, this stays
      // null and we just go to the normal success page (admin confirms
      // payment manually, same as COD).
      if (data.jazzcash) {
        const jazzcashForm = document.createElement("form");
        jazzcashForm.method = "POST";
        jazzcashForm.action = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform";
        Object.entries(data.jazzcash).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          jazzcashForm.appendChild(input);
        });
        document.body.appendChild(jazzcashForm);
        jazzcashForm.submit();
        return;
      }

      navigate(`/order-success/${data.orderNumber}`, { state: { whatsappLink: data.whatsappLink } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const shippingFee = 300;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-bark mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          <div>
            <h2 className="font-display text-lg text-bark mb-3">Contact Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
                required
              />
              <input
                name="phone"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
                required
              />
              <input
                name="email"
                placeholder="Email (optional)"
                value={form.email}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf sm:col-span-2"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-bark mb-3">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="addressLine1"
                placeholder="Address Line 1 *"
                value={form.addressLine1}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf sm:col-span-2"
                required
              />
              <input
                name="addressLine2"
                placeholder="Address Line 2 (optional)"
                value={form.addressLine2}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf sm:col-span-2"
              />
              <input
                name="city"
                placeholder="City *"
                value={form.city}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
                required
              />
              <input
                name="state"
                placeholder="Province *"
                value={form.state}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
                required
              />
              <input
                name="pincode"
                placeholder="Postal Code (optional)"
                value={form.pincode}
                onChange={handleChange}
                className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-bark mb-3">Payment Method</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 font-body text-sm border border-bark/20 rounded-xl px-4 py-3 flex-1 cursor-pointer has-[:checked]:border-leaf">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === "COD"}
                  onChange={handleChange}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 font-body text-sm border border-bark/20 rounded-xl px-4 py-3 flex-1 cursor-pointer has-[:checked]:border-leaf">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="JAZZCASH"
                  checked={form.paymentMethod === "JAZZCASH"}
                  onChange={handleChange}
                />
                JazzCash
              </label>
            </div>
          </div>

          <textarea
            name="notes"
            placeholder="Order notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-leaf text-parchment py-3.5 rounded-full font-body text-sm hover:bg-leaf-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Order summary */}
        <div className="border border-bark/10 rounded-2xl p-6 h-fit bg-white/50">
          <h2 className="font-display text-lg text-bark mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm font-body">
                <span className="text-bark/70">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono">Rs {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-bark/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm font-body text-bark/60">
              <span>Subtotal</span>
              <span className="font-mono">Rs {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm font-body text-bark/60">
              <span>Shipping</span>
              <span className="font-mono">{shippingFee === 0 ? "Free" : `Rs ${shippingFee}`}</span>
            </div>
            <div className="flex justify-between font-display text-lg text-bark pt-2">
              <span>Total</span>
              <span className="font-mono">Rs {grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

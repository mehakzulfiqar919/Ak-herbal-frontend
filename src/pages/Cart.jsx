import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-bark">Your cart is empty</h1>
        <p className="font-body text-bark/60 mt-2">
          Browse our products and add something you love.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-6 bg-leaf text-parchment px-7 py-3 rounded-full font-body text-sm hover:bg-leaf-600 transition-colors"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-bark mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row sm:items-center gap-4 border border-bark/10 rounded-2xl p-4 bg-white/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-leaf/5 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-leaf/30 text-xs">No image</span>
                )}
              </div>

              <div className="flex-1 min-w-0 sm:hidden">
                <Link
                  to={`/product/${item.slug}`}
                  className="font-display text-base text-bark hover:text-leaf truncate block"
                >
                  {item.name}
                </Link>
                <span className="font-mono text-sm text-bark/60">Rs {item.price}</span>
              </div>
            </div>

            <div className="hidden sm:block flex-1 min-w-0">
              <Link
                to={`/product/${item.slug}`}
                className="font-display text-base text-bark hover:text-leaf truncate block"
              >
                {item.name}
              </Link>
              <span className="font-mono text-sm text-bark/60">Rs {item.price}</span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="flex items-center border border-bark/20 rounded-full">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 font-mono text-bark/60 hover:text-leaf"
                >
                  −
                </button>
                <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))
                  }
                  className="w-8 h-8 font-mono text-bark/60 hover:text-leaf"
                >
                  +
                </button>
              </div>

              <span className="font-mono text-sm w-16 text-right">
                Rs {item.price * item.quantity}
              </span>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-bark/30 hover:text-clay text-sm font-body"
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-bark/10 pt-6 flex flex-col items-end gap-4">
        <div className="font-body text-bark/70">
          Subtotal:{" "}
          <span className="font-mono text-lg text-bark ml-2">
            Rs {subtotal}
          </span>
        </div>

        <p className="font-body text-xs text-bark/40">
          Shipping calculated at checkout. Free shipping on orders over Rs 999.
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-leaf text-parchment px-8 py-3 rounded-full font-body text-sm hover:bg-leaf-600 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
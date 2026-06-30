import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-white/60 border border-bark/10 rounded-2xl overflow-hidden hover:border-leaf/40 hover:shadow-sm transition-all"
    >
      <div className="aspect-square bg-leaf/5 flex items-center justify-center overflow-hidden">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="font-display text-leaf/30 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <span className="font-mono text-[11px] uppercase tracking-wide text-bark/40">
          {product.category}
        </span>
        <h3 className="font-display text-lg text-bark mt-1 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div className="font-mono text-sm">
            {hasDiscount ? (
              <span className="flex items-center gap-2">
                <span className="text-clay">Rs {product.discountPrice}</span>
                <span className="text-bark/30 line-through text-xs">Rs {product.price}</span>
              </span>
            ) : (
              <span className="text-bark">Rs {product.price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="text-xs font-body border border-bark/20 rounded-full px-3 py-1.5 hover:border-leaf hover:bg-leaf hover:text-parchment transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-bark"
          >
            {product.stock <= 0 ? "Out of stock" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

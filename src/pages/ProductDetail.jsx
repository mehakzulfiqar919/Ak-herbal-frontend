import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
        setQuantity(1);
        setActiveImage(0);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-bark/5 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-bark/5 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-bark/5 rounded w-1/3 animate-pulse" />
          <div className="h-24 bg-bark/5 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-bark">Product not found</h1>
        <p className="font-body text-bark/60 mt-2">
          This product may have been removed or is no longer available.
        </p>
        <Link to="/shop" className="inline-block mt-6 text-leaf hover:underline font-body text-sm">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const images = product.images?.length ? product.images : [{ url: "" }];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-leaf/5 rounded-2xl border border-bark/10 flex items-center justify-center overflow-hidden">
            {images[activeImage]?.url ? (
              <img
                src={images[activeImage].url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display text-leaf/30">No image</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg border overflow-hidden ${
                    activeImage === i ? "border-leaf" : "border-bark/10"
                  }`}
                >
                  {img.url && <img src={img.url} alt="" className="w-full h-full object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-clay">
            {product.category}
          </span>
          <h1 className="font-display text-3xl text-bark mt-2">{product.name}</h1>

          <div className="flex items-center gap-3 mt-4">
            {hasDiscount ? (
              <>
                <span className="font-mono text-2xl text-clay">Rs {product.discountPrice}</span>
                <span className="font-mono text-bark/30 line-through">Rs {product.price}</span>
              </>
            ) : (
              <span className="font-mono text-2xl text-bark">Rs {product.price}</span>
            )}
            <span className="font-body text-sm text-bark/40">/ {product.unit}</span>
          </div>

          <p className="font-body text-bark/70 mt-6 leading-relaxed">{product.description}</p>

          {product.benefits?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-lg text-bark mb-2">Benefits</h3>
              <ul className="space-y-1">
                {product.benefits.map((b, i) => (
                  <li key={i} className="font-body text-sm text-bark/70 flex gap-2">
                    <span className="text-leaf">•</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.ingredients?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-display text-lg text-bark mb-2">Ingredients</h3>
              <p className="font-body text-sm text-bark/60">{product.ingredients.join(", ")}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-bark/10">
            {product.stock <= 0 ? (
              <p className="font-body text-clay text-sm">Currently out of stock</p>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-body text-sm text-bark/60">Quantity</span>
                  <div className="flex items-center border border-bark/20 rounded-full">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 font-mono text-bark/60 hover:text-leaf"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-9 h-9 font-mono text-bark/60 hover:text-leaf"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-body text-xs text-bark/40">{product.stock} in stock</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto bg-leaf text-parchment px-8 py-3 rounded-full font-body text-sm hover:bg-leaf-600 transition-colors"
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

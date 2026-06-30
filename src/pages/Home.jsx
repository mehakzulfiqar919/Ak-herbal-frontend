import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products", { params: { limit: 4 } });
        setFeatured(data.products);
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-bark/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-clay">
              Rooted in tradition
            </span>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mt-4 text-bark text-balance">
              Herbal goodness, gathered from the earth.
            </h1>
            <p className="font-body text-bark/70 mt-6 text-lg max-w-md">
              AK Herbal Products crafts small-batch remedies and wellness
              essentials using time-tested ingredients — no shortcuts, no
              fillers.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/shop"
                className="bg-leaf text-parchment px-7 py-3 rounded-full font-body text-sm hover:bg-leaf-600 transition-colors"
              >
                Shop Products
              </Link>
              <Link
                to="/track-order"
                className="border border-bark/20 px-7 py-3 rounded-full font-body text-sm hover:border-leaf hover:text-leaf transition-colors"
              >
                Track an Order
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[2rem] bg-leaf/10 border border-leaf/20 flex items-center justify-center">
              <img
                src="https://i.ibb.co/20VSP6Qf/Whats-App-Image-2026-06-29-at-4-19-08-PM.jpg"
                alt="AK Herbal Products"
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-turmeric/20 -z-10" />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-bark/10 bg-parchment-dark/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap gap-x-10 gap-y-3 justify-center text-sm font-mono text-bark/60">
          <span>100% Natural Ingredients</span>
          <span>No Added Chemicals</span>
          <span>Cash on Delivery Available</span>
          <span>Order via WhatsApp</span>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl text-bark">Featured Products</h2>
          <Link to="/shop" className="font-body text-sm text-leaf hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-bark/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="font-body text-bark/50">No products yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

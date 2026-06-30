import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", {
          params: { keyword, page, limit: 12 },
        });
        setProducts(data.products);
        setPages(data.pages);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value;
    setSearchParams(value ? { keyword: value } : {});
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-clay">
            All Products
          </span>
          <h1 className="font-display text-3xl text-bark mt-2">Shop the Collection</h1>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            name="search"
            type="text"
            defaultValue={keyword}
            placeholder="Search products..."
            className="border border-bark/20 rounded-full px-4 py-2 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf w-full md:w-64"
          />
          <button
            type="submit"
            className="bg-bark text-parchment rounded-full px-5 py-2 text-sm font-body"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-bark/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl text-bark/60">No products found</p>
          <p className="font-body text-bark/40 mt-2">Try a different search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-mono ${
                    page === i + 1
                      ? "bg-leaf text-parchment"
                      : "border border-bark/20 text-bark/60 hover:border-leaf"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;

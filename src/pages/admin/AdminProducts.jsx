import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products/admin/all");
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/products/${id}/toggle-active`);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-bark">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-leaf text-parchment px-5 py-2.5 rounded-full text-sm font-body hover:bg-leaf-600 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="border border-bark/10 rounded-2xl overflow-x-auto bg-white/50">
        <table className="w-full text-sm">
          <thead className="bg-bark/5 text-bark/50 font-body text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-right px-5 py-3">Price</th>
              <th className="text-right px-5 py-3">Stock</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-bark/40 font-body">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-bark/40 font-body">
                  No products yet. Click "Add Product" to create your first one.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t border-bark/5">
                  <td className="px-5 py-3 font-body text-bark">{product.name}</td>
                  <td className="px-5 py-3 font-body text-bark/60">{product.category}</td>
                  <td className="px-5 py-3 font-mono text-right">Rs {product.price}</td>
                  <td className="px-5 py-3 font-mono text-right">{product.stock}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggleActive(product._id)}
                      className={`text-xs font-body px-2.5 py-1 rounded-full ${product.isActive
                          ? "bg-leaf/10 text-leaf-600"
                          : "bg-bark/10 text-bark/50"
                        }`}
                    >
                      {product.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="text-leaf hover:underline font-body text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="text-clay hover:underline font-body text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;

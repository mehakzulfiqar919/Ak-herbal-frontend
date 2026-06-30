import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  category: "",
  price: "",
  discountPrice: "",
  stock: "",
  unit: "1 unit",
  imageUrl: "",
  ingredients: "",
  benefits: "",
  isFeatured: false,
};

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get("/products/admin/all");
        const product = data.find((p) => p._id === id);
        if (product) {
          setForm({
            name: product.name,
            slug: product.slug,
            description: product.description,
            category: product.category,
            price: product.price,
            discountPrice: product.discountPrice || "",
            stock: product.stock,
            unit: product.unit,
            imageUrl: product.images?.[0]?.url || "",
            ingredients: product.ingredients?.join(", ") || "",
            benefits: product.benefits?.join(", ") || "",
            isFeatured: product.isFeatured,
          });
        }
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "name" && !isEdit) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
      unit: form.unit,
      images: form.imageUrl ? [{ url: form.imageUrl }] : [],
      ingredients: form.ingredients
        ? form.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      benefits: form.benefits
        ? form.benefits.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      isFeatured: form.isFeatured,
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 font-body text-bark/40">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-2xl text-bark mb-6">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Product Name *"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
        />
        <input
          name="slug"
          placeholder="URL Slug (auto-generated)"
          value={form.slug}
          onChange={handleChange}
          className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm font-mono bg-white/60 focus:outline-none focus:border-leaf"
        />
        <textarea
          name="description"
          placeholder="Description *"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="category"
            placeholder="Category *"
            value={form.category}
            onChange={handleChange}
            required
            className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
          />
          <input
            name="unit"
            placeholder="Unit (e.g. 100g)"
            value={form.unit}
            onChange={handleChange}
            className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
          />
          <input
            name="price"
            type="number"
            placeholder="Price (Rs ) *"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-mono bg-white/60 focus:outline-none focus:border-leaf"
          />
          <input
            name="discountPrice"
            type="number"
            placeholder="Discount Price (optional)"
            value={form.discountPrice}
            onChange={handleChange}
            min="0"
            className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-mono bg-white/60 focus:outline-none focus:border-leaf"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock Quantity *"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="border border-bark/20 rounded-xl px-4 py-3 text-sm font-mono bg-white/60 focus:outline-none focus:border-leaf col-span-2"
          />
        </div>
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
        />
        <input
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={form.ingredients}
          onChange={handleChange}
          className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
        />
        <input
          name="benefits"
          placeholder="Benefits (comma separated)"
          value={form.benefits}
          onChange={handleChange}
          className="w-full border border-bark/20 rounded-xl px-4 py-3 text-sm font-body bg-white/60 focus:outline-none focus:border-leaf"
        />
        <label className="flex items-center gap-2 font-body text-sm text-bark/70">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          Show on homepage as Featured
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-leaf text-parchment px-7 py-3 rounded-full text-sm font-body hover:bg-leaf-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border border-bark/20 px-7 py-3 rounded-full text-sm font-body hover:border-leaf hover:text-leaf transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;

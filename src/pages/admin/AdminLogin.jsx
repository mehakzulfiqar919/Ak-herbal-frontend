import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bark flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-parchment text-center mb-1">AK Herbal</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-parchment/40 text-center mb-8">
          Admin Dashboard
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-parchment/5 border border-parchment/10 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="font-body text-xs text-parchment/60 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-parchment/10 border border-parchment/20 rounded-lg px-4 py-2.5 text-parchment text-sm font-body focus:outline-none focus:border-turmeric"
            />
          </div>
          <div>
            <label className="font-body text-xs text-parchment/60 block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-parchment/10 border border-parchment/20 rounded-lg px-4 py-2.5 text-parchment text-sm font-body focus:outline-none focus:border-turmeric"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-turmeric text-parchment py-3 rounded-lg font-body text-sm hover:bg-turmeric-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

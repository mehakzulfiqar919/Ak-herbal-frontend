import { Outlet, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const StorefrontLayout = () => {
  const { itemsCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <header className="border-b border-bark/10 bg-parchment/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-bark tracking-tight">
            ORGANIC.BASTI.AK
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-body text-sm text-bark/80">
            <Link to="/shop" className="hover:text-leaf transition-colors">Shop</Link>
            <Link to="/track-order" className="hover:text-leaf transition-colors">Track Order</Link>
          </nav>
          <Link
            to="/cart"
            className="relative font-mono text-sm border border-bark/20 rounded-full px-4 py-2 hover:border-leaf hover:text-leaf transition-colors"
          >
            Cart
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-turmeric text-parchment text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-bark/10 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-bark/60 font-body">
          © {new Date().getFullYear()} AK Herbal Products. Pure. Natural. Trusted.
        </div>
      </footer>

      <a
        href="https://wa.me/03475444445?text=Hello%20AK%20Herbal!"
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, background: "#25D366", borderRadius: "50%", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", cursor: "pointer", textDecoration: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30" height="30">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.135 1.528 5.884L.057 23.882a.5.5 0 00.606.61l6.188-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.866 9.866 0 01-5.031-1.378l-.36-.214-3.733.867.933-3.613-.235-.373A9.861 9.861 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z" />
        </svg>
      </a>
    </div>
  );
};

export default StorefrontLayout;
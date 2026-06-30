import { useLocation, useParams, Link } from "react-router-dom";

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const whatsappLink = location.state?.whatsappLink;

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-leaf/10 border border-leaf/30 flex items-center justify-center mx-auto mb-6">
        <span className="text-leaf text-2xl">✓</span>
      </div>
      <h1 className="font-display text-3xl text-bark">Order Placed!</h1>
      <p className="font-body text-bark/60 mt-3">
        Thank you for your order. We'll start preparing it right away.
      </p>

      <div className="mt-8 inline-block border border-bark/10 rounded-xl px-6 py-4 bg-white/50">
        <span className="font-mono text-xs uppercase tracking-wide text-bark/40">
          Order Number
        </span>
        <p className="font-mono text-lg text-bark mt-1">{orderNumber}</p>
      </div>

      <p className="font-body text-sm text-bark/50 mt-4">
        Save this number to track your order later.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-leaf text-parchment px-7 py-3 rounded-full font-body text-sm hover:bg-leaf-600 transition-colors"
          >
            Confirm via WhatsApp
          </a>
        )}
        <Link
          to="/shop"
          className="border border-bark/20 px-7 py-3 rounded-full font-body text-sm hover:border-leaf hover:text-leaf transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette — grounded in herbal/ayurvedic materials:
        // turmeric, neem leaf, clay pot, dried bark, parchment
        bark: {
          DEFAULT: "#2B2419", // deep roasted bark — primary text/dark surfaces
          800: "#3A3122",
        },
        leaf: {
          DEFAULT: "#3F5B3A", // neem/tulsi green — primary brand color
          600: "#4F7048",
          400: "#6E8E63",
        },
        turmeric: {
          DEFAULT: "#C9892F", // turmeric/saffron accent — CTAs, highlights
          600: "#B5781F",
        },
        clay: {
          DEFAULT: "#B9663F", // terracotta clay accent for secondary highlights
        },
        parchment: {
          DEFAULT: "#F6F1E4", // base background — raw paper/parchment
          dark: "#EDE4CE",
        },
      },
      fontFamily: {
        // Display: warm serif evoking apothecary labels & traditional print
        display: ["'Fraunces'", "serif"],
        // Body: clean humanist sans for readability
        body: ["'Work Sans'", "sans-serif"],
        // Utility: for prices, SKUs, labels — slightly mono for an apothecary feel
        mono: ["'Space Mono'", "monospace"],
      },
      backgroundImage: {
        "grain": "url('/textures/grain.png')",
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "350ms",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "slide-up": "slideUp 0.7s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 8s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "gradient": "gradient-shift 8s ease infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "scale-in": "scale-in 0.4s ease-out forwards",
        "blob": "blob-move 20s ease-in-out infinite",
        "progress": "progress-fill 1s ease-out forwards",
        "toast-in": "toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "toast-out": "toastOut 0.2s ease-in forwards",
        "modal-overlay": "modalOverlayIn 0.2s ease-out forwards",
        "modal-content": "modalContentIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "bounce-in": "bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "ring-pulse": "ringPulse 1.5s ease-out infinite",
        "gradient-text": "gradientText 6s ease infinite",
      },
      boxShadow: {
        "premium": "0 4px 30px -4px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        "premium-lg": "0 8px 40px -8px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)",
        "glow-blue": "0 0 40px -10px rgba(59,130,246,0.3)",
        "glow-purple": "0 0 40px -10px rgba(139,92,246,0.3)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.1)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #3b82f6 60%, #6366f1 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;

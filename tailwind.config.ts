import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0B0E11",
          900: "#121418",
          850: "#181A20",
          800: "#1E2026",
          700: "#2B2F36",
          600: "#363A45",
        },
        brand: {
          blue: "#FCD535",
          primary: "#FCD535",
          gradStart: "#FCD535",
          gradEnd: "#F0B90B",
          emerald: "#0ECB81",
          rose: "#F6465D",
          amber: "#FCD535",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "brand-gradient": "linear-gradient(135deg, #7BC2FF 0%, #5A9BFF 100%)",
        "blue-glow": "radial-gradient(circle at center, rgba(110, 183, 255, 0.15) 0%, transparent 70%)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(110, 183, 255, 0.4)" },
          "100%": { boxShadow: "0 0 30px rgba(110, 183, 255, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

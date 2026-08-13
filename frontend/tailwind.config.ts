import type { Config } from "tailwindcss";

// Airbnb's actual brand red is close to #FF385C — used as the primary accent
// throughout (buttons, active states, price-per-night emphasis, heart icon).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF385C",
          dark: "#E31C5F",
        },
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;

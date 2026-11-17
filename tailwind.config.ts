import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0B1226",
        surface: "#0F1830",
        raised: "#15213F",
        line: { DEFAULT: "#1F2D52", strong: "#2C3E6B" },
        fg: "#E6ECFF",
        mute: "#8393BD",
        dim: "#5A6A94",
        cobalt: { DEFAULT: "#2F5BFF", hover: "#4A72FF", ice: "#B7C7FF" },
        tally: "#FFB224",
        danger: "#FF6B6B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        tally: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.25" } },
      },
      animation: { tally: "tally 1.2s steps(1) infinite" },
    },
  },
  plugins: [],
};
export default config;

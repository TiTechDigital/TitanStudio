import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#08080A", 900: "#0E0E11", 800: "#151518", 700: "#1E1E23", 600: "#2B2B31", 500: "#3A3A42" },
        fg: "#EDEDF0",
        mute: "#8D8D98",
        dim: "#5E5E68",
        lime: { DEFAULT: "#D1FE17", soft: "#E3FF70", deep: "#A8D400" },
        danger: "#FF6B5E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.3" } },
        drift: { "0%,100%": { transform: "translate3d(0,0,0) scale(1)" }, "50%": { transform: "translate3d(4%,-3%,0) scale(1.12)" } },
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        sweep: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(250%)" } },
      },
      animation: {
        pulseDot: "pulseDot 1.4s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        rise: "rise .7s cubic-bezier(.2,.7,.2,1) both",
        sweep: "sweep 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

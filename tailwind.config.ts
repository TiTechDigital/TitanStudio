import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#04060C", 900: "#080C16", 800: "#0D1322", 700: "#141C31", 600: "#1F2A45", 500: "#30405F" },
        fg: "#EAF0FF",
        mute: "#8A97B5",
        dim: "#56627F",
        accent: { DEFAULT: "#3B82FF", soft: "#7BAAFF", deep: "#1F5BE0", glow: "#38BDF8" },
        danger: "#FF6B7A",
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
        spinSlow: { to: { transform: "rotate(360deg)" } },
        breathe: { "0%,100%": { opacity: ".5", transform: "scale(.96)" }, "50%": { opacity: "1", transform: "scale(1.04)" } },
      },
      animation: {
        pulseDot: "pulseDot 1.4s ease-in-out infinite",
        drift: "drift 14s ease-in-out infinite",
        rise: "rise .7s cubic-bezier(.2,.7,.2,1) both",
        sweep: "sweep 1.6s ease-in-out infinite",
        spinSlow: "spinSlow 6s linear infinite",
        breathe: "breathe 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

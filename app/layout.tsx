import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToasts";
import { Toasts } from "@/components/Toasts";

const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["opsz", "wdth"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Titan Studio",
  description: "Generate video with voice-over and music from a single prompt.",
};
export const viewport: Viewport = { themeColor: "#08080A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="min-h-screen">
        <ToastProvider>
          {children}
          <Toasts />
        </ToastProvider>
      </body>
    </html>
  );
}

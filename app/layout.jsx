import "./globals.css";
import { Manrope } from "next/font/google";
import { GeistMono } from "geist/font/mono";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "Auto Ranč",
  description: "Garaža, servisna knjiga i održavanje za entuzijaste.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr" className={`${manrope.variable} ${GeistMono.variable}`}>
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}

// app/layout.js
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],   // 로고는 두껍게
});

export const metadata = {
  title: "HereOn",
  description: "언제든 간단하게 HereOn",
  // ...
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-h-dvh`}
      >
        <Header />
        <div className="pt-0">{children}</div>
      </body>
    </html>
  );
}

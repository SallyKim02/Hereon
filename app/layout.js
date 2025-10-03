// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata = {
  title: "심리코딩",
  description: "생각 다루기 · CBT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-h-dvh`}
      >
        {/* 전역 고정 헤더 */}
        <Header />
        {/* 헤더 높이만큼 아래로 밀기 */}
        <div className="pt-0">{children}</div>
      </body>
    </html>
  );
}

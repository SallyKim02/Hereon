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

//  사이트 메타데이터
export const metadata = {
  title: "HereOn",
  description: "언제든 간단하게 HereOn",
  openGraph: {
    title: "HereOn",
    description: "언제든 간단하게 HereOn",
    url: "https://HereOn.vercel.app",
    siteName: "HereOn",
    images: [
      {
        url: "/green.png", // public 폴더에 green.png 넣어두면 자동 제공됨
        width: 1200,
        height: 630,
        alt: "HereOn 미리보기 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HereOn | Panic Attack Helper",
    description: "언제든 간단하게 HereOn",
    images: ["/green.png"],
  },
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

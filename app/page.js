"use client";

import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import CircleLink from "../components/CircleLink";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-stone-100 relative overflow-hidden">
      {/* 1) 스플래시 화면 */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="absolute inset-0 bg-white flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-center">
              {/* Welcome to & HereOn! */}
              <motion.p
                className={`${playfair.className} text-7xl md:text-8xl font-extrabold text-black`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Welcome to
              </motion.p>
              <motion.h1
                className={`${playfair.className} text-7xl md:text-8xl font-extrabold text-black mt-2`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              >
                HereOn!
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* 부제 */}
        <motion.p
          className="mt-32 text-xs md:text-sm text-gray-700 text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 8 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          여기 존재할 수 있도록
        </motion.p>

      {/* 2) 실제 메인 콘텐츠 */}
      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center">
        <motion.h1
          className={`${playfair.className} text-8xl md:text-9xl font-extrabold w-full text-center text-black`}
          initial={{ y: 0 }}
          animate={{ y: showSplash ? 0 : -10 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          HereOn
        </motion.h1>

        {/* 초록 언더바 */}
        <motion.div
          className="relative"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: showSplash ? 0 : 480, opacity: showSplash ? 0 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          <div
            className="h-2 rounded-full"
            style={{
              background: "#2F7D5C", // 진한 에메랄드 톤
              boxShadow: `
                6px 6px 14px rgba(0,0,0,.25),   /* 어두운 그림자 */
                -6px -6px 14px rgba(255,255,255,.8)  /* 밝은 하이라이트 */
              `,
            }}
          />
        </motion.div>


        {/* 버튼 */}
        <motion.div
          className="mt-16 flex justify-center items-center gap-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
        >
          <CircleLink href="/breathing" label="호흡" />
          <CircleLink href="/grounding" label="감각" />
          <CircleLink href="/cbt" label="생각" />
        </motion.div>
      </div>
    </main>
  );
}

"use client";
import Link from "next/link";

export default function CircleLink({ href, label, size = 185 }) {
  return (
    <Link href={href} className="group">
      <div
        className="relative flex items-center justify-center rounded-full select-none
                   transition-all duration-300 ease-out hover:scale-[1.04]"
        style={{ width: size, height: size }}
      >
        {/* 뉴모피즘 배경 */}
        <div
          className="absolute inset-0 rounded-full bg-stone-100
                     shadow-[10px_10px_24px_rgba(0,0,0,.08),_-10px_-10px_24px_rgba(255,255,255,1)]
                     group-hover:shadow-[14px_14px_32px_rgba(0,0,0,.10),_-14px_-14px_32px_rgba(255,255,255,1)]"
        />

        {/* 라벨 */}
        <span className="relative z-10 text-gray-700 font-medium text-lg">
          {label}
        </span>
      </div>
    </Link>
  );
}

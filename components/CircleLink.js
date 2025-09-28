"use client";
import Link from "next/link";

export default function CircleLink({ href, label }) {
  return (
    <Link
      href={href}
      className="
        w-58 h-58 rounded-full flex items-center justify-center
        text-black font-semibold text-xl text-center
        bg-[radial-gradient(circle,rgba(0,118,22,1)_0%,rgba(0,128,96,0)_85%)]
        hover:scale-110 transition-transform
      "
    >
      {label}
    </Link>
  );
}

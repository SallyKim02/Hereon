"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* 아이콘 */
function IconHome({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3 10.5 12 4l9 6.5V20a2 2 0 0 1-2 2h-4.5a.5.5 0 0 1-.5-.5V15h-4v6.5a.5.5 0 0 1-.5.5H5a2 2 0 0 1-2-2v-9.5Z" fill="currentColor"/>
    </svg>
  );
}
function IconHamburger({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconX({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // ESC/바깥 클릭 닫기
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    function onClick(e) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <>
      {/* 고정 헤더 전체 폭 사용 */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-transparent z-50">
        {/* 화면 가장 오른쪽 정렬 */}
        <div className="h-full px-4 flex items-center justify-end gap-2">
          {/* 집 아이콘: 테두리 제거 */}
          <Link
            href="/"
            aria-label="홈으로"
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-neutral-100"
          >
            <IconHome />
          </Link>

          {/* 햄버거: 테두리 제거 */}
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-neutral-100"
          >
            {open ? <IconX /> : <IconHamburger />}
          </button>
        </div>
      </header>

      {/* 드롭다운 패널: 헤더 높이에 맞춰 아래 붙이기 */}
      {open && (
        <div className="fixed top-12 right-0 left-0 z-40">
          <div className="px-4 flex justify-end">
            <nav
              ref={panelRef}
              className="w-56 rounded-xl border border-neutral-200 bg-white shadow-lg p-2"
            >
              <MenuItem href="/breathing" label="호흡 다루기" onClick={() => setOpen(false)} />
              <MenuItem href="/grounding" label="감각 다루기" onClick={() => setOpen(false)} />
              <MenuItem href="/cbt" label="생각 다루기" onClick={() => setOpen(false)} />
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block w-full rounded-lg px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
    >
      {label}
    </Link>
  );
}

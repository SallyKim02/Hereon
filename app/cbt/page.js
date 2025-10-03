// app/cbt/page.js
import Link from "next/link";

export const metadata = {
  title: "인지재구성기법 | 옵션 선택",
  description: "설명영상, 연습, 실전 중 하나를 선택하세요.",
};

export default function CBTPage() {
  const items = [
    { href: "/cbt/videos",   title: "설명영상", desc: "인지재구성 기법 설명 영상 보기" },
    { href: "/cbt/practice", title: "연습",     desc: "카드 클릭-매칭으로 자동적 사고 ↔ 대안적 사고 연결하기" },
    { href: "/cbt/form",     title: "실전",     desc: "상황 기록지 작성하고 저장하기 (로컬 저장)" },
  ];

  return (
    <main className="min-h-dvh bg-white text-gray-900 mx-auto max-w-2xl px-4 py-10 flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">인지재구성기법</h1>
        <p className="mt-2 text-sm text-gray-600">아래에서 모드를 선택하세요.</p>
      </header>

      {/* 세로 스택 */}
      <ul className="space-y-4 flex-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="group block rounded-2xl border border-gray-200 p-5 shadow-sm transition hover:shadow-md bg-white"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{it.title}</h2>
                <span
                  aria-hidden
                  className="rounded-full border px-2 py-0.5 text-xs text-gray-500"
                >
                  이동
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{it.desc}</p>

              <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 underline-offset-4 group-hover:underline">
                시작하기 →
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* 메인으로 버튼 */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="inline-block rounded-2xl border-2 border-gray-400 px-6 py-3 text-lg font-medium text-gray-800 transition hover:bg-gray-50"
        >
          메인으로
        </Link>
      </div>
    </main>
  );
}

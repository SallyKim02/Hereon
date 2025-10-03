// app/cbt/page.js
import Link from "next/link";

export const metadata = {
  title: "인지재구성기법 | 옵션 선택",
  description: "설명영상, 연습, 실전, 기록 중 하나를 선택하세요.",
};

export default function CBTPage() {
  const items = [
    { href: "/cbt/videos",   title: "CBT 설명 영상", desc: "자동적 사고와 대안적 사고에 대해 알아봐요" },
    { href: "/cbt/practice", title: "대안적 사고 매칭하기",     desc: "자동적 사고와 대안적 사고 연결하기를 연습해요" },
    { href: "/cbt/form",     title: "생각 기록하기",     desc: "상황과 감정 그리고 생각을 기록하고 저장해요" },
    { href: "/cbt/history",  title: "나의 기록", desc: "지난 기록을 모아보고 관리할 수 있어요" },
  ];

  return (
    <main className="min-h-dvh bg-white text-gray-900 mx-auto max-w-3xl px-4 flex flex-col justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">생각 다루기</h1>
        <p className="mt-2 text-sm gap-1 text-gray-600">
          힘든 상황 속에서 떠오른 생각을 기록하고, 다른 시각에서 바라보는 연습을 해보세요. <br />
          작은 시도가 마음을 더 단단하게 만들어 줄 거예요.
        </p>
      </header>

      {/* 2x2 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="h-36 group block rounded-2xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md bg-white"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{it.title}</h2>
            </div>
            <p className="mt-2 text-sm text-gray-600">{it.desc}</p>

            <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 underline-offset-4 group-hover:underline">
              시작하기 →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

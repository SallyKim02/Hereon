import CircleLink from "../components/CircleLink";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      {/* 중앙 컨테이너 */}
      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center">
        <h1 className="mt-40 text-4xl font-bold text-black w-full text-center">
          Panic Attack Helper
        </h1>

        <div className="mt-24 flex justify-center items-center gap-32">
          <CircleLink href="/breathing" label="호흡 훈련" />
          <CircleLink href="/grounding" label="감각 그라운딩" />
          <CircleLink href="/cbt" label="CBT 카드" />
        </div>
      </div>
    </main>
  );
}

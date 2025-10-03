// app/cbt/form/page.js
import EntryForm from "../../../components/cbt/EntryForm";

export const metadata = { title: "실전 기록 작성 | CBT" };

export default function FormPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* 5xl → 4xl로 '조~금'만 줄임 */}
      <div className="mx-auto max-w-4xl py-8 md:py-12 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">기록 작성</h1>
        <EntryForm />
      </div>
    </main>
  );
}

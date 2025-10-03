// app/cbt/form/page.js
"use client";

import { useRouter } from "next/navigation";
import EntryForm from "../../../components/cbt/EntryForm";
import { saveEntry } from "../../../lib/cbt/storage";

export default function FormPage() {
  const router = useRouter();

  const handleSubmit = (entry) => {
    saveEntry(entry);
    router.push("/cbt/history");
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">실전 기록 작성</h1>
        <EntryForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}

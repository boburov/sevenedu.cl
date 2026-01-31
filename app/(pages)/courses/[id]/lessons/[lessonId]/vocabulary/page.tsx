"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/api/service/api";

interface VocabularyItem {
  id: string;
  word: string;
  translated: string;
  lessonsId: string;
}

const VocabularyPage = () => {
  const params = useParams();
  const lessonId = params?.lessonId ? String(params.lessonId) : "";

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;

    const fetchVocabulary = async () => {
      try {
        const res = await api.get(`/dictonary/lesson/${lessonId}`);
        setVocabulary(res.data);
      } catch (err) {
        console.error("Vocabulary fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [lessonId]);

 if (loading)
  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-surface-alt" />
          <div className="h-10 w-full rounded bg-surface-alt" />
          <div className="h-10 w-full rounded bg-surface-alt" />
          <div className="h-10 w-full rounded bg-surface-alt" />
        </div>
        <p className="mt-4 text-sm text-text-secondary">Yuklanmoqda…</p>
      </div>
    </div>
  );

return (
  <div className="min-h-screen bg-background px-5 py-8">
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-text-primary">
          Lug‘at
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Lesson bo‘yicha so‘zlar ro‘yxati
        </p>
      </div>

      {vocabulary.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-card">
          <p className="text-sm text-text-secondary">Lug‘at topilmadi.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-surface-alt text-text-secondary">
                <th className="px-4 py-3 text-left text-xs font-semibold border-b border-border w-14">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold border-b border-border">
                  Word
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold border-b border-border">
                  Translation
                </th>
              </tr>
            </thead>

            <tbody>
              {vocabulary.map((item, index) => (
                <tr
                  key={item.id}
                  className={[
                    "transition-colors",
                    index % 2 === 0 ? "bg-surface" : "bg-surface-alt/60",
                    "hover:bg-primary-soft/60",
                  ].join(" ")}
                >
                  <td className="px-4 py-3 text-xs text-text-muted border-b border-border text-left">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-text-primary border-b border-border">
                    {item.word}
                  </td>
                  <td className="px-4 py-3 text-sm text-primary border-b border-border">
                    {item.translated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

};

export default VocabularyPage;

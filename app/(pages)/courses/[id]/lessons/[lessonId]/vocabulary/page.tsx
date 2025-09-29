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
      <div className="p-5 text-center text-lg animate-pulse text-green-400">
        ⏳ Yuklanmoqda...
      </div>
    );

  return (
    <div className="min-h-screen  px-5 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-green-400">
          📚 Lug'at
        </h1>

        {vocabulary.length === 0 ? (
          <p className="text-center text-gray-400">Lug'at topilmadi.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-700">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-800/80 text-green-300">
                  <th className="px-4 py-3 text-sm font-semibold border-b border-gray-700">
                    #
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b border-gray-700">
                    Word
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b border-gray-700">
                    Translation
                  </th>
                </tr>
              </thead>
              <tbody>
                {vocabulary.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-200 ${
                      index % 2 === 0
                        ? "bg-gray-800/60"
                        : "bg-gray-700/60"
                    } hover:bg-green-900/30`}
                  >
                    <td className="px-4 py-3 text-gray-400 border-b border-gray-700 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-100 border-b border-gray-700">
                      {item.word}
                    </td>
                    <td className="px-4 py-3 text-green-400 border-b border-gray-700">
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

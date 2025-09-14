"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Puzzle type
interface SentencePuzzle {
  id: string;
  sentence: string;
  answer: string;
}

const Page = () => {
  const path = useParams();
  const lessonId = String(path.lessonId);
  const category_id = String(path.id);

  const [sentencePuzzles, setSentencePuzzles] = useState<SentencePuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Shuffle helper
  const shuffleArray = (arr: string[]) => {
    return arr
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  };

  // Fetch data
  useEffect(() => {
    api.get("courses/all").then((data) => {
      const lessonData = data.data
        .filter((e: any) => e.id === category_id)[0]
        ?.lessons?.filter((les: any) => les.id === lessonId)[0];

      if (lessonData?.sentencePuzzles) {
        setSentencePuzzles(lessonData.sentencePuzzles);
      }
    });
  }, [lessonId, category_id]);

  // Prepare words when puzzle changes
  useEffect(() => {
    if (sentencePuzzles.length > 0 && currentIndex < sentencePuzzles.length) {
      const words = sentencePuzzles[currentIndex].answer.split(" ");
      setShuffledWords(shuffleArray(words));
      setUserWords([]);
      setShowResult(false);
    }
  }, [sentencePuzzles, currentIndex]);

  if (sentencePuzzles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <p className="text-2xl font-semibold text-gray-700">
          ❌ Hozircha savollar mavjud emas
        </p>
        <p className="text-gray-500">Keyinroq yana urinib ko‘ring 🙂</p>
      </div>
    );
  }

  const currentPuzzle = sentencePuzzles[currentIndex];

  const handleWordClick = (word: string) => {
    setUserWords([...userWords, word]);
    setShuffledWords(shuffledWords.filter((w) => w !== word));
  };

  const handleRemoveWord = (word: string) => {
    setUserWords(userWords.filter((w) => w !== word));
    setShuffledWords([...shuffledWords, word]);
  };

  const checkAnswer = () => {
    setShowResult(true);
  };

  const goNext = () => {
    if (currentIndex < sentencePuzzles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(sentencePuzzles.length); // oxiri
    }
  };

  if (currentIndex >= sentencePuzzles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
        <h2 className="text-3xl font-bold text-green-600">
          🎉 Barcha mashqlar tugadi!
        </h2>
        <p className="text-gray-600">Tabriklaymiz! Endi boshqa darsni tanlang.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10 space-y-8">
      {/* Sentence */}
      <div className="p-6 bg-white rounded-2xl shadow-md text-center space-y-3">
        <h2 className="text-lg text-gray-700">🇺🇿 {currentPuzzle.sentence}</h2>
        <div className="flex flex-wrap justify-center gap-2 min-h-[50px] border rounded-lg p-3 bg-gray-50">
          {userWords.map((word, i) => (
            <button
              key={i}
              onClick={() => handleRemoveWord(word)}
              className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Word options */}
      <div className="flex flex-wrap justify-center gap-2">
        {shuffledWords.map((word, i) => (
          <button
            key={i}
            onClick={() => handleWordClick(word)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={checkAnswer}
          disabled={userWords.length === 0}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          Tekshirish
        </button>

        {showResult && (
          <button
            onClick={goNext}
            className="px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            Next →
          </button>
        )}
      </div>

      {/* Result */}
      {showResult && (
        <div className="text-center">
          {userWords.join(" ") === currentPuzzle.answer ? (
            <p className="text-green-600 font-semibold text-lg">
              ✅ To‘g‘ri javob!
            </p>
          ) : (
            <p className="text-red-500 font-semibold text-lg">
              ❌ Xato. To‘g‘ri javob: <br />
              <span className="text-gray-700">{currentPuzzle.answer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;

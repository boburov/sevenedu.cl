"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, CheckCircle2, ChevronRight, X } from "lucide-react";

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
      <div className="page py-8 sm:py-10">
        <div className="mx-auto max-w-md rounded-card border border-border bg-surface p-10 text-center">
          <h2 className="text-lg font-semibold text-text-primary">
            Hozircha savollar mavjud emas
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Keyinroq yana urinib ko‘ring
          </p>
        </div>
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
      <div className="page py-8 sm:py-10">
        <div className="mx-auto max-w-md rounded-card border border-border bg-surface p-10 text-center">
          {/* Tugallandi — haqiqiy muvaffaqiyat statusi */}
          <CheckCircle2
            size={32}
            strokeWidth={1.75}
            className="mx-auto mb-4 text-success"
          />
          <h2 className="text-xl font-semibold text-text-primary">
            Barcha mashqlar tugadi!
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Tabriklaymiz! Endi boshqa darsni tanlang.
          </p>
        </div>
      </div>
    );
  }

  const isCorrect = userWords.join(" ") === currentPuzzle.answer;

  return (
    <div className="page py-8 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Sentence */}
        <div className="space-y-3 rounded-card border border-border bg-surface p-6 text-center">
          <h2 className="text-lg text-text-secondary">{currentPuzzle.sentence}</h2>
          <div className="flex min-h-[50px] flex-wrap justify-center gap-2 rounded-input border border-border bg-surface-alt p-3">
            {/* Tanlangan so'zlar — tuzilayotgan javob */}
            {userWords.map((word, i) => (
              <button
                key={i}
                onClick={() => handleRemoveWord(word)}
                className="focus-ring rounded-button border border-primary bg-primary px-3 py-1 text-primary-foreground transition-colors hover:bg-primary-hover"
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
              className="focus-ring rounded-button border border-border bg-surface-alt px-3 py-2 text-text-primary transition-colors hover:border-border-strong"
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
            className="focus-ring inline-flex items-center gap-2 rounded-button border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tekshirish
          </button>

          {showResult && (
            <button
              onClick={goNext}
              className="focus-ring inline-flex items-center gap-2 rounded-button border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Next
              <ChevronRight size={16} strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Result */}
        {showResult && (
          <div>
            {isCorrect ? (
              /* To'g'ri javob → success */
              <div className="flex items-center justify-center gap-2 rounded-card border border-success/30 bg-success-soft p-4 text-lg font-semibold text-success">
                <Check size={20} strokeWidth={2} />
                To‘g‘ri javob!
              </div>
            ) : (
              /* Noto'g'ri javob → danger */
              <div className="rounded-card border border-danger/30 bg-danger-soft p-4 text-center">
                <p className="flex items-center justify-center gap-2 text-lg font-semibold text-danger">
                  <X size={20} strokeWidth={2} />
                  Xato. To‘g‘ri javob:
                </p>
                <p className="mt-1 text-text-primary">{currentPuzzle.answer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

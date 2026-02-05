"use client";

import { useEffect, useMemo, useRef, useState } from "react"; // ✅ useRef qo‘shildi
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, FileX, RefreshCcw, XCircle } from "lucide-react";
import api from "@/app/api/service/api";
import confetti from "canvas-confetti";

interface OneTest {
  word: string;
  correct: string;
  options: string[];
}

export default function TestPage() {
  const path = useParams();
  const lessonId = path.lessonId;
  const [index, setIndex] = useState(0);
  const [tests, setTests] = useState<OneTest[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  // ✅ Sound refs (preload + lag yo‘q)
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudioRef.current = new Audio("/sounds/correct.mp3");
    wrongAudioRef.current = new Audio("/sounds/incorrect.mp3");

    // preload feel
    correctAudioRef.current.load();
    wrongAudioRef.current.load();

    // ixtiyoriy: volume
    correctAudioRef.current.volume = 0.35;
    wrongAudioRef.current.volume = 0.35;
  }, []);

  const play = (type: "correct" | "wrong") => {
    const a = type === "correct" ? correctAudioRef.current : wrongAudioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {
      // Autoplay policy: user click bo‘lmasa blok bo‘lishi mumkin.
      // Bizda click bor, lekin ba’zi browserlarda baribir catch bo‘lishi mumkin.
    });
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await api.get("/auth/me");
        localStorage.setItem("userId", res.data.id);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUserId();
  }, []);

  const launchConfetti = () => {
    confetti({ particleCount: 90, spread: 80, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 90, spread: 80, origin: { x: 1, y: 0.6 } });
  };

  // ❌ eski: hammasi true bo‘lsa confetti
  // ✅ yangi: 80%+ bo‘lsa confetti (finished bo‘lganda)
  useEffect(() => {
    if (!finished || tests.length === 0) return;
    const correctCount = results.filter(Boolean).length;
    const percent = (correctCount / tests.length) * 100;
    if (percent >= 80) launchConfetti();
  }, [finished, results, tests.length]);

  useEffect(() => {
    api.get(`/courses/${lessonId}/vocabulary-quiz`).then((res) => {
      setTests(res.data);
    });
  }, [lessonId]);

  const current = tests[index];

  const handleAnswer = async (answer: string) => {
    if (selected) return;

    setSelected(answer);
    const isCorrect = answer === current.correct;

    // ✅ shu yerda sound
    play(isCorrect ? "correct" : "wrong");

    setResults((prev) => [...prev, isCorrect]);

    setTimeout(async () => {
      if (index + 1 >= tests.length) {
        setFinished(true);

        const correctCount = [...results, isCorrect].filter(Boolean).length;

        api.post(`/courses/${lessonId}/vocabulary-result`, {
          total: tests.length,
          correct: correctCount,
          wrong: tests.length - correctCount,
        });

        if (correctCount === tests.length) {
          const userId = localStorage.getItem("userId");
          if (userId) {
            try {
              await api.post("/user/coins", { userId, coins: 5 });
            } catch (err) {
              console.error("Coin add error:", err);
            }
          }
        }
      } else {
        setIndex(index + 1);
        setSelected(null);
      }
    }, 900);
  };
  // Empty / no tests
  if (!current)
    return (
      <div className="min-h-screen bg-background px-5 py-10">
        <div className="container max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-card text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-danger-soft">
            <FileX size={22} className="text-danger" />
          </div>

          <h2 className="text-lg font-semibold text-text-primary">
            Testlar topilmadi
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Ushbu dars uchun hozircha test savollari mavjud emas.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-surface-alt px-4 py-2 text-sm font-semibold text-text-primary transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            <RefreshCcw size={18} className="text-primary" />
            Qayta yuklash
          </button>
        </div>
      </div>
    );

  const progress = Math.round(((index + (finished ? 1 : 0)) / tests.length) * 100);
  const correctCount = results.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-card">
        {/* Top bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-text-primary">Test</h1>
            <span className="text-xs font-semibold text-text-secondary">
              {finished ? "Finished" : `${index + 1}/${tests.length}`}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-3 h-2 w-full rounded-full bg-surface-alt overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${finished ? 100 : (index / tests.length) * 100}%` }}
            />
          </div>
        </div>

        {finished ? (
          <div className="text-center space-y-3">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success-soft">
              <CheckCircle2 size={22} className="text-success" />
            </div>

            <h2 className="text-lg font-semibold text-text-primary">
              Natijangiz
            </h2>

            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">
                {correctCount}
              </span>{" "}
              / {tests.length} to‘g‘ri javob
            </p>

            {correctCount === tests.length ? (
              <p className="text-xs text-primary">
                Perfect! Sizga 5 coin berildi ✨
              </p>
            ) : (
              <p className="text-xs text-text-muted">
                Yana bir marta urinib ko‘ring.
              </p>
            )}

            <button
              onClick={() => router.back()}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] active:scale-[0.99]"
            >
              Orqaga qaytish
            </button>
          </div>
        ) : (
          <>
            {/* Question */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-text-muted">
                So‘z #{index + 1}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-text-primary">
                {current.word}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map((opt, i) => {
                const isSelected = selected === opt;
                const isCorrect = selected && opt === current.correct;
                const isWrong = selected === opt && opt !== current.correct;

                const base =
                  "w-full rounded-2xl border px-4 py-3 text-sm font-semibold text-left transition focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]";
                const idle =
                  "border-border bg-surface hover:bg-surface-alt text-text-primary";
                const correct =
                  "border-success bg-success-soft text-text-primary";
                const wrong = "border-danger bg-danger-soft text-text-primary";

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className={[
                      base,
                      isCorrect ? correct : "",
                      isWrong ? wrong : "",
                      !isSelected && !isCorrect && !isWrong ? idle : "",
                      selected ? "cursor-default" : "cursor-pointer",
                    ].join(" ")}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {selected && (
              <div className="mt-4 rounded-2xl border border-border bg-surface-alt p-3 text-sm text-text-secondary">
                {selected === current.correct ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-success" size={18} />
                    To‘g‘ri javob
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <XCircle className="text-danger mt-0.5" size={18} />
                    <div>
                      <div>Noto‘g‘ri javob.</div>
                      <div className="mt-1">
                        To‘g‘ri javob:{" "}
                        <span className="font-semibold text-text-primary">
                          {current.correct}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sub hint */}
            <p className="mt-4 text-xs text-text-muted">
              Tip: javobni tanlang — keyin avtomatik keyingi savolga o‘tadi.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

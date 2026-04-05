"use client";

import { useEffect, useState, useCallback } from "react";
import { Flame, CheckCircle2, Star, Zap, Trophy, BookOpen } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProgressSectionProps {
  userCourses: {
    id: string;
    title: string;
    lessons: { isVisible: boolean; isCompleted?: boolean }[];
  }[];
  userName?: string;
}

interface DailyQuestion {
  question: string;
  options: string[];
  correct: number;
  reward: number; // coin
}

// ─── Static daily questions (rotate by day) ───────────────────────────────────

const QUESTIONS: DailyQuestion[] = [
  {
    question: "Ingliz tilida 'I have been studying' qaysi zamonga tegishli?",
    options: ["Past Simple", "Present Perfect Continuous", "Future Simple", "Past Perfect"],
    correct: 1,
    reward: 10,
  },
  {
    question: "Nemis tilida 'Guten Morgen' nima degani?",
    options: ["Xayrli kech", "Rahmat", "Xayrli tong", "Salom"],
    correct: 2,
    reward: 10,
  },
  {
    question: "'She doesn't know' jumlasida qaysi yordamchi fe'l ishlatilgan?",
    options: ["do", "does", "did", "is"],
    correct: 1,
    reward: 10,
  },
  {
    question: "Fransuz tilida 'Merci' nima degani?",
    options: ["Iltimos", "Rahmat", "Kechirasiz", "Salom"],
    correct: 1,
    reward: 10,
  },
  {
    question: "'Vocabulary' so'zining tarjimasi qaysi?",
    options: ["Grammatika", "Talaffuz", "Lug'at", "Jumla"],
    correct: 2,
    reward: 10,
  },
  {
    question: "Ingliz tilida 'Will + V1' qaysi zamon?",
    options: ["Present Simple", "Past Continuous", "Future Simple", "Present Perfect"],
    correct: 2,
    reward: 10,
  },
  {
    question: "Yapon tilida 'Arigatou' nima degani?",
    options: ["Salom", "Xayrli tong", "Rahmat", "Ha"],
    correct: 2,
    reward: 10,
  },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────

const getToday = () => new Date().toISOString().slice(0, 10); // "2025-07-14"

const loadState = () => {
  try {
    const raw = localStorage.getItem("seven_edu_progress");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveState = (state: object) => {
  try {
    localStorage.setItem("seven_edu_progress", JSON.stringify(state));
  } catch {}
};

// ─── Component ────────────────────────────────────────────────────────────────

const ProgressSection = ({ userCourses, userName }: ProgressSectionProps) => {
  const today = getToday();
  const dayIndex = new Date().getDay(); // 0-6
  const dailyQ = QUESTIONS[dayIndex % QUESTIONS.length];

  // Persisted state
  const [streak, setStreak] = useState(0);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [quizDoneToday, setQuizDoneToday] = useState(false);
  const [coins, setCoins] = useState(0);
  const [lastCheckin, setLastCheckin] = useState<string | null>(null);

  // UI state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(null);
  const [coinAnim, setCoinAnim] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = loadState();
    if (!saved) return;
    setCoins(saved.coins ?? 0);
    setLastCheckin(saved.lastCheckin ?? null);

    // streak logic
    if (saved.lastCheckin === today) {
      setCheckedInToday(true);
      setStreak(saved.streak ?? 0);
    } else if (saved.lastCheckin === getPrevDay(today)) {
      setStreak(saved.streak ?? 0); // keep streak, just haven't checked in yet today
    } else {
      setStreak(0); // streak broken
    }

    if (saved.quizDate === today) {
      setQuizDoneToday(true);
      setQuizResult(saved.quizResult ?? null);
      setSelectedOption(saved.selectedOption ?? null);
    }
  }, [today]);

  const getPrevDay = (d: string) => {
    const dt = new Date(d);
    dt.setDate(dt.getDate() - 1);
    return dt.toISOString().slice(0, 10);
  };

  // Check-in handler
  const handleCheckin = useCallback(() => {
    if (checkedInToday) return;
    const newStreak = lastCheckin === getPrevDay(today) ? streak + 1 : 1;
    const newCoins = coins + 5;
    setStreak(newStreak);
    setCheckedInToday(true);
    setCoins(newCoins);
    setLastCheckin(today);
    setCoinAnim(true);
    setTimeout(() => setCoinAnim(false), 1000);
    saveState({
      streak: newStreak,
      coins: newCoins,
      lastCheckin: today,
      quizDate: quizDoneToday ? today : null,
      quizResult,
      selectedOption,
    });
  }, [checkedInToday, coins, lastCheckin, quizDoneToday, quizResult, selectedOption, streak, today]);

  // Quiz answer handler
  const handleAnswer = useCallback(
    (idx: number) => {
      if (quizDoneToday) return;
      const isCorrect = idx === dailyQ.correct;
      setSelectedOption(idx);
      setQuizResult(isCorrect ? "correct" : "wrong");
      setQuizDoneToday(true);
      const newCoins = isCorrect ? coins + dailyQ.reward : coins;
      if (isCorrect) {
        setCoins(newCoins);
        setCoinAnim(true);
        setTimeout(() => setCoinAnim(false), 1000);
      }
      saveState({
        streak,
        coins: newCoins,
        lastCheckin,
        quizDate: today,
        quizResult: isCorrect ? "correct" : "wrong",
        selectedOption: idx,
      });
    },
    [coins, dailyQ, lastCheckin, quizDoneToday, streak, today]
  );

  // Course progress calc
  const getCourseProgress = (course: ProgressSectionProps["userCourses"][0]) => {
    const visible = course.lessons.filter((l) => l.isVisible);
    const completed = visible.filter((l) => l.isCompleted);
    if (!visible.length) return 0;
    return Math.round((completed.length / visible.length) * 100);
  };

  // Streak fire color
  const streakColor =
    streak >= 30 ? "#f59e0b" : streak >= 7 ? "#f97316" : streak >= 3 ? "#ef4444" : "#94a3b8";

  return (
    <div className="space-y-4 mb-8">
      {/* ── ROW 1: Streak + Coin ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-4">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-orange-100/60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={20} style={{ color: streakColor }} />
              <span className="text-xs font-semibold text-orange-700">Streak</span>
            </div>
            <div className="text-3xl font-black text-orange-600 leading-none">{streak}</div>
            <div className="text-[11px] text-orange-500 mt-1">
              {streak === 0
                ? "Bugun boshlang! 🔥"
                : streak === 1
                ? "Zo'r boshlanish!"
                : `${streak} kun ketma-ket`}
            </div>
          </div>
        </div>

        {/* Coin card */}
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-4 transition-transform ${
            coinAnim ? "scale-105" : ""
          }`}
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-violet-100/60" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Star size={20} className="text-violet-500" fill="currentColor" />
              <span className="text-xs font-semibold text-violet-700">Coinlar</span>
            </div>
            <div className="text-3xl font-black text-violet-600 leading-none">{coins}</div>
            <div className="text-[11px] text-violet-500 mt-1">Yig'ilgan mukofot</div>
          </div>
          {coinAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-violet-600 animate-bounce">+🌟</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CHECK-IN ── */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Kunlik check-in</p>
            <p className="text-xs text-text-secondary mt-0.5">
              {checkedInToday ? "Bugun allaqachon tekshirdingiz ✓" : "Bugun kirganingizni tasdiqlang — +5 coin"}
            </p>
          </div>
          <button
            onClick={handleCheckin}
            disabled={checkedInToday}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              checkedInToday
                ? "bg-emerald-100 text-emerald-600 cursor-default"
                : "bg-primary text-white hover:bg-primary-hover active:scale-95 shadow-sm"
            }`}
          >
            <CheckCircle2 size={15} />
            {checkedInToday ? "Bajarildi" : "Check-in"}
          </button>
        </div>

        {/* Streak week dots */}
        <div className="mt-4 flex items-center gap-2">
          {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map((day, i) => {
            const todayDow = (new Date().getDay() + 6) % 7; // Mon=0
            const isPast = i < todayDow;
            const isToday = i === todayDow;
            const filled = isToday ? checkedInToday : isPast;
            return (
              <div key={day} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`h-2 w-full rounded-full transition-colors ${
                    filled
                      ? "bg-orange-400"
                      : isToday
                      ? "bg-orange-200"
                      : "bg-slate-100"
                  }`}
                />
                <span className={`text-[10px] font-medium ${isToday ? "text-orange-500" : "text-text-muted"}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>


      {/* ── COURSE PROGRESS ── */}
      {userCourses.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-amber-500" />
            <p className="text-sm font-semibold text-text-primary">Kurslar progressi</p>
          </div>
          <div className="space-y-3">
            {userCourses.map((course) => {
              const prog = getCourseProgress(course);
              const visibleCount = course.lessons.filter((l) => l.isVisible).length;
              const completedCount = course.lessons.filter((l) => l.isVisible && l.isCompleted).length;
              return (
                <div key={course.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen size={13} className="text-primary shrink-0" />
                      <span className="text-xs font-medium text-text-primary truncate">{course.title}</span>
                    </div>
                    <span className="text-[11px] font-bold text-primary ml-2 shrink-0">
                      {completedCount}/{visibleCount}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-text-muted">
                      {prog === 0 ? "Hali boshlanmagan" : prog === 100 ? "✓ Tugatildi!" : "Davom etmoqda..."}
                    </span>
                    <span className="text-[10px] font-semibold text-primary">{prog}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
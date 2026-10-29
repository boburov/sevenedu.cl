"use client";

import React, { useEffect, useMemo, useState } from "react";
import api, { getMe } from "@/app/api/service/api";
import { Check, Lock, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import apiEndpoins from "@/app/api/api.endpoin";

interface Lesson {
  id: string;
  videoUrl: string;
  title: string;
  isVisible: boolean;
  isDemo?: boolean;
}

interface UserCourse {
  courseId: string;
  subscription: "FULL_CHARGE" | "MONTHLY";
}

interface User {
  id: string;
  name: string;
  courses: UserCourse[];
}

// Kichik belgilar qobiq bilan bir xil chiziq qalinligida.
const BADGE_ICON = { size: 13, strokeWidth: 1.75 } as const;

const CourseLessonsPage: React.FC = () => {
  const params = useParams() as { id?: string };
  const courseId = String(params?.id || "");
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [userSubscription, setUserSubscription] = useState<
    "FULL_CHARGE" | "MONTHLY" | null
  >(null);
  const [userHasCourse, setUserHasCourse] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        // 1️⃣ userni olish
        const user: User = await getMe();

        const foundCourse = user.courses?.find((uc) => uc.courseId === courseId);

        if (foundCourse) {
          setUserHasCourse(true);
          setUserSubscription(foundCourse.subscription);
        } else {
          setUserHasCourse(false);
          setUserSubscription(null);
        }

        // 2️⃣ darslarni olish
        const res = await api.get(apiEndpoins.getCategory(courseId));

        setCourseTitle(res.data?.title || "");
        setLessons(res.data.lessons || []);
      } catch (err: any) {
        console.error("❌ Xatolik:", err?.message || err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const openLesson = (lesson: Lesson, index: number) => {
    let isLocked = false;

    if (!userHasCourse && lesson.isDemo === false) {
      isLocked = true;
    } else if (userHasCourse && userSubscription === "MONTHLY" && index >= 12) {
      isLocked = true;
    }

    if (isLocked) {
      window.open("https://t.me/HR7EDU", "_blank");
      return;
    }

    router.push(`/courses/${courseId}/lessons/${lesson.id}`);
  };

  const visibleLessons = useMemo(
    () => lessons.filter((e) => e.isVisible === true),
    [lessons]
  );

  const isLessonLocked = (lesson: Lesson, index: number) =>
    (!userHasCourse && lesson.isDemo === false) ||
    (userHasCourse && userSubscription === "MONTHLY" && index >= 12);

  // "current" = first unlocked lesson
  const currentIndex = useMemo(() => {
    const idx = visibleLessons.findIndex((l, i) => !isLessonLocked(l, i));
    return idx === -1 ? 0 : idx;
  }, [visibleLessons, userHasCourse, userSubscription]);

  const planLabel = userHasCourse
    ? userSubscription === "FULL_CHARGE"
      ? "To'liq kurs"
      : "Oylik obuna"
    : "Demo rejim";

  if (isLoading) {
    return (
      <div className="page py-10">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-[15px] text-text-secondary">
              Darslar yuklanmoqda…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page py-8 sm:py-10">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
          {courseTitle || "Kurs darslari"}
        </h1>
        <p className="mt-2 text-[15px] text-text-secondary">
          {visibleLessons.length} ta dars · {planLabel}
        </p>
      </header>

      {visibleLessons.length === 0 ? (
        <div className="mx-auto max-w-md rounded-card border border-border bg-surface p-10 text-center">
          <h2 className="text-lg font-semibold text-text-primary">
            Hozircha darslar yo&apos;q
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Tez orada yangi darslar qo&apos;shiladi.
          </p>
        </div>
      ) : (
        <ol className="mx-auto max-w-3xl space-y-3">
          <AnimatePresence mode="popLayout">
            {visibleLessons.map((lesson, index) => {
              const locked = isLessonLocked(lesson, index);
              const isCurrent = index === currentIndex && !locked;
              const isDone = index < currentIndex && !locked;

              return (
                <motion.li
                  key={lesson.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.3),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex gap-4"
                >
                  {/* Bosqich ustuni: tugun + uni keyingisiga ulovchi chiziq */}
                  <div className="flex shrink-0 flex-col items-center">
                    <LessonNode
                      locked={locked}
                      isCurrent={isCurrent}
                      isDone={isDone}
                      step={index + 1}
                    />
                    {index !== visibleLessons.length - 1 && (
                      <div
                        className={`w-px flex-1 ${
                          isDone ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>

                  <LessonCard
                    lesson={lesson}
                    index={index}
                    locked={locked}
                    isCurrent={isCurrent}
                    isDone={isDone}
                    onClick={() => openLesson(lesson, index)}
                  />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}
    </div>
  );
};

// Bosqich tuguni. Uch holat ko'z bilan darhol ajraladi — oldingi dizaynda
// "tugallangan" va "keyingi" bir xil binafsha gradient edi:
//   tugallangan — qora to'ldirilgan
//   joriy       — orange to'ldirilgan (dashboard'dagi "bugun" ustuni kabi)
//   keyingi     — oq, chegarali
const LessonNode = ({
  locked,
  isCurrent,
  isDone,
  step,
}: {
  locked: boolean;
  isCurrent: boolean;
  isDone: boolean;
  step: number;
}) => {
  const base =
    "grid h-10 w-10 shrink-0 place-items-center rounded-tile border text-[13px] font-semibold";

  if (locked) {
    return (
      <span
        className={`${base} border-border bg-surface-alt text-text-muted`}
        aria-label="Yopiq dars"
      >
        <Lock size={16} strokeWidth={1.75} />
      </span>
    );
  }
  if (isDone) {
    return (
      <span
        className={`${base} border-primary bg-primary text-primary-foreground`}
        aria-label="Tugallangan dars"
      >
        <Check size={17} strokeWidth={2} />
      </span>
    );
  }
  if (isCurrent) {
    return (
      <span
        className={`${base} border-accent bg-accent text-accent-foreground`}
        aria-label="Joriy dars"
      >
        <Play size={15} strokeWidth={1.75} fill="currentColor" />
      </span>
    );
  }
  return (
    <span className={`${base} border-border bg-surface text-text-secondary`}>
      {step}
    </span>
  );
};

const LessonCard: React.FC<{
  lesson: Lesson;
  index: number;
  locked: boolean;
  isCurrent: boolean;
  isDone: boolean;
  onClick: () => void;
}> = ({ lesson, index, locked, isCurrent, isDone, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`focus-ring mb-3 flex-1 rounded-card border p-4 text-left transition-colors ${
      locked
        ? "border-border bg-surface-alt hover:border-border-strong"
        : isCurrent
          ? "border-accent bg-surface"
          : "border-border bg-surface hover:border-border-strong"
    }`}
  >
    <div className="mb-2 flex flex-wrap items-center gap-1.5">
      <Badge tone="neutral">{index + 1}-bosqich</Badge>

      {lesson.isDemo && <Badge tone="accent-soft">Demo</Badge>}

      {isCurrent && <Badge tone="accent">Siz shu yerdasiz</Badge>}

      {locked && (
        <Badge tone="neutral">
          <Lock {...BADGE_ICON} />
          Yopiq
        </Badge>
      )}

      {isDone && !isCurrent && (
        <Badge tone="success">
          <Check {...BADGE_ICON} strokeWidth={2} />
          Tugallandi
        </Badge>
      )}
    </div>

    <h3
      className={`line-clamp-2 text-[15px] font-semibold ${
        locked ? "text-text-muted" : "text-text-primary"
      }`}
    >
      {lesson.title}
    </h3>

    <p
      className={`mt-1 text-[13px] ${
        locked ? "text-text-muted" : "text-text-secondary"
      }`}
    >
      {locked
        ? "Kirish uchun obuna kerak"
        : isDone
          ? "Tugallangan dars"
          : isCurrent
            ? "Hozir boshlang"
            : "Davom eting"}
    </p>
  </button>
);

const BADGE_TONES = {
  neutral: "border-border bg-surface-alt text-text-secondary",
  accent: "border-accent bg-accent text-accent-foreground",
  "accent-soft": "border-accent/30 bg-accent-soft text-accent-strong",
  success: "border-success/30 bg-success-soft text-success",
} as const;

const Badge = ({
  tone,
  children,
}: {
  tone: keyof typeof BADGE_TONES;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${BADGE_TONES[tone]}`}
  >
    {children}
  </span>
);

export default CourseLessonsPage;

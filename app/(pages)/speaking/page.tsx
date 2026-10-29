"use client";

// Talaffuz mashqlari uchun kirish nuqtasi (sidebar → Speaking).
//
// Bu sahifa HECH QANDAY yangi so'rov qilmaydi: kurslar, darslar va ko'rilgan
// darslar ro'yxati MeContext'da qobiq darajasida allaqachon yuklangan.
// So'zlar soni ataylab ko'rsatilmaydi — u /dictonary/lesson/:id dan keladi,
// ya'ni har bir dars uchun alohida so'rov bo'lardi (3 kurs × 20 dars = 60 ta).
// Talaffuz natijasi ham ko'rsatilmaydi: u hech qayerda saqlanmaydi.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, ChevronDown, Mic, Play } from "lucide-react";
import {
  COURSE_DOTS,
  courseProgress,
  useMe,
  type Me,
  type MeCourse,
} from "@/app/components/shell/MeContext";

const speakingHref = (courseId: string, lessonId: string) =>
  `/courses/${courseId}/lessons/${lessonId}/speaking`;

const visibleLessons = (course: MeCourse) =>
  (course.lessons || []).filter((l) => l.isVisible !== false);

/** Oxirgi ko'rilgan dars — "Davom ettirish" kartasi uchun. */
const lastWatched = (me: Me | null, courses: MeCourse[]) => {
  const watched = [...(me?.showedLesson || [])].sort(
    (a, b) => +new Date(b.watchedAt) - +new Date(a.watchedAt),
  );

  for (const entry of watched) {
    for (const course of courses) {
      const lesson = visibleLessons(course).find((l) => l.id === entry.lessonsId);
      if (lesson) return { course, lesson };
    }
  }
  return null;
};

const SpeakingPage = () => {
  const { me, myCourses, loading } = useMe();

  // Brauzer tekshiruvi faqat mijozda bajariladi. Boshlang'ich qiymat null —
  // "hali bilmaymiz", shunda serverdan kelgan HTML'da ogohlantirish miltillab
  // ketmaydi.
  const [sttSupported, setSttSupported] = useState<boolean | null>(null);
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSttSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const resume = useMemo(() => lastWatched(me, myCourses), [me, myCourses]);

  // Oxirgi ko'rilgan dars qaysi kursda bo'lsa, o'sha kurs ochiq turadi.
  // Hech biri bo'lmasa — birinchisi. Sahifa hech qachon butunlay yopiq
  // ro'yxat bilan ochilmaydi.
  const [openId, setOpenId] = useState<string | null>(null);
  const defaultOpenId = resume?.course.id ?? myCourses[0]?.id ?? null;
  const activeId = openId ?? defaultOpenId;

  return (
    <div className="page py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
          Talaffuz mashqi
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-6 text-text-secondary">
          Darsdagi so&apos;zlarni tinglang, ovoz chiqarib ayting va talaffuzingiz
          qanchalik to&apos;g&apos;ri chiqqanini ko&apos;ring.
        </p>
      </header>

      {sttSupported === false && <UnsupportedBrowser />}

      {loading ? (
        <Skeleton />
      ) : myCourses.length === 0 ? (
        <NoCourses />
      ) : (
        <>
          {resume && (
            <ResumeCard course={resume.course} lesson={resume.lesson} />
          )}

          <h2 className="mb-3 mt-10 text-[13px] font-semibold uppercase tracking-wide text-text-muted">
            Kurslaringiz
          </h2>
          <ul role="list" className="space-y-4">
            {myCourses.map((course, i) => (
              <li key={course.id}>
                <CourseGroup
                  course={course}
                  me={me}
                  dot={COURSE_DOTS[i % COURSE_DOTS.length]}
                  open={course.id === activeId}
                  onToggle={() =>
                    setOpenId(course.id === activeId ? "" : course.id)
                  }
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

/* ── Holatlar ──────────────────────────────────────────────────────────── */

// Firefox'da SpeechRecognition yo'q. Kirishni to'smaymiz: tinglash (TTS)
// hamma joyda ishlaydi, faqat "aytish" qismi ishlamaydi.
const UnsupportedBrowser = () => (
  <div
    role="status"
    className="mb-8 flex items-start gap-3 rounded-card border border-warning/30 bg-warning-soft px-5 py-4"
  >
    <AlertCircle
      size={18}
      strokeWidth={2}
      className="mt-0.5 shrink-0 text-text-primary"
    />
    <div>
      <p className="text-sm font-semibold text-text-primary">
        Bu brauzer ovozni tanimaydi
      </p>
      <p className="mt-1 text-sm leading-6 text-text-primary/80">
        So&apos;zlarni tinglay olasiz, lekin aytganingiz tekshirilmaydi. Mashqni
        to&apos;liq ishlatish uchun Chrome, Edge yoki Safari&apos;da oching.
      </p>
    </div>
  </div>
);

const Skeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-label="Kurslar yuklanmoqda">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-[76px] animate-pulse rounded-card border border-border bg-surface-alt"
      />
    ))}
  </div>
);

const NoCourses = () => (
  <div
    role="status"
    className="rounded-card border border-border bg-surface px-6 py-12 text-center"
  >
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-tile border border-border bg-surface-alt text-text-secondary">
      <Mic size={22} strokeWidth={1.75} />
    </span>
    <h2 className="mt-4 text-[17px] font-semibold text-text-primary">
      Mashq qilish uchun kurs kerak
    </h2>
    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
      Talaffuz mashqi dars so&apos;zlari ustida ishlaydi. Avval biror kursga
      yoziling.
    </p>
    <Link
      href="/courses"
      className="focus-ring mt-6 inline-flex h-11 items-center rounded-button bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
    >
      Kurslarni ko&apos;rish
    </Link>
  </div>
);

/* ── Davom ettirish ────────────────────────────────────────────────────── */

const ResumeCard = ({
  course,
  lesson,
}: {
  course: MeCourse;
  lesson: MeCourse["lessons"][number];
}) => (
  <div className="flex flex-col gap-5 rounded-card border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-[13px] text-text-secondary">
        Oxirgi ko&apos;rgan darsingiz
      </p>
      <p className="mt-1 truncate text-xl font-semibold text-text-primary">
        {lesson.title || "Dars"}
      </p>
      <p className="mt-1 truncate text-sm text-text-secondary">
        {course.title}
      </p>
    </div>
    <Link
      href={speakingHref(course.id, lesson.id)}
      className="focus-ring inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-button bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
    >
      <Play size={18} strokeWidth={2} />
      Shu darsni mashq qilish
    </Link>
  </div>
);

/* ── Kurs va darslar ───────────────────────────────────────────────────── */

const CourseGroup = ({
  course,
  me,
  dot,
  open,
  onToggle,
}: {
  course: MeCourse;
  me: Me | null;
  dot: string;
  open: boolean;
  onToggle: () => void;
}) => {
  const lessons = visibleLessons(course);
  const { done, total } = courseProgress(course, me);
  const panelId = `speaking-course-${course.id}`;
  const watchedIds = new Set((me?.showedLesson || []).map((s) => s.lessonsId));

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="focus-ring flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-alt"
      >
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-text-primary">
            {course.title}
          </span>
          <span className="mt-0.5 block text-[13px] text-text-secondary">
            {total} dars &middot; {done} tasi ko&apos;rilgan
          </span>
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden
          className={`shrink-0 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Panel yopiq bo'lsa ham DOM'da qoladi (hidden) — aria-controls
          mavjud elementga ishora qilishi shart. */}
      <div id={panelId} hidden={!open} className="border-t border-border">
        {lessons.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-text-secondary">
            Bu kursda hali ochiq dars yo&apos;q.
          </p>
        ) : (
          // Ichma-ich kartochka emas — bitta kartochka ichidagi ajratgichli
          // qatorlar. Shuning uchun chegara faqat qatorlar orasida.
          <ul role="list" className="divide-y divide-border">
            {lessons.map((lesson, i) => (
              <li key={lesson.id}>
                <LessonRow
                  href={speakingHref(course.id, lesson.id)}
                  index={i + 1}
                  title={lesson.title || `${i + 1}-dars`}
                  watched={watchedIds.has(lesson.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const LessonRow = ({
  href,
  index,
  title,
  watched,
}: {
  href: string;
  index: number;
  title: string;
  watched: boolean;
}) => (
  <Link
    href={href}
    className="focus-ring group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-alt"
  >
    <span className="w-6 shrink-0 text-right text-[13px] tabular-nums text-text-muted">
      {index}
    </span>
    <span className="min-w-0 flex-1 truncate text-[15px] text-text-primary">
      {title}
    </span>

    {/* Holat faqat rang bilan emas, belgi va matn bilan ham beriladi.
        Tor ekranda matnga joy yo'q — faqat belgi qoladi, lekin matn
        ekran o'quvchisi uchun saqlanadi (sr-only). */}
    {watched ? (
      <span className="flex shrink-0 items-center gap-1.5 text-[13px] text-success">
        <Check size={15} strokeWidth={2.25} aria-hidden />
        <span className="sr-only sm:not-sr-only">Ko&apos;rilgan</span>
      </span>
    ) : (
      <span className="sr-only shrink-0 text-[13px] text-text-muted sm:not-sr-only">
        Ko&apos;rilmagan
      </span>
    )}

    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-tile border border-border bg-surface text-text-secondary transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
      <Mic size={16} strokeWidth={1.75} aria-hidden />
    </span>
  </Link>
);

export default SpeakingPage;

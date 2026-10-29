"use client";

import { allCourse, getStreak } from "@/app/api/service/api";
import {
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  ChartArea,
  Flame,
  Lock,
  Medal,
  Mic,
  Play,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSafeThumbnail, PLACEHOLDER_THUMBNAIL } from "@/app/lib/thumbnail";
import { formatUzDate, lastSevenDays, lessonsByDay, weekdayOf } from "@/app/lib/week";
import { Avatar } from "@/app/components/shell/AppShell";
import {
  COURSE_DOTS,
  courseProgress,
  fullName,
  MeCourse,
  useMe,
} from "@/app/components/shell/MeContext";

type Streak = Awaited<ReturnType<typeof getStreak>>;

// Kurs teglari uchun yumshoq ranglar (2-referensdagi "Design / Development" kabi)
const TAG_STYLES = [
  "bg-primary-soft text-primary",
  "bg-warning-soft text-warning",
  "bg-info-soft text-info",
  "bg-success-soft text-success",
  "bg-danger-soft text-danger",
];

const quickLinks = [
  { href: "/dashboard", icon: ChartArea, label: "Dashboard va statistika" },
  { href: "/rank", icon: Medal, label: "Reyting jadvali" },
  { href: "/speaking", icon: Mic, label: "Speaking mashqlari" },
  { href: "/dashboard/certificate", icon: Award, label: "Sertifikatlarim" },
  { href: "/notifications", icon: Bell, label: "Bildirishnomalar" },
];

const visibleLessons = (c: MeCourse) =>
  (c.lessons || [])
    .filter((l) => l.isVisible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));


const HomePage = () => {
  const { me, myCourses, loading } = useMe();
  const [allCourses, setAllCourses] = useState<MeCourse[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    allCourse()
      .then(setAllCourses)
      .catch(() => null);
    getStreak()
      .then(setStreak)
      .catch(() => null);
  }, []);

  const seen = useMemo(() => me?.showedLesson || [], [me]);
  const seenIds = useMemo(() => new Set(seen.map((s) => s.lessonsId)), [seen]);

  const progress = useMemo(
    () =>
      myCourses.map((c, i) => ({
        course: c,
        ...courseProgress(c, me),
        tag: TAG_STYLES[i % TAG_STYLES.length],
        dot: COURSE_DOTS[i % COURSE_DOTS.length],
        next: visibleLessons(c).find((l) => !seenIds.has(l.id)),
      })),
    [myCourses, me, seenIds],
  );

  const totals = useMemo(() => {
    const done = progress.reduce((s, p) => s + p.done, 0);
    const total = progress.reduce((s, p) => s + p.total, 0);
    return { done, percent: total ? Math.round((done / total) * 100) : 0 };
  }, [progress]);

  // Davom ettirish: oxirgi ko'rilgan dars qaysi kursda bo'lsa — o'sha kursning
  // keyingi ko'rilmagan darsi; hech narsa ko'rilmagan bo'lsa birinchi kurs.
  const current = useMemo(() => {
    const last = [...seen].sort(
      (a, b) => +new Date(b.watchedAt) - +new Date(a.watchedAt),
    )[0];
    const byLast =
      last &&
      progress.find((p) =>
        p.course.lessons.some((l) => l.id === last.lessonsId),
      );
    return byLast || progress.find((p) => p.next) || progress[0];
  }, [seen, progress]);

  const upNext = useMemo(() => {
    if (!current) return [];
    return visibleLessons(current.course)
      .filter((l) => !seenIds.has(l.id))
      .slice(0, 5);
  }, [current, seenIds]);

  const week = useMemo(() => {
    const byDay = lessonsByDay(seen);
    return lastSevenDays().map((d) => ({ ...d, value: byDay[d.key] || 0 }));
  }, [seen]);
  const weekMax = Math.max(1, ...week.map((d) => d.value));
  const activeBar = hovered ?? week.length - 1;

  const lastActive = [...seen].sort(
    (a, b) => +new Date(b.watchedAt) - +new Date(a.watchedAt),
  )[0]?.watchedAt;
  const ownedIds = new Set(myCourses.map((c) => c.id));
  const continueHref = current?.next
    ? `/courses/${current.course.id}/lessons/${current.next.id}`
    : current
      ? `/courses/${current.course.id}`
      : "/courses";

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* ── Sarlavha ─────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs text-text-muted">
            O&apos;quvchi:
            <Avatar size={20} />
            <span className="font-medium text-text-secondary">
              {fullName(me) || "…"}
            </span>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Salom{me?.name ? `, ${me.name}` : ""}!
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            <span>
              Oxirgi faollik:{" "}
              <span className="inline-flex items-center gap-1 font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {formatUzDate(lastActive)}
              </span>
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="inline-flex items-center gap-1">
              <Flame size={13} className="text-warning" />
              {streak?.currentStreak ?? 0} kunlik streak
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/courses"
            aria-label="Barcha kurslar"
            className="grid h-11 w-11 place-items-center rounded-button border border-border bg-surface text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <BookOpen size={18} />
          </Link>
          <Link
            href={continueHref}
            className="inline-flex h-11 items-center gap-2 rounded-button border border-text-primary bg-text-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary hover:border-primary"
          >
            <Play size={16} /> Davom ettirish
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
        {/* ── Asosiy ustun ───────────────────────────── */}
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            {/* O'quv progressi */}
            <div className="rounded-card border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">
                  O&apos;quv progressi
                </h2>
                <span className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
                    Bugun
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />{" "}
                    Hafta
                  </span>
                </span>
              </div>

              <div className="mt-4 grid grid-cols-[112px_1fr] gap-4 sm:grid-cols-[140px_1fr]">
                <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-primary bg-primary p-3 text-white">
                  <span className="text-xs text-white/80">Umumiy</span>
                  <svg
                    viewBox="0 0 120 50"
                    className="absolute inset-x-0 top-1/3 w-full"
                    aria-hidden
                  >
                    <path
                      d="M0 30 C 25 5, 45 5, 60 25 S 100 45, 120 15"
                      fill="none"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M0 30 C 25 5, 45 5, 60 25 S 100 45, 120 15 V50 H0 Z"
                      fill="rgba(255,255,255,0.12)"
                    />
                  </svg>
                  <span className="relative text-right text-3xl font-bold italic">
                    {totals.percent}%
                  </span>
                </div>

                <div className="flex h-40 items-end gap-2 pt-6">
                  {week.map((d, i) => {
                    const isActive = i === activeBar;
                    const h = Math.max(
                      6,
                      Math.round((d.value / weekMax) * 100),
                    );
                    return (
                      <div
                        key={d.key}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div className="relative flex w-full flex-1 items-end justify-center">
                          {isActive && (
                            <span
                              className="absolute mb-1 whitespace-nowrap text-[11px] font-semibold text-text-primary"
                              style={{ bottom: `${h}%` }}
                            >
                              {d.value} dars
                            </span>
                          )}
                          <div
                            className={`w-full max-w-5 rounded-md border ${
                              isActive
                                ? "border-primary bg-primary"
                                : "border-primary/15 bg-primary-soft"
                            }`}
                            style={{
                              height: `${h}%`,
                              backgroundImage: isActive
                                ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0 2px, transparent 2px 6px)"
                                : undefined,
                            }}
                          />
                        </div>
                        <span
                          className={`text-[11px] ${d.isToday ? "font-semibold text-text-primary" : "text-text-muted"}`}
                        >
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex flex-col rounded-card border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold text-text-primary">
                Streak
              </h2>
              <p className="text-xs text-text-muted">Ketma-ket faol kunlar</p>
              <p className="mt-4 text-4xl font-bold text-text-primary">
                {streak?.currentStreak ?? 0}
                <span className="ml-1 text-base font-medium text-text-muted">
                  kun
                </span>
              </p>
              <div className="mt-4 flex justify-between">
                {(streak?.weekDays || []).map((d) => (
                  <span
                    key={d.date}
                    title={`${weekdayOf(d.date)} · ${d.date}`}
                    className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] ${
                      d.active
                        ? "border-warning bg-warning text-white"
                        : d.isToday
                          ? "border-primary text-primary"
                          : "border-border text-text-muted"
                    }`}
                  >
                    {d.active ? <Flame size={11} /> : weekdayOf(d.date)}
                  </span>
                ))}
              </div>
              <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full border border-success/30 bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                Rekord: {streak?.longestStreak ?? 0} kun
              </span>
            </div>
          </div>

          {/* Davom etayotgan kurslar */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-text-primary">
              Davom etayotgan kurslar
            </h2>
            {loading ? (
              <div className="rounded-card border border-border bg-surface p-6 text-sm text-text-muted">
                Yuklanmoqda…
              </div>
            ) : progress.length === 0 ? (
              <div className="rounded-card border border-dashed border-border-strong bg-surface p-6 text-center">
                <p className="text-sm text-text-secondary">
                  Sizda hali kurs yo&apos;q.
                </p>
                <Link
                  href="/courses"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                >
                  Kurslarni ko&apos;rish <ArrowUpRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {progress.map(({ course, done, total, percent, tag, next }) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group rounded-card border border-border bg-surface p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tag}`}
                      >
                        {course.shortName || "Kurs"}
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-text-muted transition-colors group-hover:text-primary"
                      />
                    </div>
                    <h3 className="mt-3 truncate font-semibold text-text-primary">
                      {course.title}
                    </h3>
                    <p className="mt-1 truncate text-xs text-text-muted">
                      Keyingi: {next?.title || "Barcha darslar ko'rilgan 🎉"}
                    </p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <PlayCircle size={13} /> {done}/{total} dars
                      </span>
                      <span className="font-semibold text-text-primary">
                        {percent}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Barcha kurslar */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-text-primary">
              Barcha kurslar
            </h2>
            <div className="overflow-hidden rounded-card border border-border bg-surface">
              <table className="w-full text-sm">
                <thead className="hidden border-b border-border text-left text-xs text-text-muted sm:table-header-group">
                  <tr>
                    <th className="px-4 py-3 font-medium">Kurs</th>
                    <th className="px-4 py-3 font-medium">Holat</th>
                    <th className="px-4 py-3 font-medium">Darslar</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {allCourses.map((c) => {
                    const owned = ownedIds.has(c.id);
                    const count = visibleLessons(c).length;
                    return (
                      <tr
                        key={c.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-alt">
                              <Image
                                src={getSafeThumbnail(c.thumbnail)}
                                alt=""
                                fill
                                sizes="56px"
                                unoptimized
                                className={`object-cover ${owned ? "" : "opacity-60"}`}
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  if (!img.src.endsWith(PLACEHOLDER_THUMBNAIL))
                                    img.src = PLACEHOLDER_THUMBNAIL;
                                }}
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-text-primary">
                                {c.title}
                              </span>
                              <span className="block truncate text-xs text-text-muted sm:hidden">
                                {count} dars · {owned ? "Sizda bor" : "Yopiq"}
                              </span>
                              {c.goal && (
                                <span className="hidden max-w-xs truncate text-xs text-text-muted sm:block">
                                  {c.goal}
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          {owned ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                              <span className="h-1.5 w-1.5 rounded-full bg-success" />{" "}
                              Sizda bor
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-medium text-danger">
                              <span className="h-1.5 w-1.5 rounded-full bg-danger" />{" "}
                              Yopiq
                            </span>
                          )}
                        </td>
                        <td className="hidden px-4 py-3 text-text-secondary sm:table-cell">
                          {count} ta
                        </td>
                        <td className="px-4 py-3 text-right">
                          {owned ? (
                            <Link
                              href={`/courses/${c.id}`}
                              className="inline-flex items-center gap-1.5 rounded-button border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                            >
                              <Play size={13} /> Ko&apos;rish
                            </Link>
                          ) : (
                            <a
                              href="https://t.me/@HR7EDU"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary"
                            >
                              <Lock size={13} /> Buyurtma
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {allCourses.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-sm text-text-muted">
                        Yuklanmoqda…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ── O'ng ustun ─────────────────────────────── */}
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 text-xl font-semibold text-text-primary">
              Tezkor havolalar
            </h2>
            <ul>
              {quickLinks.map(({ href, icon: Icon, label }) => (
                <li key={href} className="border-b border-border">
                  <Link
                    href={href}
                    className="flex items-center gap-3 py-3 text-sm text-text-secondary transition-colors hover:text-primary"
                  >
                    <Icon size={16} className="text-text-muted" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-xl font-semibold text-text-primary">
              Keyingi darslar
            </h2>
            <p className="mt-0.5 truncate text-xs text-text-muted">
              {current?.course.title || "Kurs tanlanmagan"}
            </p>

            {upNext.length === 0 ? (
              <p className="mt-6 text-sm text-text-secondary">
                {current
                  ? "Bu kursdagi barcha darslar ko'rilgan 🎉"
                  : "Kurs sotib olsangiz, darslar shu yerda chiqadi."}
              </p>
            ) : (
              <ol className="relative mt-5 space-y-4 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-border">
                {upNext.map((l, i) => {
                  const first = i === 0;
                  return (
                    <li key={l.id} className="relative flex items-center gap-3">
                      <span
                        className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                          first
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-surface text-text-muted"
                        }`}
                      >
                        {first ? <Play size={13} /> : i + 1}
                      </span>
                      <Link
                        href={`/courses/${current!.course.id}/lessons/${l.id}`}
                        className={`min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                          first
                            ? "border-primary bg-primary font-semibold text-white hover:bg-primary-hover"
                            : "border-border bg-surface-alt text-text-primary hover:border-primary/40"
                        }`}
                      >
                        <span className="block truncate">
                          {l.title || "Dars"}
                        </span>
                        <span
                          className={`text-[11px] ${first ? "text-white/80" : "text-text-muted"}`}
                        >
                          {first
                            ? "Hozir ko'rish"
                            : l.isDemo
                              ? "Demo dars"
                              : "Navbatda"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

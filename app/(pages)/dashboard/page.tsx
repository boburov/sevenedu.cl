"use client";

import {
  getDailyStats,
  getLeaderboard,
  getStreak,
} from "@/app/api/service/api";
import { ArrowUpRight, Flame, PlayCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  COURSE_DOTS,
  courseProgress as progressOf,
  useMe,
} from "@/app/components/shell/MeContext";
import { lastSevenDays, lessonsByDay } from "@/app/lib/week";

type DailyStat = Awaited<ReturnType<typeof getDailyStats>>[number];
type Leaderboard = Awaited<ReturnType<typeof getLeaderboard>>;
type ActivityTab = "lessons" | "vocabulary" | "quiz";

const DashboardPage = () => {
  const { me, myCourses: courses, loading } = useMe();
  const [daily, setDaily] = useState<DailyStat[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [tab, setTab] = useState<ActivityTab>("lessons");
  const [hovered, setHovered] = useState<number | null>(null);

  // Ikkinchi darajali bloklar — xato bo'lsa ham sahifa ochilaveradi
  useEffect(() => {
    getDailyStats()
      .then(setDaily)
      .catch(() => null);
    getStreak()
      .then(setStreak)
      .catch(() => null);
    getLeaderboard()
      .then(setBoard)
      .catch(() => null);
  }, []);

  // Har bir kurs bo'yicha ko'rilgan darslar soni
  const courseProgress = useMemo(
    () =>
      courses.map((course, i) => ({
        course,
        ...progressOf(course, me),
        dot: COURSE_DOTS[i % COURSE_DOTS.length],
      })),
    [courses, me],
  );

  const totals = useMemo(() => {
    const done = courseProgress.reduce((s, c) => s + c.done, 0);
    const total = courseProgress.reduce((s, c) => s + c.total, 0);
    return {
      done,
      total,
      percent: total ? Math.round((done / total) * 100) : 0,
    };
  }, [courseProgress]);

  // Oxirgi 7 kun: har kuni ko'rilgan darslar va (daily-stats dan) so'z/test javoblari
  const week = useMemo(() => {
    const byDay = lessonsByDay(me?.showedLesson);
    const statsByDay = Object.fromEntries(daily.map((d) => [d.date, d]));
    return lastSevenDays().map((d) => ({
      ...d,
      lessons: byDay[d.key] || 0,
      vocabulary: statsByDay[d.key]?.vocabulary.total || 0,
      quiz: statsByDay[d.key]?.quiz.total || 0,
    }));
  }, [daily, me]);

  const values = week.map((d) => d[tab]);
  const weekMax = Math.max(1, ...values);
  const weekTotal = values.reduce((s, v) => s + v, 0);
  const lessonsThisWeek = week.reduce((s, d) => s + d.lessons, 0);
  const unit =
    tab === "lessons" ? "dars" : tab === "vocabulary" ? "so'z" : "savol";
  const active = hovered ?? week.length - 1;

  const fullName = [me?.name, me?.surname].filter(Boolean).join(" ");

  return (
    <section className="page py-6">
      <div>
        {/* ── Asosiy qism ────────────────────────────── */}
        <div className="min-w-0 space-y-6">
          {/* Sahifa sarlavhasi — barcha sahifalarda bir xil pattern:
              katta qalin H1 + bitta qatorli kulrang izoh. */}
          <header>
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
              Dashboard
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary">
              O&apos;quv jarayoningiz, faolligingiz va natijalaringiz.
            </p>
          </header>

          {/* Ko'rsatkichlar */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard
              label="Mening kurslarim"
              value={loading ? "…" : courses.length}
            >
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>Umumiy progress</span>
                <span className="font-semibold text-text-primary">
                  {totals.percent}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${totals.percent}%` }}
                />
              </div>
            </StatCard>

            <StatCard label="Streak" value={`${streak.currentStreak} kun`}>
              <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Flame size={14} className="text-accent" />
                Rekord: {streak.longestStreak} kun
              </p>
            </StatCard>

            <StatCard
              label="Tangalar"
              value={(me?.coins ?? 0).toLocaleString("en-US")}
            >
              <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Trophy size={14} className="text-text-muted" />
                Reytingda:{" "}
                {board?.currentUser ? `#${board.currentUser.rank}` : "—"}
              </p>
            </StatCard>

            <StatCard label="Ko'rilgan darslar" value={totals.done}>
              <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                <PlayCircle size={14} className="text-text-muted" />
                Bu hafta: {lessonsThisWeek}
              </p>
            </StatCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
            {/* Haftalik faollik */}
            <div className="rounded-card border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-text-primary">
                  O&apos;quv faolligi
                </h2>
                <span className="rounded-button border border-border px-3 py-1 text-xs text-text-secondary">
                  Oxirgi 7 kun · {weekTotal} {unit}
                </span>
              </div>

              <div className="mt-4 flex gap-5 border-b border-border text-sm">
                {(
                  [
                    ["lessons", "Darslar"],
                    ["vocabulary", "So'zlar"],
                    ["quiz", "Testlar"],
                  ] as [ActivityTab, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`-mb-px border-b-2 pb-2 transition-colors ${
                      tab === key
                        ? "border-primary font-semibold text-text-primary"
                        : "border-transparent text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex h-64 items-end gap-2 pt-14 sm:gap-4">
                {week.map((d, i) => {
                  const isActive = i === active;
                  const h = Math.max(4, Math.round((d[tab] / weekMax) * 100));
                  return (
                    <div
                      key={d.key}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div className="relative flex w-full flex-1 items-end justify-center">
                        {isActive && (
                          <div
                            className="absolute z-10 mb-2 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1.5 text-center"
                            style={{ bottom: `${h}%` }}
                          >
                            <p className="text-[10px] text-text-muted">
                              {d.isToday ? "Bugun" : d.label}
                            </p>
                            <p className="text-sm font-semibold text-text-primary">
                              {d[tab]} {unit}
                            </p>
                          </div>
                        )}
                        <div
                          className={`w-full max-w-14 rounded-lg border transition-all ${
                            isActive
                              ? "border-accent bg-accent"
                              : "border-border bg-surface-alt"
                          }`}
                          style={{
                            height: `${h}%`,
                            backgroundImage:
                              "repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 7px)",
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs ${d.isToday ? "font-semibold text-accent-strong" : "text-text-muted"}`}
                      >
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reyting */}
            <div className="rounded-card border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">
                  Reyting
                </h2>
                <Link
                  href="/rank"
                  className="grid h-8 w-8 place-items-center rounded-tile border border-border text-text-secondary transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-strong"
                  aria-label="Reytingni ochish"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <ul className="mt-4 space-y-2">
                {(board?.leaderboard || []).slice(0, 5).map((u) => {
                  const isMe = u.id === me?.id;
                  return (
                    <li
                      key={u.id}
                      className={`flex items-center gap-3 rounded-button border px-3 py-2 ${
                        isMe
                          ? "border-accent/40 bg-accent-soft"
                          : "border-border"
                      }`}
                    >
                      <span className="w-5 text-sm font-semibold text-text-muted">
                        {u.rank}
                      </span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-xs font-semibold text-accent-strong">
                        {u.profilePic ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.profilePic}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          u.name?.[0]?.toUpperCase()
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                        {[u.name, u.surname].filter(Boolean).join(" ")}
                      </span>
                      <span className="text-xs font-semibold text-text-secondary">
                        {u.coins.toLocaleString("en-US")}
                      </span>
                    </li>
                  );
                })}
                {!board && (
                  <li className="text-sm text-text-muted">Yuklanmoqda…</li>
                )}
              </ul>
              {board?.currentUser && board.currentUser.rank > 5 && (
                <p className="mt-3 border-t border-border pt-3 text-xs text-text-secondary">
                  Sizning o&apos;rningiz:{" "}
                  <span className="font-semibold text-accent-strong">
                    #{board.currentUser.rank}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Kurslar progressi */}
          <div className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-text-primary">
              Kurslar progressi
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
            ) : courseProgress.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-text-secondary">
                  Hozircha hech qanday kurs yo&apos;q
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-button bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Kurslarni ko&apos;rish
                </Link>
              </div>
            ) : (
              <>
                {/* Telefon: ro'yxat ko'rinishi */}
                <ul className="mt-4 divide-y divide-border sm:hidden">
                  {courseProgress.map(
                    ({ course, done, total, percent, dot }) => (
                      <li key={course.id}>
                        <Link
                          href={`/courses/${course.id}`}
                          className="flex items-center gap-3 py-3"
                        >
                          <span
                            className={`h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border ${course.thumbnail ? "" : dot}`}
                          >
                            {course.thumbnail && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={course.thumbnail}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2 text-sm">
                              <span className="truncate font-medium text-text-primary">
                                {course.title}
                              </span>
                              <span className="shrink-0 text-xs text-text-secondary">
                                {done}/{total} · {percent}%
                              </span>
                            </span>
                            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-alt">
                              <span
                                className="block h-full rounded-full bg-accent"
                                style={{ width: `${percent}%` }}
                              />
                            </span>
                          </span>
                          <ArrowUpRight
                            size={16}
                            className="shrink-0 text-text-muted"
                          />
                        </Link>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-4 hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="text-left text-text-muted">
                        <th className="pb-3 font-medium">Kurs</th>
                        <th className="pb-3 font-medium">Darslar</th>
                        <th className="pb-3 font-medium">Progress</th>
                        <th className="pb-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {courseProgress.map(
                        ({ course, done, total, percent, dot }) => (
                          <tr
                            key={course.id}
                            className="border-t border-border"
                          >
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border ${course.thumbnail ? "" : dot}`}
                                >
                                  {course.thumbnail && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={course.thumbnail}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </span>
                                <span className="font-medium text-text-primary">
                                  {course.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-text-secondary">
                              {done} / {total}
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-alt">
                                  <div
                                    className="h-full rounded-full bg-accent"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <span className="text-xs italic text-text-secondary">
                                  {percent}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              <Link
                                href={`/courses/${course.id}`}
                                className="inline-grid h-8 w-8 place-items-center rounded-tile border border-border text-text-secondary transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-strong"
                                aria-label={`${course.title} kursini ochish`}
                              >
                                <ArrowUpRight size={16} />
                              </Link>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  label,
  value,
  children,
}: {
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className="rounded-card border border-border bg-surface p-4 sm:p-5">
    <p className="text-xs text-text-secondary sm:text-sm">{label}</p>
    <p className="mt-1 text-2xl font-bold text-text-primary sm:mt-2 sm:text-3xl">
      {value}
    </p>
    <div className="mt-3 sm:mt-4">{children}</div>
  </div>
);

export default DashboardPage;

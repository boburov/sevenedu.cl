"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookText,
  HelpCircle,
  ClipboardCheck,
  CalendarDays,
  Target,
  Flame,
  Activity,
} from "lucide-react";
import { getDailyStats } from "@/app/api/service/api";

type StatEntry = {
  date: string;
  vocabulary: { total: number; correct: number };
  quiz: { total: number; correct: number };
  test: { total: number; correct: number };
};

type DayCell = {
  date: string;
  total: number;
  correct: number;
  level: 0 | 1 | 2 | 3 | 4;
  inRange: boolean;
};

type ViewType = "kunlik" | "umumiy";

const percent = (c: number, t: number) =>
  t === 0 ? 0 : Math.round((c / t) * 100);

// Faollik zichligi: neytral (faollik yo'q) → urg'u orange (eng faol).
// Oldin GitHub'ning yashil palitrasi qotirilgan hex bilan yozilgan edi;
// tizimda yashil faqat "success" roli uchun, zichlik esa urg'u rangi bilan.
const LEVEL_CLASSES = [
  "border-border bg-surface-alt",
  "border-accent/20 bg-accent/20",
  "border-accent/40 bg-accent/40",
  "border-accent/70 bg-accent/70",
  "border-accent bg-accent",
] as const;

const WEEKDAY_LABELS = ["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"];
const MONTH_LABELS = [
  "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
  "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek",
];

const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const levelFor = (total: number): DayCell["level"] => {
  if (total <= 0) return 0;
  if (total <= 2) return 1;
  if (total <= 5) return 2;
  if (total <= 9) return 3;
  return 4;
};

export default function DailyStats() {
  const [data, setData] = useState<StatEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>("kunlik");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyStats()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  // Kun -> jami urinishlar / to'g'ri javoblar
  const dayMap = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const d of data) {
      const total = d.vocabulary.total + d.quiz.total + d.test.total;
      const correct = d.vocabulary.correct + d.quiz.correct + d.test.correct;
      map.set(d.date, { total, correct });
    }
    return map;
  }, [data]);

  // Umumiy statistika
  const totals = useMemo(() => {
    let total = 0;
    let correct = 0;
    let activeDays = 0;
    for (const v of dayMap.values()) {
      total += v.total;
      correct += v.correct;
      if (v.total > 0) activeDays += 1;
    }
    return { total, correct, activeDays };
  }, [dayMap]);

  // Joriy streak — bugundan orqaga qarab ketma-ket faol kunlar
  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    // Agar bugun faol bo'lmasa, kechagidan boshlab hisoblaymiz
    if (!(dayMap.get(fmt(cursor))?.total)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (dayMap.get(fmt(cursor))?.total) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [dayMap]);

  // GitHub uslubidagi hafta ustunlari
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Boshlanish sanasi: eng erta ma'lumot yoki oxirgi ~26 hafta
    const dates = [...dayMap.keys()].sort();
    let start = dates.length ? parse(dates[0]) : new Date(today);
    const minStart = new Date(today);
    minStart.setDate(minStart.getDate() - 7 * 26);
    if (start > minStart) start = new Date(minStart);
    if (start < parse("2000-01-01")) start = new Date(minStart);

    // Hafta boshiga (Yakshanba) tekislaymiz
    start.setDate(start.getDate() - start.getDay());

    const cols: DayCell[][] = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const col: DayCell[] = [];
      for (let i = 0; i < 7; i++) {
        const key = fmt(cursor);
        const info = dayMap.get(key);
        const inRange = cursor <= today;
        col.push({
          date: key,
          total: info?.total ?? 0,
          correct: info?.correct ?? 0,
          level: inRange ? levelFor(info?.total ?? 0) : 0,
          inRange,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      cols.push(col);
    }
    return cols;
  }, [dayMap]);

  // Har bir hafta ustuni tepasidagi oy yorlig'i
  const monthLabels = useMemo(() => {
    return weeks.map((col, idx) => {
      const first = col[0];
      const d = parse(first.date);
      // Yangi oy shu ustunda boshlansa yorliq ko'rsatamiz
      if (idx === 0) return d.getDate() <= 7 ? MONTH_LABELS[d.getMonth()] : "";
      const prev = parse(weeks[idx - 1][0].date);
      return d.getMonth() !== prev.getMonth() ? MONTH_LABELS[d.getMonth()] : "";
    });
  }, [weeks]);

  const activeDailyList = useMemo(
    () =>
      [...data]
        .filter(
          (d) =>
            d.vocabulary.total + d.quiz.total + d.test.total > 0
        )
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [data]
  );

  // Ko'rsatkich kartochkalari — dashboard'dagi StatCard qolipi.
  // Faqat streak urg'uli (orange), qolgani neytral belgi.
  const statCards = [
    { label: "Urunishlar", value: totals.total, icon: Activity, accent: false },
    {
      label: "Aniqlik",
      value: `${percent(totals.correct, totals.total)}%`,
      icon: Target,
      accent: false,
    },
    {
      label: "Active kunlar",
      value: totals.activeDays,
      icon: CalendarDays,
      accent: false,
    },
    { label: "Streak", value: streak, icon: Flame, accent: true },
  ];

  return (
    <div className="page py-8 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
            Statistika
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            {loading
              ? "Yuklanmoqda…"
              : `Jami ${totals.total} urinish · ${totals.activeDays} faol kun`}
          </p>
        </header>

        {!loading && (
          <>
            {/* Ko'rinish almashtirgichi */}
            <div className="inline-flex rounded-button border border-border bg-surface p-1">
              {(["kunlik", "umumiy"] as ViewType[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`focus-ring rounded-button px-4 py-1.5 text-sm font-semibold transition-colors ${
                    view === v
                      ? "bg-primary text-primary-foreground"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {v === "kunlik" ? "Kunlik" : "Umumiy"}
                </button>
              ))}
            </div>

            {/* Ko'rsatkichlar */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {statCards.map((x) => (
                <div
                  key={x.label}
                  className="rounded-card border border-border bg-surface p-4 sm:p-5"
                >
                  <p className="flex items-center gap-2 text-xs text-text-secondary sm:text-sm">
                    <x.icon
                      size={16}
                      strokeWidth={1.75}
                      className={x.accent ? "text-accent" : "text-text-muted"}
                    />
                    {x.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
                    {x.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Faollik jadvali */}
            <div className="rounded-card border border-border bg-surface p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-text-primary">
                  Faollik jadvali
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>Kam</span>
                  {LEVEL_CLASSES.map((c, i) => (
                    <span
                      key={i}
                      className={`h-3 w-3 rounded-[3px] border ${c}`}
                    />
                  ))}
                  <span>Ko&apos;p</span>
                </div>
              </div>

              <div className="overflow-x-auto pb-1">
                <div className="inline-flex flex-col gap-1">
                  {/* Oy yorliqlari */}
                  <div className="flex gap-1 pl-8">
                    {monthLabels.map((m, i) => (
                      <div
                        key={i}
                        className="w-3 text-[10px] text-text-muted"
                        style={{ minWidth: "0.75rem" }}
                      >
                        {m}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1">
                    {/* Hafta kunlari yorlig'i */}
                    <div className="flex flex-col justify-between gap-1 pr-1">
                      {WEEKDAY_LABELS.map((w, i) => (
                        <div
                          key={w}
                          className="h-3 text-[10px] leading-3 text-text-muted"
                          style={{
                            visibility: i % 2 === 1 ? "visible" : "hidden",
                          }}
                        >
                          {w}
                        </div>
                      ))}
                    </div>

                    {/* Ustunlar (haftalar) */}
                    {weeks.map((col, ci) => (
                      <div key={ci} className="flex flex-col gap-1">
                        {col.map((cell) => (
                          <div
                            key={cell.date}
                            title={
                              cell.inRange
                                ? `${cell.date}: ${cell.total} urinish${
                                    cell.total
                                      ? ` · ${percent(cell.correct, cell.total)}% aniqlik`
                                      : ""
                                  }`
                                : undefined
                            }
                            className={`h-3 w-3 rounded-[3px] border ${
                              cell.inRange
                                ? LEVEL_CLASSES[cell.level]
                                : "border-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Kunlik ro'yxat */}
            {view === "kunlik" && (
              <div className="space-y-3">
                {activeDailyList.length === 0 ? (
                  <div className="rounded-card border border-border bg-surface p-10 text-center">
                    <p className="text-[15px] text-text-secondary">
                      Hozircha faollik yo&apos;q. Dars o&apos;qing yoki test
                      yeching!
                    </p>
                  </div>
                ) : (
                  activeDailyList.map((d) => {
                    const total =
                      d.vocabulary.total + d.quiz.total + d.test.total;
                    const correct =
                      d.vocabulary.correct + d.quiz.correct + d.test.correct;
                    const p = percent(correct, total);

                    return (
                      <div
                        key={d.date}
                        className="rounded-card border border-border bg-surface p-4"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(expanded === d.date ? null : d.date)
                          }
                          className="focus-ring flex w-full items-center justify-between gap-3 rounded-tile text-left"
                          aria-expanded={expanded === d.date}
                        >
                          <span>
                            <span className="block text-[15px] font-semibold text-text-primary">
                              {d.date}
                            </span>
                            <span className="block text-[13px] text-text-secondary">
                              {correct}/{total} ({p}%)
                            </span>
                          </span>
                          {expanded === d.date ? (
                            <ChevronUp
                              size={20}
                              strokeWidth={1.75}
                              className="shrink-0 text-text-muted"
                            />
                          ) : (
                            <ChevronDown
                              size={20}
                              strokeWidth={1.75}
                              className="shrink-0 text-text-muted"
                            />
                          )}
                        </button>

                        {/* Aniqlik — joriy qiymat urg'uli, bo'sh qismi neytral */}
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-alt">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${p}%` }}
                          />
                        </div>

                        {expanded === d.date && (
                          <div className="mt-4 space-y-2">
                            {[
                              {
                                label: "Vocabulary",
                                icon: BookText,
                                ...d.vocabulary,
                              },
                              { label: "Quiz", icon: HelpCircle, ...d.quiz },
                              {
                                label: "Test",
                                icon: ClipboardCheck,
                                ...d.test,
                              },
                            ].map((x) => (
                              <div
                                key={x.label}
                                className="flex items-center justify-between gap-3 rounded-tile border border-border px-3 py-2 text-sm"
                              >
                                <div className="flex items-center gap-2 text-text-secondary">
                                  <x.icon
                                    size={16}
                                    strokeWidth={1.75}
                                    className="text-text-muted"
                                  />
                                  {x.label}
                                </div>
                                <span className="font-semibold text-text-primary">
                                  {x.correct}/{x.total}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Umumiy natija */}
            {view === "umumiy" && (
              <div className="rounded-card border border-border bg-surface p-5">
                <h2 className="text-lg font-semibold text-text-primary">
                  Umumiy natija
                </h2>

                {(() => {
                  const agg = data.reduce(
                    (a, b) => {
                      a.voc.total += b.vocabulary.total;
                      a.voc.correct += b.vocabulary.correct;
                      a.quiz.total += b.quiz.total;
                      a.quiz.correct += b.quiz.correct;
                      a.test.total += b.test.total;
                      a.test.correct += b.test.correct;
                      return a;
                    },
                    {
                      voc: { total: 0, correct: 0 },
                      quiz: { total: 0, correct: 0 },
                      test: { total: 0, correct: 0 },
                    }
                  );
                  const rows = [
                    { label: "Vocabulary", icon: BookText, ...agg.voc },
                    { label: "Quiz", icon: HelpCircle, ...agg.quiz },
                    { label: "Test", icon: ClipboardCheck, ...agg.test },
                  ];
                  return (
                    <div className="mt-4 space-y-4">
                      {rows.map((r) => {
                        const p = percent(r.correct, r.total);
                        return (
                          <div key={r.label} className="space-y-2">
                            <div className="flex items-center justify-between gap-3 text-sm">
                              <div className="flex items-center gap-2 text-text-secondary">
                                <r.icon
                                  size={16}
                                  strokeWidth={1.75}
                                  className="text-text-muted"
                                />
                                {r.label}
                              </div>
                              <span className="font-semibold text-text-primary">
                                {r.correct}/{r.total} ({p}%)
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-surface-alt">
                              <div
                                className="h-full rounded-full bg-accent"
                                style={{ width: `${p}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <p className="border-t border-border pt-3 text-sm text-text-secondary">
                        Umumiy aniqlik:{" "}
                        <span className="font-semibold text-text-primary">
                          {percent(totals.correct, totals.total)}%
                        </span>
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

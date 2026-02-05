"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookText,
  HelpCircle,
  ClipboardCheck,
  ChartArea,
  CalendarDays,
  Target,
  Flame,
  Activity,
} from "lucide-react";
import api from "@/app/api/service/api";

type StatEntry = {
  date: string;
  vocabulary: { total: number; correct: number };
  quiz: { total: number; correct: number };
  test: { total: number; correct: number };
};

type ViewType = "kunlik" | "oylik";
type Range = "today" | "7d" | "30d" | "all";

const percent = (c: number, t: number) =>
  t === 0 ? 0 : Math.round((c / t) * 100);

const barColor = (p: number) =>
  p >= 90 ? "bg-emerald-500" : p >= 70 ? "bg-amber-500" : "bg-rose-500";

export default function DailyStats() {
  const [data, setData] = useState<StatEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>("kunlik");
  const [range, setRange] = useState<Range>("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/kunlik-stats").then((res) => {
      setData(res.data || []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (range === "all") return data;
    const now = new Date();
    return data.filter((d) => {
      const date = new Date(d.date);
      if (range === "today")
        return date.toDateString() === now.toDateString();
      if (range === "7d") return date >= new Date(now.setDate(now.getDate() - 6));
      if (range === "30d") return date >= new Date(now.setDate(now.getDate() - 29));
      return true;
    });
  }, [data, range]);

  const oylik = useMemo(() => {
    return filtered.reduce(
      (a, b) => {
        a.total +=
          b.vocabulary.total + b.quiz.total + b.test.total;
        a.correct +=
          b.vocabulary.correct + b.quiz.correct + b.test.correct;
        return a;
      },
      { total: 0, correct: 0 }
    );
  }, [filtered]);

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 bg-white">
      {/* VIEW SWITCH */}
      <div className="flex justify-center gap-3">
        {["kunlik", "oylik"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as ViewType)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold ${view === v
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white text-gray-600 border-gray-200"
              }`}
          >
            {v === "kunlik" ? "Kunlik" : "Umumiy"}
          </button>
        ))}
      </div>

      {/* HERO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Urunishlar", value: oylik.total, icon: Activity },
          {
            label: "Aniqlik",
            value: percent(oylik.correct, oylik.total) + "%",
            icon: Target,
          },
          { label: "Active kunlar", value: filtered.length, icon: CalendarDays },
          { label: "Xarakat", value: "🔥", icon: Flame },
        ].map((x, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 p-4 bg-white"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <x.icon size={16} />
              {x.label}
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">
              {x.value}
            </div>
          </div>
        ))}
      </div>

      {/* DAILY */}
      {view === "kunlik" && (
        <div className="space-y-3">
          {filtered.map((d) => {
            const total =
              d.vocabulary.total + d.quiz.total + d.test.total;
            const correct =
              d.vocabulary.correct +
              d.quiz.correct +
              d.test.correct;
            const p = percent(correct, total);

            return (
              <div
                key={d.date}
                className="border border-gray-200 rounded-2xl p-4 bg-white"
              >
                <button
                  onClick={() =>
                    setExpanded(expanded === d.date ? null : d.date)
                  }
                  className="w-full flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{d.date}</p>
                    <p className="text-sm text-gray-500">
                      {correct}/{total} ({p}%)
                    </p>
                  </div>
                  {expanded === d.date ? <ChevronUp /> : <ChevronDown />}
                </button>

                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor(p)}`}
                    style={{ width: `${p}%` }}
                  />
                </div>

                {expanded === d.date && (
                  <div className="mt-4 space-y-3 text-sm">
                    {[
                      {
                        label: "Vocabulary",
                        icon: BookText,
                        ...d.vocabulary,
                      },
                      { label: "Quiz", icon: HelpCircle, ...d.quiz },
                      { label: "Test", icon: ClipboardCheck, ...d.test },
                    ].map((x) => (
                      <div
                        key={x.label}
                        className="flex justify-between items-center border border-gray-200 rounded-xl px-3 py-2"
                      >
                        <div className="flex items-center gap-2 text-gray-700">
                          <x.icon size={16} />
                          {x.label}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {x.correct}/{x.total}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUMMARY */}
      {view === "oylik" && (
        <div className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-900">
            Summary
          </h2>

          {[
            { label: "Vocabulary", ...oylik },
          ].map((_, i) => (
            <p
              key={i}
              className="text-center text-gray-600 text-sm"
            >
              Overall accuracy:{" "}
              <span className="font-semibold text-gray-900">
                {percent(oylik.correct, oylik.total)}%
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

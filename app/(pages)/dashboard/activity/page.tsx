"use client";
import { useEffect, useState } from "react";
import { CalendarDays, CalendarCheck, BarChart3 } from "lucide-react";
import { getMe } from "@/app/api/service/api";

const Page = () => {
  const [missed, setMissed] = useState({
    week: 0,
    month: 0,
    fourMonths: 0,
  });
  const [missedDates, setMissedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  function countMissedDays(startDateStr: string, endDateStr: string, watchedList: string[]) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const watchedSet = new Set(watchedList);
    const missed: string[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      if (!watchedSet.has(dateStr)) {
        missed.push(dateStr);
      }
    }

    const today = new Date();
    const normalize = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const weekAgo = normalize(6);
    const monthAgo = normalize(29);
    const fourMonthsAgo = normalize(119);

    const week = missed.filter(date => new Date(date) >= weekAgo).length;
    const month = missed.filter(date => new Date(date) >= monthAgo).length;
    const fourMonths = missed.filter(date => new Date(date) >= fourMonthsAgo).length;

    return {
      missedDates: missed,
      countByRange: { week, month, fourMonths }
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getMe();
        if (!user) throw new Error("User not found");

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // TODO: Replace with real watched lesson dates from user.showedLesson
        const watchedDates = user.showedLesson?.map((l: any) =>
          l.watchedAt.substring(0, 10)
        ) || [];

        const { missedDates, countByRange } = countMissedDays(
          user.createdAt.substring(0, 10),
          todayStr,
          watchedDates
        );

        setMissed(countByRange);
        setMissedDates(missedDates);
      } catch (error) {
        console.error("Xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Uch oyna — bir xil kartochka. Oldin har biri boshqa rangda edi
  // (kulrang / amber / sky), lekin bu status emas, shunchaki davr oynasi.
  const ranges = [
    { label: "Haftalik", value: missed.week, icon: CalendarDays },
    { label: "Oylik", value: missed.month, icon: CalendarCheck },
    { label: "So‘nggi 4 Oy", value: missed.fourMonths, icon: BarChart3 },
  ];

  return (
    <div className="container py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
            O&apos;quvchining Davomat Qismi
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Jami {loading ? "…" : missedDates.length} kun qoldirilgan
          </p>
        </header>

        {loading ? (
          <p className="text-[15px] text-text-secondary">Yuklanmoqda...</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {ranges.map((r) => (
              <div
                key={r.label}
                className="rounded-card border border-border bg-surface p-4 sm:p-5"
              >
                <p className="flex items-center gap-2 text-xs text-text-secondary sm:text-sm">
                  <r.icon
                    size={16}
                    strokeWidth={1.75}
                    className="shrink-0 text-text-muted"
                  />
                  {r.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
                  {r.value}
                </p>
                <p className="mt-1 text-[13px] text-text-secondary">
                  kun qoldirilgan
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

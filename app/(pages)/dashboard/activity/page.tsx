"use client";
import { useEffect, useState } from "react";
import { CalendarDays, CalendarCheck, BarChart3 } from "lucide-react";
import api, { getMe } from "@/app/api/service/api";

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

  return (
    <div className="container space-y-6 pt-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-text-primary text-center w-full">
        O&apos;quvchining Davomat Qismi
      </h1>

      {loading ? (
        <p className="text-center text-text-secondary">Yuklanmoqda...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
              <CalendarDays className="text-slate-500 shrink-0" size={40} strokeWidth={1.5} />
              <div className="flex flex-col">
                <p className="text-xl font-semibold text-text-primary">Haftalik</p>
                <p className="text-base text-text-secondary">{missed.week} kun qoldirilgan</p>
              </div>
            </div>

            <div className="flex items-center gap-5 w-full rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
              <CalendarCheck className="text-amber-500 shrink-0" size={40} strokeWidth={1.5} />
              <div className="flex flex-col">
                <p className="text-xl font-semibold text-amber-700">Oylik</p>
                <p className="text-base text-text-secondary">{missed.month} kun qoldirilgan</p>
              </div>
            </div>

            <div className="flex items-center gap-5 w-full rounded-2xl border border-sky-200 bg-sky-50 px-6 py-5">
              <BarChart3 className="text-sky-500 shrink-0" size={40} strokeWidth={1.5} />
              <div className="flex flex-col">
                <p className="text-xl font-semibold text-sky-700">So‘nggi 4 Oy</p>
                <p className="text-base text-text-secondary">{missed.fourMonths} kun qoldirilgan</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;

"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import { Lock, Play, BookOpen, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  lessons: any[];
  goal: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  courses: { courseId: string }[];
  phonenumber: string;
  coin: number;
}

const placeholderThumbnail = "/images/course-placeholder.jpg";

const getSafeThumbnail = (originalUrl: string) => {
  if (!originalUrl) return placeholderThumbnail;
  if (originalUrl.includes("s3.eu-north-1.amazonaws.com/seven.edu/")) return originalUrl;
  const match = originalUrl.match(/\/images\/([^/?]+(\.png|\.jpg|\.jpeg|\.webp|\.gif))/i);
  if (match) return `https://s3.eu-north-1.amazonaws.com/seven.edu/images/${match[1]}`;
  return placeholderThumbnail;
};

type Tab = "all" | "mine";

const CoursesPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allCoursesData, meData] = await Promise.all([allCourse(), getMe()]);
        setCourses(allCoursesData);
        setUser(meData);
        const userCourseData = await Promise.all(
          meData.courses.map((item: any) => GetCourseById(item.courseId))
        );
        setUserCourses(userCourseData);
      } catch (e) {
        console.error("fetchAll error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const ownedIds = useMemo(() => new Set(userCourses.map((c) => c.id)), [userCourses]);

  const countVisibleLessons = (kurs: Course) =>
    kurs.lessons?.filter((lesson: any) => lesson.isVisible).length || 0;

  const displayedCourses = useMemo(() => {
    const base = tab === "mine" ? userCourses : courses;
    if (!search.trim()) return base;
    return base.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.goal?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tab, courses, userCourses, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* ─── TOP BAR ─── */}
      <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-slate-800">Kurslar</h1>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {displayedCourses.length} ta
            </span>
          </div>

          {/* Tab + Search row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Tabs */}
            <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
              {([
                { key: "all", label: `Barcha (${courses.length})` },
                { key: "mine", label: `Mening (${userCourses.length})` },
              ] as { key: Tab; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                    tab === key
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Kurs qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── GRID ─── */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        {displayedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-100">
              <BookOpen size={28} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">Kurs topilmadi</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs text-violet-600 hover:underline"
              >
                Qidiruvni tozalash
              </button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedCourses.map((kurs) => {
              const isOwned = ownedIds.has(kurs.id);
              return (
                <li
                  key={kurs.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={getSafeThumbnail(kurs.thumbnail)}
                      alt={kurs.title}
                      fill
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isOwned ? "opacity-65" : ""}`}
                      unoptimized
                    />

                    {/* gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                    {/* locked overlay */}
                    {!isOwned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/50 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                          <Lock size={12} /> Sotib olish
                        </div>
                      </div>
                    )}

                    {/* owned badge */}
                    {isOwned && (
                      <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                        MENING
                      </div>
                    )}

                    {/* lesson count */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      <BookOpen size={11} />
                      {countVisibleLessons(kurs)} dars
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {kurs.title}
                    </h3>

                    <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {kurs.goal}
                    </p>

                    {/* separator */}
                    <div className="my-3 h-px bg-slate-100" />

                    {/* action */}
                    <Link
                      href={`/courses/${kurs.id}`}
                      className={
                        isOwned
                          ? "inline-flex items-center gap-2 self-start rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700"
                          : "inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      }
                    >
                      {isOwned ? (
                        <><Play size={13} fill="currentColor" /> Ko'rish</>
                      ) : (
                        <><Lock size={13} /> Buyurtma</>
                      )}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

export default CoursesPage;
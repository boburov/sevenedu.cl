"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import { Play, Lock, BookOpen, Star, TrendingUp, Award, ChevronRight, Zap } from "lucide-react";
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

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Xayrli tong";
  if (h < 18) return "Xayrli kun";
  return "Xayrli kech";
};

const getInitials = (name: string) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
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

  const totalLessons = userCourses.reduce((acc, c) => acc + countVisibleLessons(c), 0);

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
    <main className="min-h-screen bg-[#f8f7ff]">
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-fuchsia-700 px-4 pt-10 pb-20 sm:px-8">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-2xl" />

        <div className="relative mx-auto max-w-5xl">
          {/* greeting row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-violet-200">{getGreeting()} 👋</p>
              <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                {user?.name ?? "Foydalanuvchi"}
              </h1>
            </div>
            {/* avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/30 text-white font-bold text-lg backdrop-blur-sm">
              {user?.name ? getInitials(user.name) : "?"}
            </div>
          </div>

          {/* stat chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <BookOpen size={15} className="opacity-80" />
              <span><b>{userCourses.length}</b> ta kurs</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Zap size={15} className="opacity-80" />
              <span><b>{totalLessons}</b> ta dars</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Award size={15} className="opacity-80" />
              <span><b>{user?.coin ?? 0}</b> coin</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="relative mx-auto -mt-10 max-w-5xl px-4 pb-16 sm:px-8">

        {/* ── MY COURSES ── */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-violet-500" />
              <h2 className="text-base font-semibold text-slate-800">Mening kurslarim</h2>
            </div>
            <Link
              href="/courses"
              className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
            >
              Barchasi <ChevronRight size={14} />
            </Link>
          </div>

          {userCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userCourses.map((kurs, i) => (
                <Link
                  key={kurs.id}
                  href={`/courses/${kurs.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-violet-200"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-violet-50">
                    <Image
                      src={getSafeThumbnail(kurs.thumbnail)}
                      alt={kurs.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* play button center */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                        <Play size={20} className="translate-x-0.5 text-violet-600" fill="currentColor" />
                      </div>
                    </div>

                    {/* lesson count badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      <BookOpen size={12} />
                      {countVisibleLessons(kurs)} dars
                    </div>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{kurs.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 flex-1">
                      {kurs.goal}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-violet-600">
                      <Play size={13} fill="currentColor" /> Davom ettirish
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-100">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                <BookOpen size={24} className="text-violet-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">Hozircha kurs yo'q</p>
              <p className="mt-1 text-xs text-slate-400">Quyidagi kurslardan birini tanlang</p>
              <Link
                href="/courses"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Kurslarni ko'rish
              </Link>
            </div>
          )}
        </section>

        {/* ── DISCOVER ── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-fuchsia-500" />
              <h2 className="text-base font-semibold text-slate-800">Barcha kurslar</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              {courses.length} ta
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((kurs, i) => {
              const isOwned = ownedIds.has(kurs.id);
              return (
                <div
                  key={kurs.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={getSafeThumbnail(kurs.thumbnail)}
                      alt={kurs.title}
                      fill
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isOwned ? "opacity-70" : ""}`}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {!isOwned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                          <Lock size={12} /> Buyurtma
                        </div>
                      </div>
                    )}

                    {isOwned && (
                      <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
                        MENING
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      <BookOpen size={12} />
                      {countVisibleLessons(kurs)} dars
                    </div>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{kurs.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 flex-1">{kurs.goal}</p>
                    <div className="mt-3">
                      <Link
                        href={`/courses/${kurs.id}`}
                        className={
                          isOwned
                            ? "inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors"
                            : "inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
                        }
                      >
                        {isOwned ? (
                          <><Play size={13} fill="currentColor" /> Ko'rish</>
                        ) : (
                          <><Lock size={13} /> Buyurtma berish</>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import { Lock, Play, BookOpen } from "lucide-react";
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

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);

  // ✅ define first
  const placeholderThumbnail = "/images/course-placeholder.jpg";

  // ✅ URL normalizer (keeps your logic, just safer)
  const getSafeThumbnail = (originalUrl: string) => {
    if (!originalUrl) return placeholderThumbnail;

    if (originalUrl.includes("s3.eu-north-1.amazonaws.com/seven.edu/")) {
      return originalUrl;
    }

    const match = originalUrl.match(/\/images\/([^/?]+(\.png|\.jpg|\.jpeg|\.webp|\.gif))/i);
    if (match) {
      return `https://s3.eu-north-1.amazonaws.com/seven.edu/images/${match[1]}`;
    }

    return placeholderThumbnail;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allCoursesData, meData] = await Promise.all([
          allCourse(),
          getMe(),
        ]);

        setCourses(allCoursesData);
        setUser(meData);

        const userCourseData = await Promise.all(
          meData.courses.map((item: any) => GetCourseById(item.courseId))
        );
        setUserCourses(userCourseData);
      } catch (e) {
        console.error("fetchAll error:", e);
      }
    };
    fetchAll();
  }, []);

  const ownedIds = useMemo(() => new Set(userCourses.map((c) => c.id)), [userCourses]);

  const countVisibleLessons = (kurs: Course) =>
    kurs.lessons?.filter((lesson: any) => lesson.isVisible).length || 0;

  return (
    <section className="container px-4 py-6 bg-background">
      {/* Top */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">
          Kurslarim soni:{" "}
          <span className="text-primary">{user?.courses?.length ?? 0}</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Kurslaringiz va barcha kurslar ro‘yxati.
        </p>
      </div>

      {/* === MY COURSES === */}
      <div className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-secondary">
            Mening kurslarim
          </h2>
          <span className="text-xs text-text-muted">
            {userCourses.length} ta
          </span>
        </div>

        {userCourses.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCourses.map((kurs) => (
              <li
                key={kurs.id}
                className="group rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden rounded-t-2xl border-b border-border bg-surface-alt">
                  <Image
                    src={getSafeThumbnail(kurs.thumbnail)}
                    alt={kurs.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* top chips */}
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                      <BookOpen size={14} />
                      {countVisibleLessons(kurs)} dars
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    {kurs.title}
                  </h3>

                  <p className="mt-2 text-xs text-text-secondary line-clamp-2">
                    <span className="font-medium text-text-primary">Maqsad:</span>{" "}
                    {kurs.goal}
                  </p>

                  <div className="mt-4">
                    <Link
                      href={`/courses/${kurs.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] active:scale-[0.99]"
                    >
                      <Play size={16} /> Ko‘rish
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-text-secondary">
            Sizda hozircha kurs yo‘q.
          </div>
        )}
      </div>

      {/* === ALL COURSES === */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-secondary">Barcha kurslar</h2>
        <span className="text-xs text-text-muted">{courses.length} ta</span>
      </div>

      {courses.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((kurs) => {
            const isOwned = ownedIds.has(kurs.id);

            return (
              <li
                key={kurs.id}
                className="group rounded-2xl border border-border bg-surface shadow-card transition-shadow hover:shadow-md"
              >
                {/* Image always visible */}
                <div className="relative h-40 w-full overflow-hidden rounded-t-2xl border-b border-border bg-surface-alt">
                  <Image
                    src={getSafeThumbnail(kurs.thumbnail)}
                    alt={kurs.title}
                    fill
                    className={`object-cover ${isOwned ? "" : "opacity-60"}`}
                    unoptimized
                  />

                  {!isOwned && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1 text-xs font-semibold text-text-secondary shadow-sm">
                        <Lock size={16} />
                        Locked
                      </div>
                    </div>
                  )}

                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-text-secondary shadow-sm">
                      <BookOpen size={14} className="text-primary" />
                      {countVisibleLessons(kurs)} dars
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    {kurs.title}
                  </h3>

                  <p className="mt-2 text-xs text-text-secondary line-clamp-2">
                    <span className="font-medium text-text-primary">Maqsad:</span>{" "}
                    {kurs.goal}
                  </p>

                  <div className="mt-4">
                    <Link
                      href={`/courses/${kurs.id}`}
                      className={
                        isOwned
                          ? "inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] active:scale-[0.99]"
                          : "inline-flex items-center gap-2 rounded-xl border-2 border-primary px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] active:scale-[0.99]"
                      }
                    >
                      {isOwned ? (
                        <>
                          <Play size={16} /> Ko‘rish
                        </>
                      ) : (
                        <>
                          <Lock size={16} /> Buyurtma
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-text-secondary text-center">
          Hozircha kurslar yo‘q
        </div>
      )}
    </section>
  );
};

export default UserPage;

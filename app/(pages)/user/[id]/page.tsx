"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import Hero from "@/app/components/Hero";
import { Lock, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  const placeholderThumbnail = "/images/course-placeholder.jpg";

  const getSafeThumbnail = (originalUrl: string): string => {
    if (!originalUrl) return placeholderThumbnail;

    if (
      originalUrl.startsWith("https://s3.eu-north-1.amazonaws.com/seven.edu/")
    ) {
      return originalUrl;
    }
    const match = originalUrl.match(
      /\/images\/([^/?]+)(\.png|\.jpg|\.jpeg|\.webp|\.gif)/i
    );

    if (match) {
      const filename = match[1] + match[2];
      return `https://s3.eu-north-1.amazonaws.com/seven.edu/images/${filename}`;
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

  return (
    <>
      <Hero />

      {/* MOBILE */}
      <section className="container p-5 hidden max-md:block">
        <h1 className="text-base font-semibold text-text-primary mb-4">
          Kurslarim soni:{" "}
          <span className="text-primary">{user?.courses?.length ?? 0}</span>
        </h1>

        {/* USER COURSES */}
        <ul className="space-y-3 mb-8">
          {userCourses.map((kurs) => {
            const lessonsCount =
              kurs.lessons?.filter((l: any) => l.isVisible).length || 0;

            return (
              <li
                key={kurs.id}
                className="relative flex items-center gap-4 p-3 bg-surface border border-border rounded-2xl shadow-card"
              >
                <div className="w-52 h-28 relative overflow-hidden rounded-xl border border-border bg-surface-alt">
                  <Image
                    src={getSafeThumbnail(kurs.thumbnail)}
                    alt={kurs.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex flex-col justify-between h-28 w-full min-w-0">
                  <div className="min-w-0 pr-24">
                    {/* Badge */}
                    <span className="absolute top-3 right-3 inline-flex items-center rounded-full border border-border bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {lessonsCount} dars
                    </span>

                    <h3 className="font-semibold text-text-primary text-sm truncate">
                      {kurs.title}
                    </h3>

                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      <span className="font-medium text-text-primary">Maqsad:</span>{" "}
                      {kurs.goal}
                    </p>
                  </div>

                  <Link
                    href={`/courses/${kurs.id}`}
                    className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover transition-colors rounded-xl px-3 py-2 w-fit focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] active:scale-[0.99]"
                  >
                    <Play size={16} /> Ko‘rish
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>


        {/* ALL COURSES */}
        <h1 className="text-base font-semibold text-text-primary mb-4">
          Barcha kurslar
        </h1>

        {courses.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 mb-10">
            {courses.map((kurs) => {
              const isOwned = userCourses.some((uc) => uc.id === kurs.id);

              return (
                <li
                  key={kurs.id}
                  className="
      flex flex-col sm:flex-row
      gap-3 sm:gap-4
      p-3
      bg-surface border border-border
      rounded-2xl shadow-card
    "
                >
                  {/* Thumbnail */}
                  <div
                    className="
        w-full sm:w-[45%] md:w-[40%]
        h-40 sm:h-28
        relative overflow-hidden
        rounded-xl border border-border
        bg-surface-alt
        shrink-0
      "
                  >
                    <Image
                      src={getSafeThumbnail(kurs.thumbnail)}
                      alt={kurs.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 40vw"
                      className={`object-cover ${isOwned ? "" : "opacity-60"}`}
                      unoptimized
                    />

                    {!isOwned && (
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="rounded-full bg-surface/90 border border-border p-2 shadow-sm">
                          <Lock size={18} className="text-text-secondary" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between min-w-0 flex-1">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-text-primary text-sm truncate leading-5">
                        {kurs.title}
                      </h3>

                      <span className="inline-block text-xs text-text-secondary mt-1">
                        Darslar:{" "}
                        <span className="font-semibold text-text-primary">
                          {kurs.lessons?.filter((l: any) => l.isVisible).length || 0}
                        </span>
                      </span>

                      <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                        <span className="font-medium text-text-primary">Maqsad:</span>{" "}
                        {kurs.goal}
                      </p>
                    </div>

                    {isOwned ? (
                      <Link
                        href={`/courses/${kurs.id}`}
                        className="
      mt-3 sm:mt-2 inline-flex items-center gap-2
      text-xs font-semibold text-white
      bg-primary hover:bg-primary-hover
      transition-colors rounded-xl
      px-3 py-2 w-full sm:w-fit justify-center
      focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
    "
                      >
                        <Play size={16} /> Ko‘rish
                      </Link>
                    ) : (
                      <a
                        href="https://t.me/@HR7EDU"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
      mt-3 sm:mt-2 inline-flex items-center gap-2
      text-xs font-semibold text-primary
      border-2 border-primary hover:bg-primary-soft
      transition-colors rounded-xl
      px-3 py-2 w-full sm:w-fit justify-center
      focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
    "
                      >
                        <Lock size={16} /> Buyurtma
                      </a>
                    )}

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
    </>
  );
};

export default UserPage;

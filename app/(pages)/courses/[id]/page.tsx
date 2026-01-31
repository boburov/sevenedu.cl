"use client";

import React, { useEffect, useState } from "react";
import { getMe } from "@/app/api/service/api";
import { Lock, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import apiEndpoins from "@/app/api/api.endpoin";

interface Lesson {
  id: string;
  videoUrl: string;
  title: string;
  isVisible: boolean;
  isDemo?: boolean;
}

interface UserCourse {
  courseId: string;
  subscription: "FULL_CHARGE" | "MONTHLY";
}

interface User {
  id: string;
  name: string;
  courses: UserCourse[];
}

// 🔒 maxsus kurs ID
const SPECIAL_COURSE_ID = "a06d565b-1d61-4564-af5d-1ceb4cfb3f6b";

const SECOND_SPECIAL_COURSE_ID = "16c43a51-8c65-4a29-995c-f2e8ab0d6073";

const CourseLessonsPage: React.FC = () => {
  const params = useParams() as { id?: string };
  const courseId = String(params?.id || "");
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userSubscription, setUserSubscription] = useState<
    "FULL_CHARGE" | "MONTHLY" | null
  >(null);
  const [userHasCourse, setUserHasCourse] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        // 1️⃣ userni olish
        const user: User = await getMe();

        const foundCourse = user.courses?.find(
          (uc) => uc.courseId === courseId
        );

        if (foundCourse) {
          setUserHasCourse(true);
          setUserSubscription(foundCourse.subscription);
        } else {
          setUserHasCourse(false);
          setUserSubscription(null);
        }

        // 2️⃣ darslarni olish
        const res = await axios.get(
          "https://sevenedu.store/" + apiEndpoins.getCategory(courseId)
        );
        console.log(res.data);

        const dataLessons: Lesson[] = res.data.lessons || [];

        // 3️⃣ maxsus kurs bo‘lsa 25–64 ni olib tashlash
        let finalLessons = dataLessons;

        if (courseId === SPECIAL_COURSE_ID) {
          finalLessons = [
            ...dataLessons.slice(0, 24), // 1–24
            ...dataLessons.slice(64), // 65+
          ];
        } else if (courseId === SECOND_SPECIAL_COURSE_ID) {
          finalLessons = [
            ...dataLessons.slice(32, finalLessons.length), // 1–24
            ...dataLessons.slice(64), // 65+
          ];
        }

        setLessons(finalLessons);
      } catch (err: any) {
        console.error("❌ Xatolik:", err?.message || err);
      }
    };

    fetchData();
  }, [courseId]);

  const openLesson = (lesson: Lesson, index: number) => {
    let isLocked = false;

    if (!userHasCourse && lesson.isDemo === false) {
      isLocked = true;
    } else if (userHasCourse && userSubscription === "MONTHLY" && index >= 12) {
      isLocked = true;
    }

    if (isLocked) {
      window.open("https://t.me/HR7EDU", "_blank");
      return;
    }

    router.push(`/courses/${courseId}/lessons/${lesson.id}`);
  };

 return (
  <div className="container mx-auto px-4 py-8 bg-background">
    {/* Empty state */}
    {!lessons.length || lessons.filter((e) => e.isVisible === true).length === 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-border bg-surface p-6 text-center shadow-card"
      >
        <h2 className="text-base font-semibold text-text-primary">
          Hozircha darslar mavjud emas
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Tez orada yangi darslar qo‘shiladi.
        </p>
      </motion.div>
    ) : (
      <div className="space-y-3">
        {lessons
          .filter((e) => e.isVisible === true)
          .map((lesson, index) => {
            const isLocked =
              (!userHasCourse && lesson.isDemo === false) ||
              (userHasCourse && userSubscription === "MONTHLY" && index >= 12);

            return (
              <button
                key={lesson.id}
                onClick={() => openLesson(lesson, index)}
                className="w-full text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className={[
                    "relative flex items-center justify-between rounded-2xl border bg-surface p-4 shadow-card transition-shadow",
                    "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]",
                    isLocked ? "border-border" : "border-border",
                  ].join(" ")}
                >
                  {/* left content */}
                  <div className="min-w-0 pr-16">
                    {/* Small chips row */}
                    <div className="mb-1 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-border bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                        {index + 1}-dars
                      </span>

                      {lesson.isDemo ? (
                        <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">
                          Demo
                        </span>
                      ) : null}

                      {isLocked ? (
                        <span className="inline-flex items-center rounded-full border border-border bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                          Locked
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-sm font-semibold text-text-primary truncate">
                      {lesson.title}
                    </h2>

                    <p className="mt-1 text-xs text-text-muted line-clamp-1">
                      Darsni ochish uchun bosing
                    </p>
                  </div>

                  {/* right icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isLocked ? (
                      <div className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface-alt">
                        <Lock className="h-5 w-5 text-text-secondary" />
                      </div>
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft">
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* locked overlay (very subtle) */}
                  {isLocked ? (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(124,58,237,0.08),transparent)]" />
                  ) : null}
                </motion.div>
              </button>
            );
          })}
      </div>
    )}
  </div>
);

};

export default CourseLessonsPage;

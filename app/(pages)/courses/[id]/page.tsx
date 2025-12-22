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
    <div className="container mx-auto px-4 py-10">
      {!lessons.length ||
      lessons.filter((e) => e.isVisible === true).length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white text-xl font-medium mt-10"
        >
          Hozircha darslar mavjud emas <br />
          Ammo tez orada ular sizni kutmoqda!
        </motion.div>
      ) : (
        <div className="space-y-6">
          {lessons
            .filter((e) => e.isVisible === true)
            .map((lesson, index) => {
              const isLocked =
                (!userHasCourse && lesson.isDemo === false) ||
                (userHasCourse &&
                  userSubscription === "MONTHLY" &&
                  index >= 12);

              return (
                <button
                  key={lesson.id}
                  onClick={() => openLesson(lesson, index)}
                  className="w-full text-left"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                    className="flex items-center justify-between bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 hover:scale-[1.01] transition-transform duration-300"
                  >
                    <div>
                      <h2 className="text-white text-lg font-semibold mb-1">
                        {index + 1}-dars:{" "}
                        <span className="text-green-600">{lesson.title}</span>
                      </h2>
                      <p className="text-white/70 text-xs robo-light">
                        Katta orzular katta qurbonlik talab qiladi ✨
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      {isLocked ? (
                        <Lock className="w-10 h-10 text-green-700" />
                      ) : (
                        <Play className="w-8 h-8 text-green-400" />
                      )}
                    </div>
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

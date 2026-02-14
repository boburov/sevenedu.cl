"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getMe } from "@/app/api/service/api";
import { Lock, Play, CheckCircle2, Sparkles, Crown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        // 1️⃣ userni olish
        const user: User = await getMe();

        const foundCourse = user.courses?.find((uc) => uc.courseId === courseId);

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

        const dataLessons: Lesson[] = res.data.lessons || [];

        // 3️⃣ maxsus kurs bo'lsa filter
        let finalLessons = dataLessons;

        if (courseId === SPECIAL_COURSE_ID) {
          finalLessons = [...dataLessons.slice(0, 24), ...dataLessons.slice(64)];
        } else if (courseId === SECOND_SPECIAL_COURSE_ID) {
          finalLessons = [...dataLessons.slice(32), ...dataLessons.slice(64)];
        }

        setLessons(finalLessons);
      } catch (err: any) {
        console.error("❌ Xatolik:", err?.message || err);
      } finally {
        setIsLoading(false);
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

  const visibleLessons = useMemo(
    () => lessons.filter((e) => e.isVisible === true),
    [lessons]
  );

  const isLessonLocked = (lesson: Lesson, index: number) =>
    (!userHasCourse && lesson.isDemo === false) ||
    (userHasCourse && userSubscription === "MONTHLY" && index >= 12);

  // "current" = first unlocked lesson
  const currentIndex = useMemo(() => {
    const idx = visibleLessons.findIndex((l, i) => !isLessonLocked(l, i));
    return idx === -1 ? 0 : idx;
  }, [visibleLessons, userHasCourse, userSubscription]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-purple-100 border-t-purple-600"
                />
                <div className="absolute inset-2 rounded-full bg-purple-50" />
              </div>
              <p className="text-gray-600 text-lg font-medium">Darslar yuklanmoqda...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#9333ea" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Gradient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10 md:mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-50 border border-purple-200">
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-purple-600" />
            <span className="text-xs sm:text-sm font-medium text-purple-700">
              {userHasCourse
                ? userSubscription === "FULL_CHARGE"
                  ? "To'liq kurs"
                  : "Oylik obuna"
                : "Demo rejim"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 bg-gradient-to-r from-purple-600 via-gray-900 to-purple-600 bg-clip-text text-transparent px-4">
            Kurs Darslari
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            {visibleLessons.length} ta dars mavjud
          </p>
        </motion.div>

        {/* Empty state */}
        {!lessons.length || visibleLessons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto px-4"
          >
            <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-8 sm:p-12 text-center shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent rounded-2xl sm:rounded-3xl" />
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Hozircha darslar mavjud emas
                </h2>
                <p className="text-sm sm:text-base text-gray-500">
                  Tez orada yangi darslar qo'shiladi.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {visibleLessons.map((lesson, index) => {
                const locked = isLessonLocked(lesson, index);
                const isCurrent = index === currentIndex && !locked;
                const isDone = index < currentIndex && !locked;
                const leftSide = index % 2 === 0;

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(index * 0.05, 0.3),
                      ease: "easeOut",
                    }}
                    className="relative"
                  >
                    {/* Connector line */}
                    {index !== 0 && (
                      <div className="absolute left-[18px] sm:left-1/2 sm:-translate-x-1/2 -top-2 sm:-top-3 h-2 sm:h-3 w-[3px]">
                        <div
                          className={`h-full rounded-full ${isDone
                              ? "bg-gradient-to-b from-purple-500 to-purple-400"
                              : "bg-gray-200"
                            }`}
                        />
                      </div>
                    )}

                    {/* Mobile layout: vertical stack */}
                    <div className="sm:hidden flex items-start gap-3">
                      {/* Left node (mobile) */}
                      <div className="relative flex-shrink-0 pt-1">
                        <motion.div
                          whileHover={{ scale: locked ? 1 : 1.1 }}
                          whileTap={{ scale: locked ? 1 : 0.95 }}
                          className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${locked
                              ? "bg-gray-100 border-2 border-gray-200"
                              : isDone
                                ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200"
                                : isCurrent
                                  ? "bg-gradient-to-br from-purple-400 to-purple-500 shadow-purple-300 ring-2 ring-purple-100"
                                  : "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200"
                            }`}
                        >
                          {locked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" fill="white" />
                          )}

                          {isCurrent && !locked && (
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-xl bg-purple-400 ring-2 ring-purple-100"
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Card (mobile) */}
                      <LessonCard
                        lesson={lesson}
                        index={index}
                        locked={locked}
                        isCurrent={isCurrent}
                        isDone={isDone}
                        onClick={() => openLesson(lesson, index)}
                        isMobile={true}
                      />
                    </div>

                    {/* Desktop layout: snake pattern */}
                    <div
                      className={`hidden sm:flex items-center gap-4 ${leftSide ? "justify-start" : "justify-end"
                        }`}
                    >
                      {/* Left card */}
                      {leftSide ? (
                        <LessonCard
                          lesson={lesson}
                          index={index}
                          locked={locked}
                          isCurrent={isCurrent}
                          isDone={isDone}
                          onClick={() => openLesson(lesson, index)}
                          isMobile={false}
                        />
                      ) : (
                        <div className="flex-1 max-w-[45%]" />
                      )}

                      {/* Center node */}
                      <div className="relative flex-shrink-0">
                        {/* Horizontal connector */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 h-[3px] w-8 ${leftSide ? "-left-8" : "left-14"
                            }`}
                        >
                          <div
                            className={`h-full rounded-full ${isDone
                                ? "bg-gradient-to-r from-purple-500 to-purple-400"
                                : "bg-gray-200"
                              }`}
                          />
                        </div>

                        <motion.div
                          whileHover={{ scale: locked ? 1 : 1.1 }}
                          whileTap={{ scale: locked ? 1 : 0.95 }}
                          className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${locked
                              ? "bg-gray-100 border-2 border-gray-200"
                              : isDone
                                ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200"
                                : isCurrent
                                  ? "bg-gradient-to-br from-purple-400 to-purple-500 shadow-purple-300 ring-4 ring-purple-100"
                                  : "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200"
                            }`}
                        >
                          {locked ? (
                            <Lock className="w-6 h-6 text-gray-400" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-white" fill="white" />
                          )}

                          {isCurrent && !locked && (
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-2xl bg-purple-400 ring-4 ring-purple-100"
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Right card */}
                      {!leftSide ? (
                        <LessonCard
                          lesson={lesson}
                          index={index}
                          locked={locked}
                          isCurrent={isCurrent}
                          isDone={isDone}
                          onClick={() => openLesson(lesson, index)}
                          isMobile={false}
                        />
                      ) : (
                        <div className="flex-1 max-w-[45%]" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

// Lesson Card Component
const LessonCard: React.FC<{
  lesson: Lesson;
  index: number;
  locked: boolean;
  isCurrent: boolean;
  isDone: boolean;
  onClick: () => void;
  isMobile: boolean;
}> = ({ lesson, index, locked, isCurrent, isDone, onClick, isMobile }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: locked ? 1 : 1.02, y: locked ? 0 : -4 }}
      whileTap={{ scale: locked ? 1 : 0.98 }}
      className={`text-left group ${isMobile ? "flex-1" : "flex-1 max-w-[45%]"
        }`}
    >
      <div
        className={`relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${locked
            ? "bg-gray-50 border-2 border-gray-200 shadow-sm"
            : isCurrent
              ? "bg-white border-2 border-purple-300 shadow-xl shadow-purple-100"
              : isDone
                ? "bg-white border-2 border-purple-200 shadow-lg shadow-purple-50"
                : "bg-white border-2 border-gray-200 shadow-lg hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100"
          }`}
      >
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 ${locked
              ? "bg-gradient-to-br from-gray-50 to-transparent"
              : isCurrent
                ? "bg-gradient-to-br from-purple-50 via-transparent to-blue-50"
                : isDone
                  ? "bg-gradient-to-br from-purple-50/50 to-transparent"
                  : "bg-gradient-to-br from-purple-50/30 via-transparent to-transparent"
            }`}
        />

        {/* Shimmer effect on hover */}
        {!locked && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent skew-x-12"
            />
          </div>
        )}

        <div className="relative p-3 sm:p-4 md:p-5">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] sm:text-xs font-semibold text-gray-700">
              <Zap className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-purple-600" />
              <span className="hidden xs:inline">{index + 1}-bosqich</span>
              <span className="xs:hidden">{index + 1}</span>
            </span>

            {lesson.isDemo && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 text-[10px] sm:text-xs font-semibold text-amber-700">
                <Crown className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                Demo
              </span>
            )}

            {isCurrent && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 text-[10px] sm:text-xs font-semibold text-purple-700 animate-pulse">
                <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                <span className="hidden sm:inline">Siz shu yerdasiz</span>
                <span className="sm:hidden">Joriy</span>
              </span>
            )}

            {locked && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] sm:text-xs font-semibold text-gray-500">
                <Lock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                Locked
              </span>
            )}

            {isDone && !isCurrent && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-100 border border-green-300 text-[10px] sm:text-xs font-semibold text-green-700">
                <CheckCircle2 className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                <span className="hidden xs:inline">Tugallandi</span>
                <span className="xs:hidden">✓</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-sm sm:text-base font-bold mb-1.5 sm:mb-2 line-clamp-2 ${locked ? "text-gray-400" : "text-gray-900"
              }`}
          >
            {lesson.title}
          </h3>

          {/* Description */}
          <p
            className={`text-xs sm:text-sm ${locked ? "text-gray-400" : "text-gray-600"
              }`}
          >
            {locked
              ? "🔒 Kirish uchun obuna kerak"
              : isDone
                ? "✓ Tugallangan dars"
                : isCurrent
                  ? "▶ Hozir boshlang"
                  : "Davom eting"}
          </p>

          {/* Progress bar for current lesson */}
          {isCurrent && !locked && (
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-purple-200">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-purple-600 mb-1">
                <span>Davom eting</span>
                <span>0%</span>
              </div>
              <div className="h-1 sm:h-1.5 bg-purple-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "0%" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Top accent line */}
        {!locked && (
          <div
            className={`absolute top-0 left-0 right-0 h-0.5 sm:h-1 ${isCurrent
                ? "bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500"
                : isDone
                  ? "bg-gradient-to-r from-purple-500 to-purple-400"
                  : "bg-gradient-to-r from-purple-400/50 to-purple-300/50"
              }`}
          />
        )}
      </div>
    </motion.button>
  );
};

export default CourseLessonsPage;
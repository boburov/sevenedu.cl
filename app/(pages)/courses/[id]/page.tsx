"use client";

import { GetCourseById, getMe } from "@/app/api/service/api";
import { Lock, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import apiEndpoins from "@/app/api/api.endpoin";

interface Lesson {
  id: string;
  videoUrl: string;
  title: string;
  isDemo?: boolean;
}

interface UserCourse {
  courseId: string;
}

interface User {
  id: string;
  name: string;
  courses: UserCourse[];
}

const Page = () => {
  const params = useParams();
  const courseId = params.id;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userHasCourse, setUserHasCourse] = useState<boolean>(false);

  useEffect(() => {


    const fetchData = async () => {
      axios.get("https://sevenedu.store/" + apiEndpoins.getCategory(String(courseId)))
        .then((elem) => {
          setLessons(elem.data.lessons)
        })
        .catch((err) => {
          console.error("❌ Xatolik:", err.message);
        });
      if (!courseId) return;

      try {
        const user: User = await getMe();
        const hasCourse = user.courses?.some(
          (uc) => uc.courseId === String(courseId)
        );
        setUserHasCourse(!!hasCourse);
      } catch (err) {
        setUserHasCourse(false);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="container mx-auto px-4 py-10">
      {!lessons.length ? (
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
          {lessons.map((lesson, index) => {
            const isLocked = !userHasCourse && lesson.isDemo === false;

            const url = isLocked
              ? "https://t.me/GraffDracula"
              : `${courseId}/lessons/${lesson.id}`;

            const Wrapper = isLocked ? "a" : Link;

            return (
              <Wrapper
                href={url}
                target={isLocked ? "_blank" : ""}
                key={index}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
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
              </Wrapper>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;

"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import { Lock, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  lessons: [];
  goal: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  courses: Course[];
  phonenumber: string;
  coin: number;
}

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);

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
          meData.courses.map((courseId: any) =>
            GetCourseById(courseId.courseId)
          )
        );
        setUserCourses(userCourseData);
      } catch (e) {
        console.error("fetchAll error:", e);
      }
    };

    fetchAll();
  }, []);

  return (
    <section className="container p-5 text-white">
      <h1 className="text-xl mb-6">
        Kurslarim soni: {user?.courses?.length ?? 0}
      </h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {userCourses.map((kurs) => (
          <li
            key={kurs.id}
            className="group relative flex flex-col bg-gradient-to-br from-green-800/20 to-green-600/10 p-5 border border-green-400/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform"
          >
            <div className="w-full h-36 mb-4 overflow-hidden rounded-xl">
              <img
                src={kurs.thumbnail}
                alt={kurs.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h3 className="uppercase font-semibold text-green-300 tracking-wider text-lg mb-2">
              {kurs.title}
            </h3>
            <p className="text-sm text-white/80 mb-1">
              <strong>Darslar:</strong>{" "}
              {kurs.lessons?.filter((lesson: any) => lesson.isVisible)
                ?.length || 0}
            </p>
            <p className="text-sm text-white/70 mb-3 line-clamp-2">
              <strong>Maqsad:</strong> {kurs.goal}
            </p>
            <Link
              href={`/courses/${kurs.id}`}
              className="text-sm px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium flex items-center gap-2 w-fit"
            >
              <Play size={16} /> Darslarni Ko‘rish
            </Link>
          </li>
        ))}
      </ul>

      <h1 className="text-2xl font-bold mb-6">Barcha Kurslar</h1>

      {courses.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((kurs) => (
            <li
              key={kurs.id}
              className="group relative flex flex-col bg-gradient-to-tr from-[#1e1e1e] to-green-900/10 p-5 border border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform"
            >
              <div className="w-full h-36 mb-4 overflow-hidden rounded-xl">
                <img
                  src={kurs.thumbnail}
                  alt={kurs.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3 className="uppercase font-semibold text-green-400 tracking-wider text-lg mb-2">
                {kurs.title}
              </h3>
              <p className="text-sm text-white/80 mb-1">
                <strong>Darslar:</strong>{" "}
                {kurs.lessons?.filter((lesson: any) => lesson.isVisible)
                  ?.length || 0}
              </p>
              <p className="text-sm text-white/70 mb-3 line-clamp-2">
                <strong>Maqsad:</strong> {kurs.goal}
              </p>
              <Link
                href={`/courses/${kurs.id}`}
                className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium flex items-center gap-2 w-fit"
              >
                <Lock size={16} /> Demo Darslarni Ko‘rish
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-white/70">Xozircha kurslar yo‘q</p>
      )}
    </section>
  );
};

export default UserPage;

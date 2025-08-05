"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import Hero from "@/app/components/Hero";
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
        getMe().then((data) => {
          data.courses.map((courseId: any) => {
            GetCourseById(courseId.courseId).then((ddd) => {
              setUserCourses([ddd]);
            });
          });
        });

        const [allCoursesData, meData] = await Promise.all([
          allCourse(),
          getMe(),
        ]);
        setCourses(allCoursesData);
        setUser(meData);
      } catch (e) {
        console.error("fetchAll error:", e);
      }
    };

    fetchAll();
  }, []);

  return (
    <>
      <Hero />
      <section className="container p-5 text-white hidden max-md:block">
        <h1 className="text-xl mb-1">
          Kurslarim soni: {user?.courses?.length ?? 0}
        </h1>
        <ul className="space-y-4 grid grid-cols-3 max-md:grid-cols-1 mb-7">
          {userCourses.map((kurs) => {
            return (
              <li
                key={kurs.id}
                className="flex items-center justify-between gap-4 p-2 bg-white/15 border border-white/15 text-white rounded-2xl transition-transform hover:scale-105"
              >
                <img
                  src={kurs.thumbnail}
                  alt={`${kurs.title} kursining rasmi`}
                  className="w-1/2 h-32 object-cover rounded-xl"
                />
                <div className="flex flex-col w-full h-11/12 justify-between items-start font-[robolight] tracking-wide gap-1">
                  <h3 className="uppercase font-bold text-green-500 text-base mb-1 tracking-widest">
                    {kurs.title}
                  </h3>
                  <span className="text-sm leading-2">
                    <strong>Darslar Soni:</strong>{" "}
                    <span className="font-light">
                      {kurs.lessons?.length || 0}
                    </span>
                  </span>
                  <span className="my-1 text-sm leading-5 w-36 truncate">
                    <strong>Maqsad: </strong> {kurs.goal}
                  </span>
                  <Link
                    href={`/courses/${kurs.id}`}
                    className="px-3 py-1.5 bg-green-500 rounded-md flex items-center gap-2 text-xs"
                  >
                    <Play size={18} /> {`Darslarni Ko'rish`}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <h1 className="text-2xl font-bold mb-4">Barcha Kurslar</h1>

        {courses.length > 0 ? (
          <ul className="grid grid-cols-3 gap-5 max-md:grid-cols-1 mb-10">
            {courses.map((kurs) => (
              <li
                key={kurs.id}
                className="flex items-center justify-between gap-4 px-2 py-2 bg-white/15 border border-white/15 text-white rounded-2xl transition-transform hover:scale-105"
              >
                <img
                  src={kurs.thumbnail}
                  alt={`${kurs.title} kursining rasmi`}
                  className="w-1/2 h-32 object-cover rounded"
                />
                <div className="flex flex-col w-full h-11/12 justify-between items-start font-[robolight] tracking-wide">
                  <h3 className="uppercase font-bold text-green-500 text-base mb-1 tracking-widest">
                    {kurs.title}
                  </h3>
                  <span className="text-sm leading-2">
                    <strong>Darslar Soni:</strong>{" "}
                    <span className="font-light">{kurs.lessons.length}</span>
                  </span>
                  <span className="my-1 text-sm leading-5 w-36 truncate">
                    <strong>Maqsad: </strong> {kurs.goal}
                  </span>
                  <Link
                    href={`/courses/${kurs.id}`}
                    className="px-3 py-1.5 bg-green-500 rounded-md flex items-center gap-2 text-xs"
                  >
                    <Lock width={18} /> {`Buyurtma berish`}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <h2>{`Xozircha kurslar yo'q`}</h2>
        )}
      </section>
    </>
  );
};

export default UserPage;

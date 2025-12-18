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
    console.log(originalUrl);

    if (
      originalUrl.startsWith("https://s3.eu-north-1.amazonaws.com/seven.edu/")
    ) {
      return originalUrl;
    }
    const match = originalUrl.match(
      /\/images\/([^/?]+)(\.png|\.jpg|\.jpeg|\.webp|\.gif)/i
    );

    if (match) {
      const filename = match[1] + match[2]; // 1765977438188.png
      return `https://s3.eu-north-1.amazonaws.com/seven.edu/images/${filename}`;
    }

    // Agar topilmasa – placeholder
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
      <section className="container p-5 text-white hidden max-md:block">
        <h1 className="text-xl mb-1">
          Kurslarim soni: {user?.courses?.length ?? 0}
        </h1>
        {/* USER KURSLARI – to'liq rasm */}
        <ul className="space-y-4 grid grid-cols-1 mb-7">
          {userCourses.map((kurs) => (
            <li
              key={kurs.id}
              className="flex items-center justify-between gap-4 p-2 bg-white/15 border border-white/15 text-white rounded-2xl transition-transform hover:scale-105"
            >
              <div className="w-1/2 h-32 relative overflow-hidden rounded-xl">
                <Image
                  src={getSafeThumbnail(kurs.thumbnail)}
                  alt={kurs.title}
                  fill
                  className="object-cover"
                  unoptimized // S3 external uchun majburiy
                />
              </div>

              <div className="flex flex-col justify-between h-32 w-full">
                <div>
                  <h3 className="uppercase font-bold text-green-500 text-base mb-1 tracking-widest">
                    {kurs.title}
                  </h3>
                  <span className="text-sm">
                    <strong>Darslar Soni:</strong>{" "}
                    {kurs.lessons?.filter((l: any) => l.isVisible).length || 0}
                  </span>
                  <p className="text-sm my-1 line-clamp-2">
                    <strong>Maqsad:</strong> {kurs.goal}
                  </p>
                </div>

                <Link
                  href={`/courses/${kurs.id}`}
                  className="px-3 py-1.5 bg-green-500 rounded-md flex items-center gap-2 text-xs w-fit"
                >
                  <Play size={18} /> Darslarni Ko'rish
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {/* BARCHA KURSLAR */}
        <h1 className="text-2xl font-bold mb-4">Barcha Kurslar</h1>
        {courses.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 mb-10">
            {courses.map((kurs) => {
              const isOwned = userCourses.some((uc) => uc.id === kurs.id);

              return (
                <li
                  key={kurs.id}
                  className="flex items-center justify-between gap-4 px-2 py-2 bg-white/15 border border-white/15 text-white rounded-2xl transition-transform hover:scale-105"
                >
                  <div className="w-1/2 h-32 relative overflow-hidden rounded-xl">
                    {isOwned ? (
                      <Image
                        src={getSafeThumbnail(kurs.thumbnail)}
                        alt={kurs.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800/70 flex items-center justify-center backdrop-blur-sm">
                        <Lock size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between h-32 w-full">
                    <div>
                      <h3 className="uppercase font-bold text-green-500 text-base mb-1 tracking-widest">
                        {kurs.title}
                      </h3>
                      <span className="text-sm">
                        <strong>Darslar Soni:</strong>{" "}
                        {kurs.lessons?.filter((l: any) => l.isVisible).length ||
                          0}
                      </span>
                      <p className="text-sm my-1 line-clamp-2">
                        <strong>Maqsad:</strong> {kurs.goal}
                      </p>
                    </div>

                    <Link
                      href={`/courses/${kurs.id}`}
                      className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs w-fit ${
                        isOwned
                          ? "bg-green-500"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    >
                      {isOwned ? (
                        <>
                          {" "}
                          <Play size={18} /> Darslarni Ko'rish{" "}
                        </>
                      ) : (
                        <>
                          {" "}
                          <Lock size={18} /> Buyurtma berish{" "}
                        </>
                      )}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <h2 className="text-center">Xozircha kurslar yo'q</h2>
        )}
      </section>
    </>
  );
};

export default UserPage;

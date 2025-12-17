"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import { Lock, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image"; // next/image ishlatish tavsiya (optimallashtirish uchun)

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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [allCoursesData, meData] = await Promise.all([
          allCourse(),
          getMe(),
        ]);

        setCourses(allCoursesData);
        setUser(meData);

        // Userning sotib olgan kurslarini ID orqali olish
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

  // ✅ URL ni to'g'rilovchi function (path-style ga o'tkazadi)
  const getSafeThumbnail = (originalUrl: string) => {
    if (!originalUrl) return placeholderThumbnail;

    // Agar allaqachon path-style bo'lsa – o'zgartirmay qaytar
    if (originalUrl.includes("s3.eu-north-1.amazonaws.com/seven.edu/")) {
      return originalUrl;
    }

    // Eski formatdan key ni kesib olish: /images/1765932988488.png
    const match = originalUrl.match(
      /\/images\/(.+\.png|\.jpg|\.jpeg|\.webp)$/i
    );
    if (match) {
      const filename = match[1]; // faqat filename + ext
      return `https://s3.eu-north-1.amazonaws.com/seven.edu/images/${filename}`;
    }

    // Agar boshqa format bo'lsa – placeholder
    return placeholderThumbnail;
  };

  // Placeholder rasm (masalan, local papkada yoki CDN dan)
  const placeholderThumbnail = "/images/course-placeholder.jpg"; // public papkaga qo'y

  return (
    <section className="container p-5 text-white">
      <h1 className="text-xl mb-6">
        Kurslarim soni: {user?.courses?.length ?? 0}
      </h1>

      {/* === USERNING KURSLARI (to'liq thumbnail) === */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {userCourses.map((kurs) => (
          <li
            key={kurs.id}
            className="group relative flex flex-col bg-gradient-to-br from-green-800/20 to-green-600/10 p-5 border border-green-400/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform"
          >
            <div className="w-full h-36 mb-4 overflow-hidden rounded-xl">
              <Image
                src={getSafeThumbnail(kurs.thumbnail)}
                alt={kurs.title}
                width={400}
                height={144}
                className="w-full h-full object-cover object-center"
                unoptimized // S3 external link uchun kerak
              />
            </div>
            <h3 className="uppercase font-semibold text-green-300 tracking-wider text-lg mb-2">
              {kurs.title}
            </h3>
            <p className="text-sm text-white/80 mb-1">
              <strong>Darslar:</strong>{" "}
              {kurs.lessons?.filter((lesson: any) => lesson.isVisible).length ||
                0}
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

      {/* === BARCHA KURSLAR (demo – thumbnail YASHIRILGAN) === */}
      <h1 className="text-2xl font-bold mb-6">Barcha Kurslar</h1>
      {courses.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((kurs) => {
            // Agar bu kurs userda bo'lsa – to'liq thumbnail, aks holda placeholder yoki blur
            const isOwned = userCourses.some((uc) => uc.id === kurs.id);

            return (
              <li
                key={kurs.id}
                className="group relative flex flex-col bg-gradient-to-tr from-[#1e1e1e] to-green-900/10 p-5 border border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform"
              >
                <div className="w-full h-36 mb-4 overflow-hidden rounded-xl relative">
                  {isOwned ? (
                    <Image
                      src={getSafeThumbnail(kurs.thumbnail)}
                      alt={kurs.title}
                      width={400}
                      height={144}
                      className="w-full h-52 object-cover"
                      unoptimized
                    />
                  ) : (
                    // Demo uchun blur + lock icon yoki placeholder
                    <div className="w-full h-full bg-gray-800/70 flex items-center justify-center backdrop-blur-sm">
                      <Lock size={48} className="text-gray-500" />
                    </div>
                  )}
                </div>

                <h3 className="uppercase font-semibold text-green-400 tracking-wider text-lg mb-2">
                  {kurs.title}
                </h3>
                <p className="text-sm text-white/80 mb-1">
                  <strong>Darslar:</strong>{" "}
                  {kurs.lessons?.filter((lesson: any) => lesson.isVisible)
                    .length || 0}
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
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-white/70">Xozircha kurslar yo‘q</p>
      )}
    </section>
  );
};

export default UserPage;

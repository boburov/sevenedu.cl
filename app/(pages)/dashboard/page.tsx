"use client";

import { getMe, GetCourseById } from "@/app/api/service/api";
import { Gift, Coins, UserCheck, GaugeCircle, Award } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  lessons: [];
  goal: string;
}

const dashboardLinks = [
  {
    href: "dashboard/progress",
    icon: <GaugeCircle size={40} className="text-green-300" />,
    title: "Jarayon",
    description: "Darslar, testlar va yodlangan so‘zlar statistikasi",
  },
  {
    href: "dashboard/activity",
    icon: <UserCheck size={40} className="text-blue-300" />,
    title: "Aktivlik",
    description: "Kundalik kirish va darslarda qatnashish",
  },
  {
    href: "dashboard/gifts",
    icon: <Gift size={40} className="text-yellow-300" />,
    title: "Sovrinlar",
    description: "Faollik uchun olingan sovrinlar",
  },
  {
    href: "dashboard/coins",
    icon: <Coins size={40} className="text-white" />,
    title: "Tangalar",
    description: "Yig‘ilgan ballar va sarflanishi",
  },
];

const UserPage = () => {
  const [userCourses, setUserCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getMe();
        const fetchedCourses = await Promise.all(
          data.courses.map(
            async (courseRef: any) => await GetCourseById(courseRef.courseId)
          )
        );
        setUserCourses(fetchedCourses);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="container p-5 text-white">
      <h1 className="text-2xl font-bold mb-5">
        Kurslaringiz soni: {userCourses.length}
      </h1>

      {/* Glass dashboard links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {dashboardLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-5 hover:bg-white/20 transition"
          >
            <div className="flex items-start gap-4">
              {link.icon}
              <div>
                <h2 className="text-lg font-semibold">{link.title}</h2>
                <p className="text-sm text-white/70">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default UserPage;

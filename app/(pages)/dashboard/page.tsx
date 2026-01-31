"use client";

import { getMe, GetCourseById } from "@/app/api/service/api";
import { Gift, Coins, UserCheck, GaugeCircle } from "lucide-react";
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
    icon: <GaugeCircle size={32} className="text-primary" />,
    title: "Jarayon",
    description: "Darslar, testlar va yodlangan so'zlar statistikasi",
    bgColor: "bg-primary-soft",
  },
  {
    href: "dashboard/activity",
    icon: <UserCheck size={32} className="text-info" />,
    title: "Aktivlik",
    description: "Kundalik kirish va darslarda qatnashish",
    bgColor: "bg-info-soft",
  },
  {
    href: "dashboard/gifts",
    icon: <Gift size={32} className="text-warning" />,
    title: "Sovrinlar",
    description: "Faollik uchun olingan sovrinlar",
    bgColor: "bg-warning-soft",
  },
  {
    href: "dashboard/coins",
    icon: <Coins size={32} className="text-success" />,
    title: "Tangalar",
    description: "Yig'ilgan ballar va sarflanishi",
    bgColor: "bg-success-soft",
  },
];

const UserPage = () => {
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="container py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-text-secondary text-sm">
          Kurslaringiz soni:{" "}
          <span className="font-semibold text-primary">{userCourses.length}</span>
        </p>
      </div>

      {/* Dashboard links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {dashboardLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="bg-surface border border-border rounded-card p-5 shadow-card hover:shadow-card-hover transition-all duration-200 group"
          >
            <div className="flex items-start gap-4">
              <div
                className={`${link.bgColor} p-3 rounded-xl transition-transform duration-200 group-hover:scale-105`}
              >
                {link.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-text-primary mb-1">
                  {link.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {link.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && userCourses.length === 0 && (
        <div className="bg-surface border border-border rounded-card p-8 text-center shadow-card">
          <p className="text-text-secondary mb-4">
            Hozircha hech qanday kurs yo'q
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-button font-semibold hover:bg-primary-hover transition-all duration-200 shadow-md"
          >
            Kurslarni ko'rish
          </Link>
        </div>
      )}
    </section>
  );
};

export default UserPage;

"use client";

import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  Bell,
  Settings,
  Lock,
  LogOut,
} from "lucide-react";
import { allCourse, getMe } from "@/app/api/service/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  courses: Course[];
  phonenumber: string;
  coins: number;
}

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    allCourse().then(setCourses).catch(console.error);
    getMe().then(setUser).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const cardStyle =
    "group flex items-center gap-4 rounded-2xl border border-[#0b0b14]/10 p-5 shadow-sm transition-all duration-200 hover:border-purple-500/10 hover:bg-[#141428]/10";

  const iconStyle =
    "h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 p-2 group-hover:bg-purple-500/20";

  return (
    <div className="min-h-screen text-[#0b0b14]">
      <div className="container mx-auto max-w-6xl px-4 pt-10">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Profil
            </h1>
            <p className="text-sm text-[#0b0b14] mt-1">
              Hisobingiz va sozlamalaringiz
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </button>
        </div>

        {/* Content */}
        {user ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* My courses */}
            <div className={cardStyle}>
              <div className={iconStyle}>
                <BookOpenCheck />
              </div>
              <div>
                <p className="text-sm text-[#0b0b14]">Mening kurslarim</p>
                <p className="mt-1 text-xl font-semibold">
                  {user.courses.length}
                  <span className="text-sm font-normal text-[#0b0b14]"> ta</span>
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className={cardStyle}>
              <div className={iconStyle}>
                <Bell />
              </div>
              <div>
                <p className="text-sm text-[#0b0b14]">Bildirishnomalar</p>
                <p className="mt-1 text-xl font-semibold">
                  0
                  <span className="text-sm font-normal text-[#0b0b14]"> ta</span>
                </p>
              </div>
            </div>

            {/* All courses */}
            <div className={cardStyle}>
              <div className={iconStyle}>
                <BookOpenCheck />
              </div>
              <div>
                <p className="text-sm text-[#0b0b14]">Platformadagi kurslar</p>
                <p className="mt-1 text-xl font-semibold">
                  {courses.length}
                  <span className="text-sm font-normal text-[#0b0b14]"> ta</span>
                </p>
              </div>
            </div>

            {/* Settings */}
            <Link href="/settings" className={cardStyle}>
              <div className={iconStyle}>
                <Settings />
              </div>
              <div>
                <p className="text-sm text-[#0b0b14]">Profil sozlamalari</p>
                <p className="mt-1 text-sm text-[#0b0b14]">
                  Shaxsiy ma’lumotlarni tahrirlash
                </p>
              </div>
            </Link>

            {/* Password */}
            <Link href="/user/settings/password" className={cardStyle}>
              <div className={iconStyle}>
                <Lock />
              </div>
              <div>
                <p className="text-sm text-[#0b0b14]">Parol xavfsizligi</p>
                <p className="mt-1 text-sm text-[#0b0b14]">
                  Parolni yangilash
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <p className="mt-20 text-center text-[#0b0b14]">Yuklanmoqda...</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;

"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/app/components/shell/AppShell";
import {
  BookOpenCheck,
  Bell,
  Settings,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { allCourse, getMe } from "@/app/api/service/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";

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

  // Ko'rsatkich kartochkasi bosilmaydi — shuning uchun hover holati yo'q.
  const cardStyle =
    "flex items-center gap-4 rounded-card border border-border bg-surface p-5";

  // Havola kartochkasi bosiladi: hover'da chegara quyuqlashadi + fokus halqasi.
  const cardLinkStyle = `${cardStyle} focus-ring transition-colors hover:border-border-strong`;

  const iconStyle =
    "grid h-10 w-10 shrink-0 place-items-center rounded-tile border border-border bg-surface-alt text-text-secondary";

  return (
    <div className="container py-8 sm:py-10">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Rasm ustiga bosib almashtirish mumkin */}
          <Avatar size={56} editable />
          <div>
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
              Profil
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary">
              Hisobingiz va sozlamalaringiz
            </p>
          </div>
        </div>

        <Button type="button" variant="outline" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.75} />
          Chiqish
        </Button>
      </header>

      {/* Content */}
      {user ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* My courses */}
          <div className={cardStyle}>
            <span className={iconStyle}>
              <BookOpenCheck size={20} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm text-text-secondary">Mening kurslarim</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">
                {user.courses.length}
                <span className="text-sm font-normal text-text-secondary">
                  {" "}
                  ta
                </span>
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className={cardStyle}>
            <span className={iconStyle}>
              <Bell size={20} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm text-text-secondary">Bildirishnomalar</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">
                0
                <span className="text-sm font-normal text-text-secondary">
                  {" "}
                  ta
                </span>
              </p>
            </div>
          </div>

          {/* All courses */}
          <div className={cardStyle}>
            <span className={iconStyle}>
              <BookOpenCheck size={20} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm text-text-secondary">
                Platformadagi kurslar
              </p>
              <p className="mt-1 text-xl font-semibold text-text-primary">
                {courses.length}
                <span className="text-sm font-normal text-text-secondary">
                  {" "}
                  ta
                </span>
              </p>
            </div>
          </div>

          {/* Settings */}
          <Link href="/user/settings" className={cardLinkStyle}>
            <span className={iconStyle}>
              <Settings size={20} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                Profil sozlamalari
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Shaxsiy ma&rsquo;lumotlarni tahrirlash
              </p>
            </div>
            <ChevronRight
              size={16}
              strokeWidth={1.75}
              className="ml-auto shrink-0 text-text-muted"
            />
          </Link>

          {/* Password */}
          <Link href="/user/settings/password" className={cardLinkStyle}>
            <span className={iconStyle}>
              <Lock size={20} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                Parol xavfsizligi
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Parolni yangilash
              </p>
            </div>
            <ChevronRight
              size={16}
              strokeWidth={1.75}
              className="ml-auto shrink-0 text-text-muted"
            />
          </Link>
        </div>
      ) : (
        <p className="mt-20 text-center text-[15px] text-text-secondary">
          Yuklanmoqda...
        </p>
      )}
    </div>
  );
};

export default UserPage;

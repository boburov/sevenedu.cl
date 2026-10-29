"use client";

// Ichki sahifalar uchun joriy foydalanuvchi — bir marta olinadi va qobiq
// (sidebar, topbar, pastki menyu) hamda sahifalar o'rtasida bo'lishiladi.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getMe, GetCourseById } from "@/app/api/service/api";

export interface MeCourse {
  id: string;
  title: string;
  shortName?: string;
  thumbnail: string;
  goal?: string;
  lessons: {
    id: string;
    title?: string;
    order?: number;
    isVisible?: boolean;
    isDemo?: boolean;
  }[];
}

export interface Me {
  id: string;
  name: string;
  surname?: string;
  email: string;
  profilePic?: string;
  coins: number;
  courses: { courseId: string; subscription?: string; joinedAt?: string }[];
  showedLesson?: {
    lessonsId: string;
    courseId?: string | null;
    watchedAt: string;
  }[];
  notifications?: { id: string; isRead: boolean }[];
}

interface MeState {
  me: Me | null;
  myCourses: MeCourse[];
  loading: boolean;
  setMe: (me: Me) => void;
  refresh: () => Promise<void>;
}

const MeContext = createContext<MeState | null>(null);

export const MeProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [myCourses, setMyCourses] = useState<MeCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      router.replace("/auth/login");
      return;
    }
    try {
      const data: Me | null = await getMe();
      if (!data) return; // 401 — getMe o'zi login sahifasiga yuboradi
      setMe(data);
      const courses = await Promise.all(
        (data.courses || []).map((c) =>
          GetCourseById(c.courseId).catch(() => null),
        ),
      );
      setMyCourses(courses.filter(Boolean) as MeCourse[]);
    } catch (error: unknown) {
      const err = error as { response?: { status: number }; message?: string };
      // Faqat token yaroqsiz bo'lsa sessiyani tozalaymiz; tarmoq/server
      // xatosida foydalanuvchini tizimdan chiqarib yubormaymiz.
      if (
        err?.response?.status === 401 ||
        err?.message === "Token bekor qilindi"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        router.replace("/auth/login");
      } else {
        console.error("Foydalanuvchi ma'lumotini olishda xatolik:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <MeContext.Provider value={{ me, myCourses, loading, setMe, refresh }}>
      {children}
    </MeContext.Provider>
  );
};

export const useMe = () => {
  const ctx = useContext(MeContext);
  if (!ctx) throw new Error("useMe faqat MeProvider ichida ishlatiladi");
  return ctx;
};

// Kurs bo'yicha ko'rilgan / jami (ko'rinadigan) darslar
export const courseProgress = (course: MeCourse, me: Me | null) => {
  const visible = (course.lessons || []).filter((l) => l.isVisible !== false);
  const ids = new Set(visible.map((l) => l.id));
  const done = new Set(
    (me?.showedLesson || [])
      .filter((s) => ids.has(s.lessonsId))
      .map((s) => s.lessonsId),
  ).size;
  const total = ids.size;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
};

// Kurslarni bir-biridan ajratish uchun bezak ranglari. Status tokenlaridan
// (success/warning/danger) ataylab mustaqil: kursga "xato qizil" yoki
// "ogohlantirish sariq" rang berish ma'no jihatdan noto'g'ri edi, hamda
// yangi orange urg'u bilan chalkashardi.
export const COURSE_DOTS = [
  "bg-course-1",
  "bg-course-2",
  "bg-course-3",
  "bg-course-4",
  "bg-course-5",
];

export const fullName = (me: Pick<Me, "name" | "surname"> | null) =>
  [me?.name, me?.surname].filter(Boolean).join(" ");

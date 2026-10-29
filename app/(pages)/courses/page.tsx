"use client";

import { allCourse, GetCourseById, getMe } from "@/app/api/service/api";
import { Lock, Play, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getSafeThumbnail, PLACEHOLDER_THUMBNAIL } from "@/app/lib/thumbnail";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { COURSE_DOTS } from "@/app/components/shell/MeContext";

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

type Tab = "all" | "mine";

// Kichik belgilar qobiq bilan bir xil chiziq qalinligida.
const BADGE_ICON = { size: 13, strokeWidth: 1.75 } as const;

// Kurs nuqtasi kurs id'siga bog'lanadi: ro'yxat filtrlanganda ham bitta
// kurs bitta rangda qoladi (indeks bo'yicha olinsa rang sakrab ketardi).
const courseDot = (id: string) =>
  COURSE_DOTS[
    Array.from(id).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
      COURSE_DOTS.length
  ];

const CoursesPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      // Kurslar ro'yxati va foydalanuvchi alohida olinadi: /auth/me yoki
      // bitta kurs xato bersa ham umumiy ro'yxat ko'rinib turishi kerak.
      const [coursesRes, meRes] = await Promise.allSettled([allCourse(), getMe()]);

      if (coursesRes.status === "fulfilled" && Array.isArray(coursesRes.value)) {
        setCourses(coursesRes.value);
      } else if (coursesRes.status === "rejected") {
        console.error("allCourse error:", coursesRes.reason);
      }

      const meData = meRes.status === "fulfilled" ? meRes.value : null;
      if (meRes.status === "rejected") console.error("getMe error:", meRes.reason);

      if (meData) {
        setUser(meData);
        const userCourseData = await Promise.all(
          (meData.courses || []).map((item: any) =>
            GetCourseById(item.courseId).catch(() => null)
          )
        );
        setUserCourses(userCourseData.filter(Boolean));
      }

      setLoading(false);
    };
    fetchAll();
  }, []);

  const ownedIds = useMemo(() => new Set(userCourses.map((c) => c.id)), [userCourses]);

  const countVisibleLessons = (kurs: Course) =>
    kurs.lessons?.filter((lesson: any) => lesson.isVisible).length || 0;

  const displayedCourses = useMemo(() => {
    const base = tab === "mine" ? userCourses : courses;
    if (!search.trim()) return base;
    return base.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.goal?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tab, courses, userCourses, search]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-[15px] text-text-secondary">Yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container py-8 sm:py-10">
      <header>
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
          Kurslar
        </h1>
        <p className="mt-2 text-[15px] text-text-secondary">
          {displayedCourses.length} ta kurs
        </p>
      </header>

      {/* Filtr qatori: tab + qidiruv */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex w-fit shrink-0 gap-1 rounded-button border border-border bg-surface-alt p-1">
          {([
            { key: "all", label: `Barcha (${courses.length})` },
            { key: "mine", label: `Mening (${userCourses.length})` },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className={`focus-ring rounded-button px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === key
                  ? "bg-surface text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            type="text"
            placeholder="Kurs qidirish..."
            aria-label="Kurs qidirish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
      </div>

      {/* ─── GRID ─── */}
      <div className="mt-6">
        {displayedCourses.length === 0 ? (
          <div className="mx-auto max-w-md rounded-card border border-border bg-surface p-10 text-center">
            <BookOpen
              size={28}
              strokeWidth={1.75}
              className="mx-auto text-text-muted"
            />
            <h2 className="mt-4 text-lg font-semibold text-text-primary">
              Kurs topilmadi
            </h2>
            {search && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSearch("")}
              >
                Qidiruvni tozalash
              </Button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedCourses.map((kurs) => {
              const isOwned = ownedIds.has(kurs.id);
              return (
                <li
                  key={kurs.id}
                  className="flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-border-strong"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden border-b border-border bg-surface-alt">
                    <Image
                      src={getSafeThumbnail(kurs.thumbnail)}
                      alt={kurs.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.endsWith(PLACEHOLDER_THUMBNAIL)) return;
                        img.src = PLACEHOLDER_THUMBNAIL;
                      }}
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      <Badge tone="neutral">
                        <BookOpen {...BADGE_ICON} />
                        {countVisibleLessons(kurs)} dars
                      </Badge>

                      {isOwned ? (
                        <Badge tone="accent-soft">Mening</Badge>
                      ) : (
                        <Badge tone="neutral">
                          <Lock {...BADGE_ICON} />
                          Yopiq
                        </Badge>
                      )}
                    </div>

                    <h3 className="flex items-start gap-2 text-[15px] font-semibold text-text-primary">
                      <span
                        aria-hidden
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${courseDot(kurs.id)}`}
                      />
                      <span className="line-clamp-1">{kurs.title}</span>
                    </h3>

                    <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-text-secondary line-clamp-2">
                      {kurs.goal}
                    </p>

                    {/* separator */}
                    <div className="my-3 h-px bg-border" />

                    {/* action */}
                    <Link
                      href={`/courses/${kurs.id}`}
                      className={`focus-ring inline-flex items-center gap-2 self-start rounded-button px-4 py-2 text-xs font-semibold transition-colors ${
                        isOwned
                          ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                          : "border border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-alt"
                      }`}
                    >
                      {isOwned ? (
                        <>
                          <Play size={13} strokeWidth={1.75} fill="currentColor" />{" "}
                          Ko&apos;rish
                        </>
                      ) : (
                        <>
                          <Lock size={13} strokeWidth={1.75} /> Buyurtma
                        </>
                      )}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
};

// Belgilar kurs darslari sahifasi bilan bir xil qolipda — ikki sahifa
// yonma-yon turganda bir tizim ko'rinishi uchun.
const BADGE_TONES = {
  neutral: "border-border bg-surface-alt text-text-secondary",
  "accent-soft": "border-accent/30 bg-accent-soft text-accent-strong",
} as const;

const Badge = ({
  tone,
  children,
}: {
  tone: keyof typeof BADGE_TONES;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${BADGE_TONES[tone]}`}
  >
    {children}
  </span>
);

export default CoursesPage;

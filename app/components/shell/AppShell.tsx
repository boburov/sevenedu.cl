"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import {
  Bell,
  BookOpen,
  ChartArea,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Coins,
  Home,
  LogOut,
  Medal,
  Mic,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import logo from "@/app/images/7edu white logo.png";
import {
  deleteUserProfilePic,
  updateUserProfilePic,
} from "@/app/api/service/api";
import { COURSE_DOTS, fullName, useMe } from "./MeContext";

const useNav = () => {
  const { me } = useMe();
  const unread = me?.notifications?.filter((n) => !n.isRead).length || 0;
  return {
    unread,
    items: [
      {
        href: me ? `/user/${me.id}` : "#",
        match: "/user/",
        icon: Home,
        label: "Asosiy",
      },
      { href: "/courses", match: "/courses", icon: BookOpen, label: "Kurslar" },
      {
        href: "/dashboard",
        match: "/dashboard",
        icon: ChartArea,
        label: "Dashboard",
      },
      { href: "/rank", match: "/rank", icon: Medal, label: "Reyting" },
      { href: "/speaking", match: "/speaking", icon: Mic, label: "Speaking" },
      {
        href: "/notifications",
        match: "/notifications",
        icon: Bell,
        label: "Bildirishnomalar",
        badge: unread,
      },
    ],
  };
};

const isActive = (pathname: string, match: string) =>
  match === "/user/"
    ? /^\/user\/(?!profile|settings)[^/]+$/.test(pathname)
    : pathname === match || pathname.startsWith(match + "/");

// Yuqori paneldagi yo'l (breadcrumb)
const CRUMBS: [RegExp, string[]][] = [
  [/^\/user\/profile/, ["Profil"]],
  [/^\/user\/settings\/password/, ["Profil", "Sozlamalar", "Parol"]],
  [/^\/user\/settings/, ["Profil", "Sozlamalar"]],
  [/^\/user\/[^/]+$/, ["Asosiy"]],
  [
    /^\/courses\/[^/]+\/lessons\/[^/]+\/(vocabulary|test|quiz|speaking|ask-for-ai)/,
    ["Kurslar", "Dars", "Mashq"],
  ],
  [/^\/courses\/[^/]+\/lessons/, ["Kurslar", "Dars"]],
  [/^\/courses\/[^/]+/, ["Kurslar", "Kurs"]],
  [/^\/courses/, ["Kurslar"]],
  [/^\/dashboard\/progress/, ["Dashboard", "Jarayon"]],
  [/^\/dashboard\/activity/, ["Dashboard", "Aktivlik"]],
  [/^\/dashboard\/gifts/, ["Dashboard", "Sovrinlar"]],
  [/^\/dashboard\/coins/, ["Dashboard", "Tangalar"]],
  [/^\/dashboard\/certificate/, ["Dashboard", "Sertifikat"]],
  [/^\/dashboard/, ["Dashboard"]],
  [/^\/rank/, ["Reyting"]],
  [/^\/speaking/, ["Speaking"]],
  [/^\/notifications/, ["Bildirishnomalar"]],
];

export const Avatar = ({
  size = 40,
  editable = false,
}: {
  size?: number;
  editable?: boolean;
}) => {
  const { me, setMe } = useMe();
  const input = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !me) return;
    const fd = new FormData();
    fd.append("profilePic", file);
    try {
      const updated = await updateUserProfilePic(me.id, fd);
      setMe({ ...me, profilePic: updated?.profilePic ?? me.profilePic });
    } catch (err) {
      console.error("Rasmni yuklashda xatolik:", err);
    }
  };

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!me) return;
    try {
      await deleteUserProfilePic(me.id);
      setMe({ ...me, profilePic: "" });
    } catch (err) {
      console.error("Rasmni o'chirishda xatolik:", err);
    }
  };

  const face = me?.profilePic ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={me.profilePic}
      alt={fullName(me)}
      className="h-full w-full object-cover"
    />
  ) : (
    <span
      className="font-semibold text-primary"
      style={{ fontSize: size * 0.4 }}
    >
      {me?.name?.[0]?.toUpperCase() || "?"}
    </span>
  );

  if (!editable) {
    return (
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-primary-soft"
        style={{ width: size, height: size }}
      >
        {face}
      </span>
    );
  }

  return (
    <span className="relative shrink-0" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={() => input.current?.click()}
        title="Profil rasmini o'zgartirish"
        className="grid h-full w-full place-items-center overflow-hidden rounded-full border border-border bg-primary-soft focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
      >
        {face}
      </button>
      {me?.profilePic && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Profil rasmini o'chirish"
          className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-border bg-surface text-text-secondary hover:text-danger"
        >
          <Trash2 size={12} />
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </span>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { me, myCourses } = useMe();
  const { items } = useNav();

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex items-center gap-3 px-5 pt-5">
        <span className="rounded-xl bg-primary p-1">
          <Image alt="SevenEdu" src={logo} className="w-9 object-cover" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-text-primary">SevenEdu</p>
          <p className="truncate text-xs text-text-muted">{me?.email || "…"}</p>
        </div>
      </div>

      <div className="mx-4 mt-5 rounded-card border border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar size={44} editable />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {fullName(me) || "…"}
            </p>
            <p className="flex items-center gap-1 text-xs text-text-secondary">
              <Coins size={12} className="text-warning" />
              {(me?.coins ?? 0).toLocaleString("en-US")} tanga
            </p>
          </div>
        </div>
        <Link
          href="/user/profile"
          className="mt-3 flex items-center justify-center rounded-button border border-border py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
        >
          Profilni ko&apos;rish
        </Link>
      </div>

      <div className="px-4 pt-4">
        <Link
          href="/courses"
          className="flex items-center justify-center gap-2 rounded-button border border-primary bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Plus size={16} /> Kurslarni ko&apos;rish
        </Link>
      </div>

      <nav className="mt-5 flex-1 overflow-y-auto px-4">
        <p className="mb-2 px-3 text-xs text-text-muted">Menyu</p>
        <ul className="space-y-0.5">
          {items.map(({ href, match, icon: Icon, label, badge }) => {
            const active = isActive(pathname, match);
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-button border px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border-border bg-surface-alt font-semibold text-text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Icon size={17} className={active ? "text-primary" : ""} />
                  <span className="flex-1">{label}</span>
                  {!!badge && (
                    <span className="rounded-full bg-danger px-1.5 text-[10px] font-semibold leading-4 text-white">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {myCourses.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 px-3 text-xs text-text-muted">
              Mening kurslarim
            </p>
            <ul className="space-y-0.5">
              {myCourses.map((c, i) => {
                const active = pathname.startsWith(`/courses/${c.id}`);
                return (
                  <li key={c.id}>
                    <Link
                      href={`/courses/${c.id}`}
                      className={`flex items-center gap-3 rounded-button border px-3 py-2 text-sm transition-colors ${
                        active
                          ? "border-border bg-surface-alt font-semibold text-text-primary"
                          : "border-transparent text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${COURSE_DOTS[i % COURSE_DOTS.length]}`}
                      />
                      <span className="truncate">{c.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      <div className="space-y-0.5 border-t border-border px-4 py-3">
        <Link
          href="/user/settings"
          className="flex items-center gap-3 rounded-button px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <Settings size={17} /> Sozlamalar
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-button px-3 py-2 text-sm text-danger transition-colors hover:bg-danger-soft"
        >
          <LogOut size={17} /> Chiqish
        </button>
      </div>
    </aside>
  );
};

const TopBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { me } = useMe();
  const { unread } = useNav();
  const crumbs = CRUMBS.find(([re]) => re.test(pathname))?.[1] || [];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        {/* Telefon: logo */}
        <Link href={me ? `/user/${me.id}` : "#"} className="lg:hidden">
          <span className="block rounded-xl bg-primary p-1">
            <Image alt="SevenEdu" src={logo} className="w-8 object-cover" />
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Orqaga"
            className="grid h-8 w-8 place-items-center rounded-lg text-text-secondary hover:bg-surface-alt hover:text-text-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => router.forward()}
            aria-label="Oldinga"
            className="grid h-8 w-8 place-items-center rounded-lg text-text-secondary hover:bg-surface-alt hover:text-text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-2 text-sm lg:flex"
          aria-label="Yo'l"
        >
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-text-muted">/</span>}
              <span
                className={
                  i === crumbs.length - 1
                    ? "font-medium text-text-primary"
                    : "text-text-muted"
                }
              >
                {c}
              </span>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-primary sm:inline-flex">
            <Coins size={14} className="text-warning" />
            {(me?.coins ?? 0).toLocaleString("en-US")}
          </span>
          <Link
            href="/notifications"
            aria-label="Bildirishnomalar"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </Link>
          <Link href="/user/profile" aria-label="Profil">
            <Avatar size={36} />
          </Link>
        </div>
      </div>
    </header>
  );
};

const MobileNav = () => {
  const pathname = usePathname();
  const { me } = useMe();
  const items = [
    {
      href: me ? `/user/${me.id}` : "#",
      match: "/user/",
      icon: Home,
      label: "Asosiy",
    },
    { href: "/courses", match: "/courses", icon: BookOpen, label: "Kurslar" },
    { href: "/rank", match: "/rank", icon: Medal, label: "Reyting" },
    {
      href: "/dashboard",
      match: "/dashboard",
      icon: ChartArea,
      label: "Dashboard",
    },
    {
      href: "/user/profile",
      match: "/user/profile",
      icon: CircleUser,
      label: "Profil",
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden"
      aria-label="Asosiy menyu"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-border bg-surface/95 px-2 py-2 backdrop-blur-xl">
        {items.map(({ href, match, icon: Icon, label }) => {
          const active = isActive(pathname, match);
          return (
            <li key={label}>
              <Link
                href={href}
                aria-label={label}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] transition-colors ${
                  active
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-text-secondary"
                }`}
              >
                <Icon size={20} strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <div className="flex min-w-0 flex-1 flex-col">
      <TopBar />
      <main className="flex-1 pb-28 lg:pb-10">{children}</main>
    </div>
    <MobileNav />
  </div>
);

export default AppShell;

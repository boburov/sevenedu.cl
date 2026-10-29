"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import {
  Category,
  Chart,
  Delete,
  Home,
  Logout,
  Notification,
  Setting,
  Star,
  User,
  Voice,
  Wallet,
} from "react-iconly";
import logo from "@/app/images/goldedu7.png";
import {
  deleteUserProfilePic,
  updateUserProfilePic,
} from "@/app/api/service/api";
import { fullName, useMe } from "./MeContext";

// Iconly ikonkalari className qabul qilmaydi — rang faqat primaryColor
// orqali o'tadi, shuning uchun hamma joyda "currentColor".
type IconlyIcon = typeof Home;

const ICON_SIZE = 22;

// Iconly'ning o'z qoidasi: faol holat to'ldirilgan (bold), nofaol — ingichka
// (light). Holat shu tariqa rang bilan ham, SHAKL bilan ham ko'rinadi.
const NavIcon = ({ icon: Icon, active }: { icon: IconlyIcon; active: boolean }) => (
  <span className="flex shrink-0 items-center">
    <Icon
      set={active ? "bold" : "light"}
      size={ICON_SIZE}
      primaryColor="currentColor"
    />
  </span>
);

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
      { href: "/courses", match: "/courses", icon: Category, label: "Kurslar" },
      {
        href: "/dashboard",
        match: "/dashboard",
        icon: Chart,
        label: "Dashboard",
      },
      { href: "/rank", match: "/rank", icon: Star, label: "Reyting" },
      { href: "/speaking", match: "/speaking", icon: Voice, label: "Speaking" },
      {
        href: "/notifications",
        match: "/notifications",
        icon: Notification,
        label: "Bildirishnomalar",
        badge: unread,
      },
      {
        href: "/user/profile",
        match: "/user/profile",
        icon: User,
        label: "Profil",
      },
      {
        href: "/user/settings",
        match: "/user/settings",
        icon: Setting,
        label: "Sozlamalar",
      },
    ],
  };
};

const isActive = (pathname: string, match: string) =>
  match === "/user/"
    ? /^\/user\/(?!profile|settings)[^/]+$/.test(pathname)
    : pathname === match || pathname.startsWith(match + "/");

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
      className="font-semibold text-accent-strong"
      style={{ fontSize: size * 0.4 }}
    >
      {me?.name?.[0]?.toUpperCase() || "?"}
    </span>
  );

  if (!editable) {
    return (
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft"
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
        className="focus-ring grid h-full w-full place-items-center overflow-hidden rounded-full bg-accent-soft"
      >
        {face}
      </button>
      {me?.profilePic && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Profil rasmini o'chirish"
          className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full  bg-surface text-text-secondary transition-colors hover:text-danger"
        >
          <Delete set="light" size={13} primaryColor="currentColor" />
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

// Orange logo plitkasi — palitradagi orange aynan shu kabi kam joylarda
// ishlatiladi, shuning uchun ko'zga tashlanadi.
const Logo = () => {
  const { me } = useMe();
  return (
    <Link
      href={me ? `/user/${me.id}` : "#"}
      className="focus-ring flex items-center rounded-tile"
      aria-label="SevenEdu — bosh sahifa"
    >
      {/* <span className="grid h-9 w-9 shrink-0 place-items-center rounded-tile bg-accent"> */}
      {/* </span> */}
        <Image alt="" src={logo} className="w-12 object-contain" />
      <span className="text-xl font-semibold mt-1.5 text-text-primary ">
        SevenEdu
      </span>
    </Link>
  );
};

// Menyu elementi.
//   faol  — oq fon + chegara, qora qalin matn, to'ldirilgan ikonka
//   hover — och orange fon + orange matn; ikonka currentColor orqali
//           avtomatik orange bo'ladi
const NavItem = ({
  href,
  active,
  icon,
  label,
  badge,
}: {
  href: string;
  active: boolean;
  icon: IconlyIcon;
  label: string;
  badge?: number;
}) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    className={`focus-ring flex items-center gap-3 rounded-nav border px-3 py-2.5 text-[15px] transition-colors ${
      active
        ? "border-border bg-surface font-semibold text-text-primary"
        : "border-transparent text-text-secondary hover:bg-accent-soft hover:text-accent-strong"
    }`}
  >
    <NavIcon icon={icon} active={active} />
    <span className="flex-1 truncate">{label}</span>
    {!!badge && (
      <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-foreground">
        {badge}
      </span>
    )}
  </Link>
);

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { me } = useMe();
  const { items } = useNav();

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    // Gorizontal padding yo'q: menyu kartochkalari va profil avatari
    // header'dagi logo bilan bir vertikal chiziqda boshlanadi.
    //
    // Balandlik: 5rem — header (h-20), 1.5rem — sticky top-6.
    // Sidebar ekranning tepasidan emas, header OSTIDAN boshlanadi. Shuning
    // uchun 100vh dan faqat top-6 ni ayirish yetmaydi: quti ekrandan 80px
    // pastga chiqib ketadi va eng pastdagi "Chiqish" kesilib qoladi.
    <aside className="sticky top-6 hidden h-[calc(100vh-5rem-1.5rem)] w-60 shrink-0 flex-col pb-2 lg:flex">
      {/* Profil kartochkasi — rasmdagidek menyuning tepasida */}
      <div className="flex items-center gap-3 pb-6">
        <Avatar size={48} editable />
        <Link href="/user/profile" className="group min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-text-primary transition-colors group-hover:text-accent-strong">
            {fullName(me) || "…"}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-text-secondary">
            {me?.email || "…"}
          </p>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Asosiy menyu">
        <ul className="space-y-1">
          {items.map(({ href, match, icon, label, badge }) => (
            <li key={label}>
              <NavItem
                href={href}
                active={isActive(pathname, match)}
                icon={icon}
                label={label}
                badge={badge}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-border pt-0">
        <button
          type="button"
          onClick={logout}
          className="focus-ring flex w-full items-center gap-3 rounded-nav border border-transparent px-3 py-2.5 text-[15px] text-text-secondary transition-colors hover:bg-accent-soft hover:text-accent-strong"
        >
          <NavIcon icon={Logout} active={false} />
          Chiqish
        </button>
      </div>
    </aside>
  );
};

// Chegarasiz va fonsiz — rasmdagidek sidebar bilan bir xil fonda turadi.
// Shuning uchun STICKY EMAS: fonsiz yopishgan header ostidan kontent
// ko'rinib, logo va tangalar ustiga matn chiqardi. Sidebar yopishib
// qoladi, demak menyu baribir doim ko'z oldida.
// Gorizontal bo'shliqni AppShell beradi — logo sidebar avatari bilan
// bir vertikal chiziqda turishi uchun bu yerda px yo'q.
const TopBar = () => {
  const { me } = useMe();
  const { unread } = useNav();

  return (
    <header>
      <div className="flex h-20 items-center gap-3">
        <Logo />

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/dashboard/coins"
            aria-label={`Tangalar: ${me?.coins ?? 0}`}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:border-border-strong"
          >
            <span className="flex items-center text-accent">
              <Wallet set="bold" size={15} primaryColor="currentColor" />
            </span>
            {(me?.coins ?? 0).toLocaleString("en-US")}
          </Link>

          <Link
            href="/notifications"
            aria-label={
              unread > 0
                ? `Bildirishnomalar, ${unread} ta o'qilmagan`
                : "Bildirishnomalar"
            }
            className="focus-ring relative grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition-colors hover:text-text-primary"
          >
            <Notification set="light" size={18} primaryColor="currentColor" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {unread}
              </span>
            )}
          </Link>

          {/* Desktopda profil sidebar kartochkasida — bu yerda takrorlanmaydi */}
          <Link
            href="/user/profile"
            aria-label="Profil"
            className="focus-ring rounded-full lg:hidden"
          >
            <Avatar size={34} />
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
    { href: "/courses", match: "/courses", icon: Category, label: "Kurslar" },
    { href: "/rank", match: "/rank", icon: Star, label: "Reyting" },
    {
      href: "/dashboard",
      match: "/dashboard",
      icon: Chart,
      label: "Dashboard",
    },
    {
      href: "/user/profile",
      match: "/user/profile",
      icon: User,
      label: "Profil",
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden"
      aria-label="Tezkor menyu"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between rounded-card border border-border bg-surface/95 px-2 py-2 backdrop-blur-xl">
        {items.map(({ href, match, icon, label }) => {
          const active = isActive(pathname, match);
          return (
            <li key={label}>
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-nav px-3 py-1.5 text-[10px] transition-colors ${
                  active
                    ? "bg-primary-soft font-semibold text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                <NavIcon icon={icon} active={active} />
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
  <div className="relative min-h-screen bg-background">
    {/* Iliq gradient — rasmdagidek yuqori o'ng burchakda, juda sust */}
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-0 h-[520px] w-[720px] bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,26,0.07),transparent_65%)]"
    />
    {/* Butun ilova ichkariga surilgan: header, sidebar va kontent bitta
        bo'shliq ichida. Shuning uchun header va sidebar chegara bilan emas,
        atrofdagi havo bilan ajraladi — rasmdagi kabi. */}
    <div className="relative mx-auto w-full max-w-[1560px] px-5 sm:px-8 lg:px-12">
      <TopBar />
      <div className="flex gap-8 lg:gap-12">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-28 lg:pb-12">{children}</main>
      </div>
    </div>
    <MobileNav />
  </div>
);

export default AppShell;

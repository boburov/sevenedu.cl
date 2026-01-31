"use client";
import {
  BellRing,
  ChartArea,
  CircleUserIcon,
  Home,
  LayoutDashboard,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "../api/service/api";
import logo from "@/app/images/7edu white logo.png";
import Link from "next/link";
import Image from "next/image";

interface NotificationContent {
  title: string;
  message: string;
  sentAt: string;
}

interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  isRead: boolean;
  notification: NotificationContent;
}

const Header = () => {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [userId, setId] = useState("");

  useEffect(() => {
    getMe().then((e) => {
      setId(e.id);
      setNotifications(e.notifications);
    });
  }, []);

  const navLinks = [
    { href: `/user/${userId}`, icon: Home, label: "Home" },
    { href: "/courses", icon: LayoutDashboard, label: "Courses" },
    { href: "/dashboard", icon: ChartArea, label: "Dashboard" },
    { href: "/notifications", icon: BellRing, label: "Notifications" },
    { href: "/user/profile", icon: CircleUserIcon, label: "Profile" },
  ]

  return (
    <header className="w-full z-50 px-4 pt-3 block max-md:hidden">
      <div className="container bg-surface border border-border rounded-2xl px-4 py-3 mx-auto flex items-center justify-between shadow-card">
        <Link href={`/user/${userId}`} className="flex items-center gap-2">
          <div className="bg-primary rounded-xl p-1">
            <Image alt="logo" src={logo} className="w-12 object-cover" />
          </div>
        </Link>
        <ul className="flex items-center gap-6 text-base font-medium">
          {navLinks.map(({ href, icon: Icon, label }, index) => {
            const isActive = pathname === href;
            return (
              <li
                key={index}
                className={`${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-secondary"
                } hover:text-primary transition-colors duration-200`}
              >
                <Link href={href}>{label}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Header;

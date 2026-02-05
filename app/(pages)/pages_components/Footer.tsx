import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartArea,
  CircleUserIcon,
  Home,
  LayoutDashboard,
  Medal,
} from "lucide-react";
import { getMe } from "@/app/api/service/api";

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

const Footer = () => {
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
    { href: "/rank", icon: Medal, label: "Rank" },
    { href: "/dashboard", icon: ChartArea, label: "Dashboard" },
    { href: "/user/profile", icon: CircleUserIcon, label: "Profile" },
  ];

  const unreadCount = notifications?.filter((e) => !e.isRead).length || 0;

  return (
    <footer className="fixed left-0 bottom-0 w-full z-50 px-3 pb-3 xl:hidden max-md:block">
      <div className="container py-2 bg-surface/95 backdrop-blur-xl border border-border rounded-2xl shadow-card">
        <ul className="flex items-center justify-between gap-2 px-2 py-2">
          {navLinks.map(({ href, icon: Icon, label }, index) => {
            const isActive = pathname.startsWith(href);

            if (label === "Notifications") {
              return (
                <li key={index}>
                  <Link
                    href={href}
                    aria-label={label}
                    className={`flex flex-col items-center justify-center text-xs transition-all duration-200 relative p-2 rounded-xl ${isActive
                      ? "text-primary bg-primary-soft"
                      : "text-text-secondary hover:text-primary hover:bg-primary-soft/50"
                      }`}
                  >
                    {unreadCount > 0 && (
                      <span className="absolute bg-danger text-white -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium">
                        {unreadCount}
                      </span>
                    )}
                    <Icon size={24} strokeWidth={1.5} className="mb-0.5" />
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-label={label}
                    className={`flex flex-col items-center justify-center text-xs transition-all duration-200 p-2 rounded-xl ${isActive
                      ? "text-primary bg-primary-soft"
                      : "text-text-secondary hover:text-primary hover:bg-primary-soft/50"
                      }`}
                  >
                    <Icon size={24} strokeWidth={1.5} className="mb-0.5" />
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

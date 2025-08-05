import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  ChartArea,
  CircleUserIcon,
  Home,
  LayoutDashboard,
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
    { href: "/dashboard", icon: ChartArea, label: "Dashboard" },
    { href: "/notifications", icon: BellRing, label: "Notifications" },
    { href: "/user/profile", icon: CircleUserIcon, label: "Profile" },
  ];

  const unreadCount = notifications?.filter((e) => !e.isRead).length || 0;

  return (
    <footer className="fixed left-0 bottom-0 w-full z-50 px-1.5 pb-1.5 xl:hidden max-md:block">
      <div className="container py-2  bg-[#343434]/60 backdrop-blur-xl border border-white/10 rounded-xl">
        <ul className="flex items-center justify-between gap-2 px-2 py-3 rounded-lg">
          {navLinks.map(({ href, icon: Icon, label }, index) => {
            const isActive = pathname.startsWith(href);

            if (label === "Notifications") {
              return (
                <li key={index}>
                  <Link
                    href={href}
                    aria-label={label}
                    className={`flex flex-col items-center justify-center text-xs transition-all relative ${isActive ? "text-green-400" : "text-white"
                      }`}
                  >
                    {unreadCount > 0 && (
                      <span className="absolute bg-red-800 -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-xs robo-light">
                        {unreadCount}
                      </span>
                    )}
                    <Icon
                      size={28}
                      strokeWidth={1}
                      stroke={isActive ? "#fff" : "#00C835"}
                      className="mb-1"
                    />
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-label={label}
                    className={`flex flex-col items-center justify-center text-xs transition-all ${isActive ? "text-green-400" : "text-white"
                      }`}
                  >
                    <Icon
                      size={28}
                      strokeWidth={1}
                      stroke={isActive ? "#fff" : "#00C835"}
                      className="mb-1"
                    />
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

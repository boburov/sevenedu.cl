"use client";

import { useEffect, useState } from "react";
import { getMe, markNotificationAsRead } from "@/app/api/service/api";
import { Info, Inbox, Clock } from "lucide-react";

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

interface UserResponse {
  notifications: UserNotification[];
  user: { id: string };
}

const Page = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    getMe().then((e: UserResponse) => {
      setNotifications(e.notifications);
      e.notifications.forEach((notification) => {
        if (!notification.isRead) {
          markNotificationAsRead(notification.id);
        }
      });
    });
  }, []);

  return (
    <section className="container max-w-2xl mx-auto pt-10 px-4">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-white/80 mt-20">
          <Inbox className="w-16 h-16 animate-pulse mb-4" />
          <p className="text-center text-lg">Sizda hech qanday xabar yo‘q.</p>
        </div>
      ) : (
        notifications.map((habar, index) => {
          const timeOnly = new Date(habar.notification.sentAt).toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return (
            <div
              key={index}
              className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl mb-5"
            >
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="font-semibold text-base mb-1">{habar.notification.title}</h1>
                  <p className="text-sm text-white/80">{habar.notification.message}</p>
                </div>
              </div>
              <div className="absolute bottom-1 right-5 flex items-center gap-1 text-xs text-white/60">
                <Clock className="w-3.5 h-3.5" />
                <span>{timeOnly}</span>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
};

export default Page;

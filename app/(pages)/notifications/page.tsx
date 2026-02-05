"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMe, markNotificationAsRead } from "@/app/api/service/api";
import { Inbox, Clock, Info } from "lucide-react";

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

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function bucketLabel(sentAtIso: string) {
  const now = new Date();
  const sent = new Date(sentAtIso);

  const nowDay = startOfDay(now);
  const sentDay = startOfDay(sent);

  const diffDays = Math.floor((nowDay - sentDay) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Bugun";
  if (diffDays === 1) return "Kecha";
  return "Oldingi";
}

const Page = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // avoid marking same id multiple times
  const markedRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        setLoading(true);
        const res = (await getMe()) as UserResponse;
        if (!mountedRef.current) return;

        // sort newest first
        const sorted = [...(res.notifications ?? [])].sort(
          (a, b) =>
            new Date(b.notification.sentAt).getTime() -
            new Date(a.notification.sentAt).getTime()
        );

        setNotifications(sorted);

        // mark unread as read (once)
        sorted.forEach((n) => {
          if (!n.isRead && !markedRef.current.has(n.id)) {
            markedRef.current.add(n.id);
            markNotificationAsRead(n.id).catch(() => {});
          }
        });
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, UserNotification[]>();
    for (const n of notifications) {
      const label = bucketLabel(n.notification.sentAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(n);
    }
    return Array.from(map.entries());
  }, [notifications]);

  return (
    <section className="container max-w-2xl mx-auto pt-10 px-4 text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Xabarlar</h1>
        <p className="text-sm text-black/60 mt-1">
          Yangilanishlar va tizim xabarlari shu yerda chiqadi.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-black/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-black/5" />
                  <div className="h-3 w-full rounded bg-black/5" />
                  <div className="h-3 w-1/2 rounded bg-black/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-black/70 mt-20">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <Inbox className="w-14 h-14 mb-3" />
              <p className="text-center text-base font-medium">
                Sizda hech qanday xabar yo‘q.
              </p>
              <p className="text-center text-sm text-black/60 mt-1">
                Yangi xabarlar kelganda shu yerda ko‘rinadi.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([label, items]) => (
            <div key={label}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-black/10" />
                <span className="text-xs font-semibold tracking-wide text-black/50">
                  {label.toUpperCase()}
                </span>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <div className="space-y-3">
                {items.map((habar) => {
                  const timeOnly = formatTime(habar.notification.sentAt);
                  const dateOnly = formatDate(habar.notification.sentAt);

                  return (
                    <article
                      key={habar.id}
                      className={[
                        "group rounded-2xl border bg-white p-5 shadow-sm",
                        "transition-all duration-200",
                        "hover:shadow-md hover:-translate-y-[1px]",
                        "active:translate-y-0",
                        "border-black/10",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">
                            <Info className="h-5 w-5 text-black/70" />
                          </div>

                          {/* unread dot */}
                          {!habar.isRead && (
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-purple-600 ring-2 ring-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h2 className="text-[15px] font-semibold leading-snug">
                              {habar.notification.title}
                            </h2>
                            <div className="shrink-0 text-right">
                              <div className="inline-flex items-center gap-1 text-xs text-black/50">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{timeOnly}</span>
                              </div>
                              <div className="text-[11px] text-black/35 mt-0.5">
                                {dateOnly}
                              </div>
                            </div>
                          </div>

                          <p className="mt-2 text-sm leading-relaxed text-black/70 break-words">
                            {habar.notification.message}
                          </p>


                          
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Page;

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
    <section className="page py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
            Xabarlar
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Yangilanishlar va tizim xabarlari shu yerda chiqadi.
          </p>
        </header>

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-card border border-border bg-surface p-5"
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-tile bg-surface-alt" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded-tile bg-surface-alt" />
                    <div className="h-3 w-full rounded-tile bg-surface-alt" />
                    <div className="h-3 w-1/2 rounded-tile bg-surface-alt" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="mx-auto max-w-md rounded-card border border-border bg-surface p-10 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-tile border border-border bg-surface-alt text-text-muted">
              <Inbox size={24} strokeWidth={1.75} />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Sizda hech qanday xabar yo&lsquo;q.
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Yangi xabarlar kelganda shu yerda ko&lsquo;rinadi.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([label, items]) => (
              <div key={label}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-3">
                  {items.map((habar) => {
                    const timeOnly = formatTime(habar.notification.sentAt);
                    const dateOnly = formatDate(habar.notification.sentAt);
                    const unread = !habar.isRead;

                    return (
                      <article
                        key={habar.id}
                        className={`rounded-card border p-5 transition-colors ${
                          unread
                            ? "border-accent/40 bg-accent-soft"
                            : "border-border bg-surface"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            <div
                              className={`grid h-10 w-10 place-items-center rounded-tile text-text-secondary ${
                                unread
                                  ? "border border-border bg-surface"
                                  : "bg-surface-alt"
                              }`}
                            >
                              <Info size={20} strokeWidth={1.75} />
                            </div>

                            {/* unread dot */}
                            {unread && (
                              <span
                                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent"
                                aria-label="O'qilmagan"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h2 className="text-[15px] font-semibold leading-snug text-text-primary">
                                {habar.notification.title}
                              </h2>
                              <div className="shrink-0 text-right">
                                <div className="inline-flex items-center gap-1 text-xs text-text-muted">
                                  <Clock size={14} strokeWidth={1.75} />
                                  <span>{timeOnly}</span>
                                </div>
                                <div className="mt-0.5 text-[11px] text-text-muted">
                                  {dateOnly}
                                </div>
                              </div>
                            </div>

                            <p className="mt-2 break-words text-sm leading-relaxed text-text-secondary">
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
      </div>
    </section>
  );
};

export default Page;

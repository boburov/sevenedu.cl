"use client";

import {
  Coins,
  Activity,
  BookOpenCheck,
  ClipboardCheck,
  Languages,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getMe } from "@/app/api/service/api";

// Statik Tailwind klasslari — dinamik `bg-${color}-500/10` Tailwind v4'da purge
// bo'lib ketadi, shuning uchun har bir variant to'liq yozilgan.
const styles = {
  gray: {
    card: "border-slate-200 bg-slate-50",
    icon: "text-slate-500",
    badge: "text-slate-700 bg-white border-slate-300",
  },
  blue: {
    card: "border-blue-200 bg-blue-50",
    icon: "text-blue-500",
    badge: "text-blue-700 bg-white border-blue-300",
  },
  green: {
    card: "border-emerald-200 bg-emerald-50",
    icon: "text-emerald-500",
    badge: "text-emerald-700 bg-white border-emerald-300",
  },
  yellow: {
    card: "border-amber-200 bg-amber-50",
    icon: "text-amber-500",
    badge: "text-amber-700 bg-white border-amber-300",
  },
} as const;

type ColorKey = keyof typeof styles;

const Page = () => {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    getMe().then((e) => {
      if (e) setCoins(e.coins ?? 0);
    });
  }, []);

  const actions: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
    point: number;
    color: ColorKey;
  }> = [
    {
      icon: <Activity size={36} className={styles.gray.icon} />,
      title: "Kirish",
      description: "Platformaga kirganingiz uchun tanga olasiz",
      point: 1,
      color: "gray",
    },
    {
      icon: <BookOpenCheck size={36} className={styles.blue.icon} />,
      title: "Darsni o'qish",
      description: "Har bir darsni o'qib bo'lganingizda sizga tanga beriladi",
      point: 5,
      color: "blue",
    },
    {
      icon: <ClipboardCheck size={36} className={styles.green.icon} />,
      title: "Testni bajarish",
      description: "Testni muvaffaqiyatli yakunlaganingizda tanga olasiz",
      point: 5,
      color: "green",
    },
    {
      icon: <Languages size={36} className={styles.yellow.icon} />,
      title: "Lug'atni yodlash",
      description: "Yangi so'zlar yodlaganingizda bonus tangalar beriladi",
      point: 10,
      color: "yellow",
    },
  ];

  return (
    <div className="container max-w-2xl mx-auto pt-6 space-y-5">
      <h1 className="text-2xl font-bold text-text-primary">
        Tangalarni qanday olish mumkin?
      </h1>

      {actions.map((item, index) => {
        const s = styles[item.color];
        return (
          <div
            key={index}
            className={`w-full rounded-2xl border ${s.card} p-4 flex items-center justify-between gap-4`}
          >
            <div className="flex gap-4 items-center min-w-0">
              <span className="shrink-0">{item.icon}</span>
              <div className="space-y-1 min-w-0">
                <h2 className="text-lg font-semibold text-text-primary">
                  {item.title}
                </h2>
                <p className="text-sm text-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
            <span
              className={`shrink-0 border ${s.badge} px-3 py-1 rounded-lg font-semibold text-sm text-center`}
            >
              +{item.point} ball
            </span>
          </div>
        );
      })}

      <div className="mt-8 flex items-center gap-3 text-xl font-bold text-text-primary">
        <Coins size={26} className="text-amber-500" strokeWidth={1.75} />
        <span>Jami tangalar: {coins}</span>
      </div>
    </div>
  );
};

export default Page;

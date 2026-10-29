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

const Page = () => {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    getMe().then((e) => {
      if (e) setCoins(e.coins ?? 0);
    });
  }, []);

  // Har bir qator bir xil kartochka. Oldin to'rt xil rangli variant bor edi
  // (kulrang / ko'k / yashil / amber) — bu status emas, shunchaki bezak edi,
  // shuning uchun ranglar olib tashlandi, ikonka esa o'z joyida qoldi.
  const actions: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
    point: number;
  }> = [
    {
      icon: <Activity size={20} strokeWidth={1.75} />,
      title: "Kirish",
      description: "Platformaga kirganingiz uchun tanga olasiz",
      point: 1,
    },
    {
      icon: <BookOpenCheck size={20} strokeWidth={1.75} />,
      title: "Darsni o'qish",
      description: "Har bir darsni o'qib bo'lganingizda sizga tanga beriladi",
      point: 5,
    },
    {
      icon: <ClipboardCheck size={20} strokeWidth={1.75} />,
      title: "Testni bajarish",
      description: "Testni muvaffaqiyatli yakunlaganingizda tanga olasiz",
      point: 5,
    },
    {
      icon: <Languages size={20} strokeWidth={1.75} />,
      title: "Lug'atni yodlash",
      description: "Yangi so'zlar yodlaganingizda bonus tangalar beriladi",
      point: 10,
    },
  ];

  return (
    <div className="page py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
            Tangalarni qanday olish mumkin?
          </h1>
          {/* Tanga belgisi — yagona orange element. Raqam oddiy matn tokenida. */}
          <p className="mt-2 flex items-center gap-2 text-[15px] text-text-secondary">
            <Coins size={16} strokeWidth={1.75} className="text-accent" />
            Jami tangalar:{" "}
            <span className="font-semibold text-text-primary">{coins}</span>
          </p>
        </header>

        <ul className="space-y-3">
          {actions.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-4 rounded-card border border-border bg-surface p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-tile border border-border bg-surface-alt text-text-secondary">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-text-primary">
                    {item.title}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-button border border-border bg-surface-alt px-3 py-1 text-[13px] font-semibold text-text-primary">
                +{item.point} ball
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;

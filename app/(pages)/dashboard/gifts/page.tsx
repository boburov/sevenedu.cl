"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/app/api/service/api";
import { Gift } from "lucide-react";

const Page = () => {
  const [gifts, setGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const user = await getMe();
        setGifts(user.gifts || []);
      } catch (err) {
        console.error("Foydalanuvchi ma'lumotlarini olishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <div className="container py-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
            Mening Sovg&apos;alarim
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            {loading ? "…" : gifts.length} ta sovg&apos;a
          </p>
        </header>

        {loading ? (
          <p className="text-[15px] text-text-secondary">Yuklanmoqda...</p>
        ) : gifts.length === 0 ? (
          <div className="mx-auto max-w-md rounded-card border border-border bg-surface p-10 text-center">
            <h2 className="text-lg font-semibold text-text-primary">
              Sizda hozircha hech qanday sovg&apos;a yo&apos;q.
            </h2>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gifts.map((gift, index) => (
              <li
                key={index}
                className="rounded-card border border-border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                {gift.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="h-40 w-full rounded-tile border border-border object-cover"
                  />
                ) : (
                  <span className="grid h-40 w-full place-items-center rounded-tile border border-border bg-surface-alt text-text-muted">
                    <Gift size={20} strokeWidth={1.75} />
                  </span>
                )}
                <h2 className="mt-3 text-[15px] font-semibold text-text-primary">
                  {gift.name}
                </h2>
                <p className="mt-1 text-[13px] text-text-secondary">
                  {gift.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;

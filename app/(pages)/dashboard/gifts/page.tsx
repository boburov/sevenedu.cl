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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-white">
          <Gift className="w-8 h-8 text-white" />
          Mening Sovg‘alarim
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">
            ⏳ Yuklanmoqda...
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center text-gray-500">
            Sizda hozircha hech qanday sovg'a yo‘q.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift, index) => (
              <div
                key={index}
                className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-2xl p-4 transition hover:scale-105 duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {gift.name}
                </h2>
                <p className="text-sm text-gray-600 mb-3">{gift.description}</p>
                {gift.image && (
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-40 object-cover rounded-xl border"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

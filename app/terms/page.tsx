import React from "react";

export default function TermsPage() {
  const sections = [
    {
      title: "I. Shartnoma maqsadi",
      items: [
        "1.1. Shartnoma O'quvchi va “7EDU” kompaniyasi o'rtasida ta'lim xizmatlarini ko'rsatish maqsadida tuziladi.",
      ],
    },
    {
      title: "II. 7EDU kompaniyasining majburiyatlari",
      items: [
        "2.1. Kompaniya quyidagi xizmatlarni taqdim etadi:",
        "2.1.1. Darsliklar bilan ta’minlash (kitob, daftar).",
        "2.1.2. O’quvchilarga o’quv darsliklaridan qanday foydalanish bo‘yicha ma’lumot berish.",
        "2.1.3. Platformaga o’quvchi tanlagan til kursi bo‘yicha ulab berish.",
        "2.1.4. Support teacher (yordamchi ustoz) bilan bog‘lanish va zarur savollarga javob berish.",
        "2.1.5. Dars shakli: video va audio darslar — o’quvchi o’zi ixtiyoriy o’rganadi.",
      ],
    },
    {
      title: "III. O’quvchining majburiyatlari va huquqlari",
      items: [
        "3.1.1. Platformadagi darslarga qatnashish, yordamchi ustoz vazifa bersa vaqtida bajarish.",
        "3.1.2. Agar yordamchi ustoz savollarga javob bera olmasa, 7edu.uz Instagram orqali shaxsiy xabarga yozing — 24–48 soat ichida yordamchi ustoz bog‘lanishi ta’minlanadi.",
        "3.1.3. Agar kompaniya 2.1–2.1.5 bandlardan kamida bittasini bajarmasa, 3 kun ichida shartnomani bekor qilish mumkin.",
        "3.1.4. Kompaniya o’quvchiga qo’ng’iroq qilsa o’quvchi javob berishi, Telegramda yozsa javob qaytarishi kerak.",
      ],
    },
    {
      title: "IV. Shartnoma muddati",
      items: [
        "4.1.1. Shartnoma o’quvchiga yuborilgan sanadan boshlanadi va 4 oy amal qiladi.",
      ],
    },
    {
      title: "V. Boshqa shartlar va fors-major holati",
      items: [
        "5.1.1. Har ikki tomon o‘z majburiyatlarini bajarishga kelishadi.",
        "5.1.2. Shartnoma shartlarini o‘zgartirish faqat yozma ravishda amalga oshiriladi.",
        "5.1.3. Shartnomaga o‘zgartirish yoki qo‘shimcha kiritish har ikkala tomonning roziligi bilan amalga oshiriladi.",
        "5.1.4. Agar kompaniya 2.1–2.1.5 bandlardan kamida bittasini bajarmasa, 3 kun ichida shartnomani bekor qilish mumkin.",
        "5.1.5. Kompaniya telefon qilsa yoki Telegramda yozsa va o‘quvchi javob bermasa — keyinchalik kompaniyaga e’tiroz bildira olmaydi.",
        "5.1.6. Ushbu shartnoma o‘quvchiga Telegram orqali yuboriladi. O‘quvchi “roziman” desa, shartnoma haqiqiy deb topiladi.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium tracking-wide text-zinc-500">
            7EDU • Terms & Conditions
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            7EDU Shartnoma
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Ushbu shartnoma 7EDU va O’quvchi o‘rtasida ta’lim xizmatlarini
            ko‘rsatish tartibini belgilaydi.
          </p>

          {/* Quick highlights */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-medium text-zinc-500">Muddati</p>
              <p className="mt-1 text-sm font-semibold">4 oy</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-medium text-zinc-500">Support</p>
              <p className="mt-1 text-sm font-semibold">24–48 soat</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-medium text-zinc-500">Bekor qilish</p>
              <p className="mt-1 text-sm font-semibold">3 kun ichida</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4">
          {sections.map((s) => (
            <section
              key={s.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold md:text-lg">{s.title}</h2>
              <div className="mt-3 space-y-2">
                {s.items.map((text, idx) => (
                  <p key={idx} className="text-sm leading-6 text-zinc-700">
                    {text}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Notice / Acceptance */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold md:text-lg">
              VI. Tomonlar
            </h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-medium text-zinc-500">Kompaniya</p>
                <p className="mt-1 text-sm font-semibold">“7EDU NTT”</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-medium text-zinc-500">O‘quvchi</p>
                <p className="mt-1 text-sm font-semibold">
                  (F.I.Sh. / Telegram username)
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm leading-6 text-zinc-700">
                Telegram orqali yuborilgan shartnoma matniga “roziman” deb javob
                berilgan taqdirda, shartnoma kuchga kiradi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} 7EDU. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </div>
  );
}

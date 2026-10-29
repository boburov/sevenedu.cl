"use client";

import React from "react";

/**
 * Maxfiylik siyosati — 7EDU / SevenEdu.
 *
 * Matn mobil ilovadagi `PRIVACY_POLICY.md` bilan AYNAN bir xil bo'lishi shart:
 * bu huquqiy hujjat, shuning uchun bandlar qayta yozilmaydi — o'zgartirish
 * kerak bo'lsa ikkala joyda birga o'zgartiriladi.
 *
 * Play Console'ga aynan shu sahifaning URL'i kiritiladi.
 */

type Block =
  | { p: string }
  | { ul: string[] }
  | { rows: [string, string][] }
  | { note: string };

type Section = { title: string; blocks: Block[] };

const UPDATED = "2026-10-11";
const CONTACT_EMAIL = "boburovdev@gmail.com";

const UZ: Section[] = [
  {
    title: "1. Ushbu siyosat nimani qamrab oladi",
    blocks: [
      {
        p: "Ushbu Maxfiylik siyosati SevenEdu mobil ilovasi (Android va iOS, paket nomi com.sevenedu.app) hamda sevenedu.org / 7edu.uz veb-saytidan foydalanganda shaxsiy ma'lumotlaringiz qanday yig'ilishi, ishlatilishi va himoyalanishini tushuntiradi.",
      },
      {
        p: "Xizmatdan foydalanish shartlari alohida hujjatda — Shartnoma (/terms). Maxfiylik siyosati va Shartnoma bir-birini to'ldiradi.",
      },
    ],
  },
  {
    title: "2. Ma'lumotlar operatori",
    blocks: [
      {
        rows: [
          ["Nomi", "“7EDU NTT”"],
          ["Elektron pochta", CONTACT_EMAIL],
          ["Telegram (yordam)", "@boburov_sh"],
        ],
      },
    ],
  },
  {
    title: "3. Qanday ma'lumotlarni yig'amiz",
    blocks: [
      { p: "3.1. Siz o'zingiz kiritadigan ma'lumotlar:" },
      {
        rows: [
          ["Ism, familiya", "Hisobni shaxsiylashtirish, sertifikat, reyting"],
          ["Elektron pochta", "Hisobga kirish, tasdiqlash kodi, parolni tiklash"],
          ["Telefon raqami", "Kurs bo'yicha bog'lanish"],
          ["Parol", "Autentifikatsiya — serverda shifrlangan (hash) holda saqlanadi"],
          ["Profil rasmi", "Avatar (ixtiyoriy)"],
          ["AI ustozga savolingiz", "Javob hosil qilish"],
        ],
      },
      { p: "3.2. Xizmatdan foydalanish natijasida hosil bo'ladigan ma'lumotlar:" },
      {
        ul: [
          "Ko'rilgan va yakunlangan darslar, kurs progressi",
          "Test va viktorina natijalari (to'g'ri/noto'g'ri javoblar, ball)",
          "Tanga (coins) va energiya balansi, xaridlar tarixi",
          "Kunlik faollik zanjiri (streak)",
          "Sertifikat ma'lumotlari — ism, ball, sana, tartib raqami",
          "Push-bildirishnoma tokeni (Firebase Cloud Messaging)",
          "Google hisobi identifikatori — faqat Google orqali kirishni tanlasangiz",
        ],
      },
    ],
  },
  {
    title: "4. Mikrofon va ovoz yozuvlari",
    blocks: [
      {
        p: "Talaffuz mashqi (Speaking) bo'limida ilova mikrofondan qisqa ovoz yozuvini oladi va uni baholash uchun bizning talaffuz xizmatimizga (speech.sevenedu.org) yuboradi.",
      },
      {
        ul: [
          "Mikrofon faqat siz yozib olish tugmasini bosganingizda yoqiladi. Fonda yoki ilova yopiq holatda hech qachon tinglanmaydi.",
          "Ovoz yozuvi operativ xotirada (RAM) qayta ishlanadi va diskka yozilmaydi. Javob qaytgach yozuv o'chib ketadi.",
          "Yozuv bilan birga faqat aytilishi kerak bo'lgan so'z va til kodi yuboriladi — ismingiz, pochtangiz yoki hisob identifikatoringiz yuborilmaydi.",
          "Xizmat faqat umumlashtirilgan statistikani saqlaydi; foydalanuvchi shaxsi aniqlanmaydi.",
        ],
      },
      {
        note: "Ovoz yozuvlari saqlanmaydi. Baholashdan so'ng ular darhol o'chadi.",
      },
    ],
  },
  {
    title: "5. Faqat qurilmangizda saqlanadigan ma'lumotlar",
    blocks: [
      { p: "Quyidagilar telefoningizdan chiqmaydi va serverimizga yuborilmaydi:" },
      {
        ul: [
          "Sessiya tokeni (tizimga kirganingizni bildiruvchi kalit)",
          "Oflayn kesh — kurslar, darslar, lug'at va testlar nusxasi",
          "Sozlamalar — til (o'zbek / rus / ingliz) va mavzu (qorong'i / yorug')",
          "Rasm keshi — kurs muqovalari va mahsulot rasmlari",
        ],
      },
      {
        p: "Android 12+ da ilova allowBackup=\"false\" bilan chiqariladi: bu fayllar Google Drive zaxirasiga tushmaydi va boshqa qurilmaga ko'chirilmaydi. Ilovani o'chirsangiz ular butunlay yo'qoladi.",
      },
    ],
  },
  {
    title: "6. Biz YIG'MAYDIGAN ma'lumotlar",
    blocks: [
      {
        ul: [
          "Geolokatsiya (GPS yoki tarmoq orqali joylashuv)",
          "Telefon kontaktlari, qo'ng'iroqlar tarixi, SMS xabarlar",
          "Kalendar, fotogalereya yoki fayllar ro'yxati",
          "Reklama identifikatori (Advertising ID) va biometrik ma'lumotlar",
          "Qurilmadagi boshqa ilovalar ro'yxati",
        ],
      },
      {
        p: "Ilovada reklama tarmoqlari yo'q, uchinchi tomon analitika SDK'lari yo'q va foydalanuvchi xatti-harakatini kuzatuvchi treker o'rnatilmagan. Shaxsiy ma'lumotlaringizni sotmaymiz.",
      },
    ],
  },
  {
    title: "7. Ma'lumotlardan nima uchun foydalanamiz",
    blocks: [
      {
        ul: [
          "Xizmatni ko'rsatish — hisob yaratish, kurslarga ulash, progressni saqlash",
          "Shaxsiylashtirish — qayerda to'xtaganingizni eslash, darajangizni hisoblash",
          "Gamifikatsiya — tanga, energiya, streak, reyting va do'kon",
          "Aloqa — tasdiqlash kodi, parolni tiklash, push-bildirishnomalar",
          "Xizmat sifati — xatoliklarni aniqlash, suiiste'molning oldini olish",
          "Qonuniy majburiyatlarni bajarish",
        ],
      },
    ],
  },
  {
    title: "8. Ma'lumotlar kimga ochiladi",
    blocks: [
      {
        p: "Boshqa foydalanuvchilarga: ilovadagi reyting bo'limida eng faol 100 o'quvchining ismi, familiyasi, profil rasmi va tanga soni ko'rinadi. Elektron pochtangiz, telefon raqamingiz va test natijalaringiz hech qachon boshqa foydalanuvchilarga ko'rsatilmaydi. Reytingda ko'rinishni istamasangiz bizga yozing.",
      },
      { p: "Xizmat ko'rsatuvchilarga:" },
      {
        rows: [
          ["Google — Firebase Cloud Messaging", "Push tokeni — bildirishnoma yetkazish"],
          ["Google — Sign-In", "Pochta, ism, hisob ID — faqat siz tanlasangiz"],
          ["Vimeo", "Video so'rovi, IP manzil — dars videolarini uzatish"],
          ["speech.sevenedu.org", "Ovoz yozuvi, so'z, til kodi — talaffuzni baholash"],
        ],
      },
      {
        p: "Telegram havolalari bosilganda Telegram ilovasi tashqarida ochiladi va o'sha paytdan Telegram'ning o'z maxfiylik siyosati amal qiladi.",
      },
      {
        p: "Qonuniy talab bo'yicha: O'zbekiston Respublikasi qonunchiligi talab qilgan hollarda vakolatli davlat organlarining rasmiy so'rovi asosida ma'lumot berilishi mumkin.",
      },
    ],
  },
  {
    title: "9. Ilova so'raydigan ruxsatlar",
    blocks: [
      {
        rows: [
          ["Internet", "Server bilan aloqa — majburiy"],
          ["Mikrofon", "Faqat Speaking mashqida — rad etsangiz qolgan hammasi ishlaydi"],
          ["Bildirishnomalar", "Dars va streak eslatmalari — ixtiyoriy"],
          ["Tarmoq holati", "Oflayn rejimni aniqlash"],
          ["Vibratsiya", "Interfeys javobi (haptika) — ixtiyoriy"],
        ],
      },
      { p: "Ruxsatlarni istalgan vaqtda qurilma sozlamalaridan bekor qilishingiz mumkin." },
    ],
  },
  {
    title: "10. Ma'lumotlar qancha saqlanadi",
    blocks: [
      {
        rows: [
          ["Hisob ma'lumotlari", "Hisob faol bo'lgunicha"],
          ["O'quv progressi va natijalar", "Hisob faol bo'lgunicha"],
          ["Sertifikat yozuvlari", "Hisob faol bo'lgunicha; hisob o'chirilganda ular ham o'chadi"],
          ["Ovoz yozuvlari", "Saqlanmaydi"],
          ["Push tokeni", "Hisobdan chiqqaningizda bekor qilinadi"],
          ["Qurilmadagi oflayn kesh", "Ilova o'chirilgunicha"],
        ],
      },
    ],
  },
  {
    title: "11. Xavfsizlik",
    blocks: [
      {
        ul: [
          "Barcha tarmoq trafigi HTTPS/TLS orqali shifrlanadi; ochiq HTTP taqiqlangan.",
          "Parollar serverda qaytarilmas hash algoritmi bilan saqlanadi.",
          "Sessiya tokeni faqat qurilmada saqlanadi va zaxira nusxaga tushmaydi.",
          "Serverga kirish cheklangan va faqat vakolatli xodimlarga ruxsat etilgan.",
        ],
      },
      {
        p: "Shunga qaramay, internet orqali uzatishning 100% xavfsizligini hech bir xizmat kafolatlay olmaydi. Parolingizni hech kimga bermang.",
      },
    ],
  },
  {
    title: "12. Sizning huquqlaringiz",
    blocks: [
      {
        ul: [
          "Ko'rish — biz sizda qanday ma'lumot saqlayotganimizni so'rash",
          "Tuzatish — noto'g'ri ma'lumotni o'zgartirish",
          "O'chirish — hisobingizni va unga bog'liq ma'lumotlarni o'chirish",
          "Cheklash va e'tiroz — masalan, reytingda ko'rinmaslik",
          "Nusxa olish — ma'lumotlaringizning mashina o'qiy oladigan nusxasi",
          "Rozilikni qaytarib olish — bildirishnoma va mikrofon ruxsatlarini o'chirish",
        ],
      },
      { p: `So'rovingizga 30 kun ichida javob beramiz: ${CONTACT_EMAIL}` },
    ],
  },
  {
    title: "13. Hisobni o'chirish",
    blocks: [
      {
        p: `Hisobingizni ilovaning Sozlamalar → Hisobni o‘chirish bo‘limida o‘chirishingiz mumkin. Ilovaga kira olmasangiz, ${CONTACT_EMAIL} manziliga hisobingiz elektron pochtasidan «Hisobni o‘chirish» mavzusida xat yuboring.`,
      },
      {
        p: "Ilovada tasdiqlash kodini kiritganingizdan so'ng hisob va unga bog'liq ma'lumotlar o'chiriladi: profil, o'quv progressi, test natijalari, sertifikatlar, tanga va energiya balansi, xaridlar tarixi va push tokeni.",
      },
      {
        p: "Hisobni o'chirish amali tasdiqlangandan so'ng ilovadagi hisob qayta tiklanmaydi.",
      },
      { note: "Elektron pochta orqali yuborilgan so'rovlar shaxs tasdiqlangach ko'rib chiqiladi." },
    ],
  },
  {
    title: "14. Bolalar maxfiyligi",
    blocks: [
      {
        p: "Xizmat 16 yoshdan katta foydalanuvchilar uchun mo'ljallangan. 16 yoshga to'lmagan bo'lsangiz, ilovadan faqat ota-onangiz yoki qonuniy vakilingiz roziligi bilan foydalanishingiz mumkin.",
      },
      {
        p: `16 yoshgacha bo'lgan bolaning ma'lumotini ota-ona roziligisiz yig'ganimizni aniqlasak, uni darhol o'chiramiz. Bunday holatni sezsangiz ${CONTACT_EMAIL} ga xabar bering.`,
      },
    ],
  },
  {
    title: "15. Xalqaro uzatish, cookie va o'zgarishlar",
    blocks: [
      {
        p: "Serverlarimiz va foydalanadigan xizmatlar (Google Firebase, Vimeo) O'zbekistondan tashqarida joylashgan bo'lishi mumkin. Ma'lumot uzatishda ushbu siyosatdagi himoya darajasi saqlanadi.",
      },
      {
        p: "Veb-saytda faqat zarur (essential) cookie'lardan foydalaniladi: sessiyani ushlab turish va til tanlovini eslab qolish. Reklama yoki kuzatuv cookie'lari o'rnatilmaydi.",
      },
      {
        p: "Siyosat vaqti-vaqti bilan yangilanishi mumkin. Muhim o'zgarishlar bo'lsa ilova ichida yoki elektron pochta orqali xabar beramiz.",
      },
    ],
  },
];

const EN: Section[] = [
  {
    title: "1. Scope",
    blocks: [
      {
        p: "This Privacy Policy explains how personal data is collected, used and protected when you use the SevenEdu mobile app (Android and iOS, package com.sevenedu.app) and the sevenedu.org / 7edu.uz website. Terms of service are a separate document (/terms).",
      },
    ],
  },
  {
    title: "2. Data controller",
    blocks: [
      {
        rows: [
          ["Name", "“7EDU NTT”"],
          ["Email", CONTACT_EMAIL],
          ["Telegram (support)", "@boburov_sh"],
        ],
      },
    ],
  },
  {
    title: "3. What we collect",
    blocks: [
      { p: "Data you provide:" },
      {
        ul: [
          "First and last name — account identity, certificates, leaderboard",
          "Email address — sign-in, verification code, password reset",
          "Phone number — course-related contact",
          "Password — authentication; stored hashed, never in plain text",
          "Profile picture — optional avatar",
          "Questions you type to the AI tutor — to generate an answer",
        ],
      },
      { p: "Data generated by using the service:" },
      {
        ul: [
          "Lessons viewed and completed, course progress",
          "Test and quiz results (correct/incorrect answers, score)",
          "Coin and energy balance, purchase history",
          "Daily activity streak",
          "Certificate records — name, score, date, serial number",
          "Push notification token (Firebase Cloud Messaging)",
          "Google account identifier — only if you sign in with Google",
        ],
      },
    ],
  },
  {
    title: "4. Microphone and voice recordings",
    blocks: [
      {
        p: "In the Speaking exercise the app records a short audio clip and sends it to our pronunciation service (speech.sevenedu.org) for scoring.",
      },
      {
        ul: [
          "The microphone is activated only when you press the record button. It is never used in the background or while the app is closed.",
          "The clip is processed in memory and is never written to disk. It is discarded as soon as the score is returned.",
          "Only the target word and a language code are sent with the clip — no name, email or account identifier.",
          "The service keeps aggregate usage counts only; no individual can be identified from them.",
        ],
      },
      { note: "Voice recordings are not stored. They are discarded immediately after scoring." },
    ],
  },
  {
    title: "5. Data kept only on your device",
    blocks: [
      {
        ul: [
          "Session token",
          "Offline cache of courses, lessons, vocabulary and quizzes",
          "Settings — language (Uzbek / Russian / English) and theme",
          "Image cache",
        ],
      },
      {
        p: 'On Android 12+ the app ships with allowBackup="false", so none of this is copied into a Google Drive backup or transferred to another device. Uninstalling the app removes it permanently.',
      },
    ],
  },
  {
    title: "6. What we do NOT collect",
    blocks: [
      {
        ul: [
          "Location (GPS or network)",
          "Contacts, call logs, SMS messages",
          "Calendar, photo library or file listings",
          "Advertising ID and biometric data",
          "The list of other apps on your device",
        ],
      },
      {
        p: "The app contains no advertising networks, no third-party analytics SDKs and no behavioural trackers. We do not sell personal data.",
      },
    ],
  },
  {
    title: "7. Who data is disclosed to",
    blocks: [
      {
        p: "To other users: the leaderboard shows the name, profile picture and coin count of the top 100 learners. Email address, phone number and test results are never shown to other users.",
      },
      {
        rows: [
          ["Google — Firebase Cloud Messaging", "Push token — notification delivery"],
          ["Google — Sign-In", "Email, name, account ID — only if you choose it"],
          ["Vimeo", "Video request, IP address — lesson video streaming"],
          ["speech.sevenedu.org", "Audio clip, word, language code — pronunciation scoring"],
        ],
      },
      {
        p: "Tapping a Telegram link opens Telegram outside the app; from that point Telegram's own privacy policy applies. Data may also be disclosed to authorities on a lawful, formal request under the legislation of the Republic of Uzbekistan.",
      },
    ],
  },
  {
    title: "8. Permissions, retention, security",
    blocks: [
      {
        p: "Permissions: Internet (required); Microphone (Speaking exercise only — declining leaves the rest of the app fully usable); Notifications (optional); Network state; Vibration (optional). All can be revoked in device settings at any time.",
      },
      {
        p: "Retention: account data, learning progress and certificate records are kept while the account is active and deleted with the account. Voice recordings are not stored. Push tokens are revoked on sign-out.",
      },
      {
        p: "Security: all traffic is encrypted with HTTPS/TLS and cleartext HTTP is blocked; passwords are stored as irreversible hashes; the session token stays on the device and is excluded from backups.",
      },
    ],
  },
  {
    title: "9. Your rights and account deletion",
    blocks: [
      {
        p: "You may request access, correction, deletion, restriction, objection, a portable copy of your data, and you may withdraw consent at any time.",
      },
      {
        p: `You can delete your account in the app under Settings → Delete Account. If you cannot access the app, email ${CONTACT_EMAIL} from your account address with the subject “Delete my account”. After you confirm the code in the app, your profile, learning progress, test results, certificates, coin and energy balance, purchase history and push token are deleted.`,
      },
      { note: "Email requests are reviewed after identity verification." },
    ],
  },
  {
    title: "10. Children, international transfers, changes",
    blocks: [
      {
        p: "The service is intended for users aged 16 and over. Users under 16 may use it only with the consent of a parent or legal guardian. If we learn that we hold data of a child under 16 without that consent, we delete it immediately.",
      },
      {
        p: "Our servers and the services we use (Google Firebase, Vimeo) may be located outside Uzbekistan; the protections described here follow the data.",
      },
      {
        p: "This policy may be updated. Material changes will be announced in the app or by email, and the “Last updated” date above always reflects the current version.",
      },
    ],
  },
];

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-3 space-y-3">
      {blocks.map((b, i) => {
        if ("p" in b)
          return (
            <p key={i} className="text-sm leading-6 text-text-primary">
              {b.p}
            </p>
          );
        if ("ul" in b)
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {b.ul.map((li, j) => (
                <li key={j} className="text-sm leading-6 text-text-primary">
                  {li}
                </li>
              ))}
            </ul>
          );
        if ("rows" in b)
          return (
            <div
              key={i}
              className="overflow-hidden rounded-input border border-border"
            >
              {b.rows.map(([k, v], j) => (
                <div
                  key={j}
                  className="flex flex-col gap-1 border-b border-border bg-surface-alt px-4 py-3 last:border-b-0 md:flex-row md:gap-4"
                >
                  <p className="text-sm font-medium text-text-primary md:w-64 md:shrink-0">
                    {k}
                  </p>
                  <p className="text-sm leading-6 text-text-secondary">{v}</p>
                </div>
              ))}
            </div>
          );
        return (
          <div
            key={i}
            className="rounded-input border border-warning/30 bg-warning-soft px-4 py-3"
          >
            <p className="text-sm font-medium leading-6 text-text-primary">
              {b.note}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function PrivacyPage() {
  const [lang, setLang] = React.useState<"uz" | "en">("uz");
  const sections = lang === "uz" ? UZ : EN;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="rounded-card border border-border bg-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-wide text-text-secondary">
                7EDU • Privacy Policy
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {lang === "uz" ? "Maxfiylik siyosati" : "Privacy Policy"}
              </h1>
            </div>
            <div className="flex shrink-0 overflow-hidden rounded-tile border border-border">
              {(["uz", "en"] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase transition ${
                    lang === code
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-text-secondary hover:bg-surface-alt"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {lang === "uz"
              ? "SevenEdu mobil ilovasi va veb-saytida shaxsiy ma'lumotlaringiz qanday yig'ilishi va himoyalanishi."
              : "How personal data is collected and protected in the SevenEdu mobile app and website."}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-input border border-border bg-surface-alt p-4">
              <p className="text-xs font-medium text-text-secondary">
                {lang === "uz" ? "Oxirgi yangilanish" : "Last updated"}
              </p>
              <p className="mt-1 text-sm font-semibold">{UPDATED}</p>
            </div>
            <div className="rounded-input border border-border bg-surface-alt p-4">
              <p className="text-xs font-medium text-text-secondary">
                {lang === "uz" ? "Ovoz yozuvlari" : "Voice recordings"}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {lang === "uz" ? "Saqlanmaydi" : "Not stored"}
              </p>
            </div>
            <div className="rounded-input border border-border bg-surface-alt p-4">
              <p className="text-xs font-medium text-text-secondary">
                {lang === "uz" ? "Reklama / treker" : "Ads / trackers"}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {lang === "uz" ? "Yo'q" : "None"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4">
          {sections.map((s) => (
            <section
              key={s.title}
              className="rounded-card border border-border bg-surface p-6"
            >
              <h2 className="text-base font-semibold md:text-lg">{s.title}</h2>
              <Blocks blocks={s.blocks} />
            </section>
          ))}

          <div className="rounded-card border border-border bg-surface p-6">
            <h2 className="text-base font-semibold md:text-lg">
              {lang === "uz" ? "Bog'lanish" : "Contact"}
            </h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-input border border-border bg-surface-alt p-4">
                <p className="text-xs font-medium text-text-secondary">Email</p>
                <p className="mt-1 text-sm font-semibold">{CONTACT_EMAIL}</p>
              </div>
              <div className="rounded-input border border-border bg-surface-alt p-4">
                <p className="text-xs font-medium text-text-secondary">Telegram</p>
                <p className="mt-1 text-sm font-semibold">@boburov_sh</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-secondary">
          © {new Date().getFullYear()} 7EDU NTT · SevenEdu
        </p>
      </div>
    </div>
  );
}

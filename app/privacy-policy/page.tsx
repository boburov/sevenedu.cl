import React from "react";
import type { Metadata } from "next";

/**
 * Maxfiylik siyosati — 7EDU / SevenEdu.
 *
 * BU SAHIFA HUJJATNING VEB NUSXASI. Matn manbasi — mobile/PRIVACY_POLICY.txt.
 * Bandlar Google Play talab qiladigan tartibda joylashgan: nima yig'iladi,
 * nima uchun, kimga ulashiladi, qanday himoyalanadi, qancha saqlanadi va
 * qanday o'chiriladi, dasturchi kim, akkaunt qanday o'chiriladi.
 *
 * Matn o'zgarsa, mobile/PRIVACY_POLICY.txt va mobile/PRIVACY_POLICY.md bilan
 * BIRGA o'zgartiriladi — bu huquqiy hujjat, nusxalar bir-biridan uzoqlashmasligi
 * kerak.
 *
 * Play Console'ga aynan shu sahifaning URL'i kiritiladi.
 */

export const metadata: Metadata = {
  title: "Privacy Policy — Maxfiylik siyosati | SevenEdu",
  description:
    "SevenEdu mobil ilovasi va veb-saytining maxfiylik siyosati: qanday ma'lumotlar yig'iladi, nima uchun ishlatiladi, kimlar bilan ulashiladi, qanday himoyalanadi, qancha saqlanadi va akkaunt qanday o'chiriladi.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

const UPDATED = "2026-08-26";
const EMAIL = "boburovdev@gmail.com";

type Item = { t: string; d: string };
type Group = { sub?: string; paras?: string[]; items?: Item[] };
type Section = { id: string; num: string; title: string; groups: Group[] };

const FACTS: Item[] = [
  { t: "Ma'lumot sotilmaydi", d: "Shaxsiy ma'lumotlaringiz hech kimga sotilmaydi." },
  { t: "Reklama va treker yo'q", d: "Ilovada reklama tarmog'i va analitika SDK'si yo'q." },
  { t: "Joylashuv so'ralmaydi", d: "GPS va tarmoq orqali joylashuv umuman yig'ilmaydi." },
  { t: "Ovoz saqlanmaydi", d: "Talaffuz yozuvi baholanadi va darhol o'chadi." },
  { t: "Ilova ichida to'lov yo'q", d: "Karta ma'lumotlari so'ralmaydi va saqlanmaydi." },
  { t: "Akkaunt o'chiriladi", d: "Ilovaning o'zidan, istalgan vaqtda, to'liq." },
];

const SECTIONS: Section[] = [
  {
    id: "yigiladigan",
    num: "1",
    title: "Qanday shaxsiy ma'lumotlar yig'iladi",
    groups: [
      {
        sub: "1.1. Siz o'zingiz kiritadigan ma'lumotlar",
        items: [
          {
            t: "Ism va familiya",
            d: "Ro'yxatdan o'tishda so'raladi. Hisobingizni shaxsiylashtirish, sertifikatga yozish hamda reyting va o'yinlarda ko'rsatish uchun ishlatiladi.",
          },
          {
            t: "Elektron pochta manzili",
            d: "Ro'yxatdan o'tishda yoki Google orqali kirishda olinadi. Hisobga kirish, tasdiqlash kodi yuborish va parolni tiklash uchun ishlatiladi.",
          },
          {
            t: "Telefon raqami",
            d: "Ro'yxatdan o'tishda so'raladi. Kurs va yordamchi ustoz masalalarida siz bilan bog'lanish uchun ishlatiladi.",
          },
          {
            t: "Parol",
            d: "Autentifikatsiya uchun kerak. Parol serverda faqat qaytarilmas hash ko'rinishida saqlanadi va ochiq matnda hech qachon saqlanmaydi.",
          },
          {
            t: "Profil rasmi",
            d: "Ixtiyoriy. Faqat siz profilingizni tahrirlaganingizda yuklanadi va avatar sifatida ko'rsatiladi.",
          },
          {
            t: "Sun'iy intellekt yordamchisiga yozgan savolingiz",
            d: "Dars ichidagi Ustozdan so'rash funksiyasida yuboriladi. Batafsil ma'lumot 3.2 bandda.",
          },
        ],
      },
      {
        sub: "1.2. Xizmatdan foydalanish natijasida hosil bo'ladigan ma'lumotlar",
        items: [
          {
            t: "Darslar va kurs progressi",
            d: "Ko'rilgan va yakunlangan darslar. O'quv jarayonini davom ettirish va bajarilgan foizni ko'rsatish uchun.",
          },
          {
            t: "Test va o'yin natijalari",
            d: "To'g'ri va noto'g'ri javoblar hamda ballar. Bilimni baholash, sertifikat testini o'tkazish va o'yin natijasini hisoblash uchun.",
          },
          {
            t: "Tanga va energiya balansi",
            d: "Balans va uning sarflanish tarixi. Do'kon, mukofot va energiya tizimi ishlashi uchun.",
          },
          {
            t: "Do'kondagi xaridlar",
            d: "Qaysi mahsulot qancha tangaga olingani. Xaridni tasdiqlash va yetkazib berish uchun.",
          },
          {
            t: "Kunlik faollik zanjiri",
            d: "Motivatsiya mexanikasi va eslatmalar uchun.",
          },
          {
            t: "Sertifikat ma'lumotlari",
            d: "Ism, ball, sana va tartib raqami. Sertifikat faylini yaratish va uning haqiqiyligini tekshirish uchun.",
          },
          {
            t: "Google hisobi identifikatori",
            d: "Faqat siz Google orqali kirishni tanlaganingizda olinadi.",
          },
          {
            t: "Push bildirishnoma tokeni",
            d: "Bildirishnomalarni qurilmangizga yetkazish uchun.",
          },
          {
            t: "Sessiya va qurilma identifikatori",
            d: "Xavfsizlik uchun: kirishlarni bir biridan ajratish va o'g'irlangan sessiyani bekor qilish uchun.",
          },
          {
            t: "Texnik jurnal",
            d: "Server so'rovlari, IP manzil va xatolik yozuvlari. Nosozlikni aniqlash hamda suiiste'mol va ortiqcha yuklamaning oldini olish uchun.",
          },
        ],
      },
      {
        sub: "1.3. Mikrofon va ovoz yozuvlari",
        paras: [
          "Talaffuz mashqi bo'limida ilova mikrofondan qisqa ovoz yozuvini oladi va uni baholash uchun bizning o'z talaffuz xizmatimizga yuboradi.",
        ],
        items: [
          {
            t: "Mikrofon qachon yoqiladi",
            d: "Faqat siz yozib olish tugmasini bosganingizda. Fonda yoki ilova yopiq holatda hech qachon tinglanmaydi.",
          },
          {
            t: "Yozuv saqlanmaydi",
            d: "Ovoz yozuvi xizmatda operativ xotirada qayta ishlanadi va diskka yozilmaydi. Javob qaytgach yozuv yo'qoladi.",
          },
          {
            t: "Yozuv bilan nima yuboriladi",
            d: "Faqat aytilishi kerak bo'lgan so'z va til kodi. Ismingiz, pochtangiz va hisob identifikatoringiz talaffuz xizmatiga yuborilmaydi.",
          },
          {
            t: "Qaytadigan natija",
            d: "Faqat foizdagi aniqlik balli va tovushlar ro'yxati. Ovozning o'zi qaytarilmaydi va saqlanmaydi.",
          },
          {
            t: "Matnni ovozga aylantirish",
            d: "Ilova so'zlarni eshittirishi mumkin. Buning uchun matn qurilmangizning o'z nutq sintezi dvigateliga beriladi. Bu funksiya mikrofonni yoqmaydi va bizga hech narsa yubormaydi.",
          },
        ],
      },
      {
        sub: "1.4. Faqat qurilmangizda saqlanadigan ma'lumotlar",
        paras: [
          "Quyidagilar telefoningizdan chiqmaydi va serverimizga yuborilmaydi. Sessiya tokeni qurilmaning himoyalangan omborida saqlanadi. Oflayn kesh, ya'ni kurslar, darslar, lug'at va testlar nusxasi, internetsiz ishlash uchun mahalliy bazada turadi. Yuklab olingan dars videolari qurilmada shifrlangan holda saqlanadi va faqat ilovaning o'zi tomonidan ochiladi. Til, mavzu, ovoz va tebranish sozlamalari hamda rasm keshi ham faqat qurilmada qoladi.",
          "Ilova zaxira nusxa olish o'chirilgan holda chiqariladi. Bu fayllar bulutli zaxiraga tushmaydi va boshqa qurilmaga ko'chirilmaydi. Ilovani o'chirsangiz, ular qurilmadan butunlay yo'qoladi.",
        ],
      },
      {
        sub: "1.5. Biz yig'maydigan ma'lumotlar",
        paras: [
          "Ilova geolokatsiyani, ya'ni GPS yoki tarmoq orqali joylashuvni yig'maydi. Telefon kontaktlari, qo'ng'iroqlar tarixi va SMS xabarlar yig'ilmaydi. Kalendar, fotogalereya va qurilmadagi fayllar ro'yxati o'qilmaydi. Reklama identifikatori va biometrik ma'lumotlar yig'ilmaydi. Qurilmadagi boshqa ilovalar ro'yxati o'qilmaydi. To'lov va bank karta ma'lumotlari so'ralmaydi va saqlanmaydi, chunki ilova ichida to'lov qabul qilinmaydi.",
        ],
      },
    ],
  },
  {
    id: "maqsad",
    num: "2",
    title: "Ma'lumotlar nima uchun ishlatiladi",
    groups: [
      {
        items: [
          {
            t: "Xizmatni ko'rsatish",
            d: "Hisob yaratish, kurslarga ulash, darslar va kinolarni ko'rsatish, progressni saqlash va sertifikat berish.",
          },
          {
            t: "Shaxsiylashtirish",
            d: "Qayerda to'xtaganingizni eslab qolish, darajangizni hisoblash va keyingi darsni taklif qilish.",
          },
          {
            t: "O'yin mexanikasi",
            d: "Tanga, energiya, faollik zanjiri, reyting, mini o'yinlar va do'kon ishlashi.",
          },
          {
            t: "Siz bilan bog'lanish",
            d: "Tasdiqlash kodi, parolni tiklash, dars va faollik eslatmalari hamda yordamchi ustoz bilan aloqa.",
          },
          {
            t: "Xavfsizlik va sifat",
            d: "Xatoliklarni aniqlash, suiiste'mol va ruxsatsiz kirishning oldini olish, yuklamani boshqarish.",
          },
          {
            t: "Qonuniy majburiyatlar",
            d: "Hisobot berish va vakolatli organlarning rasmiy so'rovlariga javob qaytarish.",
          },
        ],
      },
      {
        paras: [
          "Ishlov berishning huquqiy asoslari quyidagilar. Siz bilan tuzilgan shartnomani bajarish. Sizning roziligingiz, masalan mikrofon va bildirishnomalar uchun. Bizning qonuniy manfaatimiz, masalan xavfsizlik uchun. Va qonun talabi.",
          "Biz shaxsiy ma'lumotlaringizni sotmaymiz va reklama maqsadida uchinchi tomonlarga bermaymiz.",
        ],
      },
    ],
  },
  {
    id: "ulashish",
    num: "3",
    title: "Ma'lumotlar kimlar bilan ulashiladi",
    groups: [
      {
        sub: "3.1. Boshqa foydalanuvchilarga ko'rinadigan ma'lumotlar",
        paras: [
          "Reyting ro'yxatida eng faol o'quvchilarning ismi, familiyasi, profil rasmi va tanga soni boshqa foydalanuvchilarga ko'rinadi.",
          "Real vaqtli duel o'yinida raqibingizga faqat ismingiz va o'sha o'yindagi ballingiz ko'rinadi.",
          "Elektron pochtangiz, telefon raqamingiz, test natijalaringiz va kurs progressingiz hech qachon boshqa foydalanuvchilarga ko'rsatilmaydi.",
          "Reytingda ko'rinishni istamasangiz, bizga yozing va hisobingizni ro'yxatdan chiqaramiz.",
        ],
      },
      {
        sub: "3.2. Xizmat ko'rsatuvchi sheriklar",
        items: [
          {
            t: "Google Firebase Cloud Messaging",
            d: "Qurilmangizning push tokeni uzatiladi. Maqsad: bildirishnomani yetkazish.",
          },
          {
            t: "Google Sign In",
            d: "Elektron pochta, ism va hisob identifikatori uzatiladi. Bu faqat siz Google orqali kirishni tanlaganingizda sodir bo'ladi.",
          },
          {
            t: "OpenAI",
            d: "Faqat sun'iy intellekt yordamchisiga yozgan savolingiz matni uzatiladi. Ismingiz, pochtangiz, telefoningiz va hisob identifikatoringiz unga yuborilmaydi. Bizning serverimizda faqat so'rovlar soni saqlanadi. Savol matni va javob uzoq muddat saqlanmaydi. Iltimos, savolga parol, karta raqami yoki boshqa odamlarning shaxsiy ma'lumotlarini yozmang.",
          },
          {
            t: "Vimeo",
            d: "Video so'rovi, IP manzil va qurilma ma'lumotlari uzatiladi. Maqsad: dars videolari va kinolarni oqimda uzatish. Video ilova ichidagi ko'rinishda ochiladi va Vimeo o'z cookie fayllarini o'rnatishi mumkin.",
          },
          {
            t: "Bizning talaffuz xizmatimiz",
            d: "Qisqa ovoz yozuvi, so'z va til kodi uzatiladi. Maqsad: talaffuzni baholash. Batafsil ma'lumot 1.3 bandda.",
          },
          {
            t: "Bizning server infratuzilmamiz",
            d: "Yuqoridagi hisob ma'lumotlari va yuklangan rasmlar saqlanadi. Maqsad: ilovaning ishlashi.",
          },
        ],
        paras: [
          "Bu xizmatlar ma'lumotni faqat bizning topshirig'imiz asosida va faqat ko'rsatilgan maqsadda qayta ishlaydi. Ularga ma'lumotni o'z maqsadlari uchun ishlatishga ruxsat berilmagan.",
        ],
      },
      {
        sub: "3.3. Do'kon rasmlari va Telegram havolalari",
        paras: [
          "Do'kondagi mahsulot rasmlari Telegram xizmatida saqlanadi va serverimiz orqali uzatiladi. Bunda sizning shaxsingiz haqida Telegramga hech narsa yuborilmaydi.",
          "Ilovadagi yordam va yordamchi ustoz havolalari bosilganda Telegram ilovasi ilovamizdan tashqarida ochiladi. O'sha paytdan boshlab Telegramning o'z maxfiylik siyosati amal qiladi va biz sizning Telegram yozishmalaringizga kira olmaymiz.",
        ],
      },
      {
        sub: "3.4. Qonuniy talab bo'yicha oshkor qilish",
        paras: [
          "O'zbekiston Respublikasi qonunchiligi talab qilgan hollarda, vakolatli davlat organlarining rasmiy so'rovi asosida ma'lumot berilishi mumkin.",
        ],
      },
      {
        sub: "3.5. Sertifikatni ulashish",
        paras: [
          "Kursni yakunlaganingizda ilova sertifikat faylini hosil qiladi. Uni ulashish yoki chop etish qurilmangizning o'z tizim oynasi orqali amalga oshiriladi. Faylni kimga yuborishni faqat siz hal qilasiz. Biz bu jarayonga aralashmaymiz va kimga yuborganingizni bilmaymiz.",
        ],
      },
    ],
  },
  {
    id: "himoya",
    num: "4",
    title: "Ma'lumotlar qanday himoyalanadi",
    groups: [
      {
        items: [
          {
            t: "Shifrlangan aloqa",
            d: "Barcha tarmoq trafigi HTTPS va TLS orqali shifrlanadi. Ilovaning tarmoq konfiguratsiyasi shifrlanmagan HTTP ulanishni taqiqlaydi.",
          },
          {
            t: "Parollar",
            d: "Serverda qaytarilmas hash algoritmi bilan saqlanadi va ochiq matnda hech qachon saqlanmaydi.",
          },
          {
            t: "Sessiya tokeni",
            d: "Qurilmaning himoyalangan omborida saqlanadi va zaxira nusxaga tushmaydi.",
          },
          {
            t: "Bitta qurilma qoidasi",
            d: "Hisobga bir vaqtda faqat bitta qurilmadan kirish mumkin. Yangi qurilmadan kirilganda eski sessiya darhol bekor qilinadi va pochtangizga xabar boradi. Faol va yopilgan sessiyalarni Sozlamalar bo'limidagi Qurilmalar ro'yxatida ko'rasiz va begona qurilmani o'zingiz chiqarib yubora olasiz.",
          },
          {
            t: "Yuklab olingan videolar",
            d: "Qurilmada shifrlangan holda saqlanadi.",
          },
          {
            t: "Serverga kirish",
            d: "Cheklangan va faqat vakolatli xodimlarga ruxsat etilgan.",
          },
        ],
        paras: [
          "Shunga qaramay, internet orqali uzatishning yuz foiz xavfsizligini hech bir xizmat kafolatlay olmaydi. Parolingizni hech kimga bermang. Hisobingizga ruxsatsiz kirish shubhasi bo'lsa, darhol bizga xabar bering.",
        ],
      },
    ],
  },
  {
    id: "saqlash",
    num: "5",
    title: "Ma'lumotlar qancha vaqt saqlanadi",
    groups: [
      {
        items: [
          {
            t: "Hisob ma'lumotlari",
            d: "Ism, pochta, telefon va parol hash hisobingiz faol bo'lgunicha saqlanadi.",
          },
          {
            t: "O'quv va o'yin ma'lumotlari",
            d: "Progress, test va o'yin natijalari, tanga va energiya balansi hamda xaridlar tarixi hisobingiz faol bo'lgunicha saqlanadi.",
          },
          {
            t: "Sertifikat yozuvlari",
            d: "Hisobingiz faol bo'lgunicha saqlanadi. Hisob o'chirilganda ular ham o'chadi.",
          },
          {
            t: "Ovoz yozuvlari",
            d: "Umuman saqlanmaydi. Baholashdan so'ng darhol o'chadi.",
          },
          {
            t: "Sun'iy intellektga yozilgan savol",
            d: "Uzoq muddat saqlanmaydi. Faqat so'rovlar soni qoladi.",
          },
          {
            t: "Push bildirishnoma tokeni",
            d: "Siz hisobdan chiqqaningizda yoki ilovani o'chirganingizda bekor qilinadi.",
          },
          {
            t: "Texnik jurnal va xatolik yozuvlari",
            d: "90 kungacha saqlanadi.",
          },
          {
            t: "Qurilmadagi kesh va videolar",
            d: "Siz ilovani yoki yuklamani o'chirguningizcha turadi.",
          },
        ],
        paras: [
          "Hisobni o'chirishni tasdiqlaganingizdan so'ng ma'lumotlar darhol, kechiktirmasdan va tiklash muddatisiz butunlay o'chiriladi. O'chirish tartibi 7 bandda batafsil yozilgan.",
        ],
      },
    ],
  },
  {
    id: "dasturchi",
    num: "6",
    title: "Dasturchi nomi va aloqa ma'lumotlari",
    groups: [
      {
        items: [
          { t: "Ilova egasi va ma'lumotlar operatori", d: "7EDU NTT" },
          { t: "Elektron pochta", d: EMAIL },
          { t: "Telegram orqali yordam", d: "boburov_sh" },
          { t: "Veb-sayt", d: "sevenedu.org" },
        ],
        paras: [
          "Shaxsiy ma'lumotlarga oid har qanday savol, so'rov yoki shikoyatni shu manzillarga yuborishingiz mumkin. So'rovingizga 30 kun ichida javob beramiz.",
        ],
      },
    ],
  },
  {
    id: "ochirish",
    num: "7",
    title: "Akkauntni va ma'lumotlarni o'chirish",
    groups: [
      {
        paras: [
          "Akkauntingizni ilovaning o'z ichidan, o'zingiz o'chira olasiz. Buning uchun hech kimdan ruxsat so'rash yoki xat yozish shart emas. Yo'l quyidagicha: Profil bo'limini oching, Sozlamalar bandiga o'ting va Hisobni o'chirish tugmasini bosing.",
          "O'chirish uch qadamdan iborat va har biri alohida tasdiq so'raydi.",
        ],
        items: [
          {
            t: "Birinchi qadam: ogohlantirish",
            d: "Sizga nima yo'qolishi ro'yxati ko'rsatiladi, hisobingizdagi haqiqiy raqamlar bilan, ya'ni nechta kurs, nechta sertifikat va qancha tanga yo'qolishi aytiladi.",
          },
          {
            t: "Ikkinchi qadam: elektron pochta",
            d: "Hisobingizga biriktirilgan manzilni qo'lda yozasiz. Server uni sessiyangizdagi manzil bilan solishtiradi.",
          },
          {
            t: "Uchinchi qadam: tasdiqlash kodi",
            d: "O'sha manzilga olti xonali kod yuboriladi. Kod 10 daqiqa amal qiladi, faqat so'ralgan qurilmada ishlaydi va besh marta noto'g'ri kiritilsa bekor bo'ladi.",
          },
        ],
      },
      {
        sub: "Kod tasdiqlangach nimalar o'chiriladi",
        paras: [
          "Profil ma'lumotlari, ya'ni ism, familiya, pochta, telefon, parol hash va profil rasmi. Kurslarga yozilishlar va butun dars progressi. Test, viktorina va mini o'yin natijalari. Berilgan sertifikatlar va ularning yozuvlari. Tanga va energiya balansi hamda ularning tarixi. Do'kon xaridlari tarixi. Bildirishnomalar, push tokeni va barcha qurilma sessiyalari.",
          "O'chirish tugagach pochtangizga tasdiq xati yuboriladi. Bu amalni ortga qaytarib bo'lmaydi. O'chirilgan hisob tiklanmaydi va sotib olingan kurslar qaytarilmaydi.",
          "Agar ilovaga kira olmayotgan bo'lsangiz, masalan parolni yo'qotgan yoki telefoningiz yo'q bo'lsa, o'chirish so'rovini " +
            EMAIL +
            " manziliga hisobingiz pochtasidan yuboring. Shaxsingizni tasdiqlaganimizdan keyin 30 kun ichida bajaramiz.",
        ],
      },
    ],
  },
  {
    id: "ruxsatlar",
    num: "8",
    title: "Ilova so'raydigan ruxsatlar",
    groups: [
      {
        items: [
          {
            t: "Internet",
            d: "Server bilan aloqa uchun kerak. Majburiy.",
          },
          {
            t: "Mikrofon",
            d: "Faqat talaffuz mashqida ovozni yozib olish uchun so'raladi. Majburiy emas: rad etsangiz, ilovaning qolgan barcha qismi to'liq ishlaydi.",
          },
          {
            t: "Bildirishnoma",
            d: "Dars va faollik eslatmalari uchun so'raladi. Majburiy emas.",
          },
        ],
        paras: [
          "Bu ruxsatlarni istalgan vaqtda qurilma sozlamalaridan bekor qilishingiz mumkin. Ilova joylashuv, kontaktlar, SMS, kamera va fayllarga kirish ruxsatini umuman so'ramaydi.",
        ],
      },
    ],
  },
  {
    id: "huquqlar",
    num: "9",
    title: "Foydalanuvchining huquqlari",
    groups: [
      {
        items: [
          {
            t: "Ko'rish",
            d: "Biz sizda qanday ma'lumot saqlayotganimizni so'rashingiz mumkin.",
          },
          {
            t: "Tuzatish",
            d: "Noto'g'ri ma'lumotni ilovadagi Profilni tahrirlash bo'limi orqali yoki bizga so'rov yuborib o'zgartira olasiz.",
          },
          {
            t: "O'chirish",
            d: "Hisobingizni va unga bog'liq ma'lumotlarni 7 bandda ko'rsatilgan tartibda o'chirasiz.",
          },
          {
            t: "E'tiroz bildirish",
            d: "Ayrim ishlov berish turlariga qarshi chiqa olasiz, masalan reytingda ko'rinmaslikni so'rashingiz mumkin.",
          },
          {
            t: "Nusxa olish",
            d: "Ma'lumotlaringizning mashina o'qiy oladigan nusxasini so'rashingiz mumkin.",
          },
          {
            t: "Rozilikni qaytarib olish",
            d: "Bildirishnoma va mikrofon ruxsatlarini qurilma sozlamalaridan istalgan vaqtda o'chira olasiz.",
          },
        ],
      },
    ],
  },
  {
    id: "bolalar",
    num: "10",
    title: "Bolalar maxfiyligi",
    groups: [
      {
        paras: [
          "Xizmat 16 yoshdan katta foydalanuvchilar uchun mo'ljallangan. Agar siz 16 yoshga to'lmagan bo'lsangiz, ilovadan faqat ota onangiz yoki qonuniy vakilingiz roziligi bilan foydalanishingiz mumkin.",
          "Agar 16 yoshgacha bo'lgan bolaning ma'lumotini ota ona roziligisiz yig'ganimizni aniqlasak, uni darhol o'chiramiz. Bunday holatni sezsangiz, " +
            EMAIL +
            " manziliga xabar bering.",
        ],
      },
    ],
  },
  {
    id: "xalqaro",
    num: "11",
    title: "Ma'lumotlarning xalqaro uzatilishi",
    groups: [
      {
        paras: [
          "Serverlarimiz va biz foydalanadigan xizmatlar, ya'ni Google Firebase, OpenAI va Vimeo, O'zbekistondan tashqarida joylashgan bo'lishi mumkin. Ma'lumot uzatilganda ushbu siyosatda ko'rsatilgan himoya darajasi saqlanadi va shartnomaviy kafolatlar qo'llaniladi.",
        ],
      },
    ],
  },
  {
    id: "cookie",
    num: "12",
    title: "Veb-sayt va cookie fayllari",
    groups: [
      {
        paras: [
          "sevenedu.org saytida zarur cookie fayllardan foydalaniladi, ya'ni sessiyani ushlab turish va til tanlovini eslab qolish uchun.",
          "Veb-saytda, ilovadan farqli o'laroq, Google Analytics statistika vositasi ishlaydi. U sahifa ko'rishlari va umumiy foydalanish statistikasini yig'adi va shu maqsadda cookie fayl o'rnatadi. Mobil ilovada esa hech qanday analitika vositasi yo'q.",
          "Reklama va reklama uchun kuzatuv cookie fayllari o'rnatilmaydi.",
        ],
      },
    ],
  },
  {
    id: "tolov",
    num: "13",
    title: "To'lovlar",
    groups: [
      {
        paras: [
          "Ilova ichida to'lov qabul qilinmaydi. Karta raqami, bank yoki to'lov tizimi ma'lumotlari so'ralmaydi va saqlanmaydi. Kursga yozilish va to'lov masalalari ilovadan tashqarida hal qilinadi.",
          "Do'kondagi xaridlar faqat ilova ichidagi tanga evaziga amalga oshiriladi. Tanga haqiqiy pul emas, pulga almashtirilmaydi va qaytarilmaydi.",
        ],
      },
    ],
  },
  {
    id: "ozgarish",
    num: "14",
    title: "Ushbu siyosatga o'zgartirishlar",
    groups: [
      {
        paras: [
          "Ushbu siyosat vaqti vaqti bilan yangilanishi mumkin. Muhim o'zgarishlar bo'lsa, ilova ichida yoki elektron pochta orqali sizga xabar beramiz. Sahifaning yuqorisidagi Oxirgi yangilanish sanasi doim amaldagi versiyani bildiradi.",
        ],
      },
    ],
  },
];

function Items({ items }: { items: Item[] }) {
  return (
    <dl className="mt-4 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-zinc-50/60">
      {items.map((it) => (
        <div key={it.t} className="grid gap-1 p-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-5">
          <dt className="text-sm font-semibold text-zinc-900">{it.t}</dt>
          <dd className="text-sm leading-6 text-zinc-600">{it.d}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-600">
            SevenEdu • Privacy Policy
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Maxfiylik siyosati
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Ushbu hujjat SevenEdu mobil ilovasidan va sevenedu.org veb-saytidan
            foydalanganingizda qanday shaxsiy ma'lumotlar yig'ilishini, ular nima
            uchun ishlatilishini, kimlar bilan ulashilishini, qanday
            himoyalanishini, qancha vaqt saqlanishini va qanday o'chirilishini
            tushuntiradi.
          </p>

          <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-zinc-100 pt-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs font-medium text-zinc-500">Ilova nomi</dt>
              <dd className="mt-0.5 font-medium">SevenEdu</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Paket nomi</dt>
              <dd className="mt-0.5 font-mono text-[13px] font-medium">com.sevenedu.app</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Platformalar</dt>
              <dd className="mt-0.5 font-medium">Android va iOS</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-zinc-500">Oxirgi yangilanish</dt>
              <dd className="mt-0.5 font-medium">{UPDATED}</dd>
            </div>
          </dl>
        </header>

        <section
          aria-label="Eng muhimi qisqacha"
          className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
        >
          <h2 className="text-lg font-semibold">Eng muhimi qisqacha</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FACTS.map((f) => (
              <li
                key={f.t}
                className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4"
              >
                <p className="text-sm font-semibold text-zinc-900">{f.t}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{f.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-6">
          <nav
            aria-label="Mundarija"
            className="rounded-2xl border border-zinc-200 bg-white p-5 lg:sticky lg:top-6"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Mundarija
            </p>
            <ol className="mt-3 space-y-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={"#" + s.id}
                    className="flex gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    <span className="w-4 shrink-0 tabular-nums text-zinc-400">
                      {s.num}
                    </span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <main className="mt-6 space-y-6 lg:mt-0">
            {SECTIONS.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
              >
                <h2 className="flex gap-3 text-lg font-semibold tracking-tight sm:text-xl">
                  <span className="tabular-nums text-violet-500">{s.num}.</span>
                  <span>{s.title}</span>
                </h2>

                {s.groups.map((g, gi) => (
                  <div key={gi} className={gi === 0 ? "mt-4" : "mt-7"}>
                    {g.sub ? (
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {g.sub}
                      </h3>
                    ) : null}
                    {g.paras
                      ? g.paras.map((p, pi) => (
                          <p
                            key={pi}
                            className="mt-2 text-sm leading-7 text-zinc-700"
                          >
                            {p}
                          </p>
                        ))
                      : null}
                    {g.items ? <Items items={g.items} /> : null}
                  </div>
                ))}
              </section>
            ))}

            <section
              id="boglanish"
              className="scroll-mt-6 rounded-2xl border border-violet-200 bg-violet-50/60 p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Bog'lanish
              </h2>
              <p className="mt-2 text-sm leading-7 text-zinc-700">
                Maxfiylik bo'yicha savolingiz bo'lsa yoki ma'lumotlaringiz
                ustidan huquqlaringizdan foydalanmoqchi bo'lsangiz, biz bilan
                bog'laning.
              </p>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-violet-200 bg-white p-4">
                  <dt className="text-xs font-medium text-zinc-500">
                    Elektron pochta
                  </dt>
                  <dd className="mt-1 text-sm font-semibold break-all">
                    <a className="hover:text-violet-700" href={"mailto:" + EMAIL}>
                      {EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="rounded-xl border border-violet-200 bg-white p-4">
                  <dt className="text-xs font-medium text-zinc-500">Telegram</dt>
                  <dd className="mt-1 text-sm font-semibold">
                    <a
                      className="hover:text-violet-700"
                      href="https://t.me/boburov_sh"
                      target="_blank"
                      rel="noreferrer"
                    >
                      boburov_sh
                    </a>
                  </dd>
                </div>
                <div className="rounded-xl border border-violet-200 bg-white p-4">
                  <dt className="text-xs font-medium text-zinc-500">Veb-sayt</dt>
                  <dd className="mt-1 text-sm font-semibold">sevenedu.org</dd>
                </div>
              </dl>
            </section>
          </main>
        </div>

        <footer className="mt-8 text-center text-xs text-zinc-500">
          <p>
            Xizmatdan foydalanish shartlari alohida hujjatda:{" "}
            <a className="text-violet-600 hover:underline" href="/terms">
              Shartnoma
            </a>
          </p>
          <p className="mt-2">7EDU NTT, 2026. Barcha huquqlar himoyalangan.</p>
        </footer>
      </div>
    </div>
  );
}

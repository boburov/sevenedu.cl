// Oxirgi 7 kun bilan ishlash uchun yordamchilar (dashboard va bosh sahifa).

export const UZ_WEEKDAYS = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];

// Mahalliy sana kaliti (YYYY-MM-DD) — UTC emas, foydalanuvchi kuni bo'yicha
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const lastSevenDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (6 - i),
    );
    return { key: dayKey(d), label: UZ_WEEKDAYS[d.getDay()], isToday: i === 6 };
  });
};

// Kun bo'yicha ko'rilgan darslar soni
export const lessonsByDay = (seen: { watchedAt: string }[] = []) => {
  const map: Record<string, number> = {};
  for (const s of seen) {
    const k = dayKey(new Date(s.watchedAt));
    map[k] = (map[k] || 0) + 1;
  }
  return map;
};

const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

// "26-sentabr, 2026" — brauzerning uz-UZ formati ("2026 M09 26") o'rniga
export const formatUzDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};

// "YYYY-MM-DD" kalitidan qisqa hafta kuni (Du, Se, ...)
export const weekdayOf = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return UZ_WEEKDAYS[new Date(y, m - 1, d).getDay()];
};

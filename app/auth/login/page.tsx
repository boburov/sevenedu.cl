"use client";

import { forgotPassword, login } from "@/app/api/service/api";
import { ArrowLeft, Eye, EyeClosed, School, Terminal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Login xatosini foydalanuvchi o'qiy oladigan matnga aylantiradi.
 *
 * Serverning ichki xatosi (5xx) — bu foydalanuvchining aybi emas va uning
 * "Internal server error" degan matni unga hech narsa aytmaydi: parolini
 * qayta-qayta terib ovora bo'ladi. Shuning uchun 5xx va tarmoq uzilishi
 * alohida, tushunarli xabar oladi; 4xx da esa serverning o'z matni ko'rsatiladi
 * ("Parol noto'g'ri" kabi) — u aynan foydalanuvchi uchun yozilgan.
 */
function loginErrorMessage(error: any): string {
  const status: number | undefined = error?.response?.status;

  // Javob umuman kelmadi: internet yo'q, DNS/CORS, yoki server o'chgan.
  if (error?.response === undefined) {
    return "Serverga ulanib bo'lmadi. Internet aloqangizni tekshirib, qayta urinib ko'ring.";
  }

  if (status !== undefined && status >= 500) {
    return "Serverda vaqtinchalik xatolik. Birozdan so'ng qayta urinib ko'ring.";
  }

  const raw = error?.response?.data?.message;
  // NestJS ValidationPipe xabarni MASSIV qilib qaytaradi — birinchisini olamiz,
  // aks holda ekranda vergul bilan yopishgan matn chiqadi.
  const message = Array.isArray(raw) ? raw[0] : raw;

  if (typeof message === "string" && message.trim()) return message;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  return "Login xatosi yuz berdi. Qayta urinib ko'ring.";
}

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Console modal states
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: string; message: string; timestamp: string }>>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) router.push(`/user/${userId}`);

    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      setLogs(prev => [...prev, { type: 'log', message: args.join(' '), timestamp: new Date().toLocaleTimeString() }]);
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev, { type: 'error', message: args.join(' '), timestamp: new Date().toLocaleTimeString() }]);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      setLogs(prev => [...prev, { type: 'warn', message: args.join(' '), timestamp: new Date().toLocaleTimeString() }]);
      originalWarn.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, [router]);

  const clearLogs = () => setLogs([]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setMsg("");
    setLoading(true);

    try {
      const data = await login({ email, password });

      const token = data?.token;
      const userId = data?.checkId?.userID;

      if (token && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        router.push(`/user/${userId}`);
      } else {
        setMsg("Login muvaffaqiyatsiz");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setMsg(loginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setMsg("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setMsg("Yangi parol emailingizga yuborildi.");
      setForgotMode(false);
    } catch (error) {
      const err = error as Error;
      setMsg(err?.message || "Email topilmadi");
    } finally {
      setLoading(false);
    }
  };

  // focus:ring-* Tailwind'da box-shadow orqali chiziladi — dizaynda soya
  // ishlatilmaydi. Shuning uchun fokus halqasi .focus-ring (outline) bilan.
  const inputBaseClass =
    "focus-ring w-full h-12 border border-border rounded-input px-4 bg-surface text-text-primary placeholder:text-text-muted focus:border-primary transition-colors duration-200";

  return (
    <section className="min-h-screen bg-background">
      <div className="container pt-6">
        <Link
          href="/"
          className="focus-ring rounded inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
          <span className="text-sm font-medium">Orqaga</span>
        </Link>

        <div className="flex flex-col items-center pt-12 max-w-sm mx-auto">
          <div className="bg-primary-soft p-4 rounded-2xl mb-6">
            <School size={64} className="text-primary" strokeWidth={1} />
          </div>

          <h3 className="text-2xl font-bold text-text-primary mb-2">
            {forgotMode ? "Parolni tiklash" : "O'quvchi sifatida kirish"}
          </h3>

          <p className="text-text-secondary text-sm mb-8">
            {forgotMode
              ? "Email manzilingizni kiriting"
              : "Hisobingizga kirish uchun ma'lumotlarni kiriting"}
          </p>

          {msg && (
            <div
              className={`w-full mb-4 p-3 rounded-input text-sm font-medium text-center ${msg.includes("yuborildi")
                ? "bg-success-soft text-success"
                : "bg-danger-soft text-danger"
                }`}
            >
              {msg}
            </div>
          )}

          {!forgotMode ? (
            <form className="w-full space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={inputBaseClass}
                required
                autoComplete="email"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol"
                  className={`${inputBaseClass} pr-12`}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="focus-ring rounded absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`focus-ring w-full h-12 rounded-button text-base font-semibold text-primary-foreground transition-colors duration-200 ${loading
 ? "bg-primary/60 cursor-not-allowed"
 : "bg-primary hover:bg-primary-hover "
 }`}
              >
                {loading ? "Kirish..." : "Kirish"}
              </button>

              <Link
                href={'forgot-password'}
                className="focus-ring rounded text-primary hover:text-primary-hover font-medium w-full text-center text-sm transition-colors duration-200"
              >
                Parolni unutdingizmi?
              </Link>
            </form>
          ) : (
            <form className="w-full space-y-4" onSubmit={handleForgotPassword}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ro'yxatdan o'tgan emailingizni kiriting"
                className={inputBaseClass}
                required
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={loading}
                className={`focus-ring w-full h-12 rounded-button text-base font-semibold text-primary-foreground transition-colors duration-200 ${loading
 ? "bg-primary/60 cursor-not-allowed"
 : "bg-primary hover:bg-primary-hover "
 }`}
              >
                {loading ? "Yuborilmoqda..." : "Parolni tiklash"}
              </button>

              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="focus-ring rounded text-primary hover:text-primary-hover font-medium w-full text-center text-sm transition-colors duration-200"
                disabled={loading}
              >
                Orqaga
              </button>
            </form>
          )}

          {!forgotMode && (
            <Link
              href="signup"
              className="focus-ring rounded mt-6 text-text-secondary hover:text-primary font-medium text-sm transition-colors duration-200"
            >
              Mehmon sifatida kirish
            </Link>
          )}
        </div>
      </div>

      {/* Suzuvchi konsol tugmasi.
          Konsol — ishlab chiquvchi asbobi, mahsulot UI'si emas. Shuning uchun
          u ataylab to'q: tizimning eng to'q neytrali (--primary) fon, oq matn.
          Yangi rang kiritilmaydi. */}
      <button
        type="button"
        onClick={() => setShowConsole(!showConsole)}
        className="focus-ring fixed bottom-6 right-6 z-50 rounded-button bg-primary p-4 text-primary-foreground transition-colors hover:bg-primary-hover"
        aria-label="Konsolni ochish/yopish"
      >
        <Terminal size={24} />
      </button>

      {showConsole && (
        <div className="fixed inset-0 z-50 flex items-end bg-text-primary/50 sm:items-center sm:justify-center">
          <div className="flex h-96 w-full flex-col rounded-t-card bg-primary sm:h-3/4 sm:w-11/12 sm:max-w-4xl sm:rounded-card">
            <div className="flex items-center justify-between rounded-t-card bg-primary-hover px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal size={20} className="text-accent" />
                <h3 className="font-semibold text-primary-foreground">Console</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearLogs}
                  className="focus-ring rounded-input px-3 py-1 text-sm text-primary-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Tozalash
                </button>
                <button
                  type="button"
                  onClick={() => setShowConsole(false)}
                  className="focus-ring rounded-input p-1 text-primary-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label="Konsolni yopish"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="italic text-primary-foreground/50">
                  Hozircha yozuv yo&apos;q...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      log.type === "error"
                        ? "text-danger"
                        : log.type === "warn"
                          ? "text-warning"
                          : "text-primary-foreground/80"
                    }`}
                  >
                    <span className="mr-2 text-xs text-primary-foreground/50">
                      [{log.timestamp}]
                    </span>
                    <span className="mr-2 text-primary-foreground/60">
                      {log.type}:
                    </span>
                    {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
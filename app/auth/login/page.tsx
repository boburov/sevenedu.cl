"use client";

import { forgotPassword, login } from "@/app/api/service/api";
import { ArrowLeft, Eye, EyeClosed, School, Terminal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    } catch (error) {
      console.log((error as Error)?.message);
      setMsg("Parol yoki email noto'g'ri");
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

  const inputBaseClass =
    "w-full h-12 border border-border rounded-input px-4 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-all duration-200";

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-soft/30 via-background to-background">
      <div className="container pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-button text-base font-semibold text-primary-foreground transition-all duration-200 ${loading
                    ? "bg-primary/60 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg"
                  }`}
              >
                {loading ? "Kirish..." : "Kirish"}
              </button>

              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="text-primary hover:text-primary-hover font-medium w-full text-center text-sm transition-colors duration-200"
                disabled={loading}
              >
                Parolni unutdingizmi?
              </button>
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
                className={`w-full h-12 rounded-button text-base font-semibold text-primary-foreground transition-all duration-200 ${loading
                    ? "bg-primary/60 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg"
                  }`}
              >
                {loading ? "Yuborilmoqda..." : "Parolni tiklash"}
              </button>

              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="text-primary hover:text-primary-hover font-medium w-full text-center text-sm transition-colors duration-200"
                disabled={loading}
              >
                Orqaga
              </button>
            </form>
          )}

          {!forgotMode && (
            <Link
              href="signup"
              className="mt-6 text-text-secondary hover:text-primary font-medium text-sm transition-colors duration-200"
            >
              Mehmon sifatida kirish
            </Link>
          )}
        </div>
      </div>

      {/* Floating Terminal Button */}
      <button
        onClick={() => setShowConsole(!showConsole)}
        className="fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        aria-label="Toggle Console"
      >
        <Terminal size={24} />
      </button>

      {/* Console Modal */}
      {showConsole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="bg-gray-900 w-full sm:w-11/12 sm:max-w-4xl h-96 sm:h-3/4 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Terminal size={20} className="text-green-400" />
                <h3 className="text-white font-semibold">Console</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearLogs}
                  className="text-gray-400 hover:text-white px-3 py-1 text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowConsole(false)}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700 transition-colors"
                  aria-label="Close Console"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${log.type === 'error'
                        ? 'text-red-400'
                        : log.type === 'warn'
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                  >
                    <span className="text-gray-500 text-xs mr-2">[{log.timestamp}]</span>
                    <span className="text-gray-400 mr-2">{log.type}:</span>
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
"use client";

import { forgotPassword, login } from "@/app/api/service/api";
import { ArrowLeft, School } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setMsg("");
    setLoading(true);

    try {
      const data = await login({ email, password });
    
      if (data && data.token && data.checkId.userID) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.checkId.userID);

        router.push(`/user/${data.checkId.userID}`);
      } else {
        setMsg("Login muvaffaqiyatsiz");
      }
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
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
      setMsg(err.message || "Email topilmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      router.push(`/user/${userId}`);
    }
  }, []);

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
              className={`w-full mb-4 p-3 rounded-input text-sm font-medium text-center ${
                msg.includes("yuborildi")
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
                className="w-full h-12 border border-border rounded-input px-4 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-all duration-200"
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parol"
                className="w-full h-12 border border-border rounded-input px-4 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-all duration-200"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-button text-base font-semibold text-primary-foreground transition-all duration-200 ${
                  loading
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
                className="w-full h-12 border border-border rounded-input px-4 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-all duration-200"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-button text-base font-semibold text-primary-foreground transition-all duration-200 ${
                  loading
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
    </section>
  );
};

export default Login;

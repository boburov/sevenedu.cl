"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isStrong = password.length >= 8;
  const isMatch = password === confirm;

  const handleSubmit = async () => {
    if (!isMatch) return setError("Parollar mos kelmadi");
    if (!isStrong) return setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
    if (!token) return setError("Token topilmadi");

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.sevenedu.store/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xatolik yuz berdi");
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 px-4">
        <div className="text-center">
          <p className="text-2xl">⚠️</p>
          <p className="mt-2 text-slate-600">Havola yaroqsiz yoki muddati tugagan.</p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Parol yangilandi!</h2>
          <p className="mt-2 text-sm text-slate-500">Kirish sahifasiga yo'naltirilmoqda...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-10 shadow-xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-slate-900">Yangi parol o'rnatish</h1>
        <p className="mt-2 text-sm text-slate-500">Yangi parolingizni kiriting.</p>

        <div className="mt-8 space-y-4">

          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Yangi parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 text-lg"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Strength indicator */}
          {password && (
            <div className="flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${isStrong ? "bg-green-400" : "bg-red-300"}`} />
              <span className={`text-xs ${isStrong ? "text-green-600" : "text-red-500"}`}>
                {isStrong ? "Kuchli parol ✓" : "Kamida 8 ta belgi"}
              </span>
            </div>
          )}

          {/* Confirm field */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Parolni tasdiqlang"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 pr-12 ${
                confirm && !isMatch
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 text-lg"
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>

          {confirm && !isMatch && (
            <p className="text-xs text-red-500">⚠️ Parollar mos kelmadi</p>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !isMatch || !isStrong}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60 hover:-translate-y-px hover:shadow-xl transition-all"
          >
            {loading ? "Saqlanmoqda..." : "Parolni saqlash"}
          </button>
        </div>
      </div>
    </main>
  );
}
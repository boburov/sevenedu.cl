"use client";
import { Suspense, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://api.sevenedu.store/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Xatolik yuz berdi");
            setSent(true);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 px-4">
                <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl">
                        📧
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Email yuborildi!</h2>
                    <p className="mt-3 text-sm text-slate-500">
                        <span className="font-medium text-violet-600">{email}</span> manziliga
                        parol tiklash havolasi yuborildi. Iltimos, emailingizni tekshiring.
                    </p>
                    <p className="mt-2 text-xs text-slate-400">Havola 30 daqiqa amal qiladi.</p>
                    <Link
                        href="/auth/login"
                        className="mt-8 flex h-11 items-center justify-center rounded-2xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                        Kirish sahifasiga qaytish
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <Suspense fallback={
            <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 to-fuchsia-50">
                <div className="text-slate-400 text-sm">Yuklanmoqda...</div>
            </main>
        }>
            <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 to-fuchsia-50 px-4">
                <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-10 shadow-xl backdrop-blur-xl">
                    <h1 className="text-2xl font-bold text-slate-900">Parolni unutdingizmi?</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Emailingizni kiriting, tiklash havolasini yuboramiz.
                    </p>

                    <div className="mt-8 space-y-4">
                        <input
                            type="email"
                            placeholder="Email manzilingiz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />

                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !email}
                            className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60 hover:-translate-y-px hover:shadow-xl transition-all"
                        >
                            {loading ? "Yuborilmoqda..." : "Havola yuborish"}
                        </button>

                        <Link
                            href="/auth/login"
                            className="flex justify-center text-sm text-slate-400 hover:text-violet-600"
                        >
                            ← Kirish sahifasiga qaytish
                        </Link>
                    </div>
                </div>
            </main>
        </Suspense>
    );
}
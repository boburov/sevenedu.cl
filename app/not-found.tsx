"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import { ArrowLeft, Home, RefreshCcw, Search, Sparkles } from "lucide-react";
import notFoundAnim from "./lottie/404 error page with cat.json";

export default function NotFound() {
    return (
        <main className="min-h-[100svh] bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-12 md:flex-row md:justify-between md:py-16">
                {/* Left: text */}
                <section className="w-full max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>404 • Sahifa topilmadi</span>
                    </div>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                        Bu sahifa yo‘qolib qolgan ko‘rinadi 🐾
                    </h1>

                    <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                        Havotir olmang — bu sizning aybingiz emas. Link noto‘g‘ri bo‘lishi
                        mumkin yoki sahifa ko‘chirilgan.
                    </p>

                    {/* Quick actions */}
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            href="/"
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            <Home className="h-4 w-4 transition group-hover:scale-110" />
                            Bosh sahifaga qaytish
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                            Orqaga
                        </button>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            <RefreshCcw className="h-4 w-4 transition group-hover:rotate-180" />
                            Qayta yuklash
                        </button>
                    </div>

                    {/* Search-ish hint */}
                    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100">
                                <Search className="h-5 w-5 text-slate-700" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    Tezkor maslahat
                                </p>
                                <p className="text-sm text-slate-600">
                                    URL-ni tekshirib ko‘ring yoki menyudan kerakli bo‘limni tanlang.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-xs text-slate-500">
                        Kod: <span className="font-mono">404_NOT_FOUND</span>
                    </p>
                </section>

                {/* Right: animation */}
                <section className="w-full max-w-xl">
                    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,23,42,0.06),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.08),transparent_50%)]" />
                        <div className="relative p-6 md:p-8">
                            <Lottie
                                animationData={notFoundAnim}
                                className="mx-auto w-full max-w-md"
                                loop
                            />
                            <div className="mt-2 text-center">
                                <p className="text-sm text-slate-600">
                                    Mushuk ham qidiryapti… topolmayapti 😅
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

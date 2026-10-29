"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import { ArrowLeft, Home, RefreshCcw, Search, Sparkles } from "lucide-react";
import notFoundAnim from "./lottie/404 error page with cat.json";

export default function NotFound() {
    // Ikkilamchi harakatlar — chegara bilan, fonsiz. Soya ishlatilmaydi.
    const secondaryAction =
        "focus-ring group inline-flex items-center justify-center gap-2 rounded-button border border-border bg-surface px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-surface-alt";

    return (
        <main className="relative min-h-[100svh] overflow-hidden bg-background">
            {/* Iliq gradient — ilovaning qolgan qismidagi bilan bir xil */}
            <div
                aria-hidden
                className="pointer-events-none fixed right-0 top-0 h-[520px] w-[720px] bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,26,0.07),transparent_65%)]"
            />

            <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-12 md:flex-row md:justify-between md:py-16">
                {/* Chap: matn */}
                <section className="w-full max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-3 py-1 text-sm text-text-secondary">
                        <Sparkles size={16} strokeWidth={1.75} className="text-accent" />
                        <span>404 &middot; Sahifa topilmadi</span>
                    </div>

                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
                        Bu sahifa yo&lsquo;qolib qolgan ko&lsquo;rinadi
                    </h1>

                    <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
                        Havotir olmang — bu sizning aybingiz emas. Havola noto&lsquo;g&lsquo;ri
                        bo&lsquo;lishi mumkin yoki sahifa ko&lsquo;chirilgan.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Asosiy harakat: qora — orange faqat urg'u uchun */}
                        <Link
                            href="/"
                            className="focus-ring group inline-flex items-center justify-center gap-2 rounded-button bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                        >
                            <Home
                                size={16}
                                strokeWidth={1.75}
                                className="transition-transform group-hover:scale-110"
                            />
                            Bosh sahifaga qaytish
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className={secondaryAction}
                        >
                            <ArrowLeft
                                size={16}
                                strokeWidth={1.75}
                                className="transition-transform group-hover:-translate-x-0.5"
                            />
                            Orqaga
                        </button>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className={secondaryAction}
                        >
                            <RefreshCcw
                                size={16}
                                strokeWidth={1.75}
                                className="transition-transform group-hover:rotate-180"
                            />
                            Qayta yuklash
                        </button>
                    </div>

                    <div className="mt-8 rounded-card border border-border bg-surface p-4">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-tile border border-border bg-surface-alt text-text-secondary">
                                <Search size={20} strokeWidth={1.75} />
                            </span>
                            <div>
                                <p className="text-sm font-medium text-text-primary">
                                    Tezkor maslahat
                                </p>
                                <p className="mt-1 text-sm text-text-secondary">
                                    Manzilni tekshirib ko&lsquo;ring yoki menyudan kerakli
                                    bo&lsquo;limni tanlang.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-xs text-text-muted">
                        Kod: <span className="font-mono">404_NOT_FOUND</span>
                    </p>
                </section>

                {/* O'ng: animatsiya */}
                <section className="w-full max-w-xl">
                    <div className="overflow-hidden rounded-card border border-border bg-surface">
                        <div className="p-6 md:p-8">
                            <Lottie
                                animationData={notFoundAnim}
                                className="mx-auto w-full max-w-md"
                                loop
                            />
                            <p className="mt-2 text-center text-sm text-text-secondary">
                                Mushuk ham qidiryapti… topolmayapti
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("https://api.sevenedu.org/auth/forgot-password", {
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

    // Kartochka: soya yo'q — chegara va fon bilan ajraladi.
    const cardClass =
        "w-full max-w-md rounded-card border border-border bg-surface p-10";

    if (sent) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className={`${cardClass} text-center`}>
                    <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent-strong">
                        <Mail size={28} strokeWidth={1.75} />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Email yuborildi!
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                        <span className="font-medium text-text-primary">{email}</span>{" "}
                        manziliga parol tiklash havolasi yuborildi. Iltimos, emailingizni
                        tekshiring.
                    </p>
                    <p className="mt-2 text-xs text-text-muted">
                        Havola 30 daqiqa amal qiladi.
                    </p>
                    <Link
                        href="/auth/login"
                        className="focus-ring mt-8 flex h-12 items-center justify-center rounded-button bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                    >
                        Kirish sahifasiga qaytish
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-background">
                    <p className="text-sm text-text-secondary">Yuklanmoqda...</p>
                </main>
            }
        >
            <main className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className={cardClass}>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Parolni unutdingizmi?
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Emailingizni kiriting, tiklash havolasini yuboramiz.
                    </p>

                    <div className="mt-8 space-y-4">
                        <input
                            type="email"
                            autoComplete="email"
                            placeholder="Email manzilingiz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="focus-ring h-12 w-full rounded-input border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary"
                        />

                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 rounded-input border border-danger/25 bg-danger-soft px-4 py-3"
                            >
                                <AlertCircle
                                    size={16}
                                    strokeWidth={2}
                                    className="mt-0.5 shrink-0 text-danger-strong"
                                />
                                <p className="text-sm text-danger-strong">{error}</p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || !email}
                            className="focus-ring h-12 w-full rounded-button bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Yuborilmoqda..." : "Havola yuborish"}
                        </button>

                        <Link
                            href="/auth/login"
                            className="focus-ring flex items-center justify-center gap-2 rounded text-sm text-text-secondary transition-colors hover:text-text-primary"
                        >
                            <ArrowLeft size={16} strokeWidth={1.75} />
                            Kirish sahifasiga qaytish
                        </Link>
                    </div>
                </div>
            </main>
        </Suspense>
    );
}

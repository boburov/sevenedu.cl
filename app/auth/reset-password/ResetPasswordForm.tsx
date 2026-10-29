"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Check, Eye, EyeClosed } from "lucide-react";

export default function ResetPasswordForm() {
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
            const res = await fetch("https://api.sevenedu.org/auth/reset-password", {
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

    // Kartochka: soya yo'q — chegara va fon bilan ajraladi.
    const cardClass =
        "w-full max-w-md rounded-card border border-border bg-surface p-10";

    // Parolni ko'rsatish tugmasi — maydon ichida, o'ng tomonda.
    const toggleClass =
        "focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded text-text-secondary transition-colors hover:text-text-primary";

    if (!token) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className={`${cardClass} text-center`}>
                    <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-danger-soft text-danger-strong">
                        <AlertCircle size={28} strokeWidth={1.75} />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Havola yaroqsiz
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                        Havola yaroqsiz yoki muddati tugagan. Parolni tiklashni qaytadan
                        boshlang.
                    </p>
                </div>
            </main>
        );
    }

    if (success) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className={`${cardClass} text-center`}>
                    <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
                        <Check size={28} strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Parol yangilandi!
                    </h1>
                    <p className="mt-3 text-sm text-text-secondary">
                        Kirish sahifasiga yo&apos;naltirilmoqda...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className={cardClass}>
                <h1 className="text-2xl font-bold text-text-primary">
                    Yangi parol o&apos;rnatish
                </h1>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Yangi parolingizni kiriting.
                </p>

                <div className="mt-8 space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Yangi parol"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="focus-ring h-12 w-full rounded-input border border-border bg-surface px-4 pr-12 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                            className={toggleClass}
                        >
                            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Parol kuchi ko'rsatkichi */}
                    {password && (
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-1.5 flex-1 rounded-full ${isStrong ? "bg-success" : "bg-border-strong"}`}
                            />
                            <span
                                className={`text-xs ${isStrong ? "text-success" : "text-text-secondary"}`}
                            >
                                {isStrong ? "Kuchli parol" : "Kamida 8 ta belgi"}
                            </span>
                        </div>
                    )}

                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Parolni tasdiqlang"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className={`focus-ring h-12 w-full rounded-input border bg-surface px-4 pr-12 text-sm text-text-primary placeholder:text-text-muted transition-colors ${
                                confirm && !isMatch
                                    ? "border-danger focus:border-danger"
                                    : "border-border focus:border-primary"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            aria-label={showConfirm ? "Parolni yashirish" : "Parolni ko'rsatish"}
                            className={toggleClass}
                        >
                            {showConfirm ? <EyeClosed size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {confirm && !isMatch && (
                        <p className="text-xs text-danger-strong">Parollar mos kelmadi</p>
                    )}

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
                        disabled={loading || !isMatch || !isStrong}
                        className="focus-ring h-12 w-full rounded-button bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Saqlanmoqda..." : "Parolni saqlash"}
                    </button>
                </div>
            </div>
        </main>
    );
}

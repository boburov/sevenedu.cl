"use client";

import { getLeaderboard } from "@/app/api/service/api";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type LeaderUser = {
    id: string;
    name?: string;
    surname?: string;
    profilePic?: string;
    coins: number;
    rank: number;
};

const PAGE_SIZE = 30;

const DEFAULT_BUCKET_URL =
    "https://sevenedu-bucket.s3.eu-north-1.amazonaws.com/images/";

function hasRealProfilePic(profilePic?: string) {
    if (!profilePic) return false;
    return !profilePic.startsWith(DEFAULT_BUCKET_URL);
}

function getInitial(name?: string, surname?: string) {
    const n = (name ?? "").trim();
    const s = (surname ?? "").trim();
    return (n[0] || s[0] || "?").toUpperCase();
}

function formatNumberWithCommas(num: number): string {
    return num.toLocaleString("en-US");
}

// O'rin raqami. Medal ranglari yo'q — top-3 vazn va o'lcham bilan
// ajraladi, "men" qatori esa dashboard'dagi kabi accent-strong bilan.
function rankStyle(rank: number, isMe: boolean) {
    if (isMe) return "text-[13px] font-bold text-accent-strong";
    if (rank <= 3) return "text-[13px] font-bold text-text-primary";
    return "text-xs font-semibold text-text-muted";
}

export default function Page() {
    const [users, setUsers] = useState<LeaderUser[]>([]);
    const [me, setMe] = useState<LeaderUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await getLeaderboard();
                setUsers(Array.isArray(res.leaderboard) ? res.leaderboard : []);
                setMe(res.currentUser ?? null);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

    const current = useMemo(() => {
        const safePage = Math.min(Math.max(page, 1), totalPages);
        const start = (safePage - 1) * PAGE_SIZE;
        return users.slice(start, start + PAGE_SIZE);
    }, [users, page, totalPages]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    return (
        <div className="page py-8 sm:py-10">
            <header className="mb-8 sm:mb-10">
                <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
                    Peshqadamlar paneli
                </h1>
                <p className="mt-2 text-[15px] text-text-secondary">
                    Page{" "}
                    <span className="font-semibold text-text-primary">{page}</span> /{" "}
                    {totalPages}
                </p>
            </header>

            {/* Joriy foydalanuvchining o'rni */}
            {me && (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-card border border-accent/40 bg-accent-soft px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-9 min-w-9 place-items-center rounded-full border border-accent/40 bg-surface px-2 text-sm font-bold text-accent-strong">
                            #{me.rank}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-text-primary">
                                Sizning o&apos;rningiz
                            </p>
                            <p className="truncate text-xs text-text-secondary">
                                {`${(me.name ?? "").trim()} ${(me.surname ?? "").trim()}`.trim() ||
                                    "Siz"}
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-primary">
                        {formatNumberWithCommas(me.coins ?? 0)}
                    </span>
                </div>
            )}

            <div className="overflow-hidden rounded-card border border-border bg-surface">
                <div className="grid grid-cols-[40px_1fr_auto] items-center gap-2 border-b border-border bg-surface-alt px-4 py-3">
                    <div className="text-sm font-semibold text-text-primary">Rank</div>
                    <div className="text-sm font-semibold text-text-primary">
                        Foydalanuvchilar
                    </div>
                    <div className="text-sm font-semibold text-text-primary">Tangalar</div>
                </div>

                {loading ? (
                    <div className="p-6 text-sm text-text-secondary">Yuklanmoqda...</div>
                ) : error ? (
                    <div className="p-6 text-sm text-danger">
                        Reytingni yuklab bo&apos;lmadi. Iltimos, qayta urinib ko&apos;ring.
                    </div>
                ) : current.length === 0 ? (
                    <div className="p-6 text-sm text-text-secondary">
                        Hozircha reyting bo&apos;sh.
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {current.map((u) => {
                            const rank = u.rank;
                            const isMe = !!me && me.id === u.id;
                            const fullName = `${(u.name ?? "").trim()} ${(u.surname ?? "").trim()}`.trim();

                            return (
                                <li
                                    key={u.id}
                                    className={`px-4 py-3 transition-colors ${isMe ? "bg-accent-soft" : "hover:bg-surface-alt/60"
                                        }`}
                                >
                                    <div className="grid grid-cols-[40px_1fr_auto] items-center gap-2">
                                        {/* Rank */}
                                        <span className={rankStyle(rank, isMe)}>{rank}</span>

                                        {/* User */}
                                        <div className="flex min-w-0 items-center gap-2">
                                            {hasRealProfilePic(u.profilePic) ? (
                                                <img
                                                    src={u.profilePic}
                                                    alt={fullName || "User"}
                                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <div
                                                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong"
                                                    aria-label="User avatar"
                                                >
                                                    {getInitial(u.name, u.surname)}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p
                                                    className={`truncate text-sm text-text-primary ${rank <= 3 ? "font-bold" : "font-semibold"
                                                        }`}
                                                >
                                                    {fullName || "Unnamed user"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Coins */}
                                        <div className="text-right">
                                            <span className="inline-flex items-center justify-end rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-semibold text-text-primary">
                                                {formatNumberWithCommas(u.coins ?? 0)}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Pagination */}
            {!loading && !error && users.length > 0 && (
                <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="focus-ring inline-flex items-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft size={16} strokeWidth={1.75} />
                        Prev
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
                            const start = Math.max(1, Math.min(page - 3, totalPages - 6));
                            const p = start + idx;
                            if (p > totalPages) return null;

                            const active = p === page;
                            return (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPage(p)}
                                    className={[
                                        "focus-ring h-9 w-9 rounded-button border text-sm font-semibold transition-colors",
                                        active
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-border bg-surface text-text-primary hover:bg-surface-alt",
                                    ].join(" ")}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        {totalPages > 7 && page < totalPages - 3 ? (
                            <span className="px-1 text-text-muted">…</span>
                        ) : null}
                        {totalPages > 7 ? (
                            <button
                                type="button"
                                onClick={() => setPage(totalPages)}
                                className={[
                                    "focus-ring h-9 w-9 rounded-button border text-sm font-semibold transition-colors",
                                    page === totalPages
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-surface text-text-primary hover:bg-surface-alt",
                                ].join(" ")}
                            >
                                {totalPages}
                            </button>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="focus-ring inline-flex items-center gap-2 rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                        <ChevronRight size={16} strokeWidth={1.75} />
                    </button>
                </div>
            )}
        </div>
    );
}

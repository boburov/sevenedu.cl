"use client";

import { getLeaderboard } from "@/app/api/service/api";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";

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

// deterministic gradient per user (same user => same colors)
function gradientClassFromId(id: string) {
    const gradients = [
        "from-fuchsia-500 to-indigo-500",
        "from-emerald-500 to-cyan-500",
        "from-orange-500 to-rose-500",
        "from-sky-500 to-violet-500",
        "from-lime-500 to-teal-500",
        "from-amber-500 to-pink-500",
        "from-blue-500 to-emerald-500",
        "from-purple-500 to-sky-500",
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return gradients[hash % gradients.length];
}

function formatNumberWithCommas(num: number): string {
    return num.toLocaleString("en-US");
}

// Top 3 uchun medal ranglari
function rankBadge(rank: number) {
    if (rank === 1) return "bg-amber-100 text-amber-700 border-amber-300";
    if (rank === 2) return "bg-slate-100 text-slate-600 border-slate-300";
    if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-surface-alt text-text-secondary border-border";
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
        <div className="container py-6">
            <div className="flex items-end justify-between gap-3 mb-4">
                <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Trophy className="text-primary" size={18} />
                    Peshqadamlar paneli
                </h1>

                <div className="text-xs text-text-muted">
                    Page{" "}
                    <span className="font-semibold text-text-primary">{page}</span> /{" "}
                    {totalPages}
                </div>
            </div>

            {/* Joriy foydalanuvchining o'rni */}
            {me && (
                <div className="mb-4 rounded-2xl border border-primary-soft bg-primary-soft/50 px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <span
                            className={`grid place-items-center h-9 min-w-9 px-2 rounded-full border text-sm font-bold ${rankBadge(
                                me.rank
                            )}`}
                        >
                            #{me.rank}
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                                Sizning o&apos;rningiz
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                                {`${(me.name ?? "").trim()} ${(me.surname ?? "").trim()}`.trim() ||
                                    "Siz"}
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-bold text-primary">
                        {formatNumberWithCommas(me.coins ?? 0)} 🪙
                    </span>
                </div>
            )}

            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-surface-alt grid grid-cols-[40px_1fr_auto] items-center gap-2">
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
                            const fullName = `${(u.name ?? "").trim()} ${(u.surname ?? "").trim()}`.trim();

                            return (
                                <li
                                    key={u.id}
                                    className="px-4 py-3 hover:bg-surface-alt/60 transition"
                                >
                                    <div className="grid grid-cols-[40px_1fr_auto] items-center gap-2">
                                        {/* Rank */}
                                        <span
                                            className={`grid place-items-center h-7 min-w-7 px-1.5 rounded-full border text-xs font-bold ${rankBadge(
                                                rank
                                            )}`}
                                        >
                                            {rank}
                                        </span>

                                        {/* User */}
                                        <div className="flex items-center gap-2 min-w-0">
                                            {hasRealProfilePic(u.profilePic) ? (
                                                <img
                                                    src={u.profilePic}
                                                    alt={fullName || "User"}
                                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-soft"
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <div
                                                    className={[
                                                        "h-10 w-10 rounded-full grid place-items-center text-white font-bold",
                                                        "bg-gradient-to-br",
                                                        gradientClassFromId(u.id),
                                                        "ring-2 ring-primary-soft",
                                                    ].join(" ")}
                                                    aria-label="User avatar"
                                                >
                                                    {getInitial(u.name, u.surname)}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-text-primary truncate">
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
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                        Prev
                    </button>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
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
                                        "h-9 w-9 rounded-xl border text-sm font-semibold transition",
                                        active
                                            ? "border-primary bg-primary text-white"
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
                                    "h-9 w-9 rounded-xl border text-sm font-semibold transition",
                                    page === totalPages
                                        ? "border-primary bg-primary text-white"
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
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

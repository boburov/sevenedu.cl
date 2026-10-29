"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "@/app/api/service/api";
import { ChevronLeft, ChevronRight, Mic, Square, Volume2 } from "lucide-react";

interface VocabularyItem {
    id: string;
    word: string;
    translated: string;
    lessonsId: string;
}

type LangKey = "ar" | "ru" | "en";

const LANGS: Record<LangKey, { tts: string; stt: string; label: string }> = {
    ar: { tts: "ar-SA", stt: "ar-SA", label: "Arabic" },
    ru: { tts: "ru-RU", stt: "ru-RU", label: "Russian" },
    en: { tts: "en-US", stt: "en-US", label: "English" },
};

function detectLang(text: string): LangKey {
    if (/[؀-ۿ]/.test(text)) return "ar";
    if (/[а-яА-ЯёЁ]/.test(text)) return "ru";
    return "en";
}

function normalizeForCompare(s: string) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[’']/g, "'")
        .replace(/[^\p{L}\p{N}\s']/gu, "") // keep letters/numbers/spaces/apostrophe
        .replace(/\s+/g, " ");
}

function levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(0)
    );

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] =
                str1[i - 1] === str2[j - 1]
                    ? dp[i - 1][j - 1]
                    : Math.min(
                        dp[i - 1][j - 1] + 1,
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1
                    );
        }
    }
    return dp[m][n];
}

function scoreSimilarity(spokenRaw: string, targetRaw: string) {
    const spoken = normalizeForCompare(spokenRaw);
    const target = normalizeForCompare(targetRaw);

    if (!spoken || !target) return 0;
    if (spoken === target) return 100;

    const distance = levenshteinDistance(spoken, target);
    const maxLength = Math.max(spoken.length, target.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;

    return Math.max(0, Math.min(100, Math.round(similarity)));
}

// Emoji ikonkalar olib tashlandi — matn o'z joyida qoldi.
function feedbackFor(score: number) {
    if (score >= 95) return { text: "Perfect! Juda zo'r!" };
    if (score >= 90) return { text: "Ajoyib! Juda to‘g‘ri!" };
    if (score >= 75) return { text: "Yaxshi! Biroz mashq qilsangiz bo‘ladi." };
    if (score >= 55) return { text: "Yaxshi urinish. Qayta urinib ko‘ring." };
    return { text: "Davom eting! Yana bir bor harakat qiling." };
}

function pickBestVoice(voices: SpeechSynthesisVoice[], lang: string) {
    // Prefer exact lang match, then same language prefix, then default
    const exact = voices.find((v) => v.lang === lang);
    if (exact) return exact;

    const prefix = lang.split("-")[0];
    const samePrefix = voices.find((v) => v.lang?.startsWith(prefix));
    if (samePrefix) return samePrefix;

    const def = voices.find((v) => (v as any).default);
    return def ?? voices[0] ?? null;
}

// Harakat tugmalari bir xil shaklda: pill, 1px chegara, fokus halqasi.
const ACTION_BASE =
    "focus-ring inline-flex items-center justify-center gap-2 rounded-button border px-7 py-4 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const NAV_BASE =
    "focus-ring inline-flex items-center gap-2 rounded-button border px-6 py-3 text-[15px] font-semibold transition-colors";

const SpeakingPage = () => {
    const params = useParams();
    const lessonId = params?.lessonId ? String(params.lessonId) : "";

    const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const [userTranscript, setUserTranscript] = useState("");
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [feedback, setFeedback] = useState("");

    const [ttsRate, setTtsRate] = useState(0.9);
    const [autoNext, setAutoNext] = useState(true);

    const recognitionRef = useRef<any>(null);
    const [voicesReady, setVoicesReady] = useState(false);

    const currentWord = vocabulary[currentIndex];

    const langKey = useMemo(() => detectLang(currentWord?.word || ""), [currentWord?.word]);
    const lang = LANGS[langKey];

    // Fetch vocabulary
    useEffect(() => {
        if (!lessonId) return;

        const fetchVocabulary = async () => {
            try {
                const res = await api.get(`/dictonary/lesson/${lessonId}`);
                setVocabulary(res.data || []);
            } catch (err) {
                console.error("Vocabulary fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVocabulary();
    }, [lessonId]);

    // Load voices reliably (Chrome needs voiceschanged)
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("speechSynthesis" in window)) return;

        const synth = window.speechSynthesis;

        const handle = () => {
            const v = synth.getVoices();
            if (v && v.length > 0) setVoicesReady(true);
        };

        handle();
        synth.addEventListener?.("voiceschanged", handle);

        return () => synth.removeEventListener?.("voiceschanged", handle);
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 3;

        rec.onresult = (event: any) => {
            // Some browsers provide multiple alternatives + confidence
            const best = event.results?.[0]?.[0];
            const transcript = best?.transcript ?? "";
            const nativeConfidence =
                typeof best?.confidence === "number" ? Math.round(best.confidence * 100) : null;

            setUserTranscript(transcript);

            const levScore = scoreSimilarity(transcript, currentWord?.word || "");
            // Blend recognition confidence slightly if available (tiny boost, not huge)
            const blended =
                nativeConfidence === null
                    ? levScore
                    : Math.round(levScore * 0.85 + nativeConfidence * 0.15);

            setAccuracy(blended);

            const f = feedbackFor(blended);
            setFeedback(f.text);

            setIsListening(false);

            // Auto-next if strong result
            if (autoNext && blended >= 90) {
                setTimeout(() => {
                    goToNext();
                }, 650);
            }
        };

        rec.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);

            const msg =
                event.error === "not-allowed"
                    ? "Mikrofon ruxsati berilmagan. Brauzer sozlamasidan ruxsat bering."
                    : "Xatolik yuz berdi. Qaytadan urinib ko‘ring.";
            setFeedback(msg);
        };

        rec.onend = () => setIsListening(false);

        recognitionRef.current = rec;

        return () => {
            try {
                rec.abort();
            } catch { }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWord?.word, autoNext]);

    const resetState = () => {
        setUserTranscript("");
        setAccuracy(null);
        setFeedback("");
        setIsListening(false);
    };

    const goToNext = () => {
        if (currentIndex < vocabulary.length - 1) {
            setCurrentIndex((i) => i + 1);
            resetState();
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((i) => i - 1);
            resetState();
        }
    };

    const stopSpeaking = () => {
        if (typeof window === "undefined") return;
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const speakWord = (text: string) => {
        if (typeof window === "undefined") return;

        if (!("speechSynthesis" in window)) {
            alert("Sizning brauzeringiz ovozli o‘qishni qo‘llab-quvvatlamaydi.");
            return;
        }

        // cancel ongoing speech to avoid stacking
        stopSpeaking();

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang.tts;
        utter.rate = ttsRate;
        utter.pitch = 1;
        utter.volume = 1;

        const voices = window.speechSynthesis.getVoices();
        const best = pickBestVoice(voices, utter.lang);
        if (best) utter.voice = best;

        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utter);
    };

    const startListening = () => {
        const rec = recognitionRef.current;
        if (!rec) {
            alert("Sizning brauzeringiz ovozni tanishni qo‘llab-quvvatlamaydi.");
            return;
        }

        // Stop speaking to avoid feedback loops
        stopSpeaking();

        setUserTranscript("");
        setAccuracy(null);
        setFeedback("");
        setIsListening(true);

        rec.lang = lang.stt;

        try {
            rec.start();
        } catch (e) {
            // Some browsers throw if start is called twice quickly
            setIsListening(false);
        }
    };

    // Keyboard shortcuts (Space = listen, Enter = speak, arrows = nav)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!currentWord) return;

            if (e.key === " " && !e.repeat) {
                e.preventDefault();
                if (!isListening) startListening();
            }
            if (e.key === "Enter" && !e.repeat) {
                e.preventDefault();
                speakWord(currentWord.word);
            }
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "Escape") stopSpeaking();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWord?.word, isListening]);

    const progress = vocabulary.length
        ? Math.round(((currentIndex + 1) / vocabulary.length) * 100)
        : 0;

    // To'g'rilik darajasi — haqiqiy natija, shuning uchun status tokenlari.
    // Eski sariq (70-89) va orange (50-69) bandlari bitta `warning` ga
    // birlashtirildi: tizimda bitta warning bor, orange esa urg'u rangi va
    // statusga ishlatilmaydi. 90 va 50 chegaralari o'zgarmadi.
    const scoreColor =
        accuracy === null
            ? "bg-border"
            : accuracy >= 90
                ? "bg-success"
                : accuracy >= 50
                    ? "bg-warning"
                    : "bg-danger";

    if (loading) {
        return (
            <div className="container py-10">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
                        <p className="text-[15px] text-text-secondary">Yuklanmoqda...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (vocabulary.length === 0) {
        return (
            <div className="container py-8 sm:py-10">
                <div className="mx-auto max-w-md rounded-card border border-border bg-surface p-10 text-center">
                    <h2 className="text-lg font-semibold text-text-primary">
                        Lug‘at topilmadi.
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary">
                        Ushbu dars uchun so‘zlar hali qo‘shilmagan bo‘lishi mumkin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 sm:py-10">
            <div className="mx-auto max-w-5xl">
                {/* Sahifa sarlavhasi — barcha sahifalarda bir xil qolip */}
                <header className="mb-8 sm:mb-10">
                    <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
                        Talaffuz Mashqi
                    </h1>
                    <p className="mt-2 text-[15px] text-text-secondary">
                        Tinglang → ayting → natijani ko‘ring.{" "}
                        <span className="text-text-muted">
                            (Enter = tinglash, Space = aytish)
                        </span>
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Badge>
                            {lang.label} • {lang.tts}
                        </Badge>
                        <Badge>
                            {currentIndex + 1}/{vocabulary.length}
                        </Badge>
                    </div>
                </header>

                {/* Progress + sozlamalar */}
                <div className="rounded-card border border-border bg-surface p-6">
                    <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-text-secondary">
                            <span>Progress</span>
                            <span className="font-semibold text-text-primary">{progress}%</span>
                        </div>
                        {/* Joriy holat indikatori → accent */}
                        <div className="h-2 w-full rounded-full bg-border">
                            <div
                                className="h-2 rounded-full bg-accent transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-card border border-border bg-surface p-4">
                            <div className="mb-2 text-xs text-text-muted">Speaker speed</div>
                            <div className="flex items-center gap-2">
                                {/* Ovoz boshqaruvi = asosiy harakat → tanlangani qora */}
                                <button
                                    className={`focus-ring rounded-button border px-3 py-2 text-sm font-semibold transition-colors ${ttsRate <= 0.85
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-surface text-text-primary hover:border-border-strong"
                                        }`}
                                    onClick={() => setTtsRate(0.8)}
                                >
                                    Slow
                                </button>
                                <button
                                    className={`focus-ring rounded-button border px-3 py-2 text-sm font-semibold transition-colors ${ttsRate > 0.85
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-surface text-text-primary hover:border-border-strong"
                                        }`}
                                    onClick={() => setTtsRate(0.95)}
                                >
                                    Normal
                                </button>
                                <div className="ml-auto text-xs text-text-muted">
                                    {voicesReady ? "Voices ready" : "Loading voices…"}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-card border border-border bg-surface p-4">
                            <div className="mb-2 text-xs text-text-muted">Auto-next on 90%+</div>
                            {/* Yoqilgan holat (status emas) → accent */}
                            <button
                                onClick={() => setAutoNext((v) => !v)}
                                aria-pressed={autoNext}
                                className={`focus-ring w-full rounded-button border px-4 py-2 font-semibold transition-colors ${autoNext
                                    ? "border-accent bg-accent text-accent-foreground"
                                    : "border-border bg-surface text-text-primary hover:border-border-strong"
                                    }`}
                            >
                                {autoNext ? "ON" : "OFF"}
                            </button>
                        </div>

                        <div className="rounded-card border border-border bg-surface p-4">
                            <div className="mb-2 text-xs text-text-muted">Tips</div>
                            <p className="text-sm text-text-secondary">
                                Mikrofon yaqinroq. Sekinroq ayting. Agar so‘z uzun bo‘lsa, bo‘lib
                                ayting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main card */}
                <div className="mt-6 rounded-card border border-border bg-surface p-6 md:p-10">
                    {/* Word */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-4 py-2 text-sm text-text-secondary">
                            {/* TTS o'qiyotgani — faol indikator → accent */}
                            <span
                                className={`h-2 w-2 rounded-full ${isSpeaking ? "bg-accent" : "bg-border-strong"
                                    }`}
                            />
                            {isSpeaking ? "Speaking…" : "Ready"}
                            <span className="mx-1 text-text-muted">•</span>
                            {/* Mikrofon yozib olmoqda → danger */}
                            <span
                                className={`h-2 w-2 rounded-full ${isListening ? "bg-danger" : "bg-border-strong"
                                    }`}
                            />
                            {isListening ? "Listening…" : "Mic idle"}
                        </div>

                        <h2 className="mt-6 text-5xl font-bold tracking-tight text-text-primary md:text-6xl">
                            {currentWord?.word}
                        </h2>
                        <p className="mt-3 text-xl text-text-secondary md:text-2xl">
                            {currentWord?.translated}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-col justify-center gap-3 md:flex-row">
                        {/* Audio boshqaruvi = asosiy harakat → qora */}
                        <button
                            onClick={() => speakWord(currentWord?.word || "")}
                            disabled={!currentWord?.word}
                            className={`${ACTION_BASE} border-primary bg-primary text-primary-foreground hover:bg-primary-hover`}
                        >
                            <Volume2 size={20} strokeWidth={1.75} />
                            Tinglash <span className="text-sm opacity-70">(Enter)</span>
                        </button>

                        {/* Yozib olish: boshlash → accent, yozilmoqda → danger */}
                        <button
                            onClick={startListening}
                            disabled={isListening}
                            className={`${ACTION_BASE} ${isListening
                                ? "border-danger bg-danger text-white"
                                : "border-accent bg-accent text-accent-foreground hover:bg-accent-hover"
                                }`}
                        >
                            <Mic size={20} strokeWidth={1.75} />
                            {isListening ? "Tinglanmoqda…" : "Aytish"}{" "}
                            <span className="text-sm opacity-70">(Space)</span>
                        </button>

                        <button
                            onClick={stopSpeaking}
                            className={`${ACTION_BASE} border-border bg-surface text-text-primary hover:bg-surface-alt`}
                        >
                            <Square size={20} strokeWidth={1.75} />
                            Stop
                            <span className="text-sm opacity-70">(Esc)</span>
                        </button>
                    </div>

                    {/* Results */}
                    {(userTranscript || accuracy !== null || feedback) && (
                        <div className="mt-10 rounded-card border border-border bg-surface-alt p-6">
                            {userTranscript && (
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-text-muted">
                                        Siz aytdingiz
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-text-primary">
                                        {userTranscript}
                                    </div>
                                </div>
                            )}

                            {accuracy !== null && (
                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="text-sm font-medium text-text-secondary">
                                            To‘g‘rilik darajasi
                                        </div>
                                        <div className="text-2xl font-bold text-text-primary">
                                            {accuracy}%
                                        </div>
                                    </div>
                                    <div className="h-3 w-full rounded-full bg-border">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${scoreColor}`}
                                            style={{ width: `${accuracy}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {feedback && (
                                <div className="mt-5 rounded-card border border-border bg-surface p-4">
                                    <p className="text-center text-base font-semibold text-text-primary md:text-lg">
                                        {feedback}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="mt-6 flex justify-between gap-4">
                    <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className={`${NAV_BASE} ${currentIndex === 0
                            ? "cursor-not-allowed border-border bg-surface-alt text-text-muted"
                            : "border-border bg-surface text-text-primary hover:border-border-strong"
                            }`}
                    >
                        <ChevronLeft size={20} strokeWidth={1.75} />
                        Oldingi
                    </button>

                    <button
                        onClick={goToNext}
                        disabled={currentIndex === vocabulary.length - 1}
                        className={`${NAV_BASE} ${currentIndex === vocabulary.length - 1
                            ? "cursor-not-allowed border-border bg-surface-alt text-text-muted"
                            : "border-border bg-surface text-text-primary hover:border-border-strong"
                            }`}
                    >
                        Keyingi
                        <ChevronRight size={20} strokeWidth={1.75} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-alt px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
        {children}
    </span>
);

export default SpeakingPage;

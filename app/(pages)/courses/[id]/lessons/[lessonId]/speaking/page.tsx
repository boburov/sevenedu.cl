"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "@/app/api/service/api";

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
    if (/[\u0600-\u06FF]/.test(text)) return "ar";
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

function feedbackFor(score: number) {
    if (score >= 95) return { emoji: "🏆", text: "Perfect! Juda zo'r!" };
    if (score >= 90) return { emoji: "🎉", text: "Ajoyib! Juda to‘g‘ri!" };
    if (score >= 75) return { emoji: "👍", text: "Yaxshi! Biroz mashq qilsangiz bo‘ladi." };
    if (score >= 55) return { emoji: "📖", text: "Yaxshi urinish. Qayta urinib ko‘ring." };
    return { emoji: "💪", text: "Davom eting! Yana bir bor harakat qiling." };
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
            setFeedback(`${f.emoji} ${f.text}`);

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
            setFeedback(`⚠️ ${msg}`);
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

    const scoreColor =
        accuracy === null
            ? "bg-gray-200"
            : accuracy >= 90
                ? "bg-green-500"
                : accuracy >= 70
                    ? "bg-yellow-500"
                    : accuracy >= 50
                        ? "bg-orange-500"
                        : "bg-red-500";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-700">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (vocabulary.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
                    <p className="text-2xl text-gray-800 font-semibold">Lug‘at topilmadi.</p>
                    <p className="text-gray-600 mt-2">Ushbu dars uchun so‘zlar hali qo‘shilmagan bo‘lishi mumkin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Top header */}
                <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-white p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                    🎤
                                </span>
                                Talaffuz Mashqi
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Tinglang → ayting → natijani ko‘ring.{" "}
                                <span className="text-gray-500">(Enter = tinglash, Space = aytish)</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                                {lang.label} • {lang.tts}
                            </span>
                            <span className="text-sm text-gray-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                                {currentIndex + 1}/{vocabulary.length}
                            </span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span className="font-semibold text-gray-800">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                            <div className="text-xs text-gray-500 mb-2">Speaker speed</div>
                            <div className="flex items-center gap-2">
                                <button
                                    className={`px-3 py-2 rounded-xl border text-sm font-semibold ${ttsRate <= 0.85 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-800 border-slate-200"
                                        }`}
                                    onClick={() => setTtsRate(0.8)}
                                >
                                    Slow
                                </button>
                                <button
                                    className={`px-3 py-2 rounded-xl border text-sm font-semibold ${ttsRate > 0.85 ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-800 border-slate-200"
                                        }`}
                                    onClick={() => setTtsRate(0.95)}
                                >
                                    Normal
                                </button>
                                <div className="ml-auto text-xs text-gray-500">
                                    {voicesReady ? "Voices ready ✅" : "Loading voices…"}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                            <div className="text-xs text-gray-500 mb-2">Auto-next on 90%+</div>
                            <button
                                onClick={() => setAutoNext((v) => !v)}
                                className={`w-full px-4 py-2 rounded-xl font-semibold border transition ${autoNext ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-800 border-slate-200"
                                    }`}
                            >
                                {autoNext ? "ON" : "OFF"}
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                            <div className="text-xs text-gray-500 mb-2">Tips</div>
                            <p className="text-sm text-gray-700">
                                Mikrofon yaqinroq. Sekinroq ayting. Agar so‘z uzun bo‘lsa, bo‘lib ayting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white p-7 md:p-10">
                    {/* Word */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-sm text-gray-700">
                            <span className={`h-2 w-2 rounded-full ${isSpeaking ? "bg-indigo-600 animate-pulse" : "bg-slate-400"}`} />
                            {isSpeaking ? "Speaking…" : "Ready"}
                            <span className="mx-1 text-gray-400">•</span>
                            <span className={`h-2 w-2 rounded-full ${isListening ? "bg-green-600 animate-pulse" : "bg-slate-400"}`} />
                            {isListening ? "Listening…" : "Mic idle"}
                        </div>

                        <h2 className="mt-6 text-5xl md:text-6xl font-black tracking-tight text-gray-900">
                            {currentWord?.word}
                        </h2>
                        <p className="mt-3 text-xl md:text-2xl text-gray-600">
                            {currentWord?.translated}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-col md:flex-row gap-3 justify-center">
                        <button
                            onClick={() => speakWord(currentWord?.word || "")}
                            disabled={!currentWord?.word}
                            className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-7 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition"
                        >
                            <span className="text-xl">🔊</span>
                            Tinglash <span className="opacity-70 text-sm">(Enter)</span>
                        </button>

                        <button
                            onClick={startListening}
                            disabled={isListening}
                            className={`group flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition ${isListening
                                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                        >
                            <span className="text-xl">🎙️</span>
                            {isListening ? "Tinglanmoqda…" : "Aytish"}{" "}
                            <span className="opacity-70 text-sm">(Space)</span>
                        </button>

                        <button
                            onClick={stopSpeaking}
                            className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-gray-800 shadow-sm transition"
                        >
                            <span className="text-xl">⏹️</span> Stop
                            <span className="opacity-70 text-sm">(Esc)</span>
                        </button>
                    </div>

                    {/* Results */}
                    {(userTranscript || accuracy !== null || feedback) && (
                        <div className="mt-10 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                            {userTranscript && (
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-gray-500">Siz aytdingiz</div>
                                    <div className="mt-1 text-2xl font-bold text-gray-900">{userTranscript}</div>
                                </div>
                            )}

                            {accuracy !== null && (
                                <div className="mt-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-medium text-gray-700">To‘g‘rilik darajasi</div>
                                        <div className="text-2xl font-black text-indigo-700">{accuracy}%</div>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${scoreColor}`}
                                            style={{ width: `${accuracy}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {feedback && (
                                <div className="mt-5 bg-white rounded-xl border border-indigo-100 p-4">
                                    <p className="text-base md:text-lg text-gray-800 text-center font-semibold">
                                        {feedback}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="mt-6 flex gap-4 justify-between">
                    <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className={`px-6 py-3 rounded-2xl font-semibold shadow-sm transition ${currentIndex === 0
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-white text-gray-800 hover:bg-slate-50 border border-slate-200"
                            }`}
                    >
                        ← Oldingi
                    </button>

                    <button
                        onClick={goToNext}
                        disabled={currentIndex === vocabulary.length - 1}
                        className={`px-6 py-3 rounded-2xl font-semibold shadow-sm transition ${currentIndex === vocabulary.length - 1
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-white text-gray-800 hover:bg-slate-50 border border-slate-200"
                            }`}
                    >
                        Keyingi →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpeakingPage;

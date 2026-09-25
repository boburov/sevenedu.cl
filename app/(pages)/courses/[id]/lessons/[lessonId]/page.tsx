"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Languages, ListChecks, MessageCircleQuestion, Mic } from "lucide-react";
import Link from "next/link";

import xitoy_tili from "@/app/jsons/xitoy.json";
import koreys_tili from "@/app/jsons/koreys.json";
import rus_tili from "@/app/jsons/rus.json";
import arab_tili from "@/app/jsons/arab.json";
import nemis_tili from "@/app/jsons/nemis.json";
import turk_tili from "@/app/jsons/turk.json";

const XITOY_ID = "c7fe73bc-e878-4897-8509-d5b21777cfb5";
const RUS_ID = "a06d565b-1d61-4564-af5d-1ceb4cfb3f6b";
const KOREYS_ID = "91b5c1b3-4c3e-4347-ad75-19869b3c6f66";
const ARAB_ID = "818e97e4-8b6b-481a-99ed-547ee53ba3eb";
const NEMIS_TILI = "16c43a51-8c65-4a29-995c-f2e8ab0d6073";
const TURK_TILI = "4154be26-c57d-4c2a-bce5-03205dedb8f7";

type JsonVideo = {
  key?: string;
  url?: string; // Vimeo URL: "https://vimeo.com/1234567890"
};

type JsonCourse = {
  videos?: JsonVideo[];
};

const jsonOverrides: Record<string, JsonCourse> = {
  [XITOY_ID]: xitoy_tili as JsonCourse,
  [RUS_ID]: rus_tili as JsonCourse,
  [KOREYS_ID]: koreys_tili as JsonCourse,
  [ARAB_ID]: arab_tili as JsonCourse,
  [NEMIS_TILI]: nemis_tili as JsonCourse,
  [TURK_TILI]: turk_tili as JsonCourse,
};

type VimeoRef = { id: string; hash?: string };

/**
 * Har qanday Vimeo manbasidan ("https://vimeo.com/1174582208",
 * unlisted "https://vimeo.com/1174582208/abc123def0", "vimeo:1174582208",
 * yoki shunchaki "1174582208") Vimeo ID va (bo'lsa) maxfiy hash'ni ajratadi.
 * Admin paneldan yuklangan videolar unlisted — ular pleyerda faqat hash bilan ochiladi.
 */
function toVimeoRef(input?: string): VimeoRef | null {
  if (!input) return null;

  const value = input.trim();
  const raw = value.startsWith("vimeo:") ? value.slice("vimeo:".length) : value;
  const m = raw.match(/(?:^|\/)(\d+)(?:\/([0-9a-f]+))?\/?(?:[?#]|$)/i);
  if (!m) return null;

  const h = raw.match(/[?&]h=([0-9a-f]+)/i)?.[1];
  return { id: m[1], hash: m[2] || h };
}

/**
 * Endi barcha kurslar videolari Vimeodan keladi.
 *   1. Avval JSON fayldan Vimeo URL qidiriladi (mavjud bo'lsa — ishlatiladi)
 *   2. JSON da topilmasa — backenddan kelgan videoUrl Vimeo sifatida ishlatiladi
 */
function resolveVimeo(params: {
  categoryId: string;
  lessonIndex: number;
  backendVideoUrl?: string;
}): VimeoRef | null {
  const { categoryId, lessonIndex, backendVideoUrl } = params;

  const jsonUrl = jsonOverrides[categoryId]?.videos?.[lessonIndex]?.url;
  const fromJson = toVimeoRef(jsonUrl);
  if (fromJson) return fromJson;

  return toVimeoRef(backendVideoUrl);
}

const Page = () => {
  const params = useParams();
  const lessonId = String(params.lessonId);
  const category_id = String(params.id);

  const [vimeo, setVimeo] = useState<VimeoRef | null>(null);

  useEffect(() => {
    let cancelled = false;

    api.get("courses/all").then((res) => {
      if (cancelled) return;

      const category = res.data.find((c: any) => c.id === category_id);
      if (!category?.lessons) return;

      const lessonIndex = category.lessons.findIndex((l: any) => l.id === lessonId);
      if (lessonIndex < 0) return;

      const lesson = category.lessons[lessonIndex];

      const ref = resolveVimeo({
        categoryId: category_id,
        lessonIndex,
        backendVideoUrl: lesson?.videoUrl,
      });

      if (ref) setVimeo(ref);
    });

    return () => { cancelled = true; };
  }, [lessonId, category_id]);

  const vimeoSrc = vimeo
    ? `https://player.vimeo.com/video/${vimeo.id}?${vimeo.hash ? `h=${vimeo.hash}&` : ""}sharing=0&byline=0&title=0&portrait=0`
    : "";

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-6 space-y-6">

      {/* Video */}
      <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
          {!vimeo ? (
            <div className="absolute inset-0 grid place-items-center bg-black">
              <span className="text-sm text-white/50">Video yuklanmoqda…</span>
            </div>
          ) : (
            <iframe
              src={vimeoSrc}
              frameBorder="0"
              allow="autoplay; fullscreen; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="Vimeo video"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Lesson tools</h2>
          <span className="text-xs text-text-muted">Practice</span>
        </div>

        <Link href={`${lessonId}/vocabulary`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0"><Languages size={22} strokeWidth={1.5} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Lug'at</div>
            <div className="mt-0.5 text-xs text-text-secondary">Yangi so'zlarni yodlang</div>
          </div>
          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">Kirish →</span>
        </Link>

        <Link href={`${lessonId}/test`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0"><ListChecks size={22} strokeWidth={1.5} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Test</div>
            <div className="mt-0.5 text-xs text-text-secondary">Bilimingizni tekshiring</div>
          </div>
          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">Kirish →</span>
        </Link>

        <Link href={`${lessonId}/quiz`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0"><MessageCircleQuestion size={22} strokeWidth={1.5} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Savollar</div>
            <div className="mt-0.5 text-xs text-text-secondary">Qayta ko'rib chiqing</div>
          </div>
          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">Kirish →</span>
        </Link>

        <Link href={`${lessonId}/speaking`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0"><Mic size={22} strokeWidth={1.5} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Talafuzz</div>
            <div className="mt-0.5 text-xs text-text-secondary">Talafuzingizni tekshiring</div>
          </div>
          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">Kirish →</span>
        </Link>

        <Link href={`${lessonId}/ask-for-ai`} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0"><MessageCircleQuestion size={22} strokeWidth={1.5} /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Ustozdan so'rash</div>
            <div className="mt-0.5 text-xs text-text-secondary">Savol yuboring</div>
          </div>
          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">Kirish →</span>
        </Link>
      </div>
    </div>
  );
};

export default Page;
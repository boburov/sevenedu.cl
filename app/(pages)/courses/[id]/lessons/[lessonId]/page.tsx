"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const SPECIAL_ID = "a06d565b-1d61-4564-af5d-1ceb4cfb3f6b";
const SECOND_SPECIAL_ID = "a86c8621-b83a-4481-ac66-4176f067ca18";
const THIRD_SPECIAL_ID = "16c43a51-8c65-4a29-995c-f2e8ab0d6073";

type JsonVideo = {
  key: string;
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

/** "https://vimeo.com/1174582208" → "1174582208" */
function extractVimeoId(url: string): string {
  return url.split("/").pop() ?? "";
}

function getJsonVideoUrlByLessonNumber(categoryId: string, lessonNumber: number): string {
  const course = jsonOverrides[categoryId];
  const item = course?.videos?.[lessonNumber - 1];
  if (!item) return "";

  if (item.url) {
    const vimeoId = extractVimeoId(item.url);
    return vimeoId ? `vimeo:${vimeoId}` : "";
  }

  if (!item.key) return "";
  return `https://sevenedu-bucet.s3.eu-north-1.amazonaws.com/${encodeURIComponent(item.key)}`;
}

function getCorrectVideoUrl(url: string, categoryId: string, lessonIndex?: number): string {
  if (!url) return "";

  const filename = url.split("/").pop() || "";
  const cleanedFilename = filename.replace(/^\d{13}-/, "");
  if (!cleanedFilename) return url;

  const lessonNumber = lessonIndex !== undefined ? lessonIndex + 1 : undefined;

  if (
    (categoryId === SPECIAL_ID && lessonNumber && lessonNumber > 25) ||
    (categoryId === THIRD_SPECIAL_ID && lessonNumber && lessonNumber > 32) ||
    categoryId === SECOND_SPECIAL_ID
  ) {
    return `https://s3.eu-north-1.amazonaws.com/seven.edu/videos/${cleanedFilename}`;
  }

  return `https://sevenedu-s3.s3.eu-north-1.amazonaws.com/videos/${cleanedFilename}`;
}

/**
 * Ingliz tili kurslari jsonOverrides ro'yxatida yo'q.
 * Qolgan barcha kurslar (rus, xitoy, koreys, arab, nemis, turk) uchun:
 *   1. Avval JSON fayldan URL qidiriladi (mavjud bo'lsa — ishlatiladi)
 *   2. JSON da topilmasa — backenddan kelgan videoUrl ni Vimeo sifatida ishlatadi
 * Ingliz tili kurslari uchun: S3 URL qaytaradi (avvalgi mantiq)
 */
function resolveVideoUrl(params: {
  categoryId: string;
  lessonIndex: number;
  backendVideoUrl?: string;
}): string {
  const { categoryId, lessonIndex, backendVideoUrl } = params;

  const isJsonCourse = categoryId in jsonOverrides;

  if (isJsonCourse) {
    // 1. JSON fayldan URL qidiramiz
    const jsonUrl = getJsonVideoUrlByLessonNumber(categoryId, lessonIndex + 1);
    if (jsonUrl) return jsonUrl;

    // 2. JSON da topilmasa — backenddan kelgan URL ni Vimeo sifatida ishlatamiz
    if (backendVideoUrl) {
      // Agar to'liq Vimeo URL kelsa (https://vimeo.com/...) — ID ni ajratamiz
      if (backendVideoUrl.includes("vimeo.com/")) {
        const vimeoId = extractVimeoId(backendVideoUrl);
        return vimeoId ? `vimeo:${vimeoId}` : "";
      }
      // Agar faqat Vimeo ID raqam sifatida kelgan bo'lsa
      if (/^\d+$/.test(backendVideoUrl.trim())) {
        return `vimeo:${backendVideoUrl.trim()}`;
      }
      // Boshqa format — xuddi shunday Vimeo ID sifatida urinib ko'ramiz
      const extracted = extractVimeoId(backendVideoUrl);
      if (extracted && /^\d+$/.test(extracted)) {
        return `vimeo:${extracted}`;
      }
    }

    return "";
  }

  // Ingliz tili va boshqa S3 kurslar — avvalgi mantiq
  if (backendVideoUrl) return getCorrectVideoUrl(backendVideoUrl, categoryId, lessonIndex);

  return "";
}

const Page = () => {
  const params = useParams();
  const lessonId = String(params.lessonId);
  const category_id = String(params.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cleanedVideoUrl, setCleanedVideoUrl] = useState("");

  useEffect(() => {
    let cancelled = false;

    api.get("courses/all").then((res) => {
      if (cancelled) return;

      const category = res.data.find((c: any) => c.id === category_id);
      if (!category?.lessons) return;

      const lessonIndex = category.lessons.findIndex((l: any) => l.id === lessonId);
      if (lessonIndex < 0) return;

      const lesson = category.lessons[lessonIndex];

      const finalUrl = resolveVideoUrl({
        categoryId: category_id,
        lessonIndex,
        backendVideoUrl: lesson?.videoUrl,
      });

      if (finalUrl) setCleanedVideoUrl(finalUrl);
    });

    return () => { cancelled = true; };
  }, [lessonId, category_id]);

  const isVimeo = cleanedVideoUrl.startsWith("vimeo:");
  const vimeoId = isVimeo ? cleanedVideoUrl.replace("vimeo:", "") : "";

  const vimeoSrc = vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`
    : "";

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-6 space-y-6 bg-background">

      {/* Video */}
      <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
          {!cleanedVideoUrl ? (
            <div className="absolute inset-0 grid place-items-center bg-black">
              <span className="text-sm text-white/50">Video yuklanmoqda…</span>
            </div>
          ) : isVimeo ? (
            <iframe
              src={vimeoSrc}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="Vimeo video"
            />
          ) : (
            <video
              ref={videoRef}
              src={cleanedVideoUrl}
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              className="object-contain bg-black"
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
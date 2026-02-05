"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Languages, ListChecks, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

import xitoy_tili from "@/app/jsons/xitoy.json";
import koreys_tili from "@/app/jsons/koreys.json";
import rus_tili from "@/app/jsons/rus.json";
import arab_tili from "@/app/jsons/arab.json"
import nemis_tili from "@/app/jsons/nemis.json"
import turk_tili from "@/app/jsons/turk.json"

const XITOY_ID = "c7fe73bc-e878-4897-8509-d5b21777cfb5";
const RUS_ID = "a06d565b-1d61-4564-af5d-1ceb4cfb3f6b";
const KOREYS_ID = "91b5c1b3-4c3e-4347-ad75-19869b3c6f66";
const ARAB_ID = "818e97e4-8b6b-481a-99ed-547ee53ba3eb";
const NEMIS_TILI = "16c43a51-8c65-4a29-995c-f2e8ab0d6073"
const TURK_TILI = "4154be26-c57d-4c2a-bce5-03205dedb8f7"

const SPECIAL_ID = "a06d565b-1d61-4564-af5d-1ceb4cfb3f6b";
const SECOND_SPECIAL_ID = "a86c8621-b83a-4481-ac66-4176f067ca18";
const THIRD_SPECIAL_ID = "16c43a51-8c65-4a29-995c-f2e8ab0d6073";

type JsonCourse = {
  videos?: { key: string }[];
};

const jsonOverrides: Record<string, JsonCourse> = {
  [XITOY_ID]: xitoy_tili as JsonCourse,
  [RUS_ID]: rus_tili as JsonCourse,
  [KOREYS_ID]: koreys_tili as JsonCourse,
  [ARAB_ID]: arab_tili as JsonCourse,
  [NEMIS_TILI]: nemis_tili as JsonCourse,
  [TURK_TILI]: turk_tili as JsonCourse

};

function getJsonVideoUrlByLessonNumber(categoryId: string, lessonNumber: number) {
  const course = jsonOverrides[categoryId];
  const item = course?.videos?.[lessonNumber - 1];
  if (!item?.key) return "";

  return `https://sevenedu-bucet.s3.eu-north-1.amazonaws.com/${encodeURIComponent(
    item.key
  )}`;
}

function getCorrectVideoUrl(url: string, categoryId: string, lessonIndex?: number) {
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

function resolveVideoUrl(params: {
  categoryId: string;
  lessonIndex: number;
  backendVideoUrl?: string;
}) {
  const { categoryId, lessonIndex, backendVideoUrl } = params;
  const lessonNumber = lessonIndex + 1;

  const jsonUrl = getJsonVideoUrlByLessonNumber(categoryId, lessonNumber);
  if (jsonUrl) return jsonUrl;

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

    return () => {
      cancelled = true;
    };
  }, [lessonId, category_id]);

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-6 space-y-6 bg-background">
      {/* Video */}
      <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div className="relative w-full aspect-video bg-black">
          {cleanedVideoUrl ? (
            <video
              ref={videoRef}
              src={cleanedVideoUrl}
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full grid place-items-center">
              <div className="text-sm text-text-secondary">Video yuklanmoqda…</div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {/* helper title (optional but clean) */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Lesson tools</h2>
          <span className="text-xs text-text-muted">Practice</span>
        </div>

        {/* Card link template styles applied manually (no extra components) */}
        <Link
          href={`${lessonId}/vocabulary`}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0">
            <Languages size={22} strokeWidth={1.5} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Lug‘at</div>
            <div className="mt-0.5 text-xs text-text-secondary">
              Yangi so‘zlarni yodlang
            </div>
          </div>

          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">
            Kirish →
          </span>
        </Link>

        <Link
          href={`${lessonId}/test`}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0">
            <ListChecks size={22} strokeWidth={1.5} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Test</div>
            <div className="mt-0.5 text-xs text-text-secondary">
              Bilimingizni tekshiring
            </div>
          </div>

          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">
            Kirish →
          </span>
        </Link>

        <Link
          href={`${lessonId}/quiz`}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0">
            <MessageCircleQuestion size={22} strokeWidth={1.5} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">Savollar</div>
            <div className="mt-0.5 text-xs text-text-secondary">
              Qayta ko‘rib chiqing
            </div>
          </div>

          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">
            Kirish →
          </span>
        </Link>

        <Link
          href={`${lessonId}/ask-for-ai`}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0">
            <MessageCircleQuestion size={22} strokeWidth={1.5} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-text-primary">
              Ustozdan so‘rash
            </div>
            <div className="mt-0.5 text-xs text-text-secondary">
              Savol yuboring
            </div>
          </div>

          <span className="text-xs font-semibold text-text-muted group-hover:text-text-secondary">
            Kirish →
          </span>
        </Link>
      </div>
    </div>
  );

};

export default Page;

"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Languages, ListChecks, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

import xitoy_tili from "@/app/jsons/xitoy.json";
import koreys_tili from "@/app/jsons/koreys.json";
import rus_tili from "@/app/jsons/rus.json";

const XITOY_ID = "35b3e69c-d11f-4bd0-bc59-cbcf6286ec09";
const RUS_ID = "a06d565b-1d61-4564-af5d-1ceb4cfb3f6b";
const KOREYS_ID = "91b5c1b3-4c3e-4347-ad75-19869b3c6f66";

// Sening eski bucket switch logikang
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
};

function getJsonVideoUrlByLessonNumber(categoryId: string, lessonNumber: number) {
  const course = jsonOverrides[categoryId];
  const item = course?.videos?.[lessonNumber - 1];
  if (!item?.key) return "";

  // json key ichida bo'sh joy va boshqa belgilar bo'lishi mumkin
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

  // 1) Agar bu category JSON override bo'lsa => index bo'yicha JSON url
  const jsonUrl = getJsonVideoUrlByLessonNumber(categoryId, lessonNumber);
  if (jsonUrl) return jsonUrl;

  // 2) Aks holda oldingi backend tozalash/bucket logika
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

      // debug xohlasang:
      // console.log({ category_id, lessonNumber: lessonIndex + 1, backendOrder: lesson?.order, finalUrl });
    });

    return () => {
      cancelled = true;
    };
  }, [lessonId, category_id]);

  return (
    <div className="relative space-y-4 w-full max-w-4xl mx-auto px-5">
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl bg-black">
        {cleanedVideoUrl && (
          <video
            ref={videoRef}
            src={cleanedVideoUrl}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      <div className="space-y-4">
        <Link
          href={`${lessonId}/vocabulary`}
          className="w-full h-20 bg-yellow-400/10 border border-yellow-600 flex items-center gap-5 px-5 text-yellow-400 rounded-md hover:scale-[1.02] transition-all"
        >
          <Languages size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Lug‘at</div>
            <div className="text-sm text-yellow-300">Yangi so‘zlarni yodlang</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/test`}
          className="w-full h-20 bg-purple-400/10 border border-purple-700 flex items-center gap-5 px-5 text-purple-400 rounded-md hover:scale-[1.02] transition-all"
        >
          <ListChecks size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Test</div>
            <div className="text-sm text-purple-300">Bilimingizni tekshiring</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/quiz`}
          className="w-full h-20 bg-blue-400/10 border border-blue-700 flex items-center gap-5 px-5 text-blue-400 rounded-md hover:scale-[1.02] transition-all"
        >
          <MessageCircleQuestion size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Savollar</div>
            <div className="text-sm text-blue-300">Qayta ko‘rib chiqing</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/ask-for-ai`}
          className="w-full h-20 bg-emerald-400/10 border border-emerald-700 flex items-center gap-5 px-5 text-emerald-400 rounded-md hover:scale-[1.02] transition-all"
        >
          <MessageCircleQuestion size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Ustozdan so‘rash</div>
            <div className="text-sm text-emerald-300">Savol yuboring</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

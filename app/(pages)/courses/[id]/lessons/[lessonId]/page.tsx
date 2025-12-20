"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Languages, ListChecks, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

const SPECIAL_ID = "a06d565b-1d61-4564-af5d-1ceb4cfb3f6b";
const SECOND_SPECIAL_ID = "a86c8621-b83a-4481-ac66-4176f067ca18";

const Page = () => {
  const params = useParams();
  const lessonId = String(params.lessonId);
  const category_id = String(params.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cleanedVideoUrl, setCleanedVideoUrl] = useState("");

  const getCorrectVideoUrl = (url: string, lessonOrder?: number): string => {
    if (!url) return "";

    const filename = url.split("/").pop() || "";
    const cleanedFilename = filename.replace(/^\d{13}-/, "");

    if (!cleanedFilename) return url;

    // 🔥 MAXSUS LOGIKA
    if (
      (category_id === SPECIAL_ID && lessonOrder && lessonOrder > 25) ||
      category_id === SECOND_SPECIAL_ID
    ) {
      // 26-darsdan keyin — ESKI bucket
      return `https://s3.eu-north-1.amazonaws.com/seven.edu/videos/${cleanedFilename}`;
    }

    // default — YANGI bucket
    return `https://sevenedu-s3.s3.eu-north-1.amazonaws.com/videos/${cleanedFilename}`;
  };

  useEffect(() => {
    api.get("courses/all").then((res) => {
      const category = res.data.find((c: any) => c.id === category_id);
      const lesson = category?.lessons.find((l: any) => l.id === lessonId);

      if (lesson?.videoUrl) {
        const finalUrl = getCorrectVideoUrl(
          lesson.videoUrl,
          lesson.order // 👈 dars raqami (1,2,3...)
        );

        setCleanedVideoUrl(finalUrl);

        console.log("Category:", category_id);
        console.log("Lesson order:", lesson.order);
        console.log("Final video url:", finalUrl);
      }
    });
  }, [lessonId, category_id]);

  return (
    <div className="relative space-y-4 w-full max-w-4xl mx-auto px-5">
      {/* VIDEO */}
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

      {/* LINKLAR */}
      <div className="space-y-4">
        <Link
          href={`${lessonId}/vocabulary`}
          className="w-full h-20 bg-yellow-400/10 border border-yellow-600 flex items-center gap-5 px-5 text-yellow-400 rounded-md hover:scale-[1.02] transition-all"
        >
          <Languages size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Lug‘at</div>
            <div className="text-sm text-yellow-300">
              Yangi so‘zlarni yodlang
            </div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/test`}
          className="w-full h-20 bg-purple-400/10 border border-purple-700 flex items-center gap-5 px-5 text-purple-400 rounded-md hover:scale-[1.02] transition-all"
        >
          <ListChecks size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Test</div>
            <div className="text-sm text-purple-300">
              Bilimingizni tekshiring
            </div>
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

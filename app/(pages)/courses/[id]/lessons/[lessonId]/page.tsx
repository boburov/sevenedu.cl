"use client";

import api, { GetLessonsById, showedLesson } from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Languages, ListChecks, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

interface Lesson {
  title: string;
  videoUrl: string;
  quizs: [];
  dictonary: [];
}

const Page = () => {
  const path = useParams();
  const lessonId = String(path.lessonId);
  const category_id = String(path.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [cleanedVideoUrl, setCleanedVideoUrl] = useState("");

  // 🔧 Video URL tozalovchi funksiya
  const getCorrectVideoUrl = (url: string): string => {
    if (url.includes("sevenedu.store") || url.includes("-")) return url;

    const filename = url.split("/").pop(); // "1752060391578-1751973178413.MOV"
    const parts = filename?.split("-");
    const finalPart = parts?.[parts.length - 1];
    return `https://sevenedu-bucket.s3.eu-north-1.amazonaws.com/videos/${finalPart}`;
  };

  useEffect(() => {
    api.get("courses/all").then((data) => {
      const lessonData = data.data
        .filter((e: any) => e.id === category_id)[0]
        .lessons.filter((les: any) => les.id === lessonId)[0];

      if (lessonData?.videoUrl) {
        function cleanFileLink(url: string): string {
          return url.replace(/\/videos\/\d+-/, "/videos/");
        }

        const url = getCorrectVideoUrl(lessonData.videoUrl);
        const cleaned = cleanFileLink(url);

        setCleanedVideoUrl(cleaned); // ✅ state to'ldirildi

        console.log("Original:", lessonData.videoUrl);
        console.log("Cleaned:", cleaned);
      }
    });
  }, [lessonId, category_id]);

  return (
    <div className="relative space-y-2 w-full max-w-4xl mx-auto px-5 transition-all duration-300">
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl">
        {cleanedVideoUrl && (
          <video
            ref={videoRef}
            controls
            controlsList="nodownload" // 🔒 Download tugmasini olib tashlaydi
            onContextMenu={(e) => e.preventDefault()} // 🔒 O'ng tugmani bloklaydi
            className="w-full h-full object-contain bg-black"
            src={cleanedVideoUrl} 
          />
        )}
      </div>

      <div className="space-y-4">
        <Link
          href={`${lessonId}/vocabulary`}
          className="w-full h-20 bg-yellow-400/10 border border-yellow-600 flex items-center gap-5 px-5 text-yellow-400 rounded-md hover:scale-[1.02] transition-all duration-300 shadow-sm"
        >
          <Languages size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">{`Lug'at`}</div>
            <div className="text-sm text-yellow-300">{`Yangi so'zlarni yodlang va mashq qiling`}</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/test`}
          className="w-full h-20 bg-purple-400/10 border border-purple-700 flex items-center gap-5 px-5 text-purple-400 rounded-md hover:scale-[1.02] transition-all duration-300 shadow-sm"
        >
          <ListChecks size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Test</div>
            <div className="text-sm text-purple-300">{`Bilimingizni tekshiring va yutuqlaringizni ko'ring`}</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/quiz`}
          className="w-full h-20 bg-blue-400/10 border border-blue-700 flex items-center gap-5 px-5 text-blue-400 rounded-md hover:scale-[1.02] transition-all duration-300 shadow-sm"
        >
          <ListChecks size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Savollar</div>
            <div className="text-sm text-blue-300">{`Tushunmagan joylaringizni takror ko'rib chiqing`}</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/ask-for-ai`}
          className="w-full h-20 bg-emerald-400/10 border border-emerald-700 flex items-center gap-5 px-5 text-emerald-400 rounded-md hover:scale-[1.02] transition-all duration-300 shadow-sm"
        >
          <MessageCircleQuestion size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">{`Ustozdan so'rash`}</div>
            <div className="text-sm text-emerald-300">{`Savolingizni ustozga bevosita yuboring`}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

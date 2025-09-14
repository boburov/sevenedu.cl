"use client";

import api from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SentencePuzzle {
  id: string;
  sentence: string;
  answer: string;
}

interface Lesson {
  title: string;
  videoUrl: string;
  sentencePuzzles: SentencePuzzle[];
}

const Page = () => {
  const path = useParams();
  const lessonId = String(path.lessonId);
  const category_id = String(path.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cleanedVideoUrl, setCleanedVideoUrl] = useState("");
  const [sentencePuzzles, setSentencePuzzles] = useState<SentencePuzzle[]>([]);

  // 🔧 Video URL tozalovchi funksiya
  const getCorrectVideoUrl = (url: string): string => {
    if (url.includes("sevenedu.store") || url.includes("-")) return url;

    const filename = url.split("/").pop();
    const parts = filename?.split("-");
    const finalPart = parts?.[parts.length - 1];
    return `https://sevenedu-bucket.s3.eu-north-1.amazonaws.com/videos/${finalPart}`;
  };

  useEffect(() => {
    api.get("courses/all").then((data) => {
      const lessonData: Lesson = data.data
        .filter((e: any) => e.id === category_id)[0]
        .lessons.filter((les: any) => les.id === lessonId)[0];

      if (lessonData?.videoUrl) {
        function cleanFileLink(url: string): string {
          return url.replace(/\/videos\/\d+-/, "/videos/");
        }

        const url = getCorrectVideoUrl(lessonData.videoUrl);
        const cleaned = cleanFileLink(url);

        setCleanedVideoUrl(cleaned);
      }

      if (lessonData?.sentencePuzzles) {
        setSentencePuzzles(lessonData.sentencePuzzles);
      }

      console.log("Lesson data:", lessonData);
    });
  }, [lessonId, category_id]);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-5 space-y-8 transition-all duration-300">
      {/* Video */}
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl">
        {cleanedVideoUrl && (
          <video
            ref={videoRef}
            controls
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-contain bg-black"
            src={cleanedVideoUrl}
          />
        )}
      </div>

      {/* Sentence puzzles */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Mashqlar</h2>
        {sentencePuzzles.length === 0 ? (
          <p className="text-gray-500">Hozircha mashqlar yo‘q</p>
        ) : (
          sentencePuzzles.map((puzzle) => (
            <div
              key={puzzle.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <p className="text-lg font-medium">{puzzle.sentence}</p>
              <p className="text-sm text-green-600">✅ {puzzle.answer}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;

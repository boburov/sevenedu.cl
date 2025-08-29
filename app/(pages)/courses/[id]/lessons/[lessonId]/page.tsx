"use client";

import { GetLessonsById, showedLesson } from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  LucideSkipBack,
  PauseCircle,
  PlayCircle,
  Volume2,
  Languages,
  ListChecks,
  MessageCircleQuestion,
} from "lucide-react";
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastTapLeft, setLastTapLeft] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    GetLessonsById(lessonId).then((data) => {
      setLesson(data);
    });
    showedLesson(lessonId)
      .then(() => {
        setIsWatched(true);
      })
      .catch((err) => {
        console.error("Xatolik yuz berdi:", err);
      });
  }, [lessonId]);

  // 🔧 Video URL tozalovchi funksiya
  const getCorrectVideoUrl = (url: string): string => {
    if (url.includes("sevenedu.store")) return url;

    const filename = url.split("/").pop(); // "1752060391578-1751973178413.MOV"
    const parts = filename?.split("-");
    const finalPart = parts?.[parts.length - 1];
    return `https://sevenedu-bucket.s3.eu-north-1.amazonaws.com/videos/${finalPart}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const current = (video.currentTime / video.duration) * 100;
      setProgress(current);
      if (video.currentTime >= video.duration) {
        setIsWatched(true);
      }
    }
  };

  const seekBackward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(video.currentTime - 2, 0);
    }
  };

  const handleDoubleClickLeft = () => {
    const now = new Date().getTime();
    if (lastTapLeft && now - lastTapLeft < 300) {
      seekBackward();
    }
    setLastTapLeft(now);
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);

      if (!isFull && containerRef.current) {
        containerRef.current.style.width = "";
        containerRef.current.style.height = "";

        if ("unlock" in screen.orientation) {
          try {
            (screen.orientation as any).unlock();
          } catch (_) { }
        }
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const videoContainer = containerRef.current;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      try {
        await videoContainer.requestFullscreen();
        videoContainer.style.width = "100vw";
        videoContainer.style.height = "100vh";

        if (screen.orientation && "lock" in screen.orientation) {
          try {
            await (screen.orientation as any).lock("landscape");
          } catch (err) {
            console.warn("Orientation lock ishlamadi:", err);
          }
        }
      } catch (err) {
        console.error("Fullscreen xatoligi:", err);
      }
    } else {
      await document.exitFullscreen();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const PauseVideo = async () => {
    setIsPlaying(!isPlaying);
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // 🔧 Final cleaned URL
  const cleanedVideoUrl = lesson?.videoUrl ? getCorrectVideoUrl(lesson.videoUrl) : "";

  return (
    <div
      ref={containerRef}
      className={`relative space-y-2 w-full ${isFullscreen ? "h-screen bg-black" : "max-w-4xl mx-auto px-5"
        } transition-all duration-300`}
    >
      <div className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-2xl">
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className="w-full h-full object-contain bg-black"
          src={cleanedVideoUrl}
        />
        <div
          className="absolute inset-0 left-0 w-full cursor-pointer"
          onDoubleClick={handleDoubleClickLeft}
          onClick={PauseVideo}
        />
      </div>

      <div
        className={`${isFullscreen ? "absolute bottom-3 left-0 right-0 px-8 " : ""
          } z-10`}
      >
        <div className="flex items-center gap-4 px-4 py-3 bg-black/80 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg">
          <button onClick={seekBackward} title="2s orqaga">
            <LucideSkipBack size={24} />
          </button>
          <button onClick={togglePlay} title="Oynat/Pauza">
            {isPlaying ? (
              <PauseCircle strokeWidth={1} size={28} />
            ) : (
              <PlayCircle strokeWidth={1} size={28} />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Volume2 strokeWidth={1} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 cursor-pointer accent-green-400"
              title="Ovoz"
            />
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button onClick={toggleFullscreen} title="Fullscreen">
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
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
            <div className="text-sm text-purple-300">{`Bilimingizni tekshiring va yutuqlaringizni ko‘ring`}</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/quiz`}
          className="w-full h-20 bg-blue-400/10 border border-blue-700 flex items-center gap-5 px-5 text-blue-400 rounded-md hover:scale-[1.02] transition-all duration-300 shadow-sm"
        >
          <ListChecks size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">Savollar</div>
            <div className="text-sm text-blue-300">{`Tushunmagan joylaringizni takror ko‘rib chiqing`}</div>
          </div>
        </Link>

        <Link
          href={`${lessonId}/ask-for-ai`}
          className="w-full h-20 bg-emerald-400/10 border border-emerald-700 flex items-center gap-5 px-5 text-emerald-400 rounded-md hover:scale-[1.02] transition-all duration-300 shadow-sm"
        >
          <MessageCircleQuestion size={30} strokeWidth={1} />
          <div>
            <div className="text-lg font-semibold">{`Ustozdan so‘rash`}</div>
            <div className="text-sm text-emerald-300">{`Savolingizni ustozga bevosita yuboring`}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

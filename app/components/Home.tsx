import React from "react";
import { GraduationCap, School2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/logo.png";

const Home = () => {
  return (
    <div className="min-h-screen w-full px-4 py-10 relative flex items-center justify-center bg-gradient-to-br from-primary-soft/50 via-background to-background">
      {/* Logo yuqori chapda */}
      <div className="absolute top-6 left-6 z-10">
        <div className="p-2 rounded-2xl bg-surface shadow-card border border-border transition-all duration-200 hover:shadow-card-hover hover:scale-105">
          <Image
            src={logo}
            alt="Seven Edu Logo"
            width={50}
            height={50}
            className="rounded-xl object-contain"
          />
        </div>
      </div>

      {/* Asosiy kontent */}
      <div className="w-full max-w-md space-y-8 text-center z-10">
        {/* Matn */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary">
          Platformaga kirish usulini tanlang
        </h1>

        {/* Tugmalar */}
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="w-full flex items-center gap-4 p-4 rounded-card bg-surface hover:bg-primary-soft border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-200"
          >
            <div className="bg-primary-soft p-3 rounded-xl">
              <GraduationCap size={26} className="text-primary" />
            </div>
            <span className="text-base sm:text-lg font-medium text-text-primary">
              O'quvchi sifatida kirish
            </span>
          </Link>

          <Link
            href="/auth/signup"
            className="w-full flex items-center gap-4 p-4 rounded-card bg-surface hover:bg-primary-soft border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-200"
          >
            <div className="bg-primary-soft p-3 rounded-xl">
              <School2 size={26} className="text-primary" />
            </div>
            <span className="text-base sm:text-lg font-medium text-text-primary">
              Mehmon sifatida kirish
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

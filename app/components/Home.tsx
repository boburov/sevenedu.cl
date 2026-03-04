import React from "react";
import Image from "next/image";
import logo from "@/app/logo.png";
import Google from "./auth/Google";

const Home = () => {
  const handleGoogleLogin = () => {
    window.location.assign(`http://localhost:30066/auth/google/`);
  };

  return (
    <div className="min-h-screen w-full px-4 py-10 flex items-center justify-center bg-gradient-to-br from-primary-soft/50 via-background to-background relative">

      {/* Logo top-left */}
      <div className="absolute top-6 left-6">
        <div className="p-2 rounded-2xl shadow-lg border border-border bg-purple-500 hover:scale-105 transition">
          <Image
            src={logo}
            alt="Seven Edu Logo"
            width={50}
            height={50}
            className="rounded-xl object-contain"
          />
        </div>
      </div>

      {/* Center card */}
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">

        <div className="flex justify-center mb-6">
          <Image
            src={logo}
            alt="Seven Edu"
            width={80}
            height={80}
            className="rounded-2xl"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          SevenEduga hush kelibsiz
        </h1>

        <p className="text-gray-500 mb-8">
          Chet Tillarini Biz Bilan Oson O'rganing
        </p>

        <Google />

        <p className="text-xs text-gray-400 mt-6">
          By continuing you agree to our Terms & Privacy Policy
        </p>

      </div>
    </div>
  );
};

export default Home;
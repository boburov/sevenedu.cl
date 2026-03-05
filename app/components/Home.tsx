import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.png";
import Google from "./auth/Google";

const Home = () => {
  return (
    <div className="min-h-screen w-full px-4 py-10 flex items-center justify-center bg-linear-to-br from-primary-soft/50 via-background to-background relative">
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
          Chet Tillarini Biz Bilan Oson O&apos;rganing
        </p>

        {/* Login / Signup buttons */}
        {/* <div className="grid grid-cols-2 gap-3 mb-5">
          <Link
            href="/auth/login"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold
                       bg-gray-900 text-white shadow-lg shadow-black/10
                       hover:shadow-xl hover:-translate-y-0.5 transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
          >
            <LogIn className="w-4 h-4 opacity-90" />
            Login
            <ArrowRight className="w-4 h-4 -mr-1 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition" />
          </Link>

          <Link
            href="/auth/signup"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold
                       bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20
                       hover:shadow-xl hover:-translate-y-0.5 transition
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
          >
            <UserPlus className="w-4 h-4 opacity-90" />
            Signup
            <ArrowRight className="w-4 h-4 -mr-1 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition" />
          </Link>
        </div> */}

        {/* Divider */}
        {/* <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">yoki</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div> */}

        {/* Google auth button/component */}
        <Google />

        <p className="text-xs text-gray-400 mt-6">
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Home;
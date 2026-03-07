import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/logo.png";
import GoogleButton from "./auth/Google";

const Home = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-violet-50 via-white to-fuchsia-50 px-4 py-10">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -bottom-25 -right-25 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />
      </div>

      {/* top-left brand */}
      <div className="absolute left-6 top-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-xl">
          <div className="rounded-xl bg-violet-600 p-2 shadow-sm">
            <Image
              src={logo}
              alt="Seven Edu Logo"
              width={32}
              height={32}
              className="rounded-md object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-slate-700">SevenEdu</span>
        </div>
      </div>

      {/* center card */}
      <section className="relative z-10 w-full max-w-md rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 rounded-3xl bg-linear-to-br from-violet-500 to-fuchsia-500 p-px shadow-lg">
            <div className="rounded-[22px] bg-white p-3">
              <Image
                src={logo}
                alt="Seven Edu"
                width={72}
                height={72}
                className="bg-violet-500 rounded-2xl object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            SevenEduga hush kelibsiz
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Chet tillarini zamonaviy va qulay usulda biz bilan oson o‘rganing.
          </p>
        </div>

        <div className="space-y-3">
          <GoogleButton />

          <Link
            href="/auth/login"
            className="
      flex h-12 w-full items-center justify-center
      rounded-2xl
      border border-slate-200
      bg-white
      text-sm font-semibold text-slate-700
      shadow-sm
      transition-all duration-200
      hover:-translate-y-px
      hover:border-slate-300
      hover:bg-slate-50
      hover:shadow-md
      active:translate-y-0
      active:shadow-sm
    "
          >
            Kirish
          </Link>

          <Link
            href="/auth/signup"
            className="
      flex h-12 w-full items-center justify-center
      rounded-2xl
      bg-linear-to-r from-violet-600 to-fuchsia-600
      text-sm font-semibold text-white
      shadow-lg shadow-violet-600/25
      transition-all duration-200
      hover:-translate-y-px
      hover:shadow-xl hover:shadow-violet-600/30
      active:translate-y-0
      active:shadow-md
    "
          >
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Ro&apos;yxatdan o&apos;tish orqali siz{" "}
          <Link
            href="/terms"
            className="font-medium text-violet-600 underline underline-offset-4 hover:text-violet-700"
          >
            platforma shartlariga
          </Link>{" "}
          rozilik bildirgan bo&apos;lasiz.
        </p>
      </section>
    </main>
  );
};

export default Home;
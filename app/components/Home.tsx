import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/images/goldedu7.png";
import GoogleButton from "./auth/Google";

const Home = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Iliq gradient — qobiqdagi bilan bir xil: juda sust, yuqori o'ng burchakda */}
      <div
        aria-hidden
        className="pointer-events-none fixed right-0 top-0 h-[520px] w-[720px] bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,26,0.07),transparent_65%)]"
      />

      {/* Yuqori chap burchakdagi brend — qobiqdagi logo bilan bir xil */}
      <div className="absolute left-6 top-6 flex items-center">
        <Image alt="" src={logo} className="w-10 object-contain" />
        <span className="mt-1 text-lg font-semibold text-text-primary">
          SevenEdu
        </span>
      </div>

      {/* Markaziy kartochka — soya yo'q, chegara va fon bilan ajraladi */}
      <section className="relative z-10 w-full max-w-md rounded-card border border-border bg-surface p-8 sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image alt="" src={logo} className="mb-4 w-20 object-contain" />

          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            SevenEduga hush kelibsiz
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-text-secondary">
            Chet tillarini zamonaviy va qulay usulda biz bilan oson o&lsquo;rganing.
          </p>
        </div>

        <div className="space-y-3">
          <GoogleButton />

          {/* Ikkilamchi harakat: chegara bilan, fonsiz */}
          <Link
            href="/auth/login"
            className="focus-ring flex h-12 w-full items-center justify-center rounded-button border border-border bg-surface text-sm font-semibold text-text-primary transition-colors duration-200 hover:border-border-strong hover:bg-surface-alt"
          >
            Kirish
          </Link>

          {/* Asosiy harakat: qora — orange faqat urg'u uchun ishlatiladi */}
          <Link
            href="/auth/signup"
            className="focus-ring flex h-12 w-full items-center justify-center rounded-button bg-primary text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
          >
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-text-muted">
          Ro&apos;yxatdan o&apos;tish orqali siz{" "}
          <Link
            href="/terms"
            className="focus-ring rounded font-medium text-accent-strong underline underline-offset-4 hover:text-accent"
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

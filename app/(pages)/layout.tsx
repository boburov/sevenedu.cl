"use client";

import Footer from "./pages_components/Footer";
import { CircleArrowLeft, Trash, Wallet2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import {
  deleteUserProfilePic,
  getMe,
  updateUserProfilePic,
} from "../api/service/api";
import Header from "../components/Header";

interface User {
  id: string;
  name: string;
  profilePic?: string;
  courses: unknown[];
  email: string;
  phonenumber: string;
  coins: number;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const userData = await getMe();
        setUser(userData);
      } catch (error: unknown) {
        const err = error as {
          response?: { status: number };
          message?: string;
        };
        if (
          err?.response?.status === 401 ||
          err.message === "Token bekor qilindi"
        ) {
          router.push("/auth/signup");
        } else {
          console.error("Foydalanuvchi ma'lumotini olishda xatolik:", error);
        }
      }
    };

    fetchUser();
  }, [router]);

  function formatNumberWithCommas(num: number): string {
    return num.toLocaleString("en-US");
  }

  const onProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const updatedUser = await updateUserProfilePic(user.id, formData);
      setUser(updatedUser);
    } catch (error) {
      console.error("Rasmni yuklashda xatolik:", error);
    }
  };

  const handleDeleteProfilePic = async () => {
    if (!user) return;
    try {
      await deleteUserProfilePic(user.id);
      setUser({ ...user, profilePic: "" });
    } catch (error) {
      console.error("Rasmni o'chirishda xatolik:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div onClick={() => router.back()} className="cursor-pointer">
        <CircleArrowLeft
          size={44}
          strokeWidth={1.5}
          className="m-4 text-text-secondary hover:text-primary transition-colors duration-200 hidden max-md:block"
        />
      </div>
      {user && (
        <section className="container pt-6 hidden max-md:block">
          {/* file input must always exist */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="rounded-2xl border border-border bg-surface shadow-card">
            <div className="flex items-center gap-4 p-4">
              {/* Avatar */}
              <button
                type="button"
                onClick={onProfilePicClick}
                className="relative h-14 w-14 shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                aria-label="Change profile photo"
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User profile"
                    className="h-14 w-14 rounded-full object-cover ring-4 ring-primary-soft"
                    width={56}
                    height={56}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-primary-soft grid place-items-center ring-4 ring-primary-soft">
                    <span className="text-lg font-semibold text-primary">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Delete photo */}
                {user.profilePic ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfilePic();
                    }}
                    className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface shadow-sm transition hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    aria-label="Remove profile photo"
                  >
                    <Trash width={14} height={14} className="text-text-secondary" />
                  </button>
                ) : null}
              </button>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-text-primary truncate">
                      {user.name}
                    </h2>
                    <p className="text-sm text-text-secondary truncate">{user.email}</p>
                  </div>

                  {/* Coins */}
                  <div className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-semibold text-text-primary">
                    <Wallet2 size={14} className="text-primary" />
                    {formatNumberWithCommas(user.coins)} tanga
                  </div>
                </div>

                {/* subtle helper line (optional, minimalist) */}
                <p className="mt-2 text-xs text-text-muted">
                  Profil rasmini o‘zgartirish uchun avatar ustiga bosing.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {children}
      <span className="pb-24 inline-block"></span>
      <div className="px-3">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

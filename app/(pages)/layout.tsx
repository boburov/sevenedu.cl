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
import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";

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
      console.error("Rasmni o‘chirishda xatolik:", error);
    }
  };

  return (
    <>
      <Header />
      <div onClick={() => router.back()}>
        <CircleArrowLeft
          size={50}
          strokeWidth={1}
          className="m-4 text-white hidden max-md:block"
        />
      </div>
      {user && (
        <section className="container text-white pt-10 relative hidden max-md:block">
          <div
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={onProfilePicClick}
          >
            {user.profilePic ? (
              <div className="relative w-20 h-20">
                <img
                  src={user.profilePic}
                  alt="user image"
                  className="rounded-full border border-white/5 p-0.5 bg-gray-500 object-cover w-full h-full"
                  sizes="80px"
                  width={80}
                  height={80}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfilePic();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-300"
                >
                  <Trash width={16} height={16} />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <span className="text-4xl">{user.name[0].toUpperCase()}</span>
              </div>
            )}

            <div className="flex flex-col items-start">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <span className="text-sm text-gray-300">{user.email}</span>
              <div className="mt-1 inline-flex items-end gap-2 bg-yellow-100 text-gray-900 px-3 py-0.5 rounded-full text-sm font-medium">
                <Wallet2 width={20} /> {formatNumberWithCommas(user.coins)}{" "}
                tanga
              </div>
            </div>
          </div>
        </section>
      )}
      {children}
      <span className="pb-20 inline-block"></span>
      <div className="px-3">
        <Footer />
      </div>
    </>
  );
};

export default Layout;

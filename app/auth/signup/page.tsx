"use client";

import { ArrowLeft, EyeClosed, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import edu7 from "@/app/images/7edu white logo.png";
import { register } from "@/app/api/service/api";
import axios, { AxiosError } from "axios";

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    phonenumber: "",
    email: "",
    password: "",
  });
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAllowed, setAllow] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

const handleSignup = async () => {
  if (!isAllowed) {
    alert("Siz avval shartnomaga rozilik berishingiz kerak");
    return;
  }
  setIsSubmitting(true);
  setError(false);
  setErrorMessage("");

  if (!userData.name || !userData.surname || !userData.email || !userData.password) {
    setError(true);
    setErrorMessage("Iltimos, barcha maydonlarni to'ldiring");
    setIsSubmitting(false);
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
    setError(true);
    setErrorMessage("Iltimos, to'g'ri email manzil kiriting");
    setIsSubmitting(false);
    return;
  }

  try {
    const res = await register(userData);

    if (res.token) {
      localStorage.setItem("email", userData.email);
      localStorage.setItem("token", res.token);
      router.push("verify");
    } else {
      setError(true);
      setErrorMessage("Ro'yxatdan o'tishda noma'lum xatolik yuz berdi");
    }
  }catch (error: unknown) {
  let message = "Ro'yxatdan o'tishda xatolik yuz berdi";

  if (axios.isAxiosError(error)) {
    // Endi error.response?.status ishlaydi
    switch (error.response?.status) {
      case 400:
        message = error.response?.data?.message || "So‘rov noto‘g‘ri";
        break;
      case 403:
        message = error.response?.data?.message || "Emailingizni tasdiqlang";
        break;
      case 409:
        message = error.response?.data?.message || "Bu email allaqachon ro'yxatdan o'tgan";
        break;
      case 404:
        message = error.response?.data?.message || "Foydalanuvchi topilmadi";
        break;
      default:
        message = error.response?.data?.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  setError(true);
  setErrorMessage(message);

  if (!(axios.isAxiosError(error) && [400, 403, 404, 409].includes(Number(error.response?.status)))) {
    console.error("Registration error:", error);
  }
} finally {
    setIsSubmitting(false);
  }
};

  const inputClasses =
    "w-full h-12 border border-border rounded-input px-4 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-all duration-200";

  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-soft/30 via-background to-background">
      <div className="container pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
          <span className="text-sm font-medium">Orqaga</span>
        </Link>

        <div className="flex flex-col items-center pt-8 max-w-sm mx-auto">
          <div className="bg-primary rounded-2xl p-2 mb-6">
            <Image src={edu7} height={60} width={72} alt="SevenEdu Logo" />
          </div>

          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Mehmon Sifatida Kirish
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            Ro'yxatdan o'tish uchun ma'lumotlarni kiriting
          </p>

          {isError && (
            <div className="w-full mb-4 p-3 rounded-input bg-danger-soft text-danger text-sm font-medium text-center">
              {errorMessage}
            </div>
          )}

          <form
            className="w-full space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <input
              required
              name="name"
              type="text"
              autoComplete="off"
              placeholder="Ism"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className={inputClasses}
            />
            <input
              required
              type="text"
              name="surname"
              autoComplete="off"
              placeholder="Familya"
              value={userData.surname}
              onChange={(e) =>
                setUserData({ ...userData, surname: e.target.value })
              }
              className={inputClasses}
            />
            <input
              required
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className={inputClasses}
            />
            <input
              type="tel"
              name="phonenumber"
              autoComplete="off"
              placeholder="Telefon raqam"
              value={userData.phonenumber}
              onChange={(e) =>
                setUserData({ ...userData, phonenumber: e.target.value })
              }
              className={inputClasses}
            />
            <div className="relative w-full">
              <input
                required
                name="password"
                autoComplete="off"
                placeholder="Parol"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                minLength={6}
                className={inputClasses}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors duration-200"
              >
                {showPassword ? <EyeIcon size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isAllowed}
                onChange={() => setAllow(!isAllowed)}
                className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary accent-primary"
              />
              <p className="text-sm text-text-secondary leading-relaxed">
                men{" "}
                <Link
                  className="text-primary hover:text-primary-hover font-medium underline"
                  href={"/terms"}
                >
                  Quidagi hamma
                </Link>{" "}
                shartlarga rozilik beraman
              </p>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 rounded-button text-base font-semibold text-primary-foreground transition-all duration-200 ${isSubmitting
                ? "bg-primary/60 cursor-not-allowed"
                : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg"
                }`}
            >
              {isSubmitting ? "Yuborilmoqda..." : "Kirish"}
            </button>
          </form>

          <Link
            href="login"
            className="mt-6 text-text-secondary hover:text-primary font-medium text-sm transition-colors duration-200"
          >
            O'quvchi sifatida kirish
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;

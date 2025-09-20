"use client";

import { ArrowLeft, EyeClosed, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import edu7 from "@/app/images/7edu white logo.png";
import { register } from "@/app/api/service/api";
import { AxiosError } from "axios";

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
      return
    }
    setIsSubmitting(true);
    setError(false);
    setErrorMessage("");

    if (
      !userData.name ||
      !userData.surname ||
      !userData.email ||
      !userData.password
    ) {
      setError(true);
      setErrorMessage("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      setError(true);
      setErrorMessage("Iltimos, to'g'ri email manzil kiriting");
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
        setErrorMessage("Ro'yxatdan o'tishda xatolik yuz berdi");
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);

      let message = "Ro'yxatdan o'tishda xatolik yuz berdi";

      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(true);
      setErrorMessage(message);
    }
  };

  return (
    <div>
      <section className="container pt-5">
        <Link href="/">
          <ArrowLeft size={44} strokeWidth={1.5} className="text-white" />
        </Link>

        <div className="flex flex-col items-center">
          <Image src={edu7} height={100} width={120} alt="kotun" />
          <h3 className="text-2xl font-bold text-white mb-5">
            Mehmon Sifatida Kirish
          </h3>

          {isError && (
            <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
          )}

          <form
            className="space-y-5"
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
              className="not-focus-visible:bg-white/10 w-full h-14 border rounded-md border-white/20 text-white px-3 bg-white/10"
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
              className="autofill:bg-white/10 w-full h-14 border rounded-md border-white/20 text-white px-3 bg-white/10"
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
              className="autofill:bg-white/10 w-full h-14 border rounded-md border-white/20 text-white px-3 bg-white/10"
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
              className="autofill:bg-white/10 w-full h-14 border rounded-md border-white/20 text-white px-3 bg-white/10"
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
                className="autofill:bg-white/10 w-full h-14 border rounded-md border-white/20 text-white px-3 bg-white/10"
              />

              <div className="flex items-center gap-2 text-white pt-3">
                <input type="checkbox" name="" id="" onClick={()=>setAllow(!isAllowed)}/>
                <p className="lowercase">
                  men{" "}
                  <Link className="text-green-300 underline" href={"/terms"}>
                    QUidagi hamma
                  </Link>{" "}
                  shartlarga rozilik beraman
                </p>
              </div>

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-white"
              >
                {showPassword ? <EyeIcon /> : <EyeClosed />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#00C835] w-full py-3 rounded-md text-xl font-bold text-white mb-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Yuborilmoqda..." : "Kirish"}
            </button>
          </form>

          <Link
            href="login"
            className="text-white/80 font-[robolight] tracking-wide underline"
          >
            {` O'quvchi sifatida kirish`}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { verifyCode } from "../api/service/api";

export default function TwoFactorForm() {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : "";

  useEffect(() => {
    if (!email) {
      setError("Email topilmadi. Ro'yxatdan o'ting.");
    }
  }, [email]);

  const handleChange = (val: string, idx: number) => {
    if (!/^[A-Za-z0-9]?$/.test(val)) return;
    const arr = [...code];
    arr[idx] = val.toUpperCase();
    setCode(arr);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const checkCode = async () => {
    const entered = code.join("");
    if (entered.length !== 6) {
      setError("6 xonali kodni to'liq kiriting.");
      return;
    }

    if (!email) {
      setError("Email topilmadi.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await verifyCode({ email, code: entered });
      setSuccess("Tasdiqlandi!");
      setTimeout(() => router.push(`/user/${response.user.id}`), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-center text-text-primary">
        Emailni tasdiqlash
      </h1>
      <p className="text-text-secondary text-center mb-8 text-sm">
        Emailga yuborilgan 6 xonali kodni kiriting
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-input bg-danger-soft text-danger text-sm font-medium text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-input bg-success-soft text-success text-sm font-medium text-center">
          {success}
        </div>
      )}

      <div className="grid grid-cols-6 gap-2 mb-6">
        {code.map((ch, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            maxLength={1}
            value={ch}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            inputMode="text"
            className="h-14 w-full rounded-input bg-surface text-center text-xl font-semibold border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-primary transition-all duration-200"
            disabled={loading}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={checkCode}
          disabled={loading}
          className={`flex-1 h-12 rounded-button font-semibold text-primary-foreground transition-all duration-200 ${
            loading
              ? "bg-primary/60 cursor-not-allowed"
              : "bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
        </button>
        <button
          onClick={() => setCode(new Array(6).fill(""))}
          disabled={loading}
          className="flex-1 h-12 rounded-button font-semibold text-text-secondary border-2 border-border bg-surface hover:bg-surface-alt transition-all duration-200"
        >
          Tozalash
        </button>
      </div>
    </div>
  );
}

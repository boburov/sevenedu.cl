"use client";
import { useEffect, useRef, useState } from "react";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || window.location.origin;

    const finishLogin = (token: string) => {
      localStorage.setItem("token", token);
      setLoading(false);
      loadingRef.current = false;
      try { popupRef.current?.close(); } catch { }
      window.location.href = "/dashboard";
    };

    const onMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_ORIGIN,
        "https://api.sevenedu.store",
      ];

      if (!allowedOrigins.includes(event.origin)) return;
      if (event.data?.type === "oauth" && typeof event.data.token === "string") {
        finishLogin(event.data.token);
      }

      if (event.data?.type === "oauth_error") {
        setLoading(false);
        loadingRef.current = false;
        if (event.data.error?.includes("oddiy ro'yxatdan")) {
          setErrorMsg("Bu email oddiy parol bilan ro'yxatdan o'tgan. Iltimos, email va parol bilan kiring.");
        } else {
          setErrorMsg("Google orqali kirishda xatolik yuz berdi. Qayta urinib ko'ring.");
        }
        try { popupRef.current?.close(); } catch { }
      }
    };

    // ✅ Detect if user manually closed the popup
    // interval ichida — opener ishlamagan holatni ushlaymiz
    const interval = setInterval(() => {
      if (!loadingRef.current) return;

      // ✅ Popup yopilgan — localStorage tekshir
      if (popupRef.current?.closed) {
        const token = localStorage.getItem("token");
        const oauthError = localStorage.getItem("oauth_error");

        if (token) {
          localStorage.removeItem("oauth_success");
          finishLogin(token);
        } else if (oauthError) {
          localStorage.removeItem("oauth_error");
          setLoading(false);
          loadingRef.current = false;
          setErrorMsg(oauthError.includes("oddiy")
            ? "Bu email oddiy parol bilan ro'yxatdan o'tgan. Iltimos, email va parol bilan kiring."
            : "Google orqali kirishda xatolik yuz berdi."
          );
        } else {
          // User o'zi yopdi
          setLoading(false);
          loadingRef.current = false;
        }
      }
    }, 500);

    window.addEventListener("message", onMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const openGooglePopup = () => {
    // ✅ Clear any previous error
    setErrorMsg(null);
    setLoading(true);
    loadingRef.current = true;

    const width = 520;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `https://api.sevenedu.store/auth/google`,
      "google_oauth",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    popupRef.current = popup;

    if (!popup) {
      setLoading(false);
      loadingRef.current = false;
      setErrorMsg("Popup bloklandi. Iltimos, brauzer sozlamalarida popupga ruxsat bering.");
      return;
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={openGooglePopup}
        disabled={loading}
        className="group relative overflow-hidden w-full rounded-2xl p-px bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white via-gray-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
          <span className="text-sm font-semibold text-gray-800">
            {loading ? "Kirish jarayonida..." : "Google bilan davom etish"}
          </span>
        </div>
      </button>

      {errorMsg && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <span className="mt-0.5 text-red-500">⚠️</span>
          <p className="text-sm text-red-600">{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}
    </div>
  );
}
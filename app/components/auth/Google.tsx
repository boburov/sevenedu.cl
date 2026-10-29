"use client";
import { AlertCircle, X } from "lucide-react";
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
        "https://api.sevenedu.org",
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
      `https://api.sevenedu.org/auth/google`,
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
        className="focus-ring flex h-12 w-full items-center justify-center gap-3 rounded-button border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition-colors duration-200 hover:border-border-strong hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleMark />
        {loading ? "Kirish jarayonida..." : "Google bilan davom etish"}
      </button>

      {errorMsg && (
        <div className="mt-3 flex items-start gap-2 rounded-input border border-danger/25 bg-danger-soft px-4 py-3">
          <AlertCircle
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-danger-strong"
          />
          <p className="text-sm text-danger-strong">{errorMsg}</p>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            aria-label="Xabarni yopish"
            className="focus-ring ml-auto shrink-0 rounded text-danger-strong/70 transition-colors hover:text-danger-strong"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Google'ning rasmiy rangli "G" belgisi.
 *
 * Oldin svgrepo.com dan tashqi rasm sifatida olinardi: kirish sahifasi
 * uchinchi tomon CDN'iga bog'liq bo'lib qolgandi — u sekinlashsa yoki o'chsa,
 * tugma belgisiz chiqardi. Belgi Google'ning brend qo'llanmasida talab
 * qilingan shaklda, shuning uchun ranglar tokenlarga bog'lanmaydi.
 */
const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden focusable="false">
    <path
      fill="#4285F4"
      d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.64v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.9Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.28v3.11A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.28a12 12 0 0 0 0 10.77l3.99-3.11Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l3.99 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
    />
  </svg>
);
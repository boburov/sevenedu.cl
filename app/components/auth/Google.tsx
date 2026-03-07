"use client";

import { useEffect, useRef, useState } from "react";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const appOrigin =
      process.env.NEXT_PUBLIC_APP_ORIGIN || window.location.origin;

    const finishLogin = (token?: string | null) => {
      const finalToken = token || localStorage.getItem("token");
      if (!finalToken) return;

      localStorage.setItem("token", finalToken);
      setLoading(false);

      try {
        popupRef.current?.close();
      } catch { }

      window.location.href = "/dashboard";
    };

    const onMessage = (event: MessageEvent) => {
      console.log("message event:", event.origin, event.data);

      if (event.origin !== appOrigin) return;

      if (event.data?.type === "oauth" && typeof event.data.token === "string") {
        finishLogin(event.data.token);
      }

      if (event.data?.type === "oauth_error") {
        setLoading(false);
        try {
          popupRef.current?.close();
        } catch { }
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === "token" && event.newValue) {
        finishLogin(event.newValue);
      }
    };

    const onFocus = () => {
      if (!loadingRef.current) return;

      const token = localStorage.getItem("token");
      if (token) {
        finishLogin(token);
      }
    };

    const interval = setInterval(() => {
      if (!loadingRef.current) return;

      const token = localStorage.getItem("token");
      if (token) {
        finishLogin(token);
      }
    }, 500);

    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const openGooglePopup = () => {
    setLoading(true);

    const width = 520;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const url = `https://api.sevenedu.store/auth/google`;

    const popup = window.open(
      url,
      "google_oauth",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    popupRef.current = popup;

    if (!popup) {
      setLoading(false);
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={openGooglePopup}
      disabled={loading}
      className="
        group relative overflow-hidden
        w-full rounded-2xl p-px
        bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500
        transition-all duration-300 hover:scale-[1.01] hover:shadow-xl
        disabled:cursor-not-allowed disabled:opacity-70
      "
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white via-gray-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="h-5 w-5"
        />

        <span className="text-sm font-semibold text-gray-800">
          {loading ? "Kirish jarayonida..." : "Google bilan davom etish"}
        </span>
      </div>
    </button>
  );
}
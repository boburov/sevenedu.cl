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
      } catch {}

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
        } catch {}
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
      onClick={openGooglePopup}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        className="w-5 h-5"
      />
      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}
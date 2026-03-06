"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const appOrigin =
      process.env.NEXT_PUBLIC_APP_ORIGIN || window.location.origin;

    const finishLogin = (token: string) => {
      localStorage.setItem("token", token);
      setLoading(false);

      try {
        popupRef.current?.close();
      } catch {}

      // replace is a bit safer here than push
      window.location.replace("/dashboard");
    };

    const onMessage = (event: MessageEvent) => {
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

    const onFocus = () => {
      if (!loading) return;

      const token = localStorage.getItem("token");
      if (token) {
        finishLogin(token);
      }
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("focus", onFocus);
    };
  }, [loading, router]);

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
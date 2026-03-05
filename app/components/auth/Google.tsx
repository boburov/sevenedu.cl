"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // accept only from SAME origin as your frontend (prevents token theft)
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "oauth" && typeof event.data.token === "string") {
        localStorage.setItem("token", event.data.token);

        // cleanup
        window.removeEventListener("message", onMessage);
        try {
          popupRef.current?.close();
        } catch {}

        router.push("/dashboard");
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  const openGooglePopup = () => {
    setLoading(true);

    const width = 520;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const origin = encodeURIComponent(window.location.origin);
    const url = `https://api.sevenedu.store/auth/google?origin=${origin}`;

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

    // If popup closed without completing auth
    const timer = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(timer);
        setLoading(false);
      }
    }, 500);
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
      {loading ? "Opening Google..." : "Continue with Google"}
    </button>
  );
}
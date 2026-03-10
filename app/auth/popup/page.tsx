"use client";
import { useEffect } from "react";

export default function OAuthPopupPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || window.location.origin;

    if (error) {
      if (window.opener) {
        window.opener.postMessage({
          type: "oauth_error",
          error: decodeURIComponent(error)
        }, appOrigin);
        setTimeout(() => window.close(), 300);
      } else {
        // ✅ opener yo'q — localStorage orqali xabar ber
        localStorage.setItem("oauth_error", decodeURIComponent(error));
        window.close();
      }
      return;
    }

    if (token) {
      localStorage.setItem("token", token);

      if (window.opener) {
        // ✅ Bir necha marta yuborish — yuborilishini kafolatlash uchun
        window.opener.postMessage({ type: "oauth", token }, appOrigin);
        setTimeout(() => window.opener?.postMessage({ type: "oauth", token }, appOrigin), 100);
        setTimeout(() => window.close(), 500);
      } else {
        // ✅ opener yo'q bo'lsa ham token localStorage da — GoogleButton uni topadi
        localStorage.setItem("oauth_success", "true");
        window.close();
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  );
}
"use client";

import { useEffect } from "react";

export default function OAuthPopupPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    const appOrigin =
      process.env.NEXT_PUBLIC_APP_ORIGIN || window.location.origin;

    console.log("popup loaded", { token, error, appOrigin });

    if (error) {
      if (window.opener) {
        window.opener.postMessage({
          type: "oauth_error",
          error: decodeURIComponent(error)
        }, appOrigin);
      }
      window.close();
      return;
    }

    if (token) {
      localStorage.setItem("token", token);

      if (window.opener) {
        window.opener.postMessage({ type: "oauth", token }, appOrigin);
      }
    }

    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  );
}
"use client";
import { useEffect } from "react";
import Home from "./components/Home";

export default function Page() {
  useEffect(() => {
    alert("useEffect ishga tushdi ✅");

    if (typeof window === "undefined") {
      alert("❌ window aniqlanmagan (probably SSR)");
      return;
    }

    const tg = (window as any).Telegram;
    if (!tg) {
      alert("❌ Telegram obyekti topilmadi");
      return;
    }

    if (!tg.WebApp) {
      alert("❌ Telegram.WebApp topilmadi");
      return;
    }

    try {
      tg.WebApp.ready();
      tg.WebApp.expand();
      alert("✅ Telegram.WebApp ready va expand ishladi");
    } catch (err) {
      alert("❌ Telegram.WebApp error: " + JSON.stringify(err));
    }
  }, []);

  return (
    <div>
      <Home />
    </div>
  );
}

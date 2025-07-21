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
  }, []);

  return (
    <div>
      <Home />
    </div>
  );
}

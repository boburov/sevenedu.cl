"use client";
import { useEffect } from "react";
import Home from "./components/Home";

export default function Page() {
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div>
      <Home />
    </div>
  );
}

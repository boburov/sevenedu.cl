"use client";
import { useEffect } from "react";
import HomePage from "./components/Home";

export default function Page() {
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div>
      <HomePage />
    </div>
  );
}

"use client";

import { getUserByEmail } from "@/app/api/service/api";
import TwoFactorForm from "@/app/components/TwoFactor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const email =
      typeof window !== "undefined" ? localStorage.getItem("email") : null;

    if (!email) {
      router.push("signup");
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await getUserByEmail(email);
        if (user?.email) {
          localStorage.setItem("email", user.email);
        } else {
          router.push("signup");
        }
      } catch (err) {
        setError("Failed to verify user. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-danger-soft text-danger px-6 py-4 rounded-card text-center max-w-sm">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft/30 via-background to-background flex items-center justify-center">
      <TwoFactorForm />
    </div>
  );
};

export default VerifyPage;

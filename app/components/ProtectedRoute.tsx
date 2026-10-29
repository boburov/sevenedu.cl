"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/app/api/service/api";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await verifyToken();
        setLoading(false);
      } catch (err) {
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return <div className="pt-20 text-center text-[15px] text-text-secondary">Yuklanmoqda...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

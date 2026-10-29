import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-text-secondary">Yuklanmoqda...</div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
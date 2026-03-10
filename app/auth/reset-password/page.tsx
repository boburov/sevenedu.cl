import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 to-fuchsia-50">
        <div className="text-slate-400 text-sm">Yuklanmoqda...</div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
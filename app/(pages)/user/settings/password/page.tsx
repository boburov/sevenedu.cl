"use client";
import { useEffect, useState } from "react";
import { getMe, updateUser } from "@/app/api/service/api";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { Checkbox } from "@/app/components/ui/Checkbox";

// Xabarning ohangi (success / danger) shu satr bo'yicha aniqlanadi — qo'shimcha
// holat kiritmaslik uchun. Matn o'zgarsa, bu yerda ham o'zgarishi kerak.
const SUCCESS_MESSAGE = "Parol yangilandi. Emailga xabar yuborildi.";

const PasswordChanger = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("password");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUserId(data.id);
      } catch {
        setMessage("Foydalanuvchini aniqlab bo‘lmadi.");
      }
    };

    fetchUser();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
      setMessage("Paroll bo'sh bo'lmasligi kerak");
      return;
    }

    if (!userId) {
      setMessage("Foydalanuvchi aniqlanmadi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Yangi parollar mos emas.");
      return;
    }

    try {
      await updateUser(userId, { password: newPassword });
      setMessage(SUCCESS_MESSAGE);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("Xatolik: " + err.message);
      } else {
        setMessage("Parolni o‘zgartirib bo‘lmadi.");
      }
    }
  };

  const isSuccess = message === SUCCESS_MESSAGE;

  return (
    <div className="container py-8 sm:py-10">
      <div className="max-w-xl">
        <header>
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
            Parolni o&rsquo;zgartirish
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Parol xavfsizligi
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-4 rounded-card border border-border bg-surface p-5 sm:p-6">
          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Yangi parol
            </label>
            <Input
              id="new-password"
              type={type}
              placeholder="Yangi parol"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Yangi parol (takroran)
            </label>
            <Input
              id="confirm-password"
              type={type}
              placeholder="Yangi parol (takroran)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2.5">
            <Checkbox
              id="show-password"
              className="focus-ring"
              checked={type === "text"}
              onCheckedChange={(checked) =>
                setType(checked === true ? "text" : "password")
              }
            />
            <label
              htmlFor="show-password"
              className="cursor-pointer text-sm text-text-secondary"
            >
              {type === "password" ? "ko'rish" : "berkitish"}
            </label>
          </div>

          <Button type="button" className="w-full" onClick={handleChangePassword}>
            Parolni yangilash
          </Button>

          {message && (
            <p
              role={isSuccess ? "status" : "alert"}
              className={`rounded-input border px-4 py-3 text-sm font-medium ${
                isSuccess
                  ? "border-success/30 bg-success-soft text-success"
                  : "border-danger/30 bg-danger-soft text-danger"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChanger;

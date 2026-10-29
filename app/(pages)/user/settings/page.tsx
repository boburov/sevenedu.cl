"use client";

import { checkEmail, getMe, updateUser } from "@/app/api/service/api";
import { Edit2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";

interface User {
  id: string;
  name: string;
  email: string;
  surname: string;
  password: string;
  phonenumber: string;
}

function debounce<T extends (...args: Parameters<T>) => Promise<void>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      void func(...args); // Promise qaytgani uchun void bilan uni handle qilamiz
    }, wait);
  };
}


const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const debouncedEmailCheck = useCallback(
    debounce(async (rawEmail: string) => {
      const email = rawEmail.trim();
      if (!email) {
        setEmailExists(false);
        setEmailError(null);
        return;
      }

      if (!isValidEmail(email)) {
        setEmailExists(false);
        setEmailError("Email formati noto‘g‘ri");
        return;
      }

      try {
        const existingUser = await checkEmail(email);
        if (existingUser.exists) {
          if (user && user.email.trim().toLowerCase() !== email.toLowerCase()) {
            setEmailExists(true);
            setEmailError("Bu email allaqachon ishlatilmoqda");
          } else {
            setEmailExists(false);
            setEmailError(null);
          }
        } else {
          setEmailExists(false);
          setEmailError(null);
        }
      } catch (error) {
        const err = error as { message?: string };
        setEmailExists(false);
        setEmailError(err.message || "Email tekshirishda xatolik yuz berdi");
      }
    }, 500),
    [user]
  );



  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => { });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEmailError(null);
    setEmailExists(false);

    setUser(prev => {
      if (!prev) {
        return { id: "temp-id", email: "", name: "", surname: "", password: "", phonenumber: "", [name]: value };
      }
      return { ...prev, [name]: value };
    });

    if (name === "email") {
      debouncedEmailCheck(value);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (emailExists) {
      alert("Bu email allaqachon ishlatilmoqda. Iltimos, boshqa email kiriting.");
      return;
    }
    if (emailError) {
      alert(emailError);
      return;
    }
    try {
      const updatedUser = await updateUser(user.id, {
        name: user.name,
        surname: user.surname,
        email: user.email.trim().toLowerCase(),
        phonenumber: user.phonenumber,
        password: user.password,
      });
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profil yangilandi!");
    } catch {
      alert("Yangilashda xatolik yuz berdi");
    }
  };

  if (!user)
    return (
      <div className="container py-8 sm:py-10">
        <p className="text-[15px] text-text-secondary">Yuklanmoqda...</p>
      </div>
    );

  return (
    <div className="container py-8 sm:py-10">
      <div className="max-w-xl">
        <header>
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-text-primary sm:text-[40px]">
            Profil sozlamalari
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Shaxsiy ma&rsquo;lumotlarni tahrirlash
          </p>
        </header>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            aria-label={isEditing ? "Bekor qilish" : "Tahrirlash"}
          >
            {isEditing ? (
              <X size={16} strokeWidth={1.75} />
            ) : (
              <Edit2 size={16} strokeWidth={1.75} />
            )}
            <span>{isEditing ? "Bekor qilish" : "Tahrirlash"}</span>
          </Button>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
          className="mt-4 space-y-5 rounded-card border border-border bg-surface p-5 sm:p-6"
        >
          <InputField
            id="name"
            name="name"
            label="Ism"
            value={user.name}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <InputField
            id="surname"
            name="surname"
            label="Familya"
            value={user.surname}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
            required
            error={emailExists || emailError ? emailError : null}
            errorHighlight={emailExists || Boolean(emailError)}
          />
          <InputField
            id="phonenumber"
            name="phonenumber"
            label="Telefon raqam"
            value={user.phonenumber}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {isEditing && (
            <Button type="submit" className="mt-2 w-full">
              Saqlash
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  required?: boolean;
  error?: string | null;
  errorHighlight?: boolean;
}

const InputField = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  required = false,
  error = null,
  errorHighlight = false,
}: InputFieldProps) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-text-secondary"
    >
      {label}
    </label>
    <Input
      id={id}
      name={name}
      type={type}
      placeholder={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      error={errorHighlight}
      aria-invalid={errorHighlight || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
        {error}
      </p>
    )}
  </div>
);

export default Page;

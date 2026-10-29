"use client";

import { checkEmail, getMe, updateUser } from "@/app/api/service/api";
import { Edit2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

  if (!user) return <div>Yuklanmoqda...</div>;

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg text-white">
      <button
        className="flex items-center gap-2 bg-green-600/30 hover:bg-green-700/40 border border-green-500/20 transition-colors px-5 py-2 rounded-lg mb-6"
        onClick={() => setIsEditing(!isEditing)}
        aria-label={isEditing ? "Bekor qilish" : "Tahrirlash"}
      >
        <Edit2 />
        <span>{isEditing ? "Bekor qilish" : "Tahrirlash"}</span>
      </button>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-5"
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
          <button
            type="submit"
            className="w-full bg-green-600/20 border border-green-600 hover:bg-green-700/40 transition-colors py-3 rounded-md text-white font-semibold mt-4"
          >
            Saqlash
          </button>
        )}
      </form>
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
    <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-300">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`w-full bg-white/10 h-12 rounded-md px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errorHighlight ? "focus:ring-red-500 border border-red-500" : "focus:ring-green-500"
        }`}
    />
    {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
  </div>
);

export default Page;

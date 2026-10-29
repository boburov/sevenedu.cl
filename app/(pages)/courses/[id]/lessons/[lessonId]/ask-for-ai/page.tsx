"use client";

import {
  Send,
  X,
  MessageCircle,
  Bot,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import api, { getMe } from "@/app/api/service/api";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

type Message = {
  role: "user" | "ai";
  text: string;
};

// API request function
const sendrequestForAI = async (lessonId: string, message: string, userId: string) => {
  try {
    const response = await api.post('/user/chat', {
      lessonId,
      message,
      userId
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Siz bugungi 10 ta kreditdan foydalandingiz. Ertaga qayta urinib ko'ring.");
    }
    throw error;
  }
};

const ChatWidget = () => {
  const { lessonId } = useParams() as { lessonId: string };
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [credit, setCredit] = useState<number>(10);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Screen size detection - client only
  useEffect(() => {
    if (!isMounted) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [isMounted]);

  // Auto scroll to bottom - client only
  const scrollToBottom = () => {
    if (messagesEndRef.current && isMounted) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isMounted) {
      scrollToBottom();
    }
  }, [messages, isMounted]);

  const fetchUser = async () => {
    try {
      const me = await getMe();
      setUserId(me.id);
    } catch (err) {
      console.error("Foydalanuvchini olishda xatolik:", err);
      setError("Foydalanuvchi ma'lumotlari olinmadi");
    }
  };

  const fetchCredit = async (uid: string) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      const res = await api.get(`/user/ai-usage?userId=${uid}&lessonId=${lessonId}&date=${startOfDay.toISOString()}`);
      const usedCount = res.data.count || 0;
      setCredit(10 - usedCount);

      if (usedCount >= 10) {
        setError("Siz bugungi 10 ta kreditdan foydalandingiz. Ertaga qayta urinib ko'ring.");
      }
    } catch (err: any) {
      console.error("Kreditni olishda xatolik:", err);
      if (err.response?.status === 404) {
        setCredit(10);
      } else {
        setError("Kredit ma'lumotlari olinmadi");
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading || credit <= 0 || !userId) return;

    const newUserMessage: Message = { role: "user", text: message };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setMessage("");

    try {
      const data = await sendrequestForAI(lessonId, message, userId);
      const newAIMessage: Message = { role: "ai", text: data.answer };
      setMessages((prev) => [...prev, newAIMessage]);

      setCredit(prev => prev - 1);
    } catch (err: any) {
      console.error("Xatolik:", err);

      if (err.message.includes("kreditdan foydalandingiz")) {
        setCredit(0);
        setError(err.message);
      } else {
        setError(err.response?.data?.message || "Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchUser();
    }
  }, [isMounted]);

  useEffect(() => {
    if (userId && lessonId && isMounted) {
      fetchCredit(userId);
    }
  }, [userId, lessonId, isMounted]);

  const closeChat = () => {
    setIsOpen(false);
    setError(null);
  };

  const openChat = () => {
    setIsOpen(true);
    setError(null);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="font-sans">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="focus-ring group fixed z-50 grid place-items-center rounded-full border border-primary bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
          style={{
            bottom: '100px',
            right: '1rem',
            width: '60px',
            height: '60px'
          }}
          aria-label="AI yordamchisi bilan suhbatlashish"
        >
          <MessageCircle size={24} strokeWidth={1.75} />
          {credit > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-foreground">
              {credit}
            </span>
          )}
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-tile bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            AI Yordamchisi
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden rounded-card border border-border bg-surface"
          style={{
            bottom: '100px',
            right: '1rem',
            width: isMobile ? 'calc(100vw - 2rem)' : '380px',
            maxWidth: '380px',
            height: isMobile ? 'calc(100vh - 250px)' : '500px',
            maxHeight: isMobile ? 'none' : 'calc(100vh - 220px)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-strong">
                <Bot size={16} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-text-primary">AI Yordamchisi</h3>
                <p className="text-xs text-text-muted">
                  {userId ? `Qolgan kredit: ${credit}/10` : "Yuklanmoqda..."}
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="focus-ring grid h-8 w-8 place-items-center rounded-full text-text-muted transition-colors hover:bg-surface-alt hover:text-text-primary"
              aria-label="Chatni yopish"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-surface-alt p-4">
            {messages.length === 0 ? (
              <div className="py-12 text-center text-text-secondary">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-border bg-surface text-text-muted">
                  <Bot size={28} strokeWidth={1.75} />
                </div>
                <p className="mb-2 text-[15px] font-semibold text-text-primary">Savolingizni yozing</p>
                <p className="text-sm">Men sizga darslar bo'yicha yordam beraman</p>
                <p className="mt-2 text-xs text-text-muted">Har kuni 10 ta bepul savol</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-card px-4 py-2.5 text-sm ${msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface text-text-primary"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-card border border-border bg-surface px-4 py-3">
                      <span
                        className="block h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent"
                        aria-label="Javob yozilmoqda"
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-card border border-danger/30 bg-danger-soft p-3 text-sm text-danger">
                <AlertCircle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Credit Warning */}
            {credit <= 0 && (
              <div className="mt-4 flex items-start gap-2 rounded-card border border-warning/30 bg-warning-soft p-3 text-sm text-warning">
                <AlertTriangle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                <span>Kreditingiz tugadi. Ertaga 10 ta bepul savolga ega bo&apos;lasiz.</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={
                  credit <= 0
                    ? "Kreditingiz tugadi. Ertaga qayta urinib ko'ring."
                    : "Savolingizni yozing..."
                }
                className="flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || credit <= 0 || !userId}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || credit <= 0 || !userId || !message.trim()}
                size="icon"
                className="h-12 w-12 shrink-0"
                aria-label="Xabar yuborish"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <Send size={18} strokeWidth={1.75} />
                )}
              </Button>
            </div>

            {/* Credit Info */}
            <div className="mt-2 text-center text-xs text-text-muted">
              {userId ? (
                credit > 0 ? (
                  `Qolgan kredit: ${credit} ta`
                ) : (
                  "Bugungi kredit tugadi. Ertaga yangi kreditlar bilan qaytasiz."
                )
              ) : (
                "Yuklanmoqda..."
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
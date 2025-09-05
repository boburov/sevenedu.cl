"use client";

import { Send, X, MessageCircle, Bot, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import api, { getMe } from "@/app/api/service/api";

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
          className="fixed z-50 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 group border border-gray-200 dark:border-gray-700"
          style={{
            bottom: '100px',
            right: '1rem',
            width: '60px',
            height: '60px'
          }}
          aria-label="AI yordamchisi bilan suhbatlashish"
        >
          <MessageCircle size={24} className="mx-auto text-gray-600 dark:text-gray-300" />
          {credit > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {credit}
            </span>
          )}
          <span className="absolute opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded bottom-full mb-2 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 whitespace-nowrap">
            AI Yordamchisi
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
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
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">AI Yordamchisi</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userId ? `Qolgan kredit: ${credit}/10` : "Yuklanmoqda..."}
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Chatni yopish"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot size={28} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="font-medium mb-2">Savolingizni yozing</p>
                <p className="text-sm">Men sizga darslar bo'yicha yordam beraman</p>
                <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">Har kuni 10 ta bepul savol</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm whitespace-pre-wrap ${msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <div className="animate-pulse duration-1000">●</div>
                        <div className="animate-pulse duration-1000 delay-300">●</div>
                        <div className="animate-pulse duration-1000 delay-700">●</div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Credit Warning */}
            {credit <= 0 && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 text-sm">
                ⚠️ Kreditingiz tugadi. Ertaga 10 ta bepul savolga ega bo'lasiz.
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  credit <= 0
                    ? "Kreditingiz tugadi. Ertaga qayta urinib ko'ring."
                    : "Savolingizni yozing..."
                }
                className="flex-1 h-12 rounded-lg px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || credit <= 0 || !userId}
              />
              <button
                onClick={sendMessage}
                disabled={loading || credit <= 0 || !userId || !message.trim()}
                className="h-12 w-12 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-white"
                aria-label="Xabar yuborish"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            {/* Credit Info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
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
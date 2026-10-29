import axios from 'axios';
import apiEndpoins from '../api.endpoin';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.sevenedu.org',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

// Auth talab qilmaydigan endpointlar — bu yerda 401 (masalan, noto'g'ri parol)
// kelganda foydalanuvchini login ekraniga uloqtirmaslik kerak, oddiy xatolik
// sifatida ko'rsatiladi.
const AUTH_FREE_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify',
  '/auth/forgot-password',
  '/auth/reset-password',
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url || '';
    const isAuthFreePath = AUTH_FREE_PATHS.some((p) => url.includes(p));

    // Token eskirgan/yaroqsiz (401) — sessiyani markazlashgan tarzda tozalaymiz.
    // Bu har bir chaqiruvchining alohida 401 logikasiga tayanmasdan, butun
    // ilovada bir xil xatti-harakatni ta'minlaydi va login/logout aylanishini
    // (loop) oldini oladi.
    if (status === 401 && !isAuthFreePath && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }

    // Productionda sensitive ma'lumotlarni yashirish
    if (process.env.NODE_ENV === 'production') {
      const data = { ...error.response?.data };
      if (data?.pin) data.pin = "***";
      if (data?.token) data.token = "***";
      if (data?.password) data.password = "***";
      console.error("API Error:", data?.message || error.message || "Noma'lum xatolik yuz berdi.");
    } else {
      console.error(error);
    }

    // ⚡ Bu yerda faqat message emas, butun error obyektini qaytaring
    return Promise.reject(error); // ← asliy AxiosError qaytadi
  }
);
export const updateUserProfilePic = async (userId: string, formData: FormData) => {
    const response = await api.post(apiEndpoins.updateUserProfilePic(userId), formData);
    return response.data;
};

export const register = async (data: object) => {
    const res = await api.post(apiEndpoins.registerUser, data);
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const verifyCode = async (data: object) => {
    const res = await api.post(apiEndpoins.verifyCode, data);
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const login = async (data: object) => {
    const res = await api.post(apiEndpoins.loginUser, data);
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const getMe = async (navigate?: (path: string) => void) => {
    try {
        const res = await api.get(apiEndpoins.getMe);
        return res.data;
    } catch (err: any) {
        if (err.response?.status === 401) {
            if (navigate) {
                navigate('/auth/login');
            } else {
                window.location.href = '/auth/login';
            }
            return null;
        }

        if (err.response?.status === 404) return null;
        throw err;
    }
};



export const checkEmail = async (email: string) => {
    try {
        const res = await api.get(`user/check?email=${encodeURIComponent(email)}`);
        return res.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 400) {
                return { exists: true };
            }
        }
        throw new Error('Email tekshirishda xatolik');
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const res = await api.get(`/user/by-email`, {
            params: { email }
        });
        if (res.status === 404) return null;
        return res.data;
    } catch {
        return null;
    }
};

export const updateUser = async (id: string, data: object) => {
    const res = await api.patch(apiEndpoins.updateUser(id), data);
    return res.data.user;
};

export const deleteUserProfilePic = async (userId: string) => {
    const response = await api.delete(`/user/deleteProfilePic/${userId}`);
    return response.data;
};

export const markNotificationAsRead = async (notificationRecipientId: string) => {
    const res = await api.put(`/notifications/${notificationRecipientId}`, { isRead: true });
    return res.data;
};

export const forgotPassword = async (email: string) => {
    try {
        const res = await api.post('/auth/forgot-password', { email });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Foydalanuvchi topilmadi');
            }
        }
        throw error;
    }

};

export const getUserActivity = async () => {
    const res = await api.get("lesson-activity");
    return res.data;
};

// Courses
export const allCourse = async () => {
    const allCourse = await api.get(apiEndpoins.allCourse);
    return allCourse.data;
};

export const GetCourseById = async (id: string) => {
    const res = await api.get(apiEndpoins.getCategory(id));
    return res.data;
};

export const GetLessonsById = async (id: string) => {
    const res = await api.get(apiEndpoins.getLessonById(id))
    return res.data
}

export const allUsers = async () => {
    return await api.get("user/all")
}

// Reyting — coin bo'yicha top 100 o'quvchi + joriy foydalanuvchining o'rni.
// `user/all` admin-only bo'lgani uchun oddiy foydalanuvchilar shu endpointdan foydalanadi.
export const getLeaderboard = async () => {
    const res = await api.get("user/leaderboard");
    return res.data as {
        leaderboard: Array<{
            id: string;
            name?: string;
            surname?: string;
            profilePic?: string;
            coins: number;
            rank: number;
        }>;
        currentUser: {
            id: string;
            name?: string;
            surname?: string;
            profilePic?: string;
            coins: number;
            rank: number;
        } | null;
    };
};

// Joriy foydalanuvchining streak ma'lumoti (uzilgan bo'lsa currentStreak = 0).
export const getStreak = async () => {
    const res = await api.get("streak");
    return res.data as {
        currentStreak: number;
        longestStreak: number;
        todayActive?: boolean;
        weekDays?: { date: string; weekday: string; active: boolean; isToday: boolean }[];
    };
};

// Kunlik statistika (vocabulary / quiz / test) — GitHub activity uslubidagi grafik uchun.
export const getDailyStats = async () => {
    const res = await api.get("user/daily-stats");
    return res.data as Array<{
        date: string;
        vocabulary: { total: number; correct: number };
        quiz: { total: number; correct: number };
        test: { total: number; correct: number };
    }>;
};

// ai usage
export const sendrequestForAI = async (lessonId: string, message: string, userId: string) => {
    const response = await api.post('/user/chat', {
        lessonId,
        message,
        userId
    });
    return response.data;
};
export const addCoins = async (userId: string, coins: number) => {
    const res = await api.post(apiEndpoins.addCoin, { userId, coins });
    return res.data;
};

export const showedLesson = async (lessonId: string) => {
    const res = await api.post("/user/mark-lesson-seen", { lessonId });
    return res.data;
};

export const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    try {
        const res = await api.get(`/auth/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

export default api;
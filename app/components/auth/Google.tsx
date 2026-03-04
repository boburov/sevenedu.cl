"use client";
import Image from "next/image";
import { useState } from "react";

export default function Google({ setErrorMessage }: any) {
    const [loading, setLoading] = useState(false);

    const openGooglePopup = () => {
        const width = 500;
        const height = 500;

        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const url = `http://sevenedu.store/auth/google`;

        const popup = window.open(
            url,
            "google_oauth",
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (!popup) {
            alert("Popup blocked. Please allow popups for this site.");
            return;
        }

        const onMessage = (event: MessageEvent) => {
            // SECURITY: only accept messages from your own Next.js origin
            const allowedOrigin = window.location.origin;
            if (event.origin !== allowedOrigin) return;

            if (event.data?.type === "oauth" && event.data?.token) {
                localStorage.setItem("token", event.data.token);
                window.removeEventListener("message", onMessage);

                // optional: refresh user or redirect
                window.location.href = "/dashboard";
            }
        };

        window.addEventListener("message", onMessage);
    };

    return (
        <button
            onClick={openGooglePopup}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
            />
            Google bilan davom etish
        </button>
    );
}
"use client";

import { useEffect } from "react";

export default function OAuthPopupPage() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token && window.opener) {
            window.opener.postMessage(
                { type: "oauth", token },
                window.location.origin
            );
        }

        window.close();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-gray-500">Signing you in…</p>
        </div>
    );
}
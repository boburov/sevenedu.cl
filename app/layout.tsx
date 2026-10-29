import { ToastContainer } from "react-toastify";
import Script from "next/script";
import { Onest } from "next/font/google";
import "./globals.css";

// Butun ilovaning shrifti. O'zgaruvchan (variable) shrift — bitta faylda
// 400 dan 800 gacha vaznlar, shuning uchun sarlavha/matn/izoh ierarxiyasi
// erkin quriladi. Oldingi robobold/robolight juftligida faqat ikki chekka
// vazn bor edi va body sukut bo'yicha qalin edi.
const onest = Onest({
  subsets: ["latin", "latin-ext"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata = {
  title: "SevenEdu Web App",
  description: "Platformaga kirish usulini tanlang. O‘quvchi sifatida kirish · Mehmon sifatida kirish.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "SevenEdu Web App",
    description: "Platformaga kirish usulini tanlang. O‘quvchi sifatida kirish · Mehmon sifatida kirish.",
    url: "https://sevenedu.uz",
    siteName: "SevenEdu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SevenEdu platformasi",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning className={onest.variable}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q3DLE0CTCG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Q3DLE0CTCG');
          `}
        </Script>
        <ToastContainer position="top-right" />
        {children}
      </body>
    </html>
  );
}

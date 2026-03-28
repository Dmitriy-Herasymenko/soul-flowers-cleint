import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";
import { AppFooter } from "@/components/AppFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Soul Flowers - Купити квіти з доставкою | Свіжі букети онлайн',
    template: '%s | Soul Flowers',
  },
  description: 'Широкий вибір свіжих квітів: троянди, тюльпани, орхідеї та авторські букети. Замовляйте онлайн з доставкою по Україні.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </CartProvider>
      </body>
    </html>
  );
}

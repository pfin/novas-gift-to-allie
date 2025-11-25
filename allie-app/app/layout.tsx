import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GameProvider } from "@/lib/gameContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Allie's Bus Adventure 🚌",
  description: "An interactive adventure game for Allie!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}

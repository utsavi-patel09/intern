"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen font-sans antialiased text-slate-900 bg-slate-50 selection:bg-indigo-500/30">
        
        {/* Aesthetic Animated Background Mesh */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--color-app-bg)]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 mix-blend-multiply filter blur-[120px] animate-pulse"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/20 mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDelay: "4s" }}></div>
        </div>

        <SessionProvider>
          <Navbar />
          <div className="pt-24 pb-12 min-h-screen flex flex-col">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

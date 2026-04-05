"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import { DepartmentProvider } from "@/context/DepartmentContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen font-sans antialiased text-slate-900 bg-[var(--color-app-bg)] selection:bg-sky-500/20">
        
        {/* Professional Background Pattern */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--color-app-bg)]">
          <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/[0.04] filter blur-[100px]"></div>
          <div className="absolute bottom-[-15%] left-[-5%] w-[40%] h-[40%] rounded-full bg-slate-400/[0.04] filter blur-[100px]"></div>
        </div>

        <SessionProvider>
          <DepartmentProvider>
            <Navbar />
            <div className="pt-24 pb-12 min-h-screen flex flex-col">
              {children}
            </div>
          </DepartmentProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

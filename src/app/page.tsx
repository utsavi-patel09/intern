"use client";

import Hero from "@/components/features/landing/Hero";
import Features from "@/components/features/landing/Features";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-start relative w-full overflow-x-hidden selection:bg-sky-100 selection:text-sky-900">
      {/* Subtle professional accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/[0.05] blur-[150px] rounded-[100%]"></div>
      </div>

      <Hero />
      <Features />
      <Footer />
    </main>
  );
}

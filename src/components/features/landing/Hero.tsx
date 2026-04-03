import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 lg:px-8 pt-20 pb-24 text-center z-10 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 border border-slate-200/80 shadow-sm backdrop-blur-md text-slate-700 text-xs font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-top-8 duration-1000">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1E3A5F]"></span>
        </span>
        Professional Internship Management
      </div>

      <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-slate-900 tracking-tighter leading-[1] mb-8 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both font-heading">
        Empower <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#1E3A5F] to-[#0EA5E9]">Interns.</span><br />
        Simplify <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4]">Work.</span>
      </h1>

      <p className="text-xl md:text-2xl text-slate-500 mb-14 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
        A beautifully crafted, highly intelligent platform for tracking, evaluating, and managing the rising stars of your organization.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
        {!session ? (
          <Link href="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#1E3A5F] text-white border border-transparent px-10 py-5 text-lg font-bold rounded-2xl hover:bg-[#0EA5E9] hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
              Get Started Now
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </Link>
        ) : (
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#1E3A5F] text-white border border-transparent px-10 py-5 text-lg font-bold rounded-2xl hover:bg-[#0F2137] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
              Go to Dashboard
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </Link>
        )}
        <a href="#features" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200 px-10 py-5 text-lg font-bold rounded-2xl hover:bg-white hover:border-sky-200 hover:text-[#1E3A5F] shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3">
            Explore Features
          </button>
        </a>
      </div>
    </section>
  );
}

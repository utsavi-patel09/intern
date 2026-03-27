export default function Footer() {
  return (
    <footer className="w-full py-12 relative z-10 border-t border-slate-200 bg-white">
      <div className="container max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">InternHub</span>
        </div>
        <p className="text-slate-400 font-medium text-sm">
          © {new Date().getFullYear()} InternHub. Crafted for the future of work.
        </p>
      </div>
    </footer>
  );
}

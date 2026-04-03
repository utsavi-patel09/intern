export default function Footer() {
  return (
    <footer className="w-full py-12 relative z-10 border-t border-slate-200 bg-white">
      <div className="container max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A5F] to-[#0EA5E9] flex items-center justify-center text-white shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">InternHub</span>
        </div>
        <p className="text-slate-400 font-medium text-sm">
          © {new Date().getFullYear()} InternHub. Professional Intern Management Platform.
        </p>
      </div>
    </footer>
  );
}

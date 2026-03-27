export default function Features() {
  return (
    <section id="features" className="w-full relative py-32 bg-white/50 border-t border-slate-200/50 backdrop-blur-3xl z-10">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight font-heading">Engineered for Scale</h2>
          <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">Everything you need to orchestrate internship programs without the operational headaches.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(79,70,229,0.1)] hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 shadow-sm border border-indigo-100 text-indigo-600 bg-indigo-50 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Role-Based Ecosystem</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">Dedicated, fully-customized environments for System Admins, Department Managers, and Interns. Secure and isolated.</p>
          </div>

          {/* Feature 2 */}
          <div className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(236,72,153,0.1)] hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 shadow-sm border border-pink-100 text-pink-600 bg-pink-50 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Department Analytics</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">Organize teams effortlessly with native department assignments, filtering, and real-time manager tracking.</p>
          </div>

          {/* Feature 3 */}
          <div className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(16,185,129,0.1)] hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 shadow-sm border border-emerald-100 text-emerald-600 bg-emerald-50 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-heading">Seamless Tasks</h3>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">Assign tasks, track progress visually, and manage interconnected workflows with unparalleled ease.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

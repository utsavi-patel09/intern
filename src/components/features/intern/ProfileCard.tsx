import { Intern } from "@/types";

interface ProfileCardProps {
  intern: Intern;
  departmentName: string;
}

export function ProfileCard({ intern, departmentName }: ProfileCardProps) {
  return (
    <div className="card-glass bg-white/60 p-8 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-sky-50 to-sky-100 shadow-inner flex items-center justify-center mb-6 relative group overflow-hidden border-4 border-white/60">
        <span className="text-5xl font-black text-[#1E3A5F]/40">{intern.name.charAt(0).toUpperCase()}</span>
        <div className="absolute inset-0 bg-[#1E3A5F]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
          <svg className="w-8 h-8 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
      </div>
      <h2 className="text-xl font-bold text-slate-800 font-heading mb-1">{intern.name}</h2>
      <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-[#1E3A5F] uppercase tracking-wider mb-4 border border-sky-100">
        {departmentName} Intern
      </p>
      <div className="w-full flex flex-col gap-3 mt-2 border-t border-slate-200/50 pt-6">
        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
          {intern.email}
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Joined {intern.start_date ? new Date(intern.start_date).toLocaleDateString() : "-"}
        </div>
      </div>
    </div>
  );
}

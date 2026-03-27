interface UserFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  filteredCount: number;
}

export function UserFilters({ 
  search, 
  setSearch, 
  activeRole, 
  setActiveRole, 
  filteredCount 
}: UserFiltersProps) {
  return (
    <div className="px-6 py-5 border-b border-slate-200/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 backdrop-blur-md">
      <div className="flex flex-col gap-4 w-full sm:w-auto">
        <h2 className="section-title flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-100/50 flex items-center justify-center text-pink-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          System Users
        </h2>

        {/* Role Filter Tabs */}
        <div className="flex p-1 bg-slate-100/50 backdrop-blur-sm rounded-xl border border-slate-200 w-fit">
          {['all', 'manager', 'intern'].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRole(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeRole === r
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          {filteredCount} Users
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 py-2 text-sm bg-white/60 hover:bg-white transition-colors border-slate-200"
          />
        </div>
      </div>
    </div>
  );
}

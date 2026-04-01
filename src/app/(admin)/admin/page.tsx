"use client";

import { useEffect, useState } from "react";

interface DepartmentCount {
  department: string;
  count: number;
}

interface Stats {
  totalUsers: number;
  totalInterns: number;
  departmentCounts: DepartmentCount[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalInterns: 0,
    departmentCounts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data: Stats = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">Loading dashboard...</div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900">
            Overview
          </h1>
          <p className="text-slate-500 font-medium">{today}</p>
        </div>

      </div>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* USERS CARD */}
        <div className="card-glass p-6 group lg:col-span-2 relative overflow-hidden bg-white/50">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Total Users</p>
              <div className="flex items-end gap-3">
                <h2 className="text-6xl font-extrabold font-heading text-slate-900 tracking-tight">
                  {stats.totalUsers}
                </h2>

              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-500 text-indigo-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* INTERNS CARD */}
        <div className="card-glass p-6 group lg:col-span-2 relative overflow-hidden bg-white/50">
          <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Active Interns</p>
              <div className="flex items-end gap-3">
                <h2 className="text-6xl font-extrabold font-heading text-slate-900 tracking-tight">
                  {stats.totalInterns}
                </h2>

              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-100/50 flex items-center justify-center shadow-sm group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all duration-500 text-pink-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* DEPARTMENT TABLE */}
        <div className="lg:col-span-2 table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60">
          <div className="px-6 py-5 border-b border-slate-200/60 flex justify-between items-center bg-white/40 backdrop-blur-md">
            <h2 className="section-title flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100/50 flex items-center justify-center text-indigo-500">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Interns by Department
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th w-2/3 bg-slate-50/50">Department</th>
                  <th className="table-th text-right bg-slate-50/50">Headcount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.departmentCounts.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <p className="font-semibold text-slate-600">No department data available</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stats.departmentCounts.map((d) => (
                    <tr key={d.department} className="table-row group bg-white/40">
                      <td className="table-td py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
                            <span className="font-black text-sm">{d.department.charAt(0)}</span>
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{d.department}</span>
                        </div>
                      </td>
                      <td className="table-td text-right py-4">
                        <span className="inline-flex items-center justify-center min-w-[2.75rem] px-3 py-1.5 rounded-xl text-sm font-black bg-white border border-slate-200 text-slate-700 shadow-sm group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-300">
                          {d.count}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>



      </div>

    </div>
  );
}
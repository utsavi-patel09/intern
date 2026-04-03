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
        const res = await fetch("/api/start");

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
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#1E3A5F] rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900">Overview</h1>
          <p className="text-slate-500 font-medium">{today}</p>
        </div>
      </div>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {/* USERS CARD */}
        <div className="card-glass p-6 group lg:col-span-2 relative overflow-hidden bg-white/60">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#1E3A5F]/[0.06] rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">
                Total Users
              </p>
              <div className="flex items-end gap-3">
                <h2 className="text-6xl font-extrabold font-heading text-slate-900 tracking-tight">
                  {stats.totalUsers}
                </h2>
              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100/50 flex items-center justify-center shadow-sm group-hover:bg-[#1E3A5F] group-hover:text-white transition-all duration-500 text-[#1E3A5F]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* INTERNS CARD */}
        <div className="card-glass p-6 group lg:col-span-2 relative overflow-hidden bg-white/60">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/[0.06] rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">
                Active Interns
              </p>
              <div className="flex items-end gap-3">
                <h2 className="text-6xl font-extrabold font-heading text-slate-900 tracking-tight">
                  {stats.totalInterns}
                </h2>
              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100/50 flex items-center justify-center shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-all duration-500 text-sky-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* DEPARTMENT TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70">

          <div className="px-6 py-5 border-b border-slate-200/60 flex justify-between items-center bg-white/50 backdrop-blur-md">
            <h2 className="section-title">Interns by Department</h2>
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
                    <td colSpan={2} className="text-center py-16 text-slate-500">
                      No department data available
                    </td>
                  </tr>
                ) : (
                  stats.departmentCounts.map((d) => (
                    <tr key={d.department} className="table-row group bg-white/50">
                      <td className="table-td py-4">{d.department}</td>
                      <td className="table-td text-right py-4">{d.count}</td>
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
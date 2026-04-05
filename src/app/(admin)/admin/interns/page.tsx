"use client";


import { useEffect, useState } from "react";
import { useDepartments } from "@/context/DepartmentContext";

interface InternWithUser {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: string;
  department_id: number | null;
  department_name?: string;
  created_at: string | null;
  college: string;
  phone_number: string;
  start_date: string;
}

export default function InternsPage() {
  const [interns, setInterns] = useState<InternWithUser[]>([]);
  const { departments, loading: depsLoading } = useDepartments();
  const [filterCollege, setFilterCollege] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<number | "">("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const internsRes = await fetch("/api/interns");
        const internsData = await internsRes.json();

        setInterns(Array.isArray(internsData) ? internsData : []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredInterns = interns.filter(
    (i) =>
      (!filterCollege || i.college === filterCollege) &&
      (!filterDepartment || i.department_id === filterDepartment)
  );

  const getDeptName = (id: number | null) =>
    departments.find((d) => d.id === id)?.name || "-";

  const colleges = Array.from(new Set(interns.map((i) => i.college))).filter(Boolean);

  const filteredData = filteredInterns.filter((item: InternWithUser) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#1E3A5F] rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">Loading interns...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title text-slate-900">
            Intern Management
          </h1>

        </div>
       
      </div>

      {/* Filters and Table Card */}
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 mb-8">

        {/* Filters Bar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            {/* College Filter */}
            <div className="relative min-w-[200px] w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1E3A5F]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <select
                value={filterCollege}
                onChange={(e) => setFilterCollege(e.target.value)}
                className="form-select pl-9 py-2.5 text-sm bg-white/70 hover:bg-white transition-colors border-slate-200 w-full font-medium text-slate-700"
              >
                <option value="">All Colleges</option>
                {colleges.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="relative min-w-[200px] w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value ? Number(e.target.value) : "")}
                className="form-select pl-9 py-2.5 text-sm bg-white/70 hover:bg-white transition-colors border-slate-200 w-full font-medium text-slate-700"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full xl:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search interns by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9 py-2.5 text-sm bg-white/70 hover:bg-white transition-colors border-slate-200 font-medium text-slate-700 placeholder:font-normal placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* DataTable */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th bg-slate-50/50">Intern Name</th>
                <th className="table-th bg-slate-50/50">Contact Info</th>
                <th className="table-th bg-slate-50/50">College</th>
                <th className="table-th bg-slate-50/50">Department</th>
                <th className="table-th bg-slate-50/50">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </div>
                      <p className="font-semibold text-slate-600">No interns found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item: InternWithUser) => (
                  <tr key={item.id} className="table-row group bg-white/50 hover:bg-white/85 transition-colors">
                    <td className="table-td py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 flex items-center justify-center text-[#1E3A5F] group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
                          <span className="font-black text-sm">{item.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-bold text-slate-800 text-base group-hover:text-[#1E3A5F] transition-colors">{item.name}</span>
                      </div>
                    </td>
                    <td className="table-td py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-800 transition-colors">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="text-sm font-medium">{item.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          <span className="text-sm">{item.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-td py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-white border border-slate-200 text-slate-700 shadow-sm group-hover:bg-sky-50 group-hover:border-sky-100 group-hover:text-[#1E3A5F] transition-all duration-300">
                        {item.college}
                      </span>
                    </td>
                    <td className="table-td py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-sky-50 text-[#1E3A5F] border border-sky-100 shadow-sm group-hover:bg-sky-100 transition-all duration-300">
                        {getDeptName(item.department_id)}
                      </span>
                    </td>
                    <td className="table-td py-4 text-slate-600 font-medium">
                      {item.start_date ? new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

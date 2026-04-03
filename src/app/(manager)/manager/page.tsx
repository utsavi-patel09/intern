import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { log } from "console";
import { cookies } from "next/headers";


interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
}

interface Intern {
  id: number;
  name: string;
  email: string;
  college: string;
  department: string;
  phone_number: string;
  start_date: string;
}

export default async function ManagerPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-sm border border-red-100">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 font-heading">Access Denied</h2>
        <p className="text-slate-500 font-medium">Please login to view this page.</p>
      </div>
    );
  }

const cookieStore = await cookies();

const cookieHeader = cookieStore
  .getAll()
  .map((c) => `${c.name}=${c.value}`)
  .join("; ");

const res = await fetch(`${process.env.NEXTAUTH_URL}/api/manager`, {
  cache: "no-store",
  headers: {
    cookie: cookieHeader,
  },
});
  log("Fetching manager data from API:", res.url, "Status:", res.status);

  if (!res.ok) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-sm border border-red-100">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 font-heading">Loading Failed</h2>
        <p className="text-slate-500 font-medium">Unable to load manager dashboard data.</p>
      </div>
    );
  }

  const data = await res.json();
  const manager: User = data.manager;
  const interns: Intern[] = data.interns;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900">
            Welcome, {manager.name}
          </h1>
          <p className="text-slate-500 font-medium">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="btn-secondary flex items-center gap-2 bg-white/60 backdrop-blur-md shadow-sm pointer-events-none">
            <svg className="w-5 h-5 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-bold text-slate-700">{manager.department} Department</span>
          </div>
        </div>
      </div>

      {/* INTERNS TABLE */}
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 mb-10">
        <div className="px-6 py-5 border-b border-slate-200/60 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h2 className="section-title flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1E3A5F]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Department Interns
          </h2>
          <div className="flex bg-sky-50 text-[#1E3A5F] px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            {interns.length} Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th bg-slate-50/50">Intern Name</th>
                <th className="table-th bg-slate-50/50">Contact Info</th>
                <th className="table-th bg-slate-50/50">College</th>
                <th className="table-th bg-slate-50/50">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interns.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      </div>
                      <p className="font-semibold text-slate-600">No interns assigned</p>
                      <p className="text-sm">There are currently no interns in your department.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                interns.map((intern) => (
                  <tr key={intern.id} className="table-row group bg-white/50 hover:bg-white/85 transition-colors">
                    <td className="table-td py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 flex items-center justify-center text-[#1E3A5F] group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
                          <span className="font-black text-sm">{intern.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-bold text-slate-800 group-hover:text-[#1E3A5F] transition-colors">{intern.name}</span>
                      </div>
                    </td>
                    <td className="table-td py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-800 transition-colors">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="text-sm font-medium">{intern.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          <span className="text-sm">{intern.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-td py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-white border border-slate-200 text-slate-700 shadow-sm group-hover:bg-sky-50 group-hover:border-sky-100 group-hover:text-[#1E3A5F] transition-all duration-300">
                        {intern.college}
                      </span>
                    </td>
                    <td className="table-td py-4 text-slate-600 font-medium">
                      {intern.start_date ? new Date(intern.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
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

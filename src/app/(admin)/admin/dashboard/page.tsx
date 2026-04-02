import React from 'react';
import SupersetDashboard from '@/components/SupersetDashboard';

export default function AdminCustomDashboard() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full h-full min-h-[calc(100vh-6rem)] flex flex-col px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 text-3xl font-bold mb-1">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 font-medium">{today}</p>
        </div>
      </div>

      {/* EMBEDDED DASHBOARD */}
      <div className="flex-1 flex flex-col bg-white/60 p-6 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="mb-4">
          <h2 className="section-title flex items-center gap-2.5 text-lg font-bold text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-100/50 flex items-center justify-center text-indigo-500">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Department Distribution
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Real-time data from Superset</p>
        </div>

        <div className="w-full min-h-[65vh]">
          <SupersetDashboard
            uuid="9c396d1f-0fed-4979-a26e-bfc89030c1a2"
            supersetUrl="http://localhost:8088"
          />
        </div>
      </div>

    </div>
  );
}

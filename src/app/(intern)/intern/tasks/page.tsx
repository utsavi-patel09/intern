"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Task = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: string;
};

export default function InternTasks() {
  const { data: session, status } = useSession();

  const internId = session?.user?.id ? Number(session.user.id) : null;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    if (!internId) return;
    try {
      const res = await fetch(`/api/tasks/intern/${internId}`);
      if (!res.ok) {
        console.error("Failed to fetch tasks");
        return;
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, newStatus: string) {
    try {
      await fetch("/api/tasks/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (internId) {
      loadTasks();
    }
  }, [internId]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#1E3A5F] rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">Loading your tasks...</div>
      </div>
    );
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title text-slate-900">
            My Tasks
          </h1>

        </div>

        {/* KPI Pills */}
        <div className="flex items-center gap-3">
          <div className="card-glass px-4 py-2 flex items-center gap-2 bg-white/50">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-sm font-bold text-slate-700">{pendingCount} Pending</span>
          </div>
          <div className="card-glass px-4 py-2 flex items-center gap-2 bg-white/50">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-700">{inProgressCount} Active</span>
          </div>
          <div className="card-glass px-4 py-2 flex items-center gap-2 bg-white/50">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-bold text-slate-700">{completedCount} Done</span>
          </div>
        </div>
      </div>

      {/* TASKS TABLE */}
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 mb-10">
        <div className="px-6 py-5 border-b border-slate-200/60 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h2 className="section-title flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1E3A5F]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            Assigned Tasks
          </h2>
          <div className="flex bg-sky-50 text-[#1E3A5F] px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            {tasks.length} Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th bg-slate-50/50">Task Details</th>
                <th className="table-th bg-slate-50/50">Deadline</th>
                <th className="table-th bg-slate-50/50">Status</th>
                <th className="table-th bg-slate-50/50 text-right">Update Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <p className="font-semibold text-slate-600">You're all caught up!</p>
                      <p className="text-sm">No tasks have been assigned to you yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="table-row group bg-white/50 hover:bg-white/85 transition-colors">
                    <td className="table-td py-5">
                      <div className="flex flex-col gap-1.5 maxWidth-xs xl:max-w-md">
                        <span className="font-bold text-slate-800 text-base group-hover:text-[#1E3A5F] transition-colors">{task.title}</span>
                        <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
                      </div>
                    </td>
                    <td className="table-td py-5">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                      </div>
                    </td>
                    <td className="table-td py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm border
                        ${task.status === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                          task.status === 'in_progress' ? 'bg-sky-50 border-sky-100 text-sky-700' :
                            'bg-amber-50 border-amber-100 text-amber-700'} transition-all`
                      }>
                        <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : task.status === 'in_progress' ? 'bg-sky-500 animate-pulse' : 'bg-amber-500'}`}></span>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-td py-5 text-right w-48">
                      <div className="relative inline-block text-left w-full">
                        <select
                          className="form-select w-full bg-white/80 text-sm font-semibold border-slate-200 shadow-sm focus:border-sky-400 focus:ring-sky-400/20 py-2 cursor-pointer"
                          value={task.status}
                          onChange={(e) => updateStatus(task.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
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
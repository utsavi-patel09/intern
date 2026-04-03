"use client";

import { useEffect, useState } from "react";

interface Leave {
  id: number;
  user_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  users_by_user_id: {
    name: string;
  };
}

export default function ManagerLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch leaves */
  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/leave");
      const data = await res.json();
      if (data.success) setLeaves(data.leaves);
    } catch (error) {
      console.error("Error fetching leaves", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* Approve / Reject */
  const handleAction = async (leaveId: number, status: string) => {
    try {
      await fetch("/api/leave/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leaveId, status }),
      });
      fetchLeaves();
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#1E3A5F] rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="page-title text-slate-900 mb-6">Leave Requests</h2>

      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70">
        <div className="px-6 py-5 border-b border-slate-200/60 bg-white/50 backdrop-blur-md">
          <h2 className="section-title flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1E3A5F]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            All Leave Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th bg-slate-50/50">User Name</th>
                <th className="table-th bg-slate-50/50">Leave Type</th>
                <th className="table-th bg-slate-50/50">Start Date</th>
                <th className="table-th bg-slate-50/50">End Date</th>
                <th className="table-th bg-slate-50/50">Reason</th>
                <th className="table-th bg-slate-50/50">Status</th>
                <th className="table-th bg-slate-50/50">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500 bg-white/30">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="font-semibold text-slate-600">No leave requests</p>
                    </div>
                  </td>
                </tr>
              )}

              {leaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="table-row group bg-white/50 hover:bg-white/85 transition-colors"
                >
                <td className="table-td font-bold text-slate-800">{leave.users_by_user_id.name}</td>
                <td className="table-td text-slate-600">{leave.leave_type}</td>
                <td className="table-td text-slate-600">
                  {new Date(leave.start_date).toLocaleDateString()}
                </td>
                <td className="table-td text-slate-600">
                  {new Date(leave.end_date).toLocaleDateString()}
                </td>
                <td className="table-td text-slate-600">{leave.reason}</td>
                <td className="table-td font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      leave.status === "pending"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : leave.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="table-td">
                  {leave.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                        onClick={() => handleAction(leave.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                        onClick={() => handleAction(leave.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm font-medium capitalize">{leave.status}</span>
                  )}
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
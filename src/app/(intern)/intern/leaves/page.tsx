"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Leave {
  id: number;
  leave_type: string;
  status: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface LeaveSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  remaining_leave: number;
  used_leave: number;
}

export default function LeaveDashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch summary and leaves
  const fetchLeaves = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/leave/user`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setLeaves(data.leaves);
      }
    } catch (err) {
      console.error("Error fetching leave summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [userId]);

  // Submit new leave
  const submitLeave = async () => {
    if (!form.leave_type || !form.start_date || !form.end_date || !form.reason) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch("/api/leave/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...form }),
      });
      alert("Leave Applied");
      setForm({ leave_type: "", start_date: "", end_date: "", reason: "" });
      setFormVisible(false);
      fetchLeaves(); // refresh data
    } catch (err) {
      console.error("Error applying leave", err);
      alert("Failed to apply leave");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#1E3A5F] rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="page-title text-slate-900">Leave Dashboard</h2>

      {/* Leave Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card label="Total Leaves" value={summary.total} bg="bg-white/70" textColor="text-[#1E3A5F]" />
          <Card label="Pending" value={summary.pending} bg="bg-amber-50/70" textColor="text-amber-700" />
          <Card label="Approved" value={summary.approved} bg="bg-emerald-50/70" textColor="text-emerald-700" />
          <Card label="Rejected" value={summary.rejected} bg="bg-red-50/70" textColor="text-red-700" />
          <Card label="Remaining" value={summary.remaining_leave} bg="bg-sky-50/70" textColor="text-[#1E3A5F]" />
          <Card label="Used" value={summary.used_leave} bg="bg-slate-100/70" textColor="text-slate-700" />
        </div>
      )}

      {/* Button to toggle form */}
      <button
        onClick={() => setFormVisible(!formVisible)}
        className="btn-primary shadow-lg shadow-[#1E3A5F]/20"
      >
        {formVisible ? "Close Form" : "Apply New Leave"}
      </button>

      {/* Leave Form */}
      {formVisible && (
        <div className="p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4 mt-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">Apply Leave</h3>
          <div>
            <label className="form-label">Leave Type</label>
            <select
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
              className="form-select bg-white/80"
            >
              <option value="">Select</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="form-input bg-white/80"
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="form-input bg-white/80"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Reason</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="form-input bg-white/80 min-h-[80px] resize-y"
              placeholder="Enter reason for leave..."
            />
          </div>

          <button
            onClick={submitLeave}
            className="btn-primary w-full shadow-lg shadow-[#1E3A5F]/20"
          >
            Apply Leave
          </button>
        </div>
      )}

      {/* Leave Table */}
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 mt-6">
        <div className="px-6 py-5 border-b border-slate-200/60 bg-white/50 backdrop-blur-md">
          <h2 className="section-title flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1E3A5F]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Leave History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th bg-slate-50/50">Type</th>
                <th className="table-th bg-slate-50/50">Status</th>
                <th className="table-th bg-slate-50/50">Start Date</th>
                <th className="table-th bg-slate-50/50">End Date</th>
                <th className="table-th bg-slate-50/50">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500 bg-white/30">
                    <p className="font-semibold">No leave records found</p>
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="table-row group bg-white/50 hover:bg-white/85 transition-colors">
                    <td className="table-td font-bold text-slate-800">{l.leave_type}</td>
                    <td className="table-td">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        l.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : l.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="table-td text-slate-600">{l.start_date}</td>
                    <td className="table-td text-slate-600">{l.end_date}</td>
                    <td className="table-td text-slate-600">{l.reason}</td>
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

// Summary card component
function Card({ label, value, bg, textColor }: { label: string; value: number; bg: string; textColor: string }) {
  return (
    <div className={`${bg} backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center p-4`}>
      <span className={`font-black text-2xl ${textColor} font-heading`}>{value}</span>
      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}
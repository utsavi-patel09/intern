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
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Leave Dashboard</h2>

      {/* Leave Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card label="Total Leaves" value={summary.total} bg="bg-white/60" textColor="text-indigo-600" />
          <Card label="Pending" value={summary.pending} bg="bg-yellow-50/70" textColor="text-yellow-700" />
          <Card label="Approved" value={summary.approved} bg="bg-green-50/70" textColor="text-green-700" />
          <Card label="Rejected" value={summary.rejected} bg="bg-red-50/70" textColor="text-red-700" />
          <Card label="Remaining" value={summary.remaining_leave} bg="bg-indigo-50/60" textColor="text-indigo-700" />
          <Card label="Used" value={summary.used_leave} bg="bg-purple-50/60" textColor="text-purple-700" />
        </div>
      )}

      {/* Button to toggle form */}
      <button
        onClick={() => setFormVisible(!formVisible)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        {formVisible ? "Close Form" : "Apply New Leave"}
      </button>

      {/* Leave Form */}
      {formVisible && (
        <div className="p-6 bg-white/60 backdrop-blur-md rounded-lg shadow space-y-4 mt-4">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Apply Leave</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
            <select
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white/80"
            >
              <option value="">Select</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white/80"
              placeholder="Enter reason for leave..."
            />
          </div>

          <button
            onClick={submitLeave}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            Apply Leave
          </button>
        </div>
      )}

      {/* Leave Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-slate-300 rounded-lg overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Start Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium">End Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-2 text-sm">{l.leave_type}</td>
                <td className={`px-4 py-2 text-sm font-semibold ${statusColor(l.status)}`}>{l.status}</td>
                <td className="px-4 py-2 text-sm">{l.start_date}</td>
                <td className="px-4 py-2 text-sm">{l.end_date}</td>
                <td className="px-4 py-2 text-sm">{l.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Summary card component
function Card({ label, value, bg, textColor }: { label: string; value: number; bg: string; textColor: string }) {
  return (
    <div className={`${bg} backdrop-blur-md rounded-lg shadow flex flex-col items-center p-4`}>
      <span className={`font-bold text-lg ${textColor}`}>{value}</span>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

// Status color helper
function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "text-yellow-700";
    case "approved":
      return "text-green-700";
    case "rejected":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}
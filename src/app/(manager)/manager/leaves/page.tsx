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
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Leave Requests</h2>

      <div className="overflow-x-auto shadow-lg rounded-xl bg-white/60 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-indigo-50/60">
            <tr>
              <th className="table-th">User Name</th>
              <th className="table-th">Leave Type</th>
              <th className="table-th">Start Date</th>
              <th className="table-th">End Date</th>
              <th className="table-th">Reason</th>
              <th className="table-th">Status</th>
              <th className="table-th">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaves.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">
                  No leave requests
                </td>
              </tr>
            )}

            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="group hover:bg-white/80 transition-colors"
              >
                <td className="table-td">{leave.users_by_user_id.name}</td>
                <td className="table-td">{leave.leave_type}</td>
                <td className="table-td">
                  {new Date(leave.start_date).toLocaleDateString()}
                </td>
                <td className="table-td">
                  {new Date(leave.end_date).toLocaleDateString()}
                </td>
                <td className="table-td">{leave.reason}</td>
                <td className="table-td font-medium">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      leave.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : leave.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="table-td">
                  {leave.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                        onClick={() => handleAction(leave.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                        onClick={() => handleAction(leave.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    leave.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
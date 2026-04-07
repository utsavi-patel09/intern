import { User, Department } from "@/types";

interface UserTableProps {
  users: User[];
  departments: Department[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export function UserTable({ users, departments, onEdit, onDelete }: UserTableProps) {
  const hasInterns = users.some(user => user.role === 'intern');
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="table-th bg-slate-50/50">User Details</th>
            <th className="table-th bg-slate-50/50">Role</th>
            {hasInterns && (
              <>
                <th className="table-th bg-slate-50/50">College</th>
                <th className="table-th bg-slate-50/50">End Date</th>
                <th className="table-th bg-slate-50/50">Stipend (₹)</th>
              </>
            )}
            <th className="table-th bg-slate-50/50">Department</th>
            <th className="table-th bg-slate-50/50 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.length === 0 ? (
            <tr>
              <td colSpan={hasInterns ? 7 : 4} className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <p className="font-semibold text-slate-600">No users found</p>
                  <p className="text-sm">Try adjusting your search query or filter.</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="table-row group bg-white/50 hover:bg-white/85 transition-colors">
                <td className="table-td py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 flex items-center justify-center text-[#1E3A5F] group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
                      <span className="font-black text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-base group-hover:text-[#1E3A5F] transition-colors">{user.name}</span>
                      <span className="text-sm font-medium text-slate-500">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="table-td py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                    ${user.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-100 group-hover:bg-red-100' :
                      user.role === 'manager' ? 'bg-sky-50 text-[#1E3A5F] border border-sky-100 group-hover:bg-sky-100' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-100'} transition-colors`
                  }>
                    {user.role}
                  </span>
                </td>
                {hasInterns && (
                  <>
                    <td className="table-td py-4">
                      {user.role === 'intern' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {user.intern?.college || "-"}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="table-td py-4">
                      {user.role === 'intern' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          {user.intern?.end_date ? new Date(user.intern.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="table-td py-4">
                      {user.role === 'intern' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {user.intern?.stipend ? `₹${user.intern.stipend.toLocaleString('en-IN')}` : "-"}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </>
                )}
                <td className="table-td py-4">
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-sm font-bold bg-white border border-slate-200 text-slate-600 shadow-sm group-hover:text-slate-800 transition-colors">
                    {user.department_id ? departments.find(d => d.id === user.department_id)?.name || "Unknown" : "No Department"}
                  </span>
                </td>
                <td className="table-td py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 hover:text-[#1E3A5F] transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

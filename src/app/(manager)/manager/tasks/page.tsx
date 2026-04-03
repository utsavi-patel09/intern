"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";

type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  deadline: string;
  status: string;
};

type Intern = {
  id: number;
  name: string;
};

export default function ManagerTasks() {

  const { data: session } = useSession();
  const managerId = session?.user?.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [interns, setInterns] = useState<Intern[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      internId: "",
      deadline: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Task title is required"),
      description: Yup.string().required("Description is required"),
      internId: Yup.string().required("Please select an intern"),
      deadline: Yup.date()
        .min(new Date(new Date().setHours(0, 0, 0, 0)), "Deadline cannot be in the past")
        .required("Deadline is required"),
    }),
    onSubmit: async (values) => {
      if (editingId) {
        await fetch("/api/tasks/manager", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title: values.title,
            description: values.description,
            deadline: values.deadline,
          }),
        });
      } else {
        await fetch("/api/tasks/manager", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            assigned_to: Number(values.internId),
            assigned_by: managerId,
            deadline: values.deadline,
          }),
        });
      }

      closeModal();
      loadTasks();
    },
  });

  async function loadTasks() {
    try {
      const res = await fetch("/api/tasks/manager");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadInterns() {
    if (!managerId) return;
    try {
      const res = await fetch(`/api/manager?userId=${managerId}`);
      const data = await res.json();
      setInterns(data.interns || []);
    } catch (e) {
      console.error(e);
    }
  }


  async function deleteTask(id: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    await fetch("/api/tasks/manager", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadTasks();
  }

  function editTask(task: Task) {
    setEditingId(task.id);
    formik.setValues({
      title: task.title,
      description: task.description,
      internId: String(task.assigned_to),
      deadline: task.deadline ? task.deadline.split('T')[0] : "",
    });
    setIsModalOpen(true);
  }

  function openNewTaskModal() {
    setEditingId(null);
    formik.resetForm();
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    formik.resetForm();
  }

  useEffect(() => {
    Promise.all([loadTasks(), loadInterns()]).then(() => setLoading(false));
  }, [managerId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-sky-100 border-t-[#1E3A5F] rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title text-slate-900">
            Task Management
          </h1>

        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openNewTaskModal}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-[#1E3A5F]/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Task Table Card */}
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 mb-10">
        <div className="px-6 py-5 border-b border-slate-200/60 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h2 className="section-title flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1E3A5F]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            Active Tasks
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th bg-slate-50/50 w-[20%]">Task Title</th>
                <th className="table-th bg-slate-50/50 w-[30%]">Description</th>
                <th className="table-th bg-slate-50/50 w-[15%]">Intern</th>
                <th className="table-th bg-slate-50/50 w-[15%]">Deadline</th>
                <th className="table-th bg-slate-50/50 w-[10%]">Status</th>
                <th className="table-th bg-slate-50/50 w-[10%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                      </div>
                      <p className="font-semibold text-slate-600">No tasks found</p>
                      <p className="text-sm">Click &apos;Add Task&apos; to assign a new task to an intern.</p>
                      <button onClick={openNewTaskModal} className="btn-secondary btn-sm mt-2">Create Task</button>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const intern = interns.find(i => i.id === task.assigned_to);
                  return (
                    <tr key={task.id} className="table-row group bg-white/50 hover:bg-white/85 transition-colors">
                      <td className="table-td py-4">
                        <span className="font-bold text-slate-800">{task.title}</span>
                      </td>
                      <td className="table-td py-4 text-slate-600">
                        <span className="line-clamp-2" title={task.description}>{task.description}</span>
                      </td>
                      <td className="table-td py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-[#1E3A5F] text-xs font-bold">
                            {(intern?.name?.charAt(0) || "?").toUpperCase()}
                          </div>
                          <span className="font-medium">{intern?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="table-td py-4 text-slate-600">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                      </td>
                      <td className="table-td py-4">
                        <span className={`badge ${task.status.toLowerCase() === 'completed' ? 'badge-success' :
                            task.status.toLowerCase() === 'in progress' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                          } capitalize`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="table-td py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => editTask(task)}
                            className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 hover:text-[#1E3A5F] transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

          <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200/60 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/60">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {editingId ? "Update Task Details" : "Assign New Task"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="form-label">Task Title</label>
                <input
                  name="title"
                  className={`form-input bg-white/80 focus:bg-white ${formik.touched.title && formik.errors.title ? 'border-red-300 ring-red-100' : ''}`}
                  placeholder="E.g., Design new landing page"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.title}</p>
                )}
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className={`form-input bg-white/80 focus:bg-white min-h-[100px] resize-y ${formik.touched.description && formik.errors.description ? 'border-red-300 ring-red-100' : ''}`}
                  placeholder="Provide detailed instruction..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Assign To</label>
                  <select
                    name="internId"
                    className={`form-select bg-white/80 focus:bg-white ${formik.touched.internId && formik.errors.internId ? 'border-red-300 ring-red-100' : ''}`}
                    value={formik.values.internId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!!editingId}
                  >
                    <option value="">Select Intern</option>
                    {interns.map((intern) => (
                      <option key={intern.id} value={intern.id}>
                        {intern.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.internId && formik.errors.internId && (
                    <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.internId}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Deadline</label>
                  <input
                    name="deadline"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className={`form-input bg-white/80 focus:bg-white ${formik.touched.deadline && formik.errors.deadline ? 'border-red-300 ring-red-100' : ''}`}
                    value={formik.values.deadline}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.deadline && formik.errors.deadline && (
                    <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.deadline}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="btn-secondary px-6">
                Cancel
              </button>
              <button 
                type="submit" 
                onClick={() => formik.handleSubmit()} 
                className={`btn-primary px-6 shadow-lg shadow-[#1E3A5F]/20 ${formik.isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {editingId ? "Update Task" : "Assign Task"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
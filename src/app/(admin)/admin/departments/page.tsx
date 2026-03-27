"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Department {
  id: number;
  name: string;
}

export default function DepartmentManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingDeptId, setEditingDeptId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Must be at least 2 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (editingDeptId) {
          const res = await fetch("/api/departments", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingDeptId, name: values.name }),
          });
          const data = await res.json();
          setDepartments((prev) =>
            prev.map((d) => (d.id === editingDeptId ? data.department : d))
          );
          setEditingDeptId(null);
        } else {
          const res = await fetch("/api/departments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: values.name }),
          });
          const data = await res.json();
          setDepartments((prev) => [...prev, data.department]);
        }
        formik.resetForm();
      } catch (err) {
        console.error(err);
        alert("Operation failed");
      } finally {
        setLoading(false);
      }
    },
  });

  // FETCH DEPARTMENTS
  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ADD OR UPDATE
  //handleSubmit logic moved to formik

  // EDIT BUTTON
  const handleEdit = (dept: Department) => {
    formik.setValues({ name: dept.name });
    setEditingDeptId(dept.id);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Delete department?")) return;

    try {
      await fetch("/api/departments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <div className="text-slate-500 font-medium font-heading tracking-wide">Loading departments...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title text-slate-900">
            Department Management
          </h1>

        </div>
      </div>

      {/* FORM CARD */}
      <div className="card-glass bg-white/50 p-6 mb-10">
        <h2 className="section-title mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-100/50 flex items-center justify-center text-pink-500">
            <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          {editingDeptId ? "Update Department" : "Create New Department"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <label className="form-label">Department Name</label>
            <input
              name="name"
              type="text"
              placeholder="E.g., Engineering, Human Resources"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-input bg-white/80 focus:bg-white ${formik.touched.name && formik.errors.name ? 'border-rose-300 ring-rose-100' : ''}`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-rose-500 text-xs font-bold mt-2">{formik.errors.name}</p>
            )}
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-7">
            {editingDeptId && (
              <button
                type="button"
                onClick={() => {
                  setEditingDeptId(null);
                  formik.resetForm();
                }}
                className="btn-secondary w-full md:w-auto"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto shadow-lg shadow-indigo-500/25 disabled:opacity-70 flex justify-center"
            >
              {loading
                ? editingDeptId
                  ? "Updating..."
                  : "Adding..."
                : editingDeptId
                  ? "Update"
                  : "Add Department"}
            </button>
          </div>
        </form>
      </div>

      {/* DEPARTMENT TABLE */}
      <div className="table-container shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60">
        <div className="px-6 py-5 border-b border-slate-200/60 flex justify-between items-center bg-white/40 backdrop-blur-md">
          <h2 className="section-title flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100/50 flex items-center justify-center text-indigo-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            Active Departments
          </h2>
          <div className="flex bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            {departments.length} Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th bg-slate-50/50 w-[70%]">Department Name</th>
                <th className="table-th bg-slate-50/50 w-[30%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      </div>
                      <p className="font-semibold text-slate-600">No departments found</p>
                      <p className="text-sm">Use the form above to add your first department.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.id} className="table-row group bg-white/40 hover:bg-white/80 transition-colors">
                    <td className="table-td py-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
                          <span className="font-black text-sm">{dept.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-bold text-slate-800 text-base group-hover:text-indigo-700 transition-colors">{dept.name}</span>
                      </div>
                    </td>
                    <td className="table-td py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-1.5 font-bold text-sm"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-1.5 font-bold text-sm"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete
                        </button>
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
import { Department } from "@/types";

interface UserFormModalProps {
  show: boolean;
  onClose: () => void;
  formik: any;
  editingUserId: number | null;
  departments: Department[];
  createLoading: boolean;
  apiError: string;
  emailError: string;
}

const roles = ["admin", "manager", "intern"];

export function UserFormModal({
  show,
  onClose,
  formik,
  editingUserId,
  departments,
  createLoading,
  apiError,
  emailError,
}: UserFormModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200/60 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/60 sticky top-0 z-10">
          <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#1E3A5F]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            {editingUserId ? "Edit User Details" : "Create New User"}
          </h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {(apiError || emailError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                {apiError && <p className="font-semibold text-sm">{apiError}</p>}
                {emailError && <p className="font-semibold text-sm">{emailError}</p>}
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Full Name <span className="text-red-500">*</span></label>
              <input
                name="name"
                placeholder="John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input bg-white/80 focus:bg-white ${formik.touched.name && formik.errors.name ? 'border-red-300 ring-red-100' : ''}`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label">Email Address <span className="text-red-500">*</span></label>
              <input
                name="email"
                type="text"
                placeholder="john@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-input bg-white/80 focus:bg-white ${formik.touched.email && formik.errors.email ? 'border-red-300 ring-red-100' : ''}`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.email}</p>
              )}
            </div>

            {!editingUserId && (
              <div className="flex flex-col gap-1.5">
                <label className="form-label">Password <span className="text-red-500">*</span></label>
                <input
                  name="password"
                  type="password"
                  placeholder="Secure password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-input bg-white/80 focus:bg-white ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-300 ring-red-100'
                      : ''
                  }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs font-bold mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="form-label">Role <span className="text-red-500">*</span></label>
                <select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="form-select bg-white/80 focus:bg-white shrink-0"
                >
                  {roles.map((r) => (<option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>))}
                </select>
              </div>

              {formik.values.role !== "admin" && (
                <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="form-label">Department</label>
                  <select
                    name="department_id"
                    value={formik.values.department_id ?? ""}
                    onChange={(e) => formik.setFieldValue("department_id", e.target.value ? Number(e.target.value) : null)}
                    onBlur={formik.handleBlur}
                    className="form-select bg-white/80 focus:bg-white shrink-0"
                  >
                    <option value="">None / N/A</option>
                    {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                  </select>
                </div>
              )}
            </div>

            {formik.values.role === "intern" && (
              <div className="space-y-5 animate-in slide-in-from-top-2 fade-in duration-300 border-t border-slate-100 pt-5 mt-5">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Intern Details</h4>
                <div className="flex flex-col gap-1.5">
                  <label className="form-label">College / University</label>
                  <input
                    name="college"
                    placeholder="Enter college name"
                    value={formik.values.college}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-input bg-white/80 focus:bg-white ${formik.touched.college && formik.errors.college ? 'border-red-300 ring-red-100' : ''}`}
                  />
                  {formik.touched.college && formik.errors.college && (
                    <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.college}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={formik.values.gender ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-select bg-white/80 focus:bg-white shrink-0"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="form-label">Stipend (₹) <span className="text-red-500">*</span></label>
                    <input
                      name="stipend"
                      type="number"
                      placeholder="e.g. 5000"
                      value={formik.values.stipend ?? ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-input bg-white/80 focus:bg-white ${formik.touched.stipend && formik.errors.stipend ? 'border-red-300 ring-red-100' : ''}`}
                    />
                    {formik.touched.stipend && formik.errors.stipend && (
                      <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.stipend}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="form-label">End Date <span className="text-red-500">*</span></label>
                  <input
                    name="end_date"
                    type="date"
                    value={formik.values.end_date ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-input bg-white/80 focus:bg-white ${formik.touched.end_date && formik.errors.end_date ? 'border-red-300 ring-red-100' : ''}`}
                  />
                  {formik.touched.end_date && formik.errors.end_date && (
                    <p className="text-red-500 text-xs font-bold mt-1">{formik.errors.end_date}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
              <button type="button" onClick={onClose} className="btn-secondary px-6">
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="btn-primary px-6 shadow-lg shadow-[#1E3A5F]/20 min-w-[140px] flex justify-center disabled:opacity-70"
              >
                {createLoading ? (
                  editingUserId ? "Updating..." : "Creating..."
                ) : (
                  editingUserId ? "Update User" : "Create User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
